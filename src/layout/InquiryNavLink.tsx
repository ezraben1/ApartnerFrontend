import { NavLink } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Inquiry } from "../types";
import { useEffect, useState } from "react";
import api from "../utils/api";

const InquiryNavLink: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    const fetchInquiries = async () => {
      setStatus("loading");
      try {
        const response = await api.get("/core/simple-inquiries/");
        const data = await response.json();
        setInquiries(data);
        setStatus("idle");
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        setStatus("error");
      }
    };

    fetchInquiries();
  }, []);

  const hasUnreadInquiries =
    status === "idle" &&
    Array.isArray(inquiries) &&
    inquiries.some((inquiry) => !inquiry.read);

  return (
    <NavLink
      to="/inquiries"
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <span
        style={{
          fontWeight: "bold",
          color: hasUnreadInquiries ? "black" : "white",
          border: hasUnreadInquiries ? "1px solid green" : "none",
          padding: hasUnreadInquiries ? "2px 4px" : "0",
          borderRadius: hasUnreadInquiries ? "4px" : "0",
          backgroundColor: hasUnreadInquiries ? "lightgreen" : "transparent",
          whiteSpace: "nowrap",
        }}
      >
        My Inquiries
      </span>
      {hasUnreadInquiries && (
        <Box
          display="inline-block"
          ml={2}
          w="6px"
          h="6px"
          borderRadius="full"
          bg="green.500"
        ></Box>
      )}
    </NavLink>
  );
};

export default InquiryNavLink;
