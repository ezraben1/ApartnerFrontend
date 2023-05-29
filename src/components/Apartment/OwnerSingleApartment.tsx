import { useEffect, useState } from "react";
import { Apartment, Room } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import {
  Button,
  Heading,
  Text,
  Flex,
  Box,
  VStack,
  Input,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  Stat,
  StatLabel,
  StatNumber,
  Stack,
  Icon,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  MdAcUnit,
  MdOutlineApartment,
  MdOutlineHouseSiding,
} from "react-icons/md";

import { useParams, Link } from "react-router-dom";
import UpdateApartmentForm from "./UpdateApartmentForm";
import DeleteApartment from "./DeleteApartment";
import AddRoomForm from "../Room/AddRoomForm";
import api from "../../utils/api";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import ApartmentThumbnail from "../images/ApartmentThumbnail";
import { Carousel } from "react-bootstrap";

const SingleApartment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [apartmentData, status] = useAuthorizedData<Apartment>(
    `/owner/owner-apartments/${id}/`
  );

  useEffect(() => {
    if (status === "idle" && apartmentData) {
      setApartment(apartmentData);
    }
  }, [apartmentData, status]);

  const [] = useState<string | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const formData = new FormData();
      Array.from(event.target.files).forEach((file) => {
        formData.append("images", file);
      });

      try {
        await api.patch(
          `/owner/owner-apartments/${apartmentData?.id}/upload_image/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Images uploaded successfully!");
      } catch (error) {
        console.error("Error uploading images:", error);

        if (error && (error as any).response && (error as any).response.data) {
          console.error("Server error message:", (error as any).response.data);
        }

        alert("Failed to upload images.");
      }
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.remove(
        `/owner/owner-apartments/${apartmentData?.id}/images/${imageId}/`
      );
      setApartment((prev) => {
        if (prev) {
          return {
            ...prev,
            images: prev.images.filter((image) => image.id !== imageId),
          };
        }
        return null;
      });
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);

      if (error && (error as any).response && (error as any).response.data) {
        console.error("Server error message:", (error as any).response.data);
      }

      alert("Failed to delete image.");
    }
  };

  const updateApartment = (updatedApartment: Apartment) => {
    setApartment(updatedApartment);
  };
  const [] = useState(false);

  const imageItems = apartment?.images.map((image) => ({
    id: image.id,
    original: image.image,
    thumbnail: image.image,
    renderItem: () => (
      <Box onClick={() => handleDeleteImage(image.id)} cursor="pointer">
        <img
          src={image.image}
          alt="Apartment"
          style={{ objectFit: "contain" }}
        />
      </Box>
    ),
  }));

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error" || !apartment) {
    return <div>Error loading apartment data.</div>;
  }

  return (
    <Box
      maxW="1000px"
      mx="auto"
      p="6"
      bg="white"
      borderRadius="lg"
      boxShadow="xl"
    >
      <Flex
        justify="center"
        align="center"
        borderBottom="1px"
        borderColor="gray.200"
        pb="4"
      >
        <Heading size="xl" color="teal.500">
          {apartment.address}
        </Heading>
      </Flex>
      <Carousel>
        {imageItems &&
          imageItems.map((imageItem, index) => (
            <Carousel.Item key={index}>
              <Box>
                <Box position="relative" display="inline-block">
                  <Image
                    src={imageItem.original}
                    alt={imageItem.original}
                    borderRadius="lg"
                    boxShadow="md"
                  />
                </Box>
                <Box mt="2" textAlign="center">
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete Image"
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteImage(imageItem.id)}
                  />
                </Box>
              </Box>
            </Carousel.Item>
          ))}
      </Carousel>

      <VStack align="stretch" spacing={6} mt={4}>
        <Box bg="gray.100" p={4} borderRadius="md">
          <Heading size="lg" mb={2} color="teal.400">
            <Icon as={MdOutlineApartment} color="teal.400" /> Apartment Details
          </Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Stack>
              <Text fontSize="md" color="gray.600">
                <Icon as={MdOutlineHouseSiding} color="teal.300" /> Size
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                {apartment.size} sqm
              </Text>
            </Stack>
            <Stack>
              <Text fontSize="md" color="gray.600">
                <Icon as={MdAcUnit} color="teal.300" /> AC
              </Text>
              <Badge
                variant={apartment.ac ? "solid" : "outline"}
                colorScheme={apartment.ac ? "green" : "red"}
              >
                {apartment.ac ? "Yes" : "No"}
              </Badge>
            </Stack>
            <Stat>
              <StatLabel fontSize="md" color="gray.600">
                Balcony
              </StatLabel>
              <StatNumber fontSize="lg" fontWeight="bold">
                {apartment.balcony ? "Yes" : "No"}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="md" color="gray.600">
                Pets
              </StatLabel>
              <StatNumber fontSize="lg" fontWeight="bold">
                {apartment.allowed_pets ? "Yes" : "No"}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="md" color="gray.600">
                BBQ Allowed
              </StatLabel>
              <StatNumber fontSize="lg" fontWeight="bold">
                {apartment.bbq_allowed ? "Yes" : "No"}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="md" color="gray.600">
                Smoking Allowed
              </StatLabel>
              <StatNumber fontSize="lg" fontWeight="bold">
                {apartment.smoking_allowed ? "Yes" : "No"}
              </StatNumber>
            </Stat>
          </SimpleGrid>
        </Box>

        <Flex direction="column" alignItems="flex-start">
          <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.400">
            Upload Images:
          </Text>
          <InputGroup>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <InputRightElement>
              <IconButton
                aria-label="Upload"
                icon={<AddIcon />}
                colorScheme="teal"
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Flex justify="space-between" align="center" mt={4}>
          <UpdateApartmentForm
            apartment={apartment}
            onUpdate={updateApartment}
          />
          <DeleteApartment apartmentId={id} />
        </Flex>
        <Text fontSize="lg" color="gray.600" mt={4}>
          {apartment.description}
        </Text>

        <Box mt={4}>
          <Heading size="lg" mb={2} color="teal.400">
            Rooms
          </Heading>
          <SimpleGrid columns={2} spacing={4}>
            {apartment.rooms?.map((room: Room) => (
              <Link
                key={room.id}
                to={`/owner/my-apartments/${apartment.id}/room/${room.id}`}
              >
                <Box
                  p="4"
                  rounded="md"
                  bg="gray.50"
                  boxShadow="md"
                  transition="all 0.3s ease-in-out"
                  _hover={{
                    transform: "scale(1.02)",
                    boxShadow: "lg",
                  }}
                >
                  <Heading
                    as="h4"
                    size="md"
                    textAlign="center"
                    my={4}
                    color="teal.500"
                  >
                    Room #{room.id}
                  </Heading>
                  <ApartmentThumbnail src={room.images?.[0]?.image || ""} />
                  <VStack spacing={2} alignItems="start" mt={4}>
                    <Text fontWeight="bold" color="gray.600">
                      Price per month:
                    </Text>
                    <Text fontSize="lg" fontWeight="bold">
                      {room.price_per_month}
                    </Text>
                    <Text fontWeight="bold" color="gray.600">
                      Size:
                    </Text>
                    <Text fontSize="lg" fontWeight="bold">
                      {room.size}
                    </Text>
                  </VStack>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Box>

        <Flex justify="space-between" align="center" mt={4}>
          <AddRoomForm
            apartmentId={apartment.id}
            isOpen={false}
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
          <Flex>
            <Link
              to={`/owner/my-apartments/${apartment.id}/contracts?apartmentId=${apartment.id}`}
            >
              <Button colorScheme="green">View Contracts</Button>
            </Link>
            <Link to={`/owner/my-apartments/${apartment.id}/bills`}>
              <Button colorScheme="blue" ml={2}>
                View Bills
              </Button>
            </Link>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default SingleApartment;
