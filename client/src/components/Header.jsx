import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import "./Header.css";
import { FaShoppingBasket } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoIosSearch } from "react-icons/io";

const Header = () => {
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className="me-9 pe-5" href="/">
          242
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link className="pe-4" href="/">
            Home
          </Nav.Link>
          <Nav.Link href="/shop">Shop</Nav.Link>
        </Nav>
        <div className="search-input">
          <IoIosSearch size={25} />
          <Form.Control type="search" id="search" placeholder="Search..." />
        </div>
        <div className="ms-3">
          <CgProfile size={30} className="profile-icon" />
        </div>
        <div className="ms-3 ps-4">
          <FaShoppingBasket size={30} className="basket-icon" />
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
