"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "../../../components";

export default function CartPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const userIdFromQuery = searchParams.get("userId") || "guest";

  const [message, setMessage] = useState("결제 승인 중...");
  const [user, setUser] = useState(null);
  const [payment, setPayment] = useState(null);

  // ✅ 유저 정보 불러오기
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
      } finally {
        setIsUserLoaded(true); // ✅ 이거 꼭 필요!
      }
    };

    fetchUser();
  }, []);

  // 장바구니 결제 승인 처리
  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const items = JSON.parse(sessionStorage.getItem("cartItems") || "[]");

        const res = await fetch(
          "http://localhost:9999/store/purchase/cart/success",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount: parseInt(amount),
              userId: user ? user.username : userIdFromQuery,
              items: items.map(({ title, price }) => ({
                title,
                price,
              })),
            }),
          }
        );

        if (!res.ok) throw new Error("승인 실패");

        const result = await res.json();
        setPayment(result);
        setMessage("✅ 결제가 완료되었습니다!");

        sessionStorage.removeItem("cartItems");
        localStorage.removeItem("cartItems");
      } catch (e) {
        console.error("❌ 결제 처리 실패:", e);
        setMessage("❌ 결제 승인 중 오류가 발생했습니다.");
      }
    };

    // ✅ 모든 값이 준비되고 유저 정보 로딩이 끝난 후 실행
    if (paymentKey && orderId && amount && isUserLoaded) {
      confirmPayment();
    }
  }, [paymentKey, orderId, amount, user, isUserLoaded]);

  return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />

      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>{message}</h2>

        {payment && (
          <div
            style={{
              display: "inline-block",
              background: "#f9f9f9",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              textAlign: "left",
              maxWidth: "500px",
              width: "100%",
              marginBottom: "50px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
                {payment.orderName}
              </p>
              <p style={{ color: "#888", margin: "5px 0" }}>
                주문번호: {payment.orderId}
              </p>
            </div>

            <div style={{ fontSize: "15px", lineHeight: "1.7", color: "#333" }}>
              <p>
                <strong>결제금액:</strong> {payment.amount.toLocaleString()}원
              </p>
              <p>
                <strong>결제수단:</strong> {payment.method}
              </p>
              {payment.method === "카드" && (
                <>
                  <p>
                    <strong>카드사:</strong> {payment.cardCompany}
                  </p>
                  <p>
                    <strong>카드번호:</strong> {payment.cardNumber}
                  </p>
                </>
              )}
              <p>
                <strong>결제시간:</strong> {payment.approvedAt}
              </p>
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
    </>
  );
}
