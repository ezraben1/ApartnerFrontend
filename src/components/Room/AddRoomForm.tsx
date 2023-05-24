import { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import api from "../../utils/api";
import { AxiosError } from "axios";

interface RoomFormData {
  description: string;
  size: string;
  price_per_month: number | null;
  window: boolean;
  apartment: number | null;
}

interface AddRoomFormProps {
  apartmentId: number;
  isOpen: boolean;
  onClose: () => void;
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ apartmentId }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    description: "",
    size: "",
    price_per_month: null,
    window: false,
    apartment: apartmentId,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("formData:", formData);
      const requestData = new FormData();
      requestData.append("description", formData.description);
      requestData.append("size", formData.size);
      requestData.append(
        "price_per_month",
        formData.price_per_month!.toString()
      );
      requestData.append("window", formData.window ? "true" : "false");
      requestData.append("apartment", formData.apartment!.toString());

      const response = await api.postWithFormData(
        `/owner/owner-apartments/${apartmentId}/rooms/`,
        requestData
      );
      if (response.status === 201) {
        setFormData({
          description: "",
          size: "",
          price_per_month: null,
          window: false,
          apartment: apartmentId, // Updated this line
        });

        alert("Room added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error adding room:", errorData);
        alert(`Failed to add room: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Server error message:", axiosError.response.data);
      }
      console.error("Error adding room:", error);
      alert("Failed to add room.");
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={handleOpen}>
        Add Room
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    description: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl id="size" mb={4}>
              <FormLabel>Size</FormLabel>
              <Input
                type="text"
                placeholder="Enter size"
                value={formData.size}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    size: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl id="price_per_month" mb={4}>
              <FormLabel>Price per month</FormLabel>
              <Input
                type="number"
                placeholder="Enter price per month"
                value={formData.price_per_month || ""}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    price_per_month: parseInt(e.target.value, 10) || null,
                  }))
                }
              />
            </FormControl>

            <FormControl id="window" mb={4}>
              <Checkbox
                isChecked={formData.window}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    window: e.target.checked,
                  }))
                }
              >
                Window
              </Checkbox>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
              Add Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRoomForm;
