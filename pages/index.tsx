import Link from "next/link";
import { Heading, Text, Highlight, Flex, Button } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import { loadGoogleAPI, signInWithGoogle, uploadFileToDrive, isUserSignedIn } from '../utils/google-api';
import { Button, Text, Heading } from '@chakra-ui/react'; // Or your UI components

import MainLayout from "../components/layouts/main-layout";

export default function HomePage() {
  return (
    <>
      <MainLayout>
        <Flex
          w={{
            base: "full",
            lg: "50%",
          }}
          alignSelf="center"
          px={4}
          gap={8}
          minH="full"
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading
            as="h1"
            lineHeight="tall"
            textAlign="center"
          >
            <Highlight
              query="MBTI Personality Test"
              styles={{
                py: 1,
                px: 4,
                rounded: "full",
                bg: "primary.500",
                color: "white",
              }}
            >
              Welcome to MBTI Personality Test
            </Highlight>
          </Heading>
          <Text
            fontSize="xl"
            align="center"
          >
            Learn to know yourself better with this personality test.
          </Text>
          <Link href="/test">
            <Button
              w="min-content"
              colorScheme="primary"
              variant="outline"
              rightIcon={<FiArrowRight size={20} />}
            >
              Take Test
            </Button>
          </Link>
        </Flex>
      </MainLayout>
    </>
  );
}
