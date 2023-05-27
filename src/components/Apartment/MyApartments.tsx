import { useEffect, useState } from "react";
import { Apartment, Room } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { useUserType } from "../../utils/useUserType";
import {
  VStack,
  Button,
  Heading,
  Text,
  Box,
  List,
  ListItem,
  Flex,
  Image,
  ScaleFade,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AddApartmentForm from "./AddApartmentForm";
import RoomThumbnail from "../images/RoomThumbnail";

const ApartmentThumbnail: React.FC<{ src: string }> = ({ src }) => {
  return (
    <Image
      src={src}
      alt="Apartment thumbnail"
      width="150px"
      height="150px"
      objectFit="cover"
      borderRadius="md"
    />
  );
};

const MyApartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [apartmentData, status] = useAuthorizedData<Apartment[]>(
    "/owner/owner-apartments/"
  );
  const { userType, status: userTypeStatus } = useUserType();

  useEffect(() => {
    if (status === "idle" && apartmentData) {
      setApartments(apartmentData);
    }
  }, [apartmentData, status]);

  if (status === "loading" || userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "owner") {
    return <div>You are not an owner!</div>;
  }

  if (status === "error" || !apartments) {
    return <div>Error loading apartment data.</div>;
  }
  return (
    <Center height="full" flexDirection="column">
      <ScaleFade initialScale={0.9} in={true}>
        <Heading
          as="h1"
          size="3xl"
          color={useColorModeValue("gray.800", "white")}
          mb="8"
        >
          My Apartments
        </Heading>
        <AddApartmentForm />
        <Box maxW="1200px" mx="auto" p="6">
          <List spacing={6}>
            {apartments.map((apartment: Apartment) => (
              <Link
                to={`/owner/my-apartments/${apartment.id}`}
                key={apartment.id}
              >
                <ListItem
                  p={{ base: 6, md: 8 }}
                  rounded="lg"
                  bg={useColorModeValue("gray.100", "gray.900")}
                  boxShadow="2xl"
                  transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "2xl",
                  }}
                  maxW={{ base: "full", md: "full" }}
                >
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                  >
                    <VStack align="start" spacing={4}>
                      <Heading
                        size="lg"
                        color={useColorModeValue("gray.700", "white")}
                      >
                        {apartment.address}
                      </Heading>
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        color={useColorModeValue("gray.500", "gray.200")}
                        fontWeight="semibold"
                      >
                        {apartment.rooms?.length} Rooms
                      </Text>
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        color={useColorModeValue("gray.600", "gray.300")}
                      >
                        {apartment.description
                          ? apartment.description
                              .split(" ")
                              .slice(0, 20)
                              .join(" ") + "..."
                          : "N/A"}{" "}
                      </Text>
                    </VStack>
                    <ApartmentThumbnail
                      src={apartment.images?.[0]?.image || ""}
                    />
                  </Flex>
                  <List spacing={4} mt={4}>
                    {apartment.rooms?.map((room: Room) => (
                      <Link
                        key={room.id}
                        to={`/owner/my-apartments/${apartment.id}/room/${room.id}`}
                      >
                        <ListItem
                          p={{ base: 2, md: 4 }}
                          rounded="md"
                          bg="gray.50"
                          boxShadow="md"
                          transition="all 0.2s"
                          _hover={{
                            bg: "gray.100",
                            transform: "translateY(-2px)",
                            boxShadow: "lg",
                          }}
                          maxW={{ base: "full", md: "full" }}
                        >
                          <Flex align="center">
                            <RoomThumbnail src={room.images[0]?.image || ""} />
                            <VStack
                              align="start"
                              spacing={2}
                              ml={{ base: 2, md: 4 }}
                            >
                              <Heading size="sm" color="gray.800">
                                {room.description
                                  ? room.description
                                      .split(" ")
                                      .slice(0, 12)
                                      .join(" ") + "..."
                                  : "N/A"}{" "}
                              </Heading>
                              <Text
                                fontSize={{ base: "sm", md: "md" }}
                                color="gray.500"
                              >
                                Price per month: {room.price_per_month}
                              </Text>
                              <Text
                                fontSize={{ base: "sm", md: "md" }}
                                color="gray.500"
                              >
                                Size: {room.size}
                              </Text>
                            </VStack>
                          </Flex>
                        </ListItem>
                      </Link>
                    ))}
                  </List>

                  <Flex justify="flex-end" align="center" mt={4}>
                    <Button
                      as={Link}
                      to={`/owner/my-apartments/${apartment.id}/contracts?apartmentId=${apartment.id}`}
                      colorScheme="blue"
                      size={{ base: "xs", md: "sm" }}
                      mr={2}
                    >
                      View Contracts
                    </Button>
                    <Link to={`/owner/my-apartments/${apartment.id}/bills`}>
                      <Button
                        colorScheme="green"
                        size={{ base: "xs", md: "sm" }}
                      >
                        View Bills
                      </Button>
                    </Link>
                  </Flex>
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>
      </ScaleFade>
    </Center>
  );
};

export default MyApartments;
