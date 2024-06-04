import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Menu = (props) => {

  return (
    <>
      <Nav>
        <NavLink to={"category"}>
          <nav>Category</nav>
        </NavLink>
        <NavLink to={"product"}>
          <nav>Product</nav>
        </NavLink>
      </Nav>

      <div>
        Xin chào,
        
        <FontAwesomeIcon icon="fa-regular fa-eye" />
      </div>
    </>
  );
};
export default Menu;
