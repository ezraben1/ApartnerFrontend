import { useEffect, useState } from "react";
import RoomList from "./RoomList";
import { useAuthorizedData } from "../../utils/useAuthorizedData";
import { Room } from "../../types";
import { useUserType } from "../../utils/useUserType";

const MyRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomData, status] = useAuthorizedData<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Room[];
  }>("/owner/owner-rooms/");
  const { userType, status: userTypeStatus } = useUserType();

  useEffect(() => {
    if (status === "idle" && roomData) {
      setRooms(roomData.results);
    }
  }, [roomData, status]);
  if (status === "loading" || userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "owner") {
    return <div>You are not an owner!</div>;
  }
  return (
    <div>
      <h1>My Rooms</h1>
      <RoomList rooms={rooms} apartmentId={null} />
    </div>
  );
};

export default MyRooms;
