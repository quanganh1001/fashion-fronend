import { useEffect, useState } from 'react';
import {
    addCart,
    clearCart,
    getCart,
    getTotalItems,
    removeCart,
    updateCart,
} from '../Services/CartService';
import { CartContext } from './Context';
import useAuth from '../CustomHooks/useAuth';
import { toast } from 'react-toastify';

export default function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [totalCartItems, setTotalItems] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const { auth } = useAuth();

    useEffect(() => {
        fetchGetCart();
    }, [auth]);

    useEffect(() => {
        fetchTotalItems();
        fetchTotalPrice();
    }, [cart]);

    const fetchGetCart = () => {
        if (auth.token) {
            getCart()
                .then((res) => {
                    setCart(res.data);
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
            getTotalItems()
                .then((res) => {
                    setTotalItems(res.data);
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
            removeCart(productDetailId)
                .then((res) => {
                    setCart(res.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            let cartItems = JSON.parse(localStorage.getItem('cart')) || {};
            delete cartItems[productDetailId];
            localStorage.setItem('cart', JSON.stringify(cartItems));
            fetchGetCart();
        }
    };

    const handleUpdateCartWithAuth = (productDetailId, quantity) => {
        if (auth.token) {
            updateCart(productDetailId, quantity)
                .then((res) => {
                    setCart(res.data);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error(error);
                });
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
    };

    const handleAddCartWithAuth = (id, quantity) => {
        addCart(id, quantity)
            .then((res) => {
                console.log(res.data);
                setCart(res.data);
            })
            .catch((error) => {
                console.error(error);
                toast.error(error);
            });
    };

    const handleClearCart = () => {
        if (auth && auth.token) {
            clearCart()
                .then((res) => {
                    setCart(res.data);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error(error);
                });
        } else {
            localStorage.removeItem('cart');
            setCart({});
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalCartItems,
                totalPrice,
                setCart,
                handleRemove,
                handleUpdateCart,
                handleClearCart,
                handleUpdateCartWithAuth,
                handleAddCart,
                handleAddCartWithAuth,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
