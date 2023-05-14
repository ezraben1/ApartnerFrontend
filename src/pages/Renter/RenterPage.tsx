import { Link, Outlet } from "react-router-dom";
import { Button, Heading, VStack } from "@chakra-ui/react";
import { useUserType } from "../../utils/useUserType";

const RenterPage: React.FC = () => {
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

  return (
    <VStack spacing={8} alignItems="center" justifyContent="center">
      <Heading as="h1" size="2xl">
        Welcome to the Renter Page
      </Heading>
      <VStack spacing={4} alignItems="stretch">
        <Link to="/me">
          <Button colorScheme="blue" size="lg" w="full">
            Profile
          </Button>
        </Link>
        <Link to="/renter/my-apartment">
          <Button colorScheme="blue" size="lg" w="full">
            My Apartment
          </Button>
        </Link>
        <Link to="/renter/my-bills">
          <Button colorScheme="blue" size="lg" w="full">
            My Bills
          </Button>
        </Link>
        <Link to="/renter/my-room">
          <Button colorScheme="blue" size="lg" w="full">
            My Room
          </Button>
        </Link>
      </VStack>
      <Outlet />
    </VStack>
  );
};

export default RenterPage;
