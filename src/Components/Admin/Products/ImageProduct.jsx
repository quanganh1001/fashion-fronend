import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useModal from '../../../CustomHooks/useModal';
import {
    createImage,
    getAllImageProducts,
    getProduct,
    updateImageBackground,
} from '../../../Services/ProductService';
import { deleteImage } from '../../../Services/ImageProductService';
import LoadingSprinner from '../../Fragments/LoadingSpinner';
import Tittle from '../../Fragments/Tittle';

export default function ImageProduct() {
    const { id } = useParams();

    const { openModal, closeModal } = useModal();

    const [listImages, setListImages] = useState([]);

    const [imageBackground, setImageBackground] = useState('');

    const [imageFileError, setImageFileError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchImagesProduct();
        fetchImageBackground();
    }, []);

    const fetchImagesProduct =  () => {
         getAllImageProducts(id)
             .then((res) => {
                 setListImages(res.data);
             })
             .catch((err) => {
                 console.log(err);
             });
    };

    const fetchImageBackground =  () => {
        getProduct(id).then((res) => {
             console.log(res);
            setImageBackground(res.data.imageBackground);
         }).catch((err) => {
            console.log(err);
        });
    };

    const addImage =  (event) => {
        event.preventDefault();
        const imgFiles = event.target.file.files;
        if (imgFiles.length === 0) {
            toast.error('Vui lòng chọn ít nhất một hình ảnh.');
            setImageFileError('Vui lòng chọn ít nhất một hình ảnh.');
            return;
        } else setImageFileError('');

        for (let i = 0; i < imgFiles.length; i++) {
            if (imgFiles[i].size > 100 * 1024 * 1024) {
                toast.error(
                    'Kích thước của file quá lớn. Vui lòng chọn file có kích thước nhỏ hơn 100MB.'
                );
                setImageFileError(
                    'Kích thước của file quá lớn. Vui lòng chọn file có kích thước nhỏ hơn 100MB.'
                );
                return;
            } else setImageFileError('');
        }

        setIsLoading(true);
        const formData = new FormData();
        for (let i = 0; i < imgFiles.length; i++) {
            formData.append('imgFiles', imgFiles[i]);
        }

         createImage(id, formData)
            .then(() => {
                toast.success('Hình ảnh đã được tải lên thành công.');
                fetchImagesProduct();
            })
            .catch((error) => {
                toast.error('Lỗi khi tải lên hình ảnh.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    const handleDelete =  (id) => {
        openModal('Xóa sản phẩm', `Bạn có chắc muốn xóa ảnh này?`, () => {
            deleteImage(id)
                .then(() => {
                    toast.success('Xóa thành công');
                    fetchImageBackground();
                })
                .catch(() => {
                    toast.error('Lỗi! Không thể xóa.');
                });

            closeModal();
        });
    };

    const handleUpdateBackground = (imageUrl) => {
        openModal(
            'Đổi ảnh nền sản phẩm',
            `Bạn có chắc muốn đổi ảnh này?`,
            () => {
                updateImageBackground(id, imageUrl)
                    .then(() => {
                        toast.success('Thay đổi thành công');
                        setImageBackground(imageUrl);
                    })
                    .catch(() => {
                        toast.error('Lỗi! Không thể thay đổi.');
                    });

                closeModal();
            }
        );
    };

    return (
        <>
            <Tittle tittle="Quản lý hình ảnh sản phẩm" />

            <div className="mt-5 bg-white p-5 shadow border">
                <div className="d-flex justify-content-between mb-5">
                    <form
                        encType="multipart/form-data"
                        className="col-6"
                        onSubmit={addImage}
                    >
                        <div className="mb-3 ">
                            <label className="form-label">
                                Tải file ảnh
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                className={
                                    imageFileError === ''
                                        ? 'form-control'
                                        : 'form-control border-danger'
                                }
                                type="file"
                                name="file"
                                accept="video/*, image/*"
                                multiple
                            />
                            <span className="text-danger">
                                {imageFileError}
                            </span>
                        </div>

                        <button type="submit" className=" button">
                            Tải lên
                        </button>
                        {isLoading && <LoadingSprinner />}
                    </form>

                    <div id="select-background" className="">
                        <h4>Ảnh nền</h4>

                        <div className="mt-3">
                            {!imageBackground && <div>Chưa có ảnh nền</div> }
                            {imageBackground?.endsWith('.mp4') ? (
                                <video width="250px" controls>
                                    <source
                                        src={imageBackground}
                                        type="video/mp4"
                                    />
                                </video>
                            ) : (
                                <img
                                    src={imageBackground}
                                    width="150px"
                                    alt=""
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-3 bg-white p-5 shadow border">
                <Tittle tittle="Danh sách hình ảnh" />
                <div className="d-flex flex-wrap justify-content-start">
                    <ul
                        className="d-flex flex-wrap overflow-auto"
                        style={{ maxHeight: '100vh' }}
                    >
                        {listImages.map((i) => (
                            <li key={i.fileImg} className=" m-4">
                                {i.fileImg.endsWith('.mp4') ? (
                                    <video width="250px" controls>
                                        <source
                                            src={i.fileImg}
                                            type="video/mp4"
                                        />
                                    </video>
                                ) : (
                                    <img src={i.fileImg} width="250px" alt="" />
                                )}

                                <div className="mt-3 d-flex flex-wrap justify-content-between">
                                    <button
                                        className={
                                            i.fileImg === imageBackground
                                                ? 'btn btn-secondary'
                                                : 'btn btn-warning'
                                        }
                                        disabled={i.fileImg === imageBackground}
                                        onClick={() =>
                                            handleUpdateBackground(i.fileImg)
                                        }
                                    >
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
