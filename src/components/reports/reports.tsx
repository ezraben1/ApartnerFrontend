import React from "react";
import { Button, VStack, Box } from "@chakra-ui/react";
import api from "../../utils/api";

const Reports: React.FC = () => {
  const getFileExtension = (contentType: string | null): string => {
    if (!contentType) {
      return "";
    }

    if (
      contentType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return "xlsx";
    } else if (contentType === "application/vnd.ms-excel") {
      return "xls";
    }

    return "";
  };

  const downloadReport = async (period: string) => {
    const url = `/owner/owner-bills/${period}_report/`;

    try {
      const blob = await api.getBlob(url);

      const fileExtension = getFileExtension(blob.type);
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `report.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="10vh"
    >
      <VStack spacing={5} align="stretch">
        <Box>
          <Button colorScheme="blue" onClick={() => downloadReport("monthly")}>
            Monthly Bill Reports
          </Button>
        </Box>
        <Box>
          <Button colorScheme="teal" onClick={() => downloadReport("annual")}>
            Annual Bill Reports
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Reports;
