import React from "react";
import { Link } from "react-router-dom";
import { Room } from "../../types";
import RoomThumbnail from "../images/RoomThumbnail";
import {
  Box,
  Heading,
  List,
  ListItem,
  VStack,
  Text,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

interface RoomListProps {
  rooms: Room[] | null;
  apartmentId: number | null;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, apartmentId }) => {
  const bgHoverColor = useColorModeValue("blue.100", "blue.900");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box p={{ base: 2, md: 4 }} borderRadius="lg" boxShadow="md" bg={bgColor}>
      <Heading as="h2" size="lg" mb={4} color="teal.500">
        Rooms
      </Heading>
      <List spacing={6}>
        {rooms?.map((room) => (
          <Link
            key={room.id}
            to={`/owner/my-apartments/${apartmentId}/room/${room.id}`}
          >
            <ListItem
              p={{ base: 4, md: 6 }}
              rounded="lg"
              transition="background 0.2s, transform 0.2s"
              _hover={{
                bg: bgHoverColor,
                transform: "translateY(-2px)",
              }}
            >
              <Flex align="center" justify="space-between">
                <RoomThumbnail src={room.images[0]?.image || ""} />
                <VStack align="start" spacing={2} flex="1" marginLeft="16px">
                  <Text fontSize="lg" fontWeight="bold" color="blue.500">
                    Size: {room.size}
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    Price per month: {room.price_per_month}
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    Window: {room.window ? "Yes" : "No"}
                  </Text>
                </VStack>
              </Flex>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default RoomList;
