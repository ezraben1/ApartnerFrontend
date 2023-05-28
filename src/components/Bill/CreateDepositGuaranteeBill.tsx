import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import api from "../../utils/api";
import { Bill } from "../../types";
import { AxiosError } from "axios";

interface CreateDepositGuaranteeBillProps {
  onAdd?: (newBill: Bill) => void;
  apartmentId: string;
}

const CreateDepositGuaranteeBill: React.FC<CreateDepositGuaranteeBillProps> = ({
  onAdd = () => {},
  apartmentId,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (new Date(date) > new Date()) {
      alert("Cannot add future dates");
      return;
    }

    const formData = new FormData();

    formData.append("apartment", apartmentId);
    formData.append("bill_type", "deposits_guarantees");
    formData.append("amount", String(amount));
    formData.append("date", date);

    // Only append file to form data if there is a file
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await api.postWithFormData(
        `/renter/my-apartment/deposits-guarantees/`,
        formData
      );
      if (response.status === 201) {
        const newBill = await response.json();
        onAdd(newBill);
        window.location.reload(); // Refresh the page
      } else {
        const errorData = await response.json();
        console.error("Server error message:", errorData);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Server error message:", axiosError.response.data);
      }
      console.error("Error adding bill:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="amount">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Form.Text className="text-muted">
          Please enter an amount greater than 0.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Form.Text className="text-muted">
          Please enter a date that is not in the future.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="file">
        <Form.Label>File</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>
      <Button type="submit">Add deposits and guarantees</Button>
    </Form>
  );
};

export default CreateDepositGuaranteeBill;
