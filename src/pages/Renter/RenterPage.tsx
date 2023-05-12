import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useUserType } from "../../utils/useUserType";

const RenterPage: React.FC = () => {
  const { userType, status: userTypeStatus } = useUserType();

  if (userTypeStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userTypeStatus === "error" || userType === null) {
    return <div>Please log in to access this page.</div>;
  }

  if (userType !== "renter") {
    return <div>You are not a renter!</div>;
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <h1 className="mb-5">Welcome to the Renter Page</h1>
      <div className="d-flex justify-content-center mb-5">
        <Link to="/me">
          <Button className="mx-2" variant="primary">
            Profile
          </Button>
        </Link>
        <Link to="/renter/my-apartment">
          <Button className="mx-2" variant="primary">
            My Apartment
          </Button>
        </Link>
        <Link to="/renter/my-bills">
          <Button className="mx-2" variant="primary">
            My Bills
          </Button>
        </Link>
        <Link to="/renter/my-room">
          <Button className="mx-2" variant="primary">
            My Room
          </Button>
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default RenterPage;
