import { useEffect, useState } from 'react';
import {
    addCart,
    clearCart,
    getCart,
    getTotalItems,
    removeCart,
    updateCart,
    updateCartFromLocalToRedis,
} from '../Services/CartService';
import { CartContext } from './Context';
import useAuth from '../CustomHooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [totalCartItems, setTotalItems] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const { auth } = useAuth();
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchGetCart();
    }, [auth]);

    useEffect(() => {
        fetchTotalItems();
        fetchTotalPrice();
    }, [cart]);

    const fetchGetCart = () => {
        if (auth.token) {
            setIsLoadingCart(true);
            getCart()
                .then((res) => {
                    setCart(res.data);
                    setIsLoadingCart(false);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
            const cartArray = Object.values(cartItems).map((item) => ({
                productDetail: item.productDetail,
                quantity: item.quantity,
                totalPriceItem: item.totalPriceItem,
            }));

            setCart(cartArray);
        }
    };

    const fetchTotalPrice = () => {
        let total = 0;

        if (auth.token) {
            cart.forEach((item) => {
                total += item.totalPriceItem;
            });
        } else {
            const cartItems = JSON.parse(localStorage.getItem('cart')) || {};

            Object.values(cartItems).forEach((item) => {
                total += item.totalPriceItem;
            });
        }

        setTotalPrice(total);
    };

    const fetchTotalItems = () => {
        if (auth.token) {
            setIsLoadingCart(true)
            getTotalItems()
                .then((res) => {
                    setTotalItems(res.data);
                     setIsLoadingCart(false);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            let totalQuantity = 0;
            let cartItems = JSON.parse(localStorage.getItem('cart')) || {};

            Object.values(cartItems).forEach((item) => {
                totalQuantity += Number(item.quantity);
            });

            setTotalItems(totalQuantity);
        }
    };

    const handleRemove = (productDetailId) => {
        if (auth && auth.token) {
            setIsLoadingCart(true);
            removeCart(productDetailId)
                .then((res) => {
                    setCart(res.data);
                    setIsLoadingCart(false);
                })
                .catch((error) => {
                    console.error(error);
                })
                
        } else {
            let cartItems = JSON.parse(localStorage.getItem('cart')) || {};
            delete cartItems[productDetailId];
            localStorage.setItem('cart', JSON.stringify(cartItems));
            fetchGetCart();
        }
    };

    const handleUpdateCartWithAuth = (productDetailId, quantity) => {
        if (auth.token) {
            setIsLoadingCart(true);
            updateCart(productDetailId, quantity)
                .then((res) => {
                    setCart(res.data);
                    setIsLoadingCart(false);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error(error);
                })
                
        }
    };

    const handleUpdateCart = (productDetail, quantity) => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
        const price =
            productDetail.discountPrice !== null
                ? productDetail.discountPrice
                : productDetail.price;
        const totalPriceItem = price * quantity;

        cartItems[productDetail.id] = {
            productDetail,
            quantity,
            totalPriceItem,
        };

        const cartArray = Object.values(cartItems).map((item) => ({
            productDetail: item.productDetail,
            quantity: item.quantity,
            totalPriceItem: item.totalPriceItem,
        }));

        setCart(cartArray);

        localStorage.setItem('cart', JSON.stringify(cartItems));
    };

    const handleAddCart = (productDetail, quantity) => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
        const price =
            productDetail.discountPrice !== null
                ? productDetail.discountPrice
                : productDetail.price;
        if (cartItems[productDetail.id]) {
            cartItems[productDetail.id].quantity =
                Number(cartItems[productDetail.id].quantity) + quantity;
            cartItems[productDetail.id].totalPriceItem =
                price * cartItems[productDetail.id].quantity;
        } else {
            const totalPriceItem = price * quantity;
            cartItems[productDetail.id] = {
                productDetail,
                quantity,
                totalPriceItem,
            };
        }

        const cartArray = Object.values(cartItems).map((item) => ({
            productDetail: item.productDetail,
            quantity: item.quantity,
            totalPriceItem: item.totalPriceItem,
        }));

        setCart(cartArray);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        toast.success('Thêm vào giỏ hàng thành công');
    };

    const handleAddCartWithAuth =  (id, quantity) => {
        setIsLoadingCart(true)
         addCart(id, quantity)
            .then((res) => {
                setCart(res.data);
                toast.success('Thêm vào giỏ hàng thành công');
            })
            .catch( (error) => {
                console.error(error);
                toast.error("Vui lòng đăng nhập lại");
            })
            .finally(() => {
                setIsLoadingCart(false);
            });;
    };

    const handleClearCart = () => {
        if (auth && auth.token) {
            setIsLoadingCart(true)
            clearCart()
                .then((res) => {
                    setCart(res.data);
                    localStorage.removeItem('cart');
                })
                .catch((error) => {
                    console.error(error);
                    toast.error(error);
                })
                .finally(() => {
                    setIsLoadingCart(false);
                    
                });;
        } else {
            localStorage.removeItem('cart');
            setCart({});
        }
    };

    const handleUpdateCartFromLocalToRedis = () => {
        setIsLoadingCart(true);
        const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
        const listCart = Object.values(cartItems).map((item) => ({
            id: item.productDetail.id,
            quantity: item.quantity,
        }));

        const listCartJson = JSON.stringify(listCart);
        updateCartFromLocalToRedis(listCartJson)
            .then((res) => {
                setCart(res.data);
                toast.success('Giỏ hàng đã được cập nhật');
                setIsLoadingCart(false);
                navigate('/cart');
            })
            .catch((error) => {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalCartItems,
                totalPrice,
                isLoadingCart,
                setCart,
                handleRemove,
                handleUpdateCart,
                handleClearCart,
                handleUpdateCartWithAuth,
                handleAddCart,
                handleAddCartWithAuth,
                handleUpdateCartFromLocalToRedis,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
