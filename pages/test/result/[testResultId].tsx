import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Option, AsyncData, Result } from "@swan-io/boxed";
import { Flex, Show, Text, Heading } from "@chakra-ui/react";
import jsPDF from 'jspdf';
import { loadGoogleAPI, signInWithGoogle, uploadFileToDrive, isUserSignedIn } from '../../../utils/google-api';

import MainLayout from "../../../components/layouts/main-layout";
import TestResult from "../../../components/test/test-result";
import TestResultTableOfContent from "../../../components/test/test-result-table-of-content";
import TestResultStats from "../../../components/test/test-result-stats";
import {
  TestResult as ITestResult,
  getSavedTestResult,
} from "../../../lib/personality-test";

export default function TestResultPage() {
  const router = useRouter();
  const [testResult, setTestResult] = useState<AsyncData<Result<Option<ITestResult>, Error>>>(AsyncData.NotAsked());
  const [hasMounted, setHasMounted] = useState(false);
  const [mbtiType, setMbtiType] = useState(null);
  const [mbtiDescription, setMbtiDescription] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setTestResult(AsyncData.Loading());

      const id = parseInt(router.query.testResultId as string);

      getSavedTestResult(id).tap((result) => {
        setTestResult(AsyncData.Done(result));

        result.match({
          Ok: (value) => {
            value.match({
              Some: (data) => {
                setMbtiType(data.mbtiType);
                setMbtiDescription(data.description);

                if (hasMounted && data.mbtiType && data.description) {
                  uploadPDF(data.mbtiType, data.description);
                }
              },
              None: () => { /* No-op */ },
            });
          },
          Error: () => { /* No-op */ },
        });
      });
    }
  }, [router.isReady, router.query.testResultId, hasMounted]);

  const uploadPDF = async (mbtiType, mbtiDescription) => {
    try {
      await loadGoogleAPI();

      if (!isUserSignedIn()) {
        await signInWithGoogle();
      }

      const doc = new jsPDF();
      doc.text(`MBTI Result: ${mbtiType}`, 10, 10);
      doc.text(mbtiDescription, 10, 20);
      const pdfBytes = doc.output('arraybuffer');

      const file = new Blob([pdfBytes], { type: 'application/pdf' });
      const metadata = {
        name: 'mbti_report.pdf',
        mimeType: 'application/pdf',
      };

      const res = await uploadFileToDrive(file, metadata);
      console.log('File uploaded:', res.result);
      const driveLink = `https://drive.google.com/file/d/${res.result.id}/view?usp=sharing`;
      alert(`PDF uploaded. Link: ${driveLink}`);
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating or uploading PDF.');
    }
  };

  return (
    <MainLayout>
      {testResult.match({
        NotAsked: () => <Text>Loading</Text>,
        Loading: () => <Text>Loading</Text>,
        Done: (result) =>
          result.match({
            Error: () => <Text>Something went wrong! Please refresh!</Text>,
            Ok: (value) =>
              value.match({
                Some: (data) => (
                  <Flex
                    h="full"
                    direction={{
                      base: "column",
                      lg: "row",
                  }}
                  >
                    <TestResultStats testResult={data} />
                    <TestResult testResult={data} />
                    <Show above="lg">
                      <TestResultTableOfContent />
                    </Show>
                  </Flex>
                ),
                None: () => <Text>