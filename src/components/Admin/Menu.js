import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Menu = (props) => {
  return (
    <Nav>
      <NavLink to={"category"}>
        <nav>Category</nav>
      </NavLink>
      <NavLink to={"product"}>
        <nav>Product</nav>
      </NavLink>
    </Nav>
  );
};
export default Menu;
