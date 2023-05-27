import {
  Container,
  Flex,
  Spacer,
  Link,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  MenuDivider,
} from "@chakra-ui/react";
import { Text as ChakraText } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Cookies from "js-cookie";
import { useUserType } from "../utils/useUserType";
import InquiryNavLink from "./InquiryNavLink";

interface HeaderProps {
  currentUser: any;
  onLoginSuccess: (token?: string) => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({}) => {
  const [isSmallerThanLg] = useMediaQuery("(max-width: 991px)");
  const [username, setUsername] = useState<string | null>(null);
  const { userType } = useUserType();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const response = await api.get("/core/me/");
      const users = await response.json();
      if (users.length > 0) {
        setUsername(users[0].username);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    Cookies.remove("access_token");
    console.log("deleted");
    navigate("/");
    window.location.reload();
  };

  return (
    <Flex as="header" bg="blue.600" w="100%" justifyContent="center">
      <Container maxW="container.xl">
        <Flex justify="space-between" alignItems="center" py="2">
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
            <Heading size="xl" color="white">
              A-Partner
            </Heading>
          </Link>
          <Spacer />
          {isSmallerThanLg ? (
            <Menu>
              <InquiryNavLink />
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
              >
                Menu
              </MenuButton>

              <MenuList>
                {userType === "owner" && (
                  <>
                    <MenuItem as={RouterLink} to="/owner">
                      Owner
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/owner/my-apartments">
                      My Apartments
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/owner/my-rooms">
                      My Rooms
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/owner/my-contracts">
                      My Contracts
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/owner/contract-suggestions">
                      Contract Suggestions
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/searcher/search">
                      Search
                    </MenuItem>
                  </>
                )}
                {userType === "searcher" && (
                  <>
                    <MenuItem as={RouterLink} to="/searcher">
                      Searcher
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/searcher/search">
                      Search
                    </MenuItem>
                  </>
                )}
                {userType === "renter" && (
                  <>
                    <MenuItem as={RouterLink} to="/renter">
                      Renter
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/renter/my-apartment">
                      My Apartment
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/renter/my-bills">
                      My Bills
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/renter/my-room">
                      My Room
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/renter/Deposits-Guarantees">
                      Deposits and Guarantees
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/searcher/search">
                      Search
                    </MenuItem>
                  </>
                )}

                <MenuDivider />
                <MenuItem as={RouterLink} to="/inquiries">
                  Inquiries
                </MenuItem>
                <MenuItem as={RouterLink} to="/me">
                  Me
                </MenuItem>
                {username ? (
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                ) : (
                  <>
                    <MenuItem as={RouterLink} to="/login">
                      Login
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/signup">
                      Sign Up
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          ) : (
            <Flex alignItems="center">
              <NavLinks />
              {username ? (
                <>
                  <ChakraText color="white" fontWeight="medium" mr="4">
                    {username}
                  </ChakraText>
                  <Button colorScheme="blue" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    colorScheme="blue"
                    ml="30"
                    as={RouterLink}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    colorScheme="blue"
                    ml="40"
                    as={RouterLink}
                    to="/signup"
                  >
                    Sign Up!
                  </Button>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Container>
    </Flex>
  );
};

const NavLinks = () => {
  const { userType } = useUserType();

  return (
    <Flex as="nav" alignItems="center" justifyContent="space-between" w="100%">
      <InquiryNavLink></InquiryNavLink>
      <NavLink to="/me">Me</NavLink>

      {userType === "owner" && (
        <Menu>
          <MenuButton
            as={Button}
            color="black"
            fontWeight="medium"
            mr="4"
            _hover={{ textDecoration: "none" }}
          >
            <Flex alignItems="center">
              <RouterLink
                to="/owner"
                style={{ textDecoration: "none", color: "black" }}
              >
                Owner
              </RouterLink>
              <ChevronRightIcon ml="1" />
            </Flex>
          </MenuButton>
          <MenuList bg="black">
            <MenuItem as={RouterLink} to="/owner/">
              Owner
            </MenuItem>
            <MenuItem as={RouterLink} to="/owner/my-apartments">
              My Apartments
            </MenuItem>
            <MenuItem as={RouterLink} to="/owner/my-rooms">
              My Rooms
            </MenuItem>
            <MenuItem as={RouterLink} to="/owner/my-contracts">
              My Contracts
            </MenuItem>
            <MenuItem as={RouterLink} to="/owner/contract-suggestions">
              Contract Suggestions
            </MenuItem>
            <MenuItem as={RouterLink} to="/searcher/search">
              Search
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {userType === "searcher" && (
        <Menu>
          <MenuButton
            as={Button}
            color="black"
            fontWeight="medium"
            mr="4"
            _hover={{ textDecoration: "none" }}
          >
            <Flex alignItems="center">
              <RouterLink
                to="/searcher"
                style={{ textDecoration: "none", color: "black" }}
              >
                Searcher
              </RouterLink>
              <ChevronRightIcon ml="1" />
            </Flex>
          </MenuButton>
          <MenuList bg="black">
            <MenuItem as={RouterLink} to="/searcher/">
              Searcher
            </MenuItem>
            <MenuItem as={RouterLink} to="/searcher/search">
              Search
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {userType === "renter" && (
        <Menu>
          <MenuButton
            as={Button}
            color="black"
            fontWeight="medium"
            mr="4"
            _hover={{ textDecoration: "none" }}
          >
            <Flex alignItems="center">
              <RouterLink
                to="/renter"
                style={{ textDecoration: "none", color: "black" }}
              >
                Renter
              </RouterLink>
              <ChevronRightIcon ml="1" />
            </Flex>
          </MenuButton>
          <MenuList bg="black">
            <MenuItem as={RouterLink} to="/renter/">
              Renter
            </MenuItem>
            <MenuItem as={RouterLink} to="/renter/my-apartment">
              My Apartment
            </MenuItem>
            <MenuItem as={RouterLink} to="/renter/my-bills">
              My Bills
            </MenuItem>
            <MenuItem as={RouterLink} to="/renter/my-room">
              My Room
            </MenuItem>
            <MenuItem as={RouterLink} to="/renter/Deposits-Guarantees">
              Deposits and Guarantees
            </MenuItem>
            <MenuItem as={RouterLink} to="/searcher/search">
              Search
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    as={RouterLink}
    to={to}
    color="white"
    fontWeight="medium"
    _hover={{ textDecoration: "none" }}
  >
    {children}
  </Link>
);

export default Header;
