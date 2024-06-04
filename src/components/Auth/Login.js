/* eslint-disable no-restricted-globals */
import { useState } from "react";
import { postLogin } from "../../services/Auth";
import $  from 'jquery';
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom";
import { doLogin } from "../../redux/action/accountAction";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passBlank, setPassBlank] = useState("");
  const [usernameBlank, setUsernameBlank] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let valid = true;

  const handleLogin = async (event) => {
    if (password === "") {
      $("#password").addClass("border-danger");
      setPassBlank("Mật khẩu không được để trống");
      valid = false;
    } else {
      setPassBlank("");
      $("#password").removeClass("border-danger")
    };

    if (username === "") {
      valid = false;
      $("#username").addClass("border-danger");
      setUsernameBlank("Tên đăng nhập không được để trống");
    } else {
      setUsernameBlank("");
      $("#username").removeClass("border-danger")

    };

    if (!valid) {
      return;
    }

    try {
      let res = await postLogin(username, password);
      console.log(res);
      if(res){
        dispatch(doLogin(res))
        
        navigate("/")
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Xử lý lỗi đăng nhập, ví dụ: hiển thị thông báo lỗi cho người dùng
    }
  };

  return (
    <div className="p-5 d-flex flex-column align-items-center">
      <h2>ĐĂNG NHẬP NHÂN VIÊN</h2>
      <div className="mt-5 bg-white p-5 shadow border col-8">
        <div className="card-body">
          <p className="login-box-msg">Đăng nhập</p>

          <div className=" mb-3">
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="Tên đăng nhập"
              onChange={() => setUsername(event.target.value)}
            />
            <span className="text-danger">{usernameBlank}</span>
          </div>
          <div className=" mb-3">
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              onChange={() => setPassword(event.target.value)}
            />
            <span className="text-danger">{passBlank}</span>
          </div>
          <div className="row">
            <div className="col-4">
              <button
                onClick={() => handleLogin(props)}
                className="btn btn-dark"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
