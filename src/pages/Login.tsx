import { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../utils/auth";
import api from "../utils/api";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<any>(null); // state to store logged in user

  // login.tsx
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data, status } = await auth.login({ username, password });

      if (status === 200) {
        // if response is ok
        if (data.data && data.data.access) {
          // check if access_token exists in the nested data
          onLoginSuccess(data.data.access); // use the access_token in data

          // fetch user details and set the logged in user state
          const userResponse = await api.getUserDetails();
          console.log("userResponse:", userResponse); // add this line to log the userResponse object
          if (userResponse.ok) {
            const user = await userResponse.json();
            setLoggedInUser(user);
          }

          navigate("/");
        } else {
          console.log("No access_token in response data:", data); // for debugging
          setError("Invalid credentials");
        }
      } else {
        console.log("Login response not ok:", status); // for debugging
        setError("Invalid credentials");
      }
    } catch (error) {
      console.log("login error:", error); // add this line to log the error object
      setError("An error occurred while logging in");
    }
  };

  return (
    <Box
      mx="auto"
      maxW="md"
      mt="8"
      p="6"
      bg="white"
      borderRadius="md"
      boxShadow="md"
    >
      {loggedInUser && <Text>Welcome {loggedInUser.username}!</Text>}
      <Heading as="h1" mb="6">
        Login
      </Heading>
      {error && <Text color="red.500">{error}</Text>}
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Login;
