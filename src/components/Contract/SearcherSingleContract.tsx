import { useParams } from "react-router-dom";
import { Contract } from "../../types";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { useEffect, useState } from "react";
import { Container, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { handleDownloadFile } from "../images/handleDownloadFile";
import { Button, useToast } from "@chakra-ui/react";
import api from "../../utils/api";
import SubmitSuggestedContractForm from "./SubmitSuggestedContractForm";

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
  const toast = useToast();

  useEffect(() => {
    if ((window as any).HelloSign) {
      // Initialize HelloSign SDK
      (window as any).HelloSign.init("b0e3cae5b0eaa2ab368de095fe5ea46a");
      setHelloSignInitialized(true);
    } else {
      const script = document.createElement("script");
      script.src =
        "https://s3.amazonaws.com/cdn.hellosign.com/public/js/hellosign-embedded.LATEST.min.js";
      script.async = true;
      script.onload = () => {
        // Initialize HelloSign SDK
        (window as any).HelloSign.init("b0e3cae5b0eaa2ab368de095fe5ea46a");
        setHelloSignInitialized(true);
      };
      script.onerror = () => {
        console.error("Failed to load HelloSign script.");
      };
      document.body.appendChild(script);
    }
  }, []);

  let attempts = 0;

  const openSignatureForm = async () => {
    try {
      const response = await api.postSign(
        `/searcher/searcher-search/${roomId}/contract/${contractId}/send-for-signing`
      );

      const data = await response.json();
      const signUrl = data.sign_url;

      if (!signUrl) {
        console.error("Signing URL is missing in the response");
        return;
      }
      alert("Keep this page open until success message appears.");

      if (helloSignInitialized) {
        (window as any).HelloSign.open({
          url: signUrl,
          clientId: "b0e3cae5b0eaa2ab368de095fe5ea46a",
          skipDomainVerification: true,
          allowCancel: true,
          debug: true,
        });

        // After the form is opened, start the status polling after 30 seconds
        setTimeout(pollForSignatureStatus, 30000);
      } else {
        console.error("HelloSign SDK not yet initialized");
      }
    } catch (error) {
      console.error("Failed to get signature request ID: ", error);
    }
  };

  const uploadSignedDocument = async () => {
    // Obtain the CSRF token. This is an example of fetching it from a cookie.
    // You will need to replace this with your method of fetching the CSRF token.
    const csrftoken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken"))
      ?.split("=")[1];

    try {
      const response = await api.patch(
        `/searcher/searcher-search/${roomId}/contract/${contractId}/upload-signed-document`,
        {},
        {
          headers: {
            // Include the CSRF token in the 'X-CSRFToken' header
            "X-CSRFToken": csrftoken,
          },
        }
      );

      if (response.ok) {
        // Upload successful
        console.log("Signed document uploaded successfully");
        toast({
          title: "Signing uploaded successfully!",
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      } else {
        console.error("Failed to upload signed document");
        // Handle the error or display an error message to the user
      }
    } catch (error) {
      console.error("Error occurred while uploading signed document: ", error);
      // Handle the error or display an error message to the user
    }
  };

  const pollForSignatureStatus = async () => {
    if (attempts >= 20) {
      return;
    }

    attempts += 1;

    // Refetch the contract before checking signature_request_id
    let newContract = null;
    try {
      const response = await api.get(
        `/searcher/searcher-search/${roomId}/contract/${contractId}`
      );
      newContract = await response.json();
      setContract(newContract); // Use setContract to update the contract state
    } catch (error) {
      console.error("Failed to fetch contract: ", error);
    }

    console.log(
      "attempt:",
      attempts,
      "contract:",
      newContract?.signature_request_id
    );

    // If the signature_request_id is null, retry after some delay
    if (!newContract?.signature_request_id) {
      setTimeout(pollForSignatureStatus, 10 * 1000); // 10 seconds delay
      return;
    }

    try {
      const response = await api.get(
        `/searcher/searcher-search/${roomId}/contract/${contractId}/signature-status/${newContract?.signature_request_id}/`
      );
      const data = await response.json();
      console.log("status data:", data.status);
      if (data.status === "signed") {
        uploadSignedDocument();
      } else if (attempts < 20) {
        setTimeout(pollForSignatureStatus, 10 * 1000); // 10 seconds delay
      }
    } catch (error) {
      console.error("Failed to fetch signature status: ", error);
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
      {roomId && contractId && (
        <SubmitSuggestedContractForm roomId={roomId} contractId={contractId} />
      )}
    </Container>
  );
};

export default SearcherSingleContract;
