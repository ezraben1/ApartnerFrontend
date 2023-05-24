import { Box, VStack, Text } from "@chakra-ui/react";
import { Inquiry } from "../../types";
import { Link } from "react-router-dom";

interface InquiryListProps {
  inquiries: Inquiry[];
}

const InquiryList: React.FC<InquiryListProps> = ({ inquiries }) => {
  return (
    <VStack spacing={6} align="stretch">
      {inquiries.map((inquiry) => (
        <Box
          key={inquiry.id}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          border={!inquiry.read ? "2px solid green" : "2px solid transparent"}
          _hover={{ bg: "gray.50", cursor: "pointer" }}
        >
          <Link to={`/inquiries/${inquiry.id}`}>
            {inquiry.image && (
              <img src={inquiry.image} alt="Inquiry" width="100" height="100" />
            )}
            <Text fontWeight="bold">
              Status:{" "}
              <Box display="inline-flex" alignItems="center">
                {!inquiry.read && (
                  <Box
                    w="4px"
                    h="4px"
                    bg="green.500"
                    borderRadius="full"
                    mr={2}
                  ></Box>
                )}
                <Box
                  display="inline-block"
                  p={1}
                  borderRadius="md"
                  color={inquiry.status === "open" ? "white" : "white"}
                  bg={inquiry.status === "open" ? "green.500" : "red.500"}
                >
                  {inquiry.status}
                </Box>
              </Box>
            </Text>
            <Text fontWeight="bold" mt={2}>
              Created At: {inquiry.created_at}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Apartment: {inquiry.apartment?.address || "N/A"}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Sender:{" "}
              {inquiry.sender?.first_name && inquiry.sender?.last_name
                ? `${inquiry.sender.first_name} ${inquiry.sender.last_name}`
                : "Unknown"}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Receiver:{" "}
              {inquiry.receiver?.first_name && inquiry.receiver?.last_name
                ? `${inquiry.receiver.first_name} ${inquiry.receiver.last_name}`
                : "N/A"}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Type: {inquiry.type}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Message: {inquiry.message}
            </Text>
          </Link>
        </Box>
      ))}
    </VStack>
  );
};

export default InquiryList;
