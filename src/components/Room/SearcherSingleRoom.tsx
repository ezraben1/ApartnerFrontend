import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Badge,
  Icon,
  Box,
  Text,
  Button,
  HStack,
  Heading,
  Stack,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import {
  MdPets,
  MdSmokeFree,
  MdLocalBar,
  MdAcUnit,
  MdOutlineApartment,
  MdOutlineHouseSiding,
  MdOutlineWindow,
  MdOutlineSquareFoot,
} from "react-icons/md";

import { Room } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import ImageGallery from "../images/ImageGallery";
import InquiryForm from "../Inquiry/InquiryForm";
import { fetchUserId } from "../../utils/userId";

const SearcherSingleRoom = () => {
  const { roomId } = useParams();
  const [searcherID, setSearcherID] = useState<string | null>(null);
  const [, setUserLoading] = useState(true);
  const [] = useState<number | null>(null);

  const [roomData, status] = useAuthorizedData<Room | null>(
    `/searcher/searcher-search/${roomId}/`
  );

  useEffect(() => {
    const getUserId = async () => {
      const id = await fetchUserId();
      setSearcherID(id);
      setUserLoading(false);
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (searcherID) {
    }
  }, [searcherID]);

  if (status === "loading") {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="green.500" />
      </Flex>
    );
  }

  if (status === "error") {
    return <Text>Error fetching room data.</Text>;
  }

  if (!roomData) {
    return <Text>No data available.</Text>;
  }

  const { description, size, price_per_month, window, images, apartment } =
    roomData;

  return (
    <Flex
      justify="center"
      align="center"
      w="100%"
      minH="calc(100vh - 6rem)"
      bg="gray.100"
      p={4}
    >
      <Box maxW="60rem" w="100%">
        <Stack spacing={8}>
          <Heading as="h1" size="2xl">
            Room Details
          </Heading>
          <ImageGallery images={images} />
          <Box bg="gray.200" p={4} borderRadius="md">
            <Heading size="md" mb={2}>
              Description
            </Heading>
            <Text>{description}</Text>
          </Box>
          <Box bg="gray.200" p={4} borderRadius="md">
            <Heading size="md" mb={2}>
              Room Details
            </Heading>
            <HStack spacing={4}>
              <Stack>
                <Text>
                  <Icon as={MdOutlineSquareFoot} /> Size
                </Text>
                <Text>{size} sqm</Text>
              </Stack>
              <Stack>
                <Text>
                  <Icon as={MdOutlineHouseSiding} /> Price
                </Text>
                <Text>{price_per_month} $</Text>
              </Stack>
              <Stack>
                <Text>
                  <Icon as={MdOutlineWindow} /> Window
                </Text>
                <Badge
                  variant={window ? "solid" : "outline"}
                  colorScheme={window ? "green" : "red"}
                >
                  {window ? "Yes" : "No"}
                </Badge>
              </Stack>
            </HStack>
          </Box>
          <Box bg="gray.200" p={4} borderRadius="md">
            <Heading size="md" mb={2}>
              Apartment Details
            </Heading>
            <HStack spacing={4}>
              <Stack>
                <Text>
                  <Icon as={MdOutlineApartment} /> Address
                </Text>
                <Text>{apartment.address}</Text>
              </Stack>
              <Stack>
                <Text>
                  <Icon as={MdOutlineHouseSiding} /> Size
                </Text>
                <Text>{apartment.size} sqm</Text>
              </Stack>
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
            </HStack>
            <HStack spacing={4} mt={4}>
              <Stack>
                <Text>
                  <Icon as={MdPets} /> Pets
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
                  <Icon as={MdLocalBar} /> BBQ Allowed
                </Text>
                <Badge
                  variant={apartment.bbq_allowed ? "solid" : "outline"}
                  colorScheme={apartment.bbq_allowed ? "green" : "red"}
                >
                  {apartment.bbq_allowed ? "Yes" : "No"}
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
            </HStack>
          </Box>
        </Stack>
        {roomData.contract ? (
          <HStack mt={6} spacing={6}>
            <Button
              colorScheme="green"
              as={Link}
              to={`/searcher/searcher-search/${roomId}/contracts/${roomData.contract.id}`}
            >
              Show Contract
            </Button>
          </HStack>
        ) : (
          <Text>No contract available.</Text>
        )}

        {apartment && apartment.owner && searcherID !== null && (
          <InquiryForm
            url={`/searcher/searcher-search/${roomId}/inquiries/?is_room=true`}
            sender={searcherID}
            receiver_id={apartment.owner_id}
            apartmentID={apartment.id}
          />
        )}
      </Box>
    </Flex>
  );
};

export default SearcherSingleRoom;
