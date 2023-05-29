import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import api from "../../utils/api";
import { Bill } from "../../types";
import { AxiosError } from "axios";

interface AddBillProps {
  apartmentId: string;
  onAdd?: (newBill: Bill) => void;
}

const AddBill: React.FC<AddBillProps> = ({ apartmentId, onAdd = () => {} }) => {
  const [billType, setBillType] = useState("");
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

    if (!file) {
      alert("Please select a file");
      return;
    }
    if (!billType) {
      console.error("No bill type selected");
      return;
    }

    const formData = new FormData();
    formData.append("apartment", apartmentId);
    formData.append("bill_type", billType);
    formData.append("amount", String(Number(amount)));
    formData.append("date", date);
    formData.append("file", file || new Blob());

    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await api.postWithFormData(
        `/owner/owner-bills/`,
        formData
      );
      if (response.status === 201) {
        const newBill = await response.json();
        onAdd(newBill);
        alert("bill added!");
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
      <Form.Group controlId="billType">
        <Form.Label>Bill Type</Form.Label>
        <Form.Select
          value={billType}
          onChange={(e) => setBillType(e.target.value)}
        >
          <option value="" disabled>
            Select bill type
          </option>
          {Bill.BILL_TYPES.map((type) => (
            <option key={type[0]} value={type[0]}>
              {type[1]}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="amount">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="file">
        <Form.Label>File</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>
      <Button type="submit">Add Bill</Button>
    </Form>
  );
};

export default AddBill;
