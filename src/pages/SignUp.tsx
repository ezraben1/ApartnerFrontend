import { useState, FormEvent, ChangeEvent } from "react";
import api from "../utils/api";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Select,
} from "@chakra-ui/react";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    user_type: "",
    age: "",
    gender: "",
    bio: "",
    preferred_location: "",
    preferred_roommates: "",
    preferred_rent: "",
    phone: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: e.target.files ? e.target.files[0] : null,
    }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key as keyof typeof formData]);
    }

    const response = await api.postWithFormData("signup/", data);

    if (response.ok) {
      alert("User created successfully!");
    } else {
      alert("Error creating user.");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10">
      <form onSubmit={handleSubmit}>
        <Stack spacing={5}>
          <FormControl>
            <FormLabel>Username:</FormLabel>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>First Name:</FormLabel>
            <Input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last Name:</FormLabel>
            <Input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </FormControl>{" "}
          <FormControl>
            <FormLabel>User Type:</FormLabel>
            <Select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
            >
              <option value="">Select User Type</option>
              <option value="owner">Owner</option>
              <option value="renter">Renter</option>
              <option value="searcher">Searcher</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Age:</FormLabel>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Gender:</FormLabel>
            <Input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio:</FormLabel>
            <Textarea name="bio" value={formData.bio} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Preferred Location:</FormLabel>
            <Input
              type="text"
              name="preferred_location"
              value={formData.preferred_location}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Preferred Roommates:</FormLabel>
            <Input
              type="text"
              name="preferred_roommates"
              value={formData.preferred_roommates}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Preferred Rent:</FormLabel>
            <Input
              type="number"
              name="preferred_rent"
              value={formData.preferred_rent}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Phone:</FormLabel>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Avatar:</FormLabel>
            <Input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </FormControl>
          <Button colorScheme="teal" size="md" type="submit">
            Sign Up
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default SignUp;
