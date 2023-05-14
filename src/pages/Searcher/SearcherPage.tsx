import { Link, Outlet } from "react-router-dom";
import { Button, Heading, VStack } from "@chakra-ui/react";
import { useUserType } from "../../utils/useUserType";

const SearcherPage: React.FC = () => {
  const { userType, status: userTypeStatus } = useUserType();

  if (userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "searcher") {
    return <div>You are not a Searcher!</div>;
  }

  return (
    <VStack spacing={8} alignItems="center" justifyContent="center">
      <Heading as="h1" size="2xl">
        Welcome to the Searcher Page
      </Heading>
      <VStack spacing={4} alignItems="stretch">
        <Link to="/login">
          <Button colorScheme="blue" size="lg" w="full">
            Login
          </Button>
        </Link>
        <Link to="/me">
          <Button colorScheme="blue" size="lg" w="full">
            Profile
          </Button>
        </Link>
        <Link to="/searcher/search">
          <Button colorScheme="blue" size="lg" w="full">
            Search
          </Button>
        </Link>
      </VStack>
      <Outlet />
    </VStack>
  );
};

export default SearcherPage;
