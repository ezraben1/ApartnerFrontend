import { useEffect } from "react";
import { Room } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { useParams } from "react-router-dom";
import { Box, Heading, Text, Flex, Stack } from "@chakra-ui/react";
import ImageGallery from "../images/ImageGallery";

const PublicSingleRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [roomData, status] = useAuthorizedData<Room>(`core/feed/${id}/`);

  useEffect(() => {
    const getUserId = async () => {};

    getUserId();
  }, []);

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  if (status === "error") {
    return <Text>Error fetching room data.</Text>;
  }

  if (!roomData) {
    return <Text>No data available.</Text>;
  }
  console.log(roomData);

  const { description, size, price_per_month, window, images } = roomData;
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
            Room Details
          </Heading>
          <ImageGallery images={images} />
          <Stack align="start" spacing={4}>
            <Stack spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                Description
              </Text>
              <Text fontSize="md">{description}</Text>
            </Stack>
            <Stack spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                Room Details
              </Text>
              <Flex justify="space-between">
                <Stack spacing={2}>
                  <Text fontSize="md">Size</Text>
                  <Text fontSize="md">{size} sqm</Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">Price</Text>
                  <Text fontSize="md">{price_per_month} $</Text>
                </Stack>
                <Stack spacing={2}>
                  <Text fontSize="md">Window</Text>
                  <Text fontSize="md">{window ? "Yes" : "No"}</Text>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
};

export default PublicSingleRoom;
