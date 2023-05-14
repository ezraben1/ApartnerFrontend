import { Link, Outlet } from "react-router-dom";
import { Button, Heading, VStack } from "@chakra-ui/react";
import { useUserType } from "../../utils/useUserType";

const OwnerPage: React.FC = () => {
  const { userType, status: userTypeStatus } = useUserType();

  if (status === "loading" || userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "owner") {
    return <div>You are not an owner!</div>;
  }

  return (
    <VStack spacing={8} alignItems="center" justifyContent="center">
      <Heading as="h1" size="2xl" textAlign="center">
        Welcome to the Owner Page
      </Heading>
      <VStack spacing={4} alignItems="stretch">
        <Link to="/me">
          <Button colorScheme="blue" size="lg" w="full">
            Profile
          </Button>
        </Link>
        <Link to="/owner/my-apartments">
          <Button colorScheme="blue" size="lg" w="full">
            My Apartments
          </Button>
        </Link>
        <Link to="/owner/my-rooms">
          <Button colorScheme="blue" size="lg" w="full">
            My Rooms
          </Button>
        </Link>
        <Link to="/owner/my-contracts">
          <Button colorScheme="blue" size="lg" w="full">
            My Contracts
          </Button>
        </Link>
      </VStack>
      <Outlet />
    </VStack>
  );
};

export default OwnerPage;
