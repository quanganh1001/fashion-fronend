/* eslint-disable no-restricted-globals */
import { useState } from "react";
import $ from "jquery";
import useAuth from "../../CustomHooks/useAuth";
import { toast } from "react-toastify";
import LoadingSprinner from "../Fragments/LoadingSpinner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passBlank, setPassBlank] = useState("");
  const [usernameBlank, setUsernameBlank] = useState("");
  const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

  const { handleLogin } = useAuth();
  

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

    if (valid) {
      try {
        setIsLoading(true);
        await handleLogin({ username, password });
        toast.success("Đăng nhập thành công!")
      } catch (error) {
        setIsLoading(false);
        if (error.response.data === "Invalid username or password") {
          toast.error("Sai tên đăng nhập hoặc mật khẩu");
          setError("Sai tên đăng nhập hoặc mật khẩu");
        } else if (error.response.data === "Account has been deactivated") {
          toast.error("Tài khoản không hoạt động");
          setError("Tài khoản không hoạt động");
        }
      } 
      
    }
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
              <span className="text-danger">{error}</span>
            </div>
            <div className="row">
              <div className="col-4 d-flex align-items-center">
                <button type="submit" className="btn btn-dark">
                  Đăng nhập
                </button>
                {isLoading && <LoadingSprinner />}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
