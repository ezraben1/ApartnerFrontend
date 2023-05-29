import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4">
      <Container>
        <Row className="py-4">
          <Col md={6} className="mb-4 mb-md-0">
            <h5>
              <Link to="/aboutus" className="text-white">
                About A-Partner
              </Link>
            </h5>
            <p className="text-muted">
              A-Partner is a platform that connects people who are looking for
              properties to rent with property owners and managers.
            </p>
          </Col>
          <Col md={6} className="mb-4 mb-md-0">
            <h5>
              <Link to="/contactus" className="text-white">
                Contact Us
              </Link>
            </h5>
            <ul className="list-unstyled text-muted">
              <li>Rabenu Yeruham St.</li>
              <li>Tel-Aviv-Yaffo, TLV 6818211, Israel</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@a-partner.com</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p className="text-muted">
              © {new Date().getFullYear()} A-Partner. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
