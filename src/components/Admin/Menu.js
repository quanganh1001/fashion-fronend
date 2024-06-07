import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = (props) => {
  const [username, setUsername] = useState("");

  const navItems = [
    { path: "/admin", label: "TRANG CHỦ" },
    { path: "/admin/products", label: "QUẢN LÝ SẢN PHẨM" },
    { path: "/admin/categories", label: "QUẢN LÝ DANH MỤC" },
  ];

  const location = useLocation();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    setUsername(auth.username);
  }, []);

  return (
    <>
      <div className="shadow-lg d-flex flex-column text-white bg-dark bg-gradient min-vh-100">
        <ul className=" list-group p-3 menu ">
          {navItems.map((item) => (
            <li className="nav-item my-2 " key={item.label}>
              <Link
                to={item.path}
                className={"nav-link ps-3 py-2"}
                style={{
                  backgroundColor:
                    location.pathname === item.path ? "#E9ECEF" : "transparent",
                  borderRadius: location.pathname === item.path ? "8px" : "0",
                  color: location.pathname === item.path ? "#000" : "#fff",
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}

          <div className="col-12 border-top ">
            <div className="mb-3 text-light mt-3 ">
              Xin chào,
              {username} ! <FontAwesomeIcon icon="fa-regular fa-eye" />
            </div>

            <button className="btn btn-danger">Đăng xuất</button>
          </div>
        </ul>
      </div>
    </>
  );
};
export default Menu;
