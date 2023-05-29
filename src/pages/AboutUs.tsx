import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Spacer,
  useColorModeValue,
  Link,
  Avatar,
} from "@chakra-ui/react";
import { EmailIcon, ExternalLinkIcon } from "@chakra-ui/icons";

const AboutUs: React.FC = () => {
  const bg = useColorModeValue("gray.200", "gray.700");

  const teamMembers = [
    {
      name: "Ben Ezra",
      role: "CEO",
      email: "benez@mta.ac.il",
    },
    {
      name: "Shahaf Balelty",
      role: "CEO",
      email: "shahafba@mta.ac.il",
    },
    {
      name: "Amit Nahum",
      role: "CEO",
      email: "amitnh@mta.ac.il",
    },
  ];

  return (
    <Box p={5} w="full" maxW="800px" mx="auto">
      <Heading mb={5}>About Us</Heading>
      <Text mb={10}>
        This project is part of our Information Systems degree at the Academic
        College of Tel Aviv-Yafo. Our aim is to design and implement an
        intuitive and user-friendly system that simplifies the process of
        finding and renting apartments.
      </Text>

      <Heading mb={5}>Our Team</Heading>
      {teamMembers.map((member, index) => (
        <Flex key={index} p={5} bg={bg} borderRadius="md" my={4}>
          <Avatar name={member.name} size="md" />
          <Box ml={5}>
            <Heading fontSize="xl">{member.name}</Heading>
            <Text>
              <EmailIcon />{" "}
              <Link href={`mailto:${member.email}`} isExternal>
                {member.email} <ExternalLinkIcon mx="2px" />
              </Link>
            </Text>
            <Text fontWeight="bold">{member.role}</Text>
          </Box>
          <Spacer />
        </Flex>
      ))}
    </Box>
  );
};

export default AboutUs;
