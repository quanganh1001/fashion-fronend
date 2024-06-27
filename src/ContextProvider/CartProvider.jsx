import { useEffect, useState } from 'react';
import {
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
        if (auth?.refreshToken) {
            getCart()
                .then((res) => {
                    setCart(res.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [auth]);

    useEffect(() => {
        fetchTotalItems();
        fetchTotalPrice();
    }, [cart]);

    const fetchTotalPrice = () => {
        let total = 0;
        cart.forEach((item) => {
            total += item.totalPriceItem;
        });
        console.log(total);
        setTotalPrice(total);
    }

    const fetchTotalItems = () => {
        getTotalItems()
            .then((res) => {
                setTotalItems(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleRemove = (productDetailId) => {
        removeCart(productDetailId)
            .then((res) => {
                setCart(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleUpdateCart = (productDetailId, quantity) => {
        updateCart(productDetailId, quantity)
            .then((res) => {
                setCart(res.data);
            })
            .catch((error) => {
                console.error(error);
                toast.error(error);
            });
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
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
