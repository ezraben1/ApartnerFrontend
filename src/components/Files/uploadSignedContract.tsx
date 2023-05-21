import React from "react";
import api from "../../utils/api";

const UploadSignedContract: React.FC<{
  signedUrl: string;
  apiEndpoint: string;
}> = ({ signedUrl, apiEndpoint }) => {
  const upload = async () => {
    try {
      const response = await fetch(signedUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "signed-contract.pdf");

      const uploadResponse = await api.patch(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = await uploadResponse.json();
      console.log("Signed contract uploaded successfully:", updatedData);
    } catch (error) {
      console.error("Error uploading signed contract:", error);
    }
  };

  React.useEffect(() => {
    upload();
  }, [signedUrl, apiEndpoint]);

  return null;
};

export default UploadSignedContract;
