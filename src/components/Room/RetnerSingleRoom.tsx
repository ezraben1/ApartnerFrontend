import { useEffect, useState } from "react";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import {
  Heading,
  Text,
  Flex,
  Box,
  Image,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Room } from "../../types";
import { fetchUserId } from "../../utils/userId";
import { useUserType } from "../../utils/useUserType";

import {
  MdOutlineSquareFoot,
  MdOutlineHouseSiding,
  MdOutlineWindow,
} from "react-icons/md";
import { Badge } from "@chakra-ui/react";

const RenterSingleRoom: React.FC = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [roomData, status] = useAuthorizedData<Room>(`/renter/my-room/`);
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
    if (status === "idle" && roomData) {
      setRoom(roomData);
      setLoading(false);
    }
  }, [roomData, status]);
  const { userType, status: userTypeStatus } = useUserType();

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "renter") {
    return <div>You are not an retner!</div>;
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

  if (status === "error" || !room) {
    return <div>Error loading room data.</div>;
  }

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
          {room?.images && room.images.length > 0 && (
            <Image
              src={room?.images[0]?.image}
              alt="Room"
              objectFit="contain"
              w="100%"
              h="450px"
            />
          )}
          <Box bg="gray.200" p={4} borderRadius="md">
            <Heading size="md" mb={2}>
              Description
            </Heading>
            <Text>{room?.description}</Text>
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
                <Text>{room.size} sqm</Text>
              </Stack>
              <Stack>
                <Text>
                  <Icon as={MdOutlineHouseSiding} /> Price
                </Text>
                <Text>{room.price_per_month} $</Text>
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
              <Stat>
                <StatLabel fontSize="md">Contract Start Date</StatLabel>
                <StatNumber fontSize="sm">
                  {room?.contract ? room.contract.start_date : "N/A"}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="md">Contract End Date</StatLabel>
                <StatNumber fontSize="sm">
                  {room?.contract ? room.contract.end_date : "N/A"}
                </StatNumber>
              </Stat>
            </HStack>
          </Box>
        </Stack>
        <HStack mt={6} spacing={6}>
          <Link to={`/renter/my-bills/`}>
            <Button colorScheme="blue">View Bills</Button>
          </Link>
          <Link
            to={`/renter/my-room/${room?.id}/contracts/${room?.contract?.id}`}
          >
            <Button colorScheme="blue">View contract</Button>
          </Link>
        </HStack>
      </Box>
    </Flex>
  );
};

export default RenterSingleRoom;
