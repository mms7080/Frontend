// app/store/payment/success/page.jsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header, Footer } from "../../../../components";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const userId = searchParams.get("userId") || "guest";
  const productId = searchParams.get("productId");

  const [message, setMessage] = useState("결제 승인 중...");
  const [user, setUser] = useState(null);
  const [payment, setPayment] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser);
  }, []);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/payments/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount: parseInt(amount), userId }),
        });

        if (!res.ok) throw new Error("승인 실패");

        const result = await res.json();
        setPayment(result);
        setMessage("✅ 결제가 완료되었습니다!");
      } catch (e) {
        setMessage("❌ 결제 승인 중 오류가 발생했습니다.");
      }
    };

    if (paymentKey && orderId && amount) {
      confirmPayment();
    }
  }, [paymentKey, orderId, amount, userId]);

  useEffect(() => {
    if (!productId) return;
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/detail/${productId}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setProduct);
  }, [productId]);

  return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />

      <div style={{ padding: "60px 20px", textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>{message}</h2>

        {payment && product && (
          <div style={{
            display: "inline-block",
            background: "#f9f9f9",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "left",
            maxWidth: "500px",
            width: "100%",
            marginBottom: "50px"
          }}>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.imgUrl}`}
                alt="상품 이미지"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                }}
              />
              <div>
                <p style={{ margin: "0", fontWeight: "bold", fontSize: "18px" }}>{payment.orderName}</p>
                <p style={{ margin: "5px 0", color: "#888" }}>주문번호: {payment.orderId}</p>
              </div>
            </div>

            <div style={{ fontSize: "15px", lineHeight: "1.7", color: "#333" }}>
              <p><strong>결제금액:</strong> {payment.amount.toLocaleString()}원</p>
              <p><strong>결제수단:</strong> {payment.method}</p>
              {payment.method === "카드" && (
                <>
                  <p><strong>카드사:</strong> {payment.cardCompany}</p>
                  <p><strong>카드번호:</strong> {payment.cardNumber}</p>
                </>
              )}
              <p><strong>결제시간:</strong> {payment.approvedAt}</p>
            </div>
          </div>
        )}

        <div>
          <button
            style={{
              padding: "14px 28px",
              borderRadius: "8px",
              backgroundColor: "#6B46C1",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
            onClick={() => router.push("/store")}
          >
            스토어로 이동
          </button>
        </div>
      </div>

      <Footer footerBg="white" footerColor="black" />
    </>
  );
}