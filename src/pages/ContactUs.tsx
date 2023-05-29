import React from "react";
import {
  Box,
  VStack,
  Heading,
  Link,
  Flex,
  Avatar,
  Spacer,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";

const ContactUs: React.FC = () => {
  const contacts = [
    { name: "Ben Ezra", email: "benez@mta.ac.il" },
    { name: "Shahaf Balelty", email: "shahafba@mta.ac.il" },
    { name: "Amit Nahum", email: "amitnh@mta.ac.il" },
  ];

  const bg = useColorModeValue("gray.200", "gray.700");

  return (
    <Box p={5} w="full" maxW="500px" mx="auto">
      <Heading mb={5}>Contact Us</Heading>
      <VStack spacing={4} align="stretch">
        {contacts.map((contact, index) => (
          <Flex key={index} p={5} bg={bg} borderRadius="md" alignItems="center">
            <Avatar name={contact.name} />
            <Box ml={3}>
              <Text fontSize="xl">{contact.name}</Text>
              <Link href={`mailto:${contact.email}`} color="teal.500">
                <Flex alignItems="center">
                  <EmailIcon /> <Text ml={2}>{contact.email}</Text>
                </Flex>
              </Link>
            </Box>
            <Spacer />
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default ContactUs;
