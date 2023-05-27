import { useEffect, useState } from "react";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import {
  Heading,
  Text,
  Flex,
  Box,
  Image,
  Button,
  HStack,
  Icon,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { MdAcUnit, MdPets, MdSmokeFree, MdLocalBar } from "react-icons/md";

import { Link } from "react-router-dom";
import { ApartmentAPI } from "../../types";
import { fetchUserId } from "../../utils/userId";
import InquiryForm from "../Inquiry/InquiryForm";
import { useUserType } from "../../utils/useUserType";

const RenterSingleApartment: React.FC = () => {
  const [apartment, setApartment] = useState<ApartmentAPI | null>(null);
  const [apartmentData, status] = useAuthorizedData<ApartmentAPI>(
    `/renter/my-apartment/`
  );
  const [, setLoading] = useState(true);
  const [renterId, setRenterId] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      const id = await fetchUserId();
      setRenterId(id);
      setUserLoading(false);
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (renterId) {
      console.log("renter ID:", renterId);
    }
  }, [renterId]);

  useEffect(() => {
    if (status === "idle" && apartmentData) {
      setApartment(apartmentData);
      setLoading(false);
    }
  }, [apartmentData, status]);
  const { userType, status: userTypeStatus } = useUserType();
  if (userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "renter") {
    return <div>You are not a renter!</div>;
  }

  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  if (!renterId) {
    return <div>Error fetching renter ID.</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error" || !apartment) {
    return <div>Error loading apartment data.</div>;
  }

  return (
    <Flex
      justify="center"
      align="center"
      w="100%"
      minH="calc(100vh - 6rem)"
      bg="gray.100"
    >
      <Box maxW="60rem" w="100%" p={4}>
        <Stack spacing={8}>
          <Heading as="h1" size="2xl">
            {apartment.address}
          </Heading>
          <Box borderRadius="md" overflow="hidden">
            <Image
              src={apartment.images[0].image}
              alt="Apartment"
              objectFit="cover"
            />
          </Box>
          <Stack spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              Apartment Details
            </Text>
            <HStack spacing={4} mt={4}>
              <Stack>
                <Text>
                  <Icon as={MdAcUnit} /> AC
                </Text>
                <Badge
                  variant={apartment.ac ? "solid" : "outline"}
                  colorScheme={apartment.ac ? "green" : "red"}
                >
                  {apartment.ac ? "Yes" : "No"}
                </Badge>
              </Stack>
              <Stack>
                <Text>
                  <Icon as={MdPets} /> Pets Allowed
                </Text>
                <Badge
                  variant={apartment.allowed_pets ? "solid" : "outline"}
                  colorScheme={apartment.allowed_pets ? "green" : "red"}
                >
                  {apartment.allowed_pets ? "Yes" : "No"}
                </Badge>
              </Stack>
              <Stack>
                <Text>
                  <Icon as={MdSmokeFree} /> Smoking Allowed
                </Text>
                <Badge
                  variant={apartment.smoking_allowed ? "solid" : "outline"}
                  colorScheme={apartment.smoking_allowed ? "green" : "red"}
                >
                  {apartment.smoking_allowed ? "Yes" : "No"}
                </Badge>
              </Stack>
              <Stack>
                <Text>
                  <Icon as={MdLocalBar} /> BBQ Allowed
                </Text>
                <Badge
                  variant={apartment.bbq_allowed ? "solid" : "outline"}
                  colorScheme={apartment.bbq_allowed ? "green" : "red"}
                >
                  {apartment.bbq_allowed ? "Yes" : "No"}
                </Badge>
              </Stack>
            </HStack>
            <Text fontSize="lg" color="gray.600">
              {apartment.description}
            </Text>
            <HStack mt={6} spacing={6}>
              <Button colorScheme="blue" as={Link} to={`/renter/my-bills/`}>
                View Bills
              </Button>
              <Button
                colorScheme="blue"
                as={Link}
                to={`/renter/my-apartment/${apartment.id}/deposits-guarantees/`}
              >
                My Deposits and Guarantees
              </Button>
            </HStack>
            <Text fontSize="lg" color="gray.600">
              Owner: {apartment.owner_first_name} {apartment.owner_last_name} (
              {apartment.owner_email})
            </Text>
            <Text fontSize="lg" color="gray.600">
              Phone: {apartment.owner_phone}
            </Text>
            {apartment && renterId !== null && (
              <InquiryForm
                url={`/renter/my-apartment/inquiries/`}
                sender={renterId}
                receiver_id={apartment.owner_id}
                apartmentID={apartment.id}
              />
            )}
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
};

export default RenterSingleApartment;
