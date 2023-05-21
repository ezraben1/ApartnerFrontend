import { useParams } from "react-router-dom";
import { Contract } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { useEffect, useState } from "react";
import { Container, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { handleDownloadFile } from "../images/handleDownloadFile";
import { Button } from "@chakra-ui/react";
import api from "../../utils/api";

const SearcherSingleContract: React.FC = () => {
  const { roomId, contractId } = useParams<{
    roomId: string;
    contractId: string;
  }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [contractData, status] = useAuthorizedData<Contract>(
    `/searcher/searcher-search/${roomId}/contract/${contractId}/`
  );
  const [helloSignInitialized, setHelloSignInitialized] = useState(false);

  useEffect(() => {
    if ((window as any).HelloSign) {
      (window as any).HelloSign.init("b0e3cae5b0eaa2ab368de095fe5ea46a");
      setHelloSignInitialized(true);
    } else {
      const script = document.createElement("script");
      script.src =
        "https://s3.amazonaws.com/cdn.hellosign.com/public/js/hellosign-embedded.LATEST.min.js";
      script.async = true;
      script.onload = () => {
        (window as any).HelloSign.init("b0e3cae5b0eaa2ab368de095fe5ea46a");
        setHelloSignInitialized(true);
      };
      document.body.appendChild(script);
    }
  }, []);

  const openSignatureForm = async () => {
    try {
      const response = await api.postSign(
        `/searcher/searcher-search/${roomId}/contract/${contractId}/send-for-signing`
      );

      const data = await response.json();
      console.log(data); // Add this line to log the response data

      const signUrl = data.sign_url; // OR data.embedded.sign_url
      console.log(signUrl);

      if (!signUrl) {
        console.error("Signing URL is missing in the response");
        return;
      }

      if (helloSignInitialized) {
        (window as any).HelloSign.open(signUrl, {
          clientId: "b0e3cae5b0eaa2ab368de095fe5ea46a",
          skipDomainVerification: true,
          allowCancel: true,
          debug: true,
          onMessage: (event: any) => {
            if (event.event === "signature_request_signed") {
              console.log("Document signed! Event data:", event);
            }
          },
          onClose: () => {
            console.log("User closed the signature request.");
          },
        });
      } else {
        console.error("HelloSign SDK not yet initialized");
      }
    } catch (error) {
      console.error("Failed to get signature request ID: ", error);
    }
  };

  useEffect(() => {
    if (status === "idle" && contractData) {
      setContract(contractData);
    }
  }, [contractData, status]);

  const handleDownload = () => {
    handleDownloadFile(
      `/searcher/searcher-search/${roomId}/contract/${contract?.id}/download/`,
      `${contract?.id || ""}`,
      "contract",
      "pdf"
    );
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error" || !contract) {
    return <div>Error loading contract data.</div>;
  }

  return (
    <Container>
      <h1 className="my-4">Contract #{contract.id}</h1>
      <Card>
        <ListGroup variant="flush">
          <ListGroupItem>
            <strong>Start Date:</strong> {contract.start_date}
          </ListGroupItem>
          <ListGroupItem>
            <strong>End Date:</strong> {contract.end_date}
          </ListGroupItem>
          <ListGroupItem>
            <strong>Deposit Amount:</strong> {contract.deposit_amount}
          </ListGroupItem>
          <ListGroupItem>
            <strong>Rent Amount:</strong> {contract.rent_amount}
          </ListGroupItem>
        </ListGroup>
      </Card>
      <Button colorScheme="green" onClick={handleDownload}>
        Download Contract
      </Button>
      <Button colorScheme="blue" onClick={openSignatureForm}>
        Sign Contract
      </Button>
    </Container>
  );
};

export default SearcherSingleContract;
