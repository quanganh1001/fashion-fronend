/* eslint-disable no-restricted-globals */
import { useState, useEffect } from "react";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../services/Auth";
import { login } from "../../services/Auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passBlank, setPassBlank] = useState("");
  const [usernameBlank, setUsernameBlank] = useState("");
  const [auth, setAuth] = useState(getAuth());
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const submitForm = async (event) => {
    event.preventDefault();

    let valid = true;

    if (password === "") {
      $("#password").addClass("border-danger");
      setPassBlank("Mật khẩu không được để trống");
      valid = false;
    } else {
      setPassBlank("");
      $("#password").removeClass("border-danger");
    }

    if (username === "") {
      valid = false;
      $("#username").addClass("border-danger");
      setUsernameBlank("Tên đăng nhập không được để trống");
    } else {
      setUsernameBlank("");
      $("#username").removeClass("border-danger");
    }

    if (!valid) {
      return;
    }

    login({ username, password })
      .then((res) => {
        console.log(res);
        setAuth({
          token: res.token,
          refreshToken: res.refreshToken,
          role: res.role,
          usename: res.username,
        });
        navigate('/admin')
      })
      .catch((error) => {
        if(error.response.data === 'Invalid username or password'){
          setPassBlank("Sai tên đăng nhập hoặc mật khẩu");
        };
      });
  };

  return (
    <div className="p-5 d-flex flex-column align-items-center">
      <h2>ĐĂNG NHẬP NHÂN VIÊN</h2>
      <div className="mt-5 bg-white p-5 shadow border col-8">
        <div className="card-body">
          <p className="login-box-msg">Đăng nhập</p>
          <form onSubmit={submitForm}>
            <div className=" mb-3">
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="Tên đăng nhập"
                onChange={(event) => setUsername(event.target.value)}
              />
              <span className="text-danger">{usernameBlank}</span>
            </div>
            <div className=" mb-3">
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Mật khẩu"
                onChange={(event) => setPassword(event.target.value)}
              />
              <span className="text-danger">{passBlank}</span>
            </div>
            <div className="row">
              <div className="col-4">
                <button type="submit" className="btn btn-dark">
                  Đăng nhập
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
