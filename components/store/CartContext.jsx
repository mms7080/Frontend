"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Modal, { useModal } from '../movie/modal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(()=>{
    (async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
              {
                credentials: "include",
              }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setUser(data);
          } catch (e) {
            setUser(null);
          }
        })();
  },[]);

  const userId = user?.id ?? "guest";

  const [cartItems, setCartItems] = useState((localStorage.getItem(`cartItems_${userId}`) && localStorage.getItem(`cartItems_${userId}`)!=='[]')
                                    ?JSON.parse(localStorage.getItem(`cartItems_${userId}`))
                                    :(
                                      (localStorage.getItem(`cartItems_guest`) && localStorage.getItem(`cartItems_guest`)!=='[]')
                                      ?JSON.parse(localStorage.getItem(`cartItems_guest`))
                                      :[]
                                    )
                                  );

  useEffect(() => {
    if (typeof window === "undefined" || user === null) return;

    let stored;
    if(localStorage.getItem(`cartItems_${userId}`) && localStorage.getItem(`cartItems_${userId}`)!=='[]')
      stored=localStorage.getItem(`cartItems_${userId}`);
    else if(localStorage.getItem(`cartItems_guest`) && localStorage.getItem(`cartItems_guest`)!=='[]')
      stored=localStorage.getItem(`cartItems_guest`);
    else
      stored=null;
    setCartItems(stored ? JSON.parse(stored) : []);
  }, [user]);

  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();
  const pathname = usePathname();

  //  localStorage에서 초기화
  useEffect(() => {
    let stored;
    if(localStorage.getItem(`cartItems_${userId}`) && localStorage.getItem(`cartItems_${userId}`)!=='[]')
      stored=localStorage.getItem(`cartItems_${userId}`);
    else if(localStorage.getItem(`cartItems_guest`) && localStorage.getItem(`cartItems_guest`)!=='[]')
      stored=localStorage.getItem(`cartItems_guest`);
    else
      stored=null;
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    let stored;
    if(localStorage.getItem(`cartItems_${userId}`) && localStorage.getItem(`cartItems_${userId}`)!=='[]')
      stored=localStorage.getItem(`cartItems_${userId}`);
    else if(localStorage.getItem(`cartItems_guest`) && localStorage.getItem(`cartItems_guest`)!=='[]')
      stored=localStorage.getItem(`cartItems_guest`);
    else
      stored=null;
    if (!stored) {
      setCartItems([]);
    }
  }, [pathname]); // ✅ 경로 바뀔 때마다 실행됨

  //  localStorage에 반영
  useEffect(() => {
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
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
