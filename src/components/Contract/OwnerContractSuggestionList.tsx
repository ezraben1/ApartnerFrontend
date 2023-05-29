import { useEffect, useState } from "react";
import { Contract, SuggestedContract } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import {
  Box,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  Divider,
  Button,
} from "@chakra-ui/react";
import { useUserType } from "../../utils/useUserType";
import api from "../../utils/api";

const MyContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractData, status] = useAuthorizedData<Contract[]>(
    "/owner/owner-contract-suggestions/"
  );
  const { userType, status: userTypeStatus } = useUserType();

  useEffect(() => {
    if (status === "idle" && contractData) {
      setContracts(contractData);
    }
  }, [contractData, status]);

  const handleAcceptSuggestion = async (
    contractId: number,
    suggestionId: number
  ) => {
    try {
      const url = `http://127.0.0.1:8000/owner/owner-contract-suggestions/${contractId}/suggestion/${suggestionId}/accept/`;
      const response: Response = await api.post(url, null);
      console.log(response);
    } catch (error) {
      console.error("Error accepting contract suggestion", error);
    }
  };

  const handleDeclineSuggestion = async (
    contractId: number,
    suggestionId: number
  ) => {
    try {
      const url = `http://127.0.0.1:8000/owner/owner-contract-suggestions/${contractId}/suggestion/${suggestionId}/decline/`;
      const response: Response = await api.remove(url);
      console.log(response);
    } catch (error) {
      console.error("Error declining contract suggestion", error);
    }
  };

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
            <VStack align="start" spacing={2}>
              <Heading as="h2" size="lg">
                Contract #{contract.id}
              </Heading>
              <Text>Start Date: {contract.start_date}</Text>
              <Text>End Date: {contract.end_date}</Text>
              <Text>Deposit Amount: {contract.deposit_amount}</Text>
              <Text>Rent Amount: {contract.rent_amount}</Text>
              <Divider />
              <Heading as="h3" size="md" mb={2}>
                Suggestions
              </Heading>
              {contract.suggestions.map((suggestion: SuggestedContract) => (
                <Box
                  key={suggestion.id}
                  p={2}
                  borderWidth={1}
                  borderRadius="md"
                >
                  <Text fontWeight="bold">
                    Suggested Rent Amount: {suggestion.suggested_rent_amount}
                  </Text>
                  <Text>
                    Price Suggested By: {suggestion.price_suggested_by}
                  </Text>
                  <Text>Notes: {suggestion.notes}</Text>
                  <Button
                    colorScheme="green"
                    onClick={() =>
                      handleAcceptSuggestion(contract.id, suggestion.id)
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() =>
                      handleDeclineSuggestion(contract.id, suggestion.id)
                    }
                  >
                    Decline
                  </Button>
                  <Divider mt={2} />
                </Box>
              ))}
            </VStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MyContracts;
