import { useContext } from 'react';
import { CartContext } from '../ContextProvider/Context';

export default function useCart() {
    return useContext(CartContext);
}
