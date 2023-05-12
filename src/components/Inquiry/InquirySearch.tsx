import React, { useState, useEffect, useMemo } from "react";
import InquiryFilters from "./InquiryFilters";
import InquiryList from "./InquiryList";
import Pagination from "../../layout/Pagination";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { useUserType } from "../../utils/useUserType";

const InquirySearch: React.FC = () => {
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const queryParam = useMemo(() => {
    const params = new URLSearchParams();

    for (const key in filters) {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    }

    return `?${params.toString()}`;
  }, [filters]);

  const [url, setUrl] = useState(`/core/inquiries/${queryParam}`);

  const [data, setData] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
  }>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const [inquiryData, status] = useAuthorizedData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
  }>(url);

  useEffect(() => {
    if (status === "idle" && inquiryData) {
      const nextUrl = inquiryData.next
        ? new URL(inquiryData.next).pathname + new URL(inquiryData.next).search
        : null;
      const prevUrl = inquiryData.previous
        ? new URL(inquiryData.previous).pathname +
          new URL(inquiryData.previous).search
        : null;

      setData({
        ...inquiryData,
        next: nextUrl,
        previous: prevUrl,
      });
    }
  }, [inquiryData, status]);

  const handleFilterSubmit = (newFilters: { [key: string]: any }) => {
    setFilters(newFilters);
  };

  const onPaginate = (url: string) => {
    setUrl(url);
  };
  const { userType, status: userTypeStatus } = useUserType();

  if (userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }
  return (
    <div>
      <InquiryFilters onFilterSubmit={handleFilterSubmit} />
      <InquiryList inquiries={data.results} />
      <Pagination
        next={data.next ?? null}
        previous={data.previous ?? null}
        onPaginate={onPaginate}
      />
    </div>
  );
};

export default InquirySearch;
