import { useEffect, useState } from "react";
import { Contract } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  List,
  ListItem,
  Grid,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useUserType } from "../../utils/useUserType";

const MyContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractData, status] = useAuthorizedData<Contract[]>(
    "/owner/owner-contarcts/"
  );
  const { userType, status: userTypeStatus } = useUserType();

  useEffect(() => {
    if (status === "idle" && contractData) {
      setContracts(contractData);
    }
  }, [contractData, status]);

  if (status === "loading" || userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "owner") {
    return <div>You are not an owner!</div>;
  }

  if (status === "error" || !contracts || contracts.length === 0) {
    return <Text>No contracts found.</Text>;
  }

  return (
    <Box p={4} bg={useColorModeValue("gray.100", "gray.900")}>
      <Heading as="h1" size="xl" textAlign="center" my={8}>
        My Contracts
      </Heading>
      <List spacing={4}>
        {contracts.map((contract: Contract) => (
          <ListItem
            key={contract.id}
            borderWidth={1}
            borderRadius="lg"
            p={4}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow="lg"
          >
            <Link
              as={RouterLink}
              to={`/owner/my-apartments/${contract.apartment_id}/room/${contract.room_id}/contracts/${contract.id}`}
            >
              <VStack align="start" spacing={4}>
                <Heading as="h2" size="lg" color="teal.500">
                  Contract #{contract.id}
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Text>
                    <strong>Start Date:</strong> {contract.start_date}
                  </Text>
                  <Text>
                    <strong>End Date:</strong> {contract.end_date}
                  </Text>
                  <Text>
                    <strong>Deposit Amount:</strong> {contract.deposit_amount}
                  </Text>
                  <Text>
                    <strong>Rent Amount:</strong> {contract.rent_amount}
                  </Text>
                </Grid>
                <Badge
                  colorScheme={contract.signature_request_id ? "green" : "red"}
                  fontSize="sm"
                >
                  <Text>
                    Signed:{" "}
                    {contract.signature_request_id ? "Signed" : "Not Signed"}
                  </Text>
                </Badge>
              </VStack>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MyContracts;
