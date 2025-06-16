"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Modal, { useModal } from '../movie/modal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();

  //  localStorage에서 초기화
  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  //  localStorage에 반영
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ 중복 방지 + 초기 수량 추가
  const addToCart = (item) => {
    const exists = cartItems.find((i) => i.id === item.id);
    if (exists) {
      openModal("이미 장바구니에 담긴 상품입니다.");
      return;
    }
    setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ 수량 변경 기능 추가
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  return (<>
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
    {isModalOpen && (<Modal
    isModalOpen={isModalOpen}
    isModalVisible={isModalVisible}
    closeModal={closeModal}
    content={modalContent}/>)}
  </>);
};

export const useCart = () => useContext(CartContext);
