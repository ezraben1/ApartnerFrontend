import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Bill } from "../../types";
import CreateDepositGuaranteeBill from "./CreateDepositGuaranteeBill";
import { Link, useParams } from "react-router-dom";
import {
  VStack,
  Heading,
  Text,
  Box,
  List,
  ListItem,
  Badge,
} from "@chakra-ui/react";

const DepositsGuaranteesPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const { apartmentId } = useParams<{ apartmentId: string }>();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await api.get(
          `/renter/my-apartment/deposits-guarantees/`
        );
        const data = await response.json();
        setBills(data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };
    fetchBills();
  }, [apartmentId]);

  return (
    <Box maxW="800px" mx="auto" p="6">
      <VStack align="stretch" spacing={6}>
        {apartmentId && (
          <CreateDepositGuaranteeBill apartmentId={apartmentId} />
        )}
        <List spacing={4}>
          {bills.map((bill: Bill) => (
            <Link key={bill.id} to={`/renter/my-bills/${bill.id}`}>
              <ListItem
                p="4"
                rounded="md"
                bg="gray.50"
                boxShadow="md"
                transition="background 0.2s"
                _hover={{
                  bg: "gray.100",
                }}
              >
                <VStack align="start" spacing={2}>
                  <Heading size="sm">{bill.bill_type}</Heading>
                  <Text>Amount: ${bill.amount}</Text>
                  <Text>Date: {bill.date}</Text>
                  <Badge
                    colorScheme={bill.paid ? "green" : "red"}
                    variant="subtle"
                    px="2"
                    py="1"
                    rounded="md"
                  >
                    {bill.paid ? "Paid" : "Not Paid"}
                  </Badge>
                </VStack>
              </ListItem>
            </Link>
          ))}
        </List>
      </VStack>
    </Box>
  );
};

export default DepositsGuaranteesPage;
