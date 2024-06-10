import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useModal from "../../../CustomHooks/useModal";
import {
  createImage,
  getAllImageProducts,
  getProduct,
} from "../../../Services/ProductService";
import { deleteImage } from "../../../Services/ImageProductService";

export default function ImageProduct() {
  const { id } = useParams();

  const { openModal, closeModal } = useModal();

  const [listImages, setListImages] = useState([]);

  const [imageBackground, setImageBackground] = useState("");

  const [imageFileError, setImageFileError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchImagesProduct();
    fetchImageBackground();
  }, []);

  const fetchImagesProduct = async () => {
    await getAllImageProducts(id).then((res) => {
      setListImages(res.data);
    });
  };

  const fetchImageBackground = async () => {
    await getProduct(id).then((res) => {
      setImageBackground(res.data.imageBackground);
    });
  };

  const addImage = async (event) => {
    event.preventDefault();
    const imgFiles = event.target.file.files;
    if (imgFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hình ảnh.");
      setImageFileError("Vui lòng chọn ít nhất một hình ảnh.");
      return;
    }

    // Kiểm tra kích thước của từng file
    for (let i = 0; i < imgFiles.length; i++) {
      if (imgFiles[i].size > 100 * 1024 * 1024) {
        toast.error(
          "Kích thước của file quá lớn. Vui lòng chọn file có kích thước nhỏ hơn 100MB."
        );
        setImageFileError(
          "Kích thước của file quá lớn. Vui lòng chọn file có kích thước nhỏ hơn 100MB."
        );
        return;
      }
    }

    setIsLoading(true);
    const formData = new FormData();
    for (let i = 0; i < imgFiles.length; i++) {
      formData.append("imgFiles", imgFiles[i]);
    }

    await createImage(id, formData)
      .then(() => {
        toast.success("Hình ảnh đã được tải lên thành công.");
        fetchImagesProduct();
      })
      .catch((error) => {
        toast.error("Lỗi khi tải lên hình ảnh.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleDelete = async (id) => {
    openModal("Xóa sản phẩm", `Bạn có chắc muốn xóa sản phẩm này?`, () => {
      deleteImage(id)
        .then(() => {
          toast.success("Xóa thành công");
          fetchImagesProduct();
        })
        .catch(() => {
          toast.error("Lỗi! Không thể xóa.");
        });

      closeModal();
    });
  };

  return (
    <>
      <h1>Thêm ảnh sản phẩm</h1>
      <div className="mt-5 bg-white p-5 shadow border">
        <form encType="multipart/form-data" onSubmit={addImage}>
          <div className="mb-3 col-6">
            <label className="form-label">
              File ảnh<span>*</span>
            </label>
            <input
              className={
                imageFileError === ""
                  ? "form-control"
                  : "form-control border-danger"
              }
              type="file"
              name="file"
              accept="video/*, image/*"
              multiple
            />
            <span className="text-danger">{imageFileError}</span>
          </div>

          <button type="submit" className="col-2 btn btn-dark">
            Lưu ảnh
          </button>
          {console.log(isLoading)}
          {isLoading && (
            <div className="spinner-border text-dark" role="status"></div>
          )}
        </form>
        <div id="select-background" className="bg mt-3">
          <h4>Ảnh nền</h4>

          <div className="mt-3">
            {imageBackground.endsWith(".mp4") ? (
              <video width="250px" controls>
                <source src={imageBackground} type="video/mp4" />
              </video>
            ) : (
              <img src={imageBackground} width="150px" alt="" />
            )}
          </div>
        </div>

        <h2 className="m-5">Danh sách hình ảnh</h2>
        <div className="d-flex flex-wrap justify-content-start">
          <ul className="d-flex flex-wrap">
            {listImages.map((i) => (
              <li key={i.fileImg} className=" m-4">
                {i.fileImg.endsWith(".mp4") ? (
                  <video width="250px" controls>
                    <source src={i.fileImg} type="video/mp4" />
                  </video>
                ) : (
                  <img src={i.fileImg} width="250px" alt="" />
                )}

                <div className="mt-3 d-flex flex-wrap justify-content-between">
                  <button className="btn btn-warning  " type="button">
                    Đặt làm ảnh nền
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(i.id)}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
