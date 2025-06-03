import { CartProvider } from "../../components/store/CartContext";

export default function StoreLayout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
