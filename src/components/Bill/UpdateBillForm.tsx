import React, { useState } from "react";
import { Bill } from "../../types";
import api from "../../utils/api";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FormSelect } from "react-bootstrap";

interface UpdateBillFormProps {
  bill: Bill;
  apartmentId: string;
  billId: string;
  onUpdate: (updatedBill: Bill) => void;
}

const UpdateBillForm: React.FC<UpdateBillFormProps> = ({
  bill,
  apartmentId,
  onUpdate,
}) => {
  const [billType, setBillType] = useState(bill.bill_type);
  const [amount, setAmount] = useState(bill.amount);
  const [date, setDate] = useState(bill.date);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.patch(
        `/owner/owner-apartments/${bill.apartment}/bills/${bill.id}/`,
        {
          apartment: apartmentId,
          bill_type: billType,
          amount: amount,
          date: date,
        }
      );
      const updatedBill = await response.json();
      onUpdate(updatedBill);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button colorScheme="blue" onClick={handleOpenModal}>
        Update Bill
      </Button>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Bill</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl id="billType" mb={4}>
                <FormLabel>Bill Type</FormLabel>
                <FormSelect
                  value={billType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setBillType(
                      e.target.value as
                        | "electricity"
                        | "gas"
                        | "water"
                        | "rent"
                        | "other"
                    )
                  }
                >
                  {Bill.BILL_TYPES.map((type) => (
                    <option key={type[0]} value={type[0]}>
                      {type[1]}
                    </option>
                  ))}
                </FormSelect>
              </FormControl>
              <FormControl id="amount" mb={4}>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </FormControl>
              <FormControl id="date" mb={4}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </FormControl>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={handleCloseModal}>
                  Close
                </Button>
                <Button type="submit" colorScheme="blue">
                  Update Bill
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateBillForm;
