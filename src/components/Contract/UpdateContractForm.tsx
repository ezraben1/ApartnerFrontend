import React, { useEffect, useState } from "react";
import { Contract } from "../../types";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import api from "../../utils/api";

interface UpdateContractFormProps {
  contract: Contract;
  onUpdate: (updatedContract: Contract) => void;
  apartmentId?: string;
  roomId?: string;
}

const UpdateContractForm: React.FC<UpdateContractFormProps> = ({
  contract,
  onUpdate,
  apartmentId,
  roomId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updatedContract, setUpdatedContract] = useState<Contract>(contract);

  useEffect(() => {
    setUpdatedContract(contract);
  }, [contract]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedContract((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apartmentId || !roomId) {
      console.error("Apartment ID or Room ID is not defined");
      return;
    }

    if (updatedContract.file) {
      alert("Please delete the file before updating the contract.");
      return;
    }

    const formData = new FormData();
    formData.append("start_date", updatedContract.start_date);
    formData.append("end_date", updatedContract.end_date);
    formData.append(
      "deposit_amount",
      updatedContract.deposit_amount.toString()
    );
    formData.append("rent_amount", updatedContract.rent_amount.toString());

    try {
      const response = await api.putWithFormData(
        `/owner/owner-apartments/${apartmentId}/room/${roomId}/contracts/${contract.id}/`,
        formData
      );

      if (response.status === 200) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        onClose();
        alert("updated!");
      } else {
        throw new Error("Error updating contract");
      }
    } catch (error) {
      console.error("Error updating contract:", error);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="yellow">
        Update Contract
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Contract</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                name="start_date"
                type="date"
                value={updatedContract.start_date}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>End Date</FormLabel>
              <Input
                name="end_date"
                type="date"
                value={updatedContract.end_date}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Deposit Amount</FormLabel>
              <Input
                name="deposit_amount"
                type="number"
                value={updatedContract.deposit_amount}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Rent Amount</FormLabel>
              <Input
                name="rent_amount"
                type="number"
                value={updatedContract.rent_amount}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateContractForm;
