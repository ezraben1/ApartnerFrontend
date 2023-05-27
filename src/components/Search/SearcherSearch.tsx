import { useEffect, useState } from "react";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { Room } from "../../types";
import SearchFilters from "./SearchFilters";
import Pagination from "../../layout/Pagination";
import { useUserType } from "../../utils/useUserType";

const SearcherSearch: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [url, setUrl] = useState("/searcher/searcher-search/");

  const [roomData, status] = useAuthorizedData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Room[];
  }>(url);

  const handleFilterSubmit = (newUrl: string) => {
    setUrl(newUrl);
  };

  useEffect(() => {
    if (status === "idle" && roomData) {
      setRooms(roomData.results);
    }
  }, [roomData, status]);

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
      <SearchFilters onFilterSubmit={handleFilterSubmit} rooms={rooms} />
      <Pagination
        next={roomData?.next ?? null}
        previous={roomData?.previous ?? null}
        onPaginate={onPaginate}
      />
    </div>
  );
};

export default SearcherSearch;
