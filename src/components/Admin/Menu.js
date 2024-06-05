import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from "react";


const Menu = (props) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      setUsername(auth.username);
    }
  }, []);
  return (
    <>
      <div className="bg-dark sidebar">
        <ul className=" list-group p-3 menu">
            <li className="p-3 text-light menu-item" >Trang chủ</li>
            <li className="p-3 text-light menu-item" >Quản
                lý Sản phẩm
            </li>
            <li className="p-3 text-light menu-item" >
                Quản lý danh mục Sản phẩm
            </li>
           
          
            <div className="m-3">
                <div className="mb-3 text-light" >
                    Xin chào, {username} <FontAwesomeIcon icon="fa-regular fa-eye" /> ! 
                      
                </div>
                
                <button className="btn btn-danger">Đăng xuất</button>
                
            </div>
        </ul>
        </div>
    </>
  );
};
export default Menu;
