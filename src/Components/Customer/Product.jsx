import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllImageProducts, getProduct } from '../../Services/ProductService';

export default function Product() {
    const [listImage, setListImage] = useState([]);
    const { id } = useParams();
    const [product, setProduct] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [listSize, setListSize] = useState([]);
    const [listColor, setListColor] = useState([]);

    useEffect(() => {
        fetchListImage();
        fetchProduct();
    }, []);

    const fetchListImage = async () => {
        await getAllImageProducts(id)
            .then((res) => {
                setListImage(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchProduct = async () => {
        await getProduct(id)
            .then((res) => {
                const uniqueSizes = [
                    ...new Set(
                        res.data.productsDetails.map((product) => product.size)
                    ),
                ];
                setListSize(uniqueSizes);

                const uniqueColors = [
                    ...new Set(
                        res.data.productsDetails.map((product) => product.color)
                    ),
                ];
                setListColor(uniqueColors);

                setProduct(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <div class="container-xl mb-5">
                <div class="d-flex mb-5">
                    <div class="col-4 position-relative img "></div>

                    <div class=" col-8 ps-5">
                        <h4 class="mb-4">{product.productName}</h4>
                        <div class="d-flex justify-content-between mb-3">
                            <div>Hãy chọn size</div>
                        </div>
                        <div
                            style={{ backgroundColor: '#d9d7d7' }}
                            class="p-3 "
                        >
                            <div class="d-flex">
                                <span>Giá: </span>
                            </div>
                        </div>
                    </div>
                    <div class="p-3">
                        <form>
                            <div class="d-flex align-items-center">
                                <div class="col-1">Màu sắc:</div>
                            </div>

                            <div class="d-flex align-items-center">
                                <div class="col-1">Size:</div>
                            </div>

                            <div class="mt-3">
                                <label class="col-1">Số lượng: </label>
                                <input
                                    class=" m-1 p-1 form-control"
                                    type="number"
                                    value="1"
                                    min="1"
                                    max="99"
                                />
                            </div>

                            <div class="mt-5">
                                <button type="button" class="button p-3">
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="mt-5">
                        <div class="fw-bold mb-1">Chính sách bán hàng</div>
                        <div class="row">
                            <div class="col-4 d-flex align-items-center">
                                <div>
                                    <img
                                        width="100%"
                                        class=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=282"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=282"
                                        alt="Miễn phí giao hàng cho đơn hàng từ 500K"
                                    />
                                </div>
                                <div class="ms-2">
                                    Miễn phí giao hàng cho đơn hàng từ 500K
                                </div>
                            </div>

                            <div class="col-4 d-flex align-items-center">
                                <div>
                                    <img
                                        width="100%"
                                        class=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=282"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=282"
                                        alt="Hàng phân phối chính hãng 100%"
                                    />
                                </div>
                                <div class="ms-2">
                                    Hàng phân phối chính hãng 100%
                                </div>
                            </div>

                            <div class="col-4 d-flex align-items-center">
                                <div>
                                    <img
                                        width="100%"
                                        class=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=282"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=282"
                                        alt="TỔNG ĐÀI 24/7 :  0964942121"
                                    />
                                </div>
                                <div class="ms-2">
                                    TỔNG ĐÀI 24/7 : 0964942121
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3">
                        <div class="fw-bold mb-1">Thông tin thêm</div>
                        <div class="row">
                            <div class="col-4 d-flex align-items-center">
                                <div>
                                    <img
                                        width="100%"
                                        class=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=282"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=282"
                                        alt="ĐỔI SẢN PHẨM DỄ DÀNG (Trong vòng 7 ngày khi còn nguyên tem mác)"
                                    />
                                </div>
                                <div class="ms-2">
                                    ĐỔI SẢN PHẨM DỄ DÀNG (Trong vòng 7 ngày khi
                                    còn nguyên tem mác)
                                </div>
                            </div>

                            <div class="col-4 d-flex align-items-center">
                                <div>
                                    <img
                                        width="100%"
                                        class=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=282"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=282"
                                        alt="Kiểm tra, thanh toán khi nhận hàng COD"
                                    />
                                </div>
                                <div class="ms-2">
                                    Kiểm tra, thanh toán khi nhận hàng COD
                                </div>
                            </div>

                            <div class="col-4 d-flex align-items-center">
                                <div>
                                    <img
                                        width="100%"
                                        class=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=282"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=282"
                                        alt="Hỗ trợ bảo hành,đổi sản phẩm tại tất cả store TORANO"
                                    />
                                </div>
                                <div class="ms-2">
                                    Hỗ trợ bảo hành, đổi sản phẩm tại tất cả
                                    store TORANO
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-5 "></div>
        </>
    );
}
