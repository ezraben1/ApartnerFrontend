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
    <Box>
      <Heading as="h1" size="xl" textAlign="center" my={8}>
        My Contracts
      </Heading>
      <List spacing={4}>
        {contracts.map((contract: Contract) => (
          <ListItem key={contract.id} borderWidth={1} borderRadius="lg" p={4}>
            <Link
              as={RouterLink}
              to={`/owner/my-apartments/${contract.apartment_id}/room/${contract.room_id}/contracts/${contract.id}`}
            >
              <VStack align="start" spacing={2}>
                <Heading as="h2" size="lg">
                  Contract #{contract.id}
                </Heading>
                <Text>Start Date: {contract.start_date}</Text>
                <Text>End Date: {contract.end_date}</Text>
                <Text>Deposit Amount: {contract.deposit_amount}</Text>
                <Text>Rent Amount: {contract.rent_amount}</Text>
              </VStack>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MyContracts;
