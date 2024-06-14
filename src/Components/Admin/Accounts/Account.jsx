import { useEffect, useState } from "react";
import Tittle from "../../Fragments/Tittle";
import {
  activation,
  deleteAccount,
  getAccount,
  getAllAccount,
  updateRole,
} from "../../../Services/AccountService";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import useModal from "../../../CustomHooks/useModal";
import useAuth from "../../../CustomHooks/useAuth";
import { Link } from "react-router-dom";
import { getAllRoles } from "../../../Services/EnumService";

export default function Account() {
  const [listAccount, setListAccount] = useState([]);

  const [account, setAccount] = useState({
    phone: "",
    email: "",
    address: "",
    name: "",
  });
  const { openModal, closeModal } = useModal();

  const { auth } = useAuth();

  const [show, setShow] = useState(false);

  const [listRoles, setListRoles] = useState([]);

  const [newRole, setNewRole] = useState("");

  const handleClose = () => setShow(false);

  const handleShow = async (id) => {
    await getAccount(id).then((res) => {
      setAccount({
        name: res.data.name,
        phone: res.data.phone,
        email: res.data.email,
        address: res.data.address,
      });
    });
    setShow(true);
  };

  useEffect(() => {
    fetchGetAllAccount();
    fetchGetAllRoles();
  }, []);

  const fetchGetAllAccount = async () => {
    await getAllAccount().then((res) => {
      setListAccount(res.data.accountsRes);
    });
  };

  const fetchGetAllRoles = async () => {
    await getAllRoles().then((res) => {
      setListRoles(res.data);
    });
  };

  const handleActivation = async (id, isActivated) => {
    openModal(
      isActivated ? "Hủy kích hoạt?" : "Kích hoạt?",
      "Bạn có chắc muốn" +
        (isActivated ? " hủy kích hoạt" : "kích hoạt") +
        " tài khoản này?",
      () => {
        activation(id)
          .then((res) => {
            fetchGetAllAccount();
          })
          .catch((error) => {
            console.error(error);
            toast.error("Có lỗi xảy ra!");
          });

        closeModal();
      }
    );
  };

  const handleDelete = (id) => {
    openModal("Xóa tài khoản", `Bạn có chắc muốn xóa tài khoản này?`, () => {
      deleteAccount(id)
        .then((res) => {
          toast.success("Xóa tài khoản thành công!");
          fetchGetAllAccount();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Có lỗi xảy ra!");
        });
      closeModal();
    });
  };



  const handleShowModalRole = async (id, role) => {
    
    openModal(
      "Sửa quyền",
      <>
        <select
          className="form-control"
          onChange={(e) => setNewRole(e.target.value)}
        >
          {listRoles.map((r) => (
            <option key={r.key} value={r.key}>
              {r.value}
            </option>
          ))}
        </select>
      </>,
      async () => {
        console.log(newRole);
        await updateRole(id, newRole)
          .then((res) => {
            toast.success("Xóa tài khoản thành công!");
            fetchGetAllAccount();
          })
          .catch((error) => {
            console.error(error);
            toast.error("Có lỗi xảy ra!");
          });
        closeModal();
      }
    );
  };
  return (
    <>
      <Tittle tittle="Quản lý tài khoản" />
      <div className="mt-5 bg-white p-5 shadow border">
        <table className="table table-striped table-hover table-bordered border">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {listAccount.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.name}</td>
                <td>{acc.phone}</td>
                <td>{acc.email}</td>
                <td>{acc.role}</td>
                <td
                  className={
                    acc.isActivated ? "text-bg-success" : "text-bg-danger"
                  }
                >
                  {acc.isActivated ? "Hoạt động" : "Hủy kích hoạt"}
                </td>
                <td>
                  {auth.account.id === acc.id ? (
                    <>
                      <Link to={"/admin/accounts/edit"}>
                        <button className="button">Xem/Sửa</button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Dropdown data-bs-theme="dark">
                        <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                          Hành động
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleShow(acc.id)}>
                            Xem thông tin
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowModalRole(acc.id,acc.role)}
                          >
                            Sửa quyền
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleActivation(acc.id, acc.isActivated)
                            }
                          >
                            Hủy kích hoạt/Kích hoạt
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDelete(acc.id)}>
                            Xóa
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal size="lg" show={show}>
        <Modal.Header closeButton onClick={() => handleClose()}>
          <Modal.Title>Thông tin tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Tên: <span className="fw-bolder">{account.name}</span>
          </div>
          <div>
            Số điện thoại: <span className="fw-bolder">{account.phone}</span>
          </div>
          <div>
            Email: <span className="fw-bolder">{account.email}</span>
          </div>
          <div>
            Địa chỉ: <span className="fw-bolder">{account.address}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
