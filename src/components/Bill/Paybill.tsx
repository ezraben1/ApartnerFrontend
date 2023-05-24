import React, { useState, FormEvent } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useToast } from "@chakra-ui/react";
import api from "../../utils/api";

const PayBill: React.FC<{ billId: string; fetchBill: () => void }> = ({
  billId,
  fetchBill,
}) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(`/renter/my-bills/${billId}/pay/`, {});
      const result = await response.json();

      if (result.status === "success") {
        fetchBill();
        toast({
          title: "Payment",
          description: "Payment succeed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Payment",
          description: result.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Payment",
        description: "Payment failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Pay Bill
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pay Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="First Name" required />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Last Name" required />
            </Form.Group>
            <Form.Group controlId="cardNumber">
              <Form.Label>Credit Card Number</Form.Label>
              <Form.Control type="text" placeholder="Card Number" required />
            </Form.Group>
            <Form.Group controlId="expiryDate">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control type="month" placeholder="Expiry Date" required />
            </Form.Group>
            <Form.Group controlId="cvv">
              <Form.Label>CVV</Form.Label>
              <Form.Control type="text" placeholder="CVV" required />
            </Form.Group>
            <Form.Group controlId="id">
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" placeholder="ID" required />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PayBill;
