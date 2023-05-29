import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fetchUserId } from "../../utils/userId";
import api from "../../utils/api";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";

interface SubmitSuggestedContractFormProps {
  roomId: string;
  contractId: string;
}

const SubmitSuggestedContractForm: React.FC<
  SubmitSuggestedContractFormProps
> = ({ roomId, contractId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = await fetchUserId();
      setCurrentUser(userId);
    };
    fetchUser();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (!currentUser) {
        console.error("Invalid user data");
        return;
      }

      const formData = {
        contract: contractId,
        suggested_rent_amount: data.suggested_price,
        price_suggested_by: currentUser,
        notes: data.notes,
      };

      console.log("Data:", formData);

      const response = await api.post(
        `/searcher/searcher-search/${roomId}/contract/${contractId}/suggestedcontracts`,
        formData
      );

      if (response.status === 201) {
        alert("Contract suggestion submitted successfully");
        onClose();
      } else {
        alert("Something went wrong. Please try again later");
      }
    } catch (error) {
      console.error("Failed to submit contract suggestion", error);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Submit Suggestion</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Suggestion</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl
                id="suggested_price"
                isInvalid={!!errors.suggested_price}
              >
                <FormLabel>Suggested Price</FormLabel>
                <Input
                  type="number"
                  {...register("suggested_price", {
                    required: "This field is required",
                  })}
                />
              </FormControl>
              <FormControl id="notes">
                <FormLabel>Notes</FormLabel>
                <Input {...register("notes")} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Submit
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubmitSuggestedContractForm;
