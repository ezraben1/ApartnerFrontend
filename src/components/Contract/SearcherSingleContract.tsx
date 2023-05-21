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
  const [, setSignedUrl] = useState<string | null>(null);

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
        console.log("HelloSign script loaded successfully.");
        (window as any).HelloSign.init("b0e3cae5b0eaa2ab368de095fe5ea46a");
        setHelloSignInitialized(true);
      };
      script.onerror = () => {
        console.error("Failed to load HelloSign script.");
      };
      document.body.appendChild(script);
    }
  }, []);

  const fetchSignedDocumentUrl = async (
    signatureId: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://api.hellosign.com/v3/signature_request/${signatureId}`,
        {
          headers: {
            Authorization: `Basic ${btoa(
              "c35b8f89b102910d72f6c05bf78097f62e8e9e2f28c164a587ba0ab331bca22d:"
            )}`,
          },
        }
      );

      const data = await response.json();
      const signedDocumentUrl = data.signature_request.signatures[0].signed_url;
      console.log("url:", signedDocumentUrl);
      return signedDocumentUrl;
    } catch (error) {
      console.error("Failed to fetch signed document URL: ", error);
      return null;
    }
  };

  const openSignatureForm = async () => {
    try {
      const response = await api.postSign(
        `/searcher/searcher-search/${roomId}/contract/${contractId}/send-for-signing`
      );

      const data = await response.json();
      console.log(data);

      const signUrl = data.sign_url;
      console.log(signUrl);

      if (!signUrl) {
        console.error("Signing URL is missing in the response");
        return;
      }

      if (helloSignInitialized) {
        console.log("signUrl is", signUrl);

        console.log((window as any).HelloSign); // Log HelloSign object here
        (window as any).HelloSign.open({
          url: signUrl,
          clientId: "b0e3cae5b0eaa2ab368de095fe5ea46a",
          skipDomainVerification: true,
          allowCancel: true,
          debug: true,
          onMessage: async (event: any) => {
            if (event.event === "signature_request_signed") {
              console.log("Document signed! Event data:", event);

              // The signatureRequestId should be in the event object
              const signatureRequestId = event.signature_id;

              // Fetch the signed document URL
              const signedDocumentUrl = await fetchSignedDocumentUrl(
                signatureRequestId
              );
              setSignedUrl(signedDocumentUrl);
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
