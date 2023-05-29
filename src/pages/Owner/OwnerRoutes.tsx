import { Route, Routes } from "react-router-dom";
import MyApartments from "../../components/Apartment/MyApartments";
import MyRooms from "../../components/Room/MyRooms";
import MyContracts from "../../components/Contract/MyContracts";
import OwnerSingleRoom from "../../components/Room/OwnerSingleRoom";
import BillsList from "../../components/Bill/OwnerBillsList";
import SingleBill from "../../components/Bill/OwnerSingleBill";
import OwnerSingleContract from "../../components/Contract/OwnerSingleContract";
import OwnerSingleApartment from "../../components/Apartment/OwnerSingleApartment";
import ApartmentContracts from "../../components/Contract/ApartmentContracts";

const OwnerRoutes = () => {
  return (
    <Routes>
      <Route path="/my-rooms" element={<MyRooms />} />
      <Route path="/my-contracts" element={<MyContracts />} />
      <Route path="/my-apartments" element={<MyApartments />} />
      <Route path="/my-apartments/:id" element={<OwnerSingleApartment />} />
      <Route path="/my-apartments/:id/room/:id" element={<OwnerSingleRoom />} />
      <Route
        path="/my-apartments/:id/contracts/"
        element={<ApartmentContracts />}
      />
      <Route
        path="/my-apartments/:apartmentId/room/:roomId/contracts/:contractId"
        element={<OwnerSingleContract />}
      />
      <Route
        path="/my-apartments/:apartmentId/bills/"
        element={<BillsList />}
      />
      <Route
        path="/my-apartments/:apartmentId/bills/:billId"
        element={<SingleBill />}
      />
    </Routes>
  );
};

export default OwnerRoutes;
