import { useEffect, useState } from "react";
import { Room, CustomUser, Contract, RoomImage } from "../../types";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Heading,
  VStack,
  Text,
  HStack,
  Input,
  Flex,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  StatLabel,
  StatNumber,
  Stat,
  Icon,
  SimpleGrid,
  Stack,
  Badge,
  Button,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import UpdateRoomForm from "./UpdateRoomForm";
import DeleteRoom from "./DeleteRoom";
import { useNavigate } from "react-router-dom";
import AddContract from "../Contract/AddContract";
import api from "../../utils/api";
import { deleteImage } from "../images/imageUtils";
import { Carousel } from "react-bootstrap";
import {
  MdAcUnit,
  MdOutlineApartment,
  MdOutlineHouseSiding,
} from "react-icons/md";

const OwnerSingleRoom: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [, setRenter] = useState<CustomUser | null>(null);
  const [apartmentId, setApartmentId] = useState<number>(0);
  const [, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const handleRoomDelete = () => {
    navigate(-1);
  };

  const handleContractCreate = (createdContract: Contract) => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        return { ...prevRoom, contract: createdContract };
      }
      return prevRoom;
    });
  };

  useEffect(() => {
    const fetchApartmentAndRoomIds = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/owner/owner-apartments/${id}/room/${id}/`
        );
        const roomData = await response.json();

        setRoom(roomData);
        setRenter(roomData.renter);
        setApartmentId(roomData.apartment_id);
      } catch (error) {
        console.error("Error fetching apartment and room IDs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartmentAndRoomIds();
  }, [id]);

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
          `/owner/owner-rooms/${room?.id}/upload_image/`,
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

  const handleDeleteImage = (imageId: number) => {
    const endpoint = `/owner/owner-rooms/${room?.id}/images/${imageId}/`;
    deleteImage(
      endpoint,
      (id) => {
        setRoom((prev) => {
          if (prev) {
            return {
              ...prev,
              images: prev.images.filter((image: RoomImage) => image.id !== id),
            };
          }
          return null;
        });
      },
      imageId
    );
  };

  const imageItems = room?.images.map((image) => ({
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

  if (status === "error" || !room) {
    return <div>Error loading room data.</div>;
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
          Room {room.id}
        </Heading>
      </Flex>
      <Flex justify="center" align="center" width="100%">
        <Carousel>
          {imageItems &&
            imageItems.map((imageItem, index) => (
              <Carousel.Item key={index}>
                <Image
                  src={imageItem.original}
                  alt={imageItem.original}
                  borderRadius="lg"
                  boxShadow="md"
                />
              </Carousel.Item>
            ))}
        </Carousel>
      </Flex>

      <VStack align="stretch" spacing={6} mt={4}>
        <Box bg="gray.100" p={4} borderRadius="md">
          <Heading size="lg" mb={2} color="teal.400">
            <Icon as={MdOutlineApartment} color="teal.400" /> Room Details
          </Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Stack>
              <Text fontSize="md" color="gray.600">
                <Icon as={MdOutlineHouseSiding} color="teal.300" /> Size
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                {room.size} sqm
              </Text>
            </Stack>
            <Stack>
              <Text fontSize="md" color="gray.600">
                <Icon as={MdAcUnit} color="teal.300" /> Has window
              </Text>
              <Badge
                variant={room.window ? "solid" : "outline"}
                colorScheme={room.window ? "green" : "red"}
              >
                {room.window ? "Yes" : "No"}
              </Badge>
            </Stack>
            <Stat>
              <StatLabel fontSize="md" color="gray.600">
                Price per month
              </StatLabel>
              <StatNumber fontSize="lg" fontWeight="bold">
                ${room.price_per_month}
              </StatNumber>
            </Stat>
          </SimpleGrid>
          {room.contract ? (
            <Box>
              <Text>
                <strong>Contract ID:</strong> {room.contract.id}
              </Text>
              <Link
                to={`/owner/my-apartments/${apartmentId}/room/${room.id}/contracts/${room.contract.id}`}
              >
                <Button colorScheme="blue">Room Contract</Button>
              </Link>
            </Box>
          ) : (
            <Text>No contract available for this room.</Text>
          )}

          {room.renter ? (
            <Box>
              <Text>
                <strong>Renter name:</strong> {room.renter.first_name}{" "}
                {room.renter.last_name}
              </Text>
              <Text>
                <strong>email:</strong> {room.renter.email}
              </Text>
              <Image
                src={room.renter.avatar}
                alt="Renter's avatar"
                width="50px"
                height="50px"
              />
            </Box>
          ) : (
            <Text>No renter assigned to this room.</Text>
          )}
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
          <UpdateRoomForm
            room={room}
            apartmentId={apartmentId}
            onUpdate={(updatedRoom: Room) => setRoom(updatedRoom)}
          />
          <DeleteRoom
            roomId={room.id}
            apartmentId={apartmentId}
            onDelete={handleRoomDelete}
          />
        </Flex>
        <Text fontSize="lg" color="gray.600" mt={4}>
          {room.description}
        </Text>
      </VStack>
      <Flex justifyContent="center">
        <HStack
          spacing={{ base: 2, md: 4 }}
          justifyContent="space-between"
          flexWrap={{ base: "wrap", md: "nowrap" }}
          mt={{ base: 4, md: 6 }}
        >
          <Box flex="1">
            <UpdateRoomForm
              room={room}
              apartmentId={apartmentId}
              onUpdate={(updatedRoom: Room) => setRoom(updatedRoom)}
            />
          </Box>
          <Box flex="1">
            <DeleteRoom
              roomId={room.id}
              apartmentId={apartmentId}
              onDelete={handleRoomDelete}
            />
          </Box>
          <Box flex="1">
            <AddContract
              roomId={room.id}
              apartmentId={apartmentId}
              onCreate={handleContractCreate}
            />
          </Box>
          <Box flex={{ base: "1", md: "0" }} mt={{ base: 4, md: 0 }}>
            <Flex
              direction="column"
              alignItems={{ base: "center", md: "flex-start" }}
            >
              <Text
                fontSize={{ base: "sm", md: "lg" }}
                fontWeight="bold"
                mb={2}
              >
                Upload Images:
              </Text>
              <InputGroup>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <InputRightElement>
                  <IconButton aria-label="Upload" icon={<AddIcon />} />
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default OwnerSingleRoom;
