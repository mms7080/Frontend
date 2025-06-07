"use client";

import React, { useEffect, useState, useRef } from "react";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateQuantity,
  } = useCart();

  const router = useRouter();
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseInt(item.price) * item.quantity,
    0
  );

  const [user, setUser] = useState(null);
 const [position, setPosition] = useState(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cartSidebarPosition");
    const defaultX = Math.min(window.innerWidth - 320, window.innerWidth - 340);
    return saved
      ? JSON.parse(saved)
      : { x: defaultX < 0 ? 10 : defaultX, y: 450 };
  }
  return { x: 1000, y: 450 };
});


  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
  const maxX = window.innerWidth - 320;
  const maxY = window.innerHeight - 100;
  setPosition((prev) => {
    const newX = Math.min(prev.x, maxX);
    const newY = Math.min(prev.y, maxY);
    const clamped = { x: newX, y: newY };
    localStorage.setItem("cartSidebarPosition", JSON.stringify(clamped));
    return clamped;
  });
}, []);


  useEffect(() => {
  const handleResize = () => {
    const maxX = window.innerWidth - 320; // 사이드바 너비 고려
    const maxY = window.innerHeight - 100;

    setPosition((prev) => {
      const newX = Math.min(prev.x, maxX);
      const newY = Math.min(prev.y, maxY);
      const clamped = { x: newX, y: newY };
      localStorage.setItem("cartSidebarPosition", JSON.stringify(clamped));
      return clamped;
    });
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


 const startDrag = (e) => {
  const clientX = e.clientX ?? e.touches?.[0]?.clientX;
  const clientY = e.clientY ?? e.touches?.[0]?.clientY;
  dragging.current = true;
  offset.current = {
    x: clientX - position.x,
    y: clientY - position.y,
  };
};

const onDrag = (e) => {
  if (!dragging.current) return;
  const clientX = e.clientX ?? e.touches?.[0]?.clientX;
  const clientY = e.clientY ?? e.touches?.[0]?.clientY;

  const newX = Math.max(0, Math.min(clientX - offset.current.x, window.innerWidth - 320));
  const newY = Math.max(0, Math.min(clientY - offset.current.y, window.innerHeight - 100));

  const newPos = { x: newX, y: newY };
  setPosition(newPos);
  localStorage.setItem("cartSidebarPosition", JSON.stringify(newPos));
};


  const endDrag = () => {
    dragging.current = false;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:9999/userinfo", {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleCheckout = async () => {
    if (!user || !user.username) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
      router.push("/signin");
      return;
    }

    const toss = await loadTossPayments("test_ck_KNbdOvk5rkmzvKYA97Ey3n07xlzm");

    const orderId = `order-${Date.now()}`;
    const orderName =
      cartItems.length === 1
        ? cartItems[0].title
        : `${cartItems[0].title} 외 ${cartItems.length - 1}건`;

    try {
      await toss.requestPayment("카드", {
        amount: totalPrice,
        orderId,
        orderName,
        customerName: user.name || "회원",
        successUrl: `http://localhost:3000/store/payment-success?orderId=${orderId}&amount=${totalPrice}&userId=${user.username}&orderName=${encodeURIComponent(orderName)}`,
        failUrl: `http://localhost:3000/store/payment-fail`,
      });
    } catch (error) {
      alert("결제 실패: " + error.message);
    }
  };

  return (
    <div
      style={{ ...sidebarStyle, left: position.x, top: position.y }}
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={startDrag}
      onTouchMove={onDrag}
      onTouchEnd={endDrag}
    >
      <h3 style={titleStyle}>장바구니 🛒</h3>
      <div style={{ maxHeight: "240px", overflowY: "auto" }}>
        {cartItems.length === 0 ? (
          <p style={{ color: "#777" }}>장바구니가 비어 있습니다</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} style={itemStyle}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 4px 0" }}>{item.title}</p>
                <div>
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    style={qtyButtonStyle}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))
                    }
                    style={qtyInputStyle}
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={qtyPlusButtonStyle}
                  >
                    +
                  </button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={removeBtnStyle}>
                삭제
              </button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <>
          <p style={totalStyle}>총 합계: {totalPrice.toLocaleString()}원</p>
          <button onClick={handleCheckout} style={checkoutBtnStyle}>결제하기</button>
          <button onClick={clearCart} style={clearBtnStyle}>장바구니 비우기</button>
        </>
      )}
    </div>
  );
}

const sidebarStyle = {
  position: "fixed",
  width: "300px",
  maxWidth: "95vw",
  background: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  padding: "16px",
  borderRadius: "12px",
  zIndex: 1000,
  fontFamily: "sans-serif",
  cursor: "move",
  overflowWrap: "break-word",
};


const titleStyle = {
  fontWeight: "normal",
  fontSize: "18px",
  marginBottom: "12px",
};

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const qtyButtonStyle = {
  width: "28px",
  height: "28px",
  fontWeight: "normal",
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};

const qtyPlusButtonStyle = {
  ...qtyButtonStyle,
  marginLeft: "-15px",
};

const qtyInputStyle = {
  width: "40px",
  textAlign: "center",
  margin: "0 6px",
};

const removeBtnStyle = {
  background: "black",
  color: "#fff",
  border: "none",
  padding: "4px 8px",
  cursor: "pointer",
  borderRadius: "4px",
  fontSize: "15px",
  marginTop: "25px",
};

const totalStyle = {
  marginTop: "16px",
  fontWeight: "normal",
};

const checkoutBtnStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#6B46C1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "normal",
  cursor: "pointer",
  marginTop: "10px",
};

const clearBtnStyle = {
  width: "100%",
  padding: "8px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer",
  marginTop: "6px",
};
