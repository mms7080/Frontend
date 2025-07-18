"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Header } from "../../../components";
import Modal, { useModal } from "../../../components/movie/modal";

export default function CartPaymentSuccessPage() {
  const [realaccess,setRealAccess]=useState(sessionStorage.getItem('cartps')==='true');
  const redirected = useRef(false);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();
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
    if (!redirected.current) {
      document.title = "결제 - FILMORA";
      const fetchUser = async () => {
        try {
          const allowed = sessionStorage.getItem('cartps');
          if (allowed !== 'true') {
            openModal("잘못된 접근입니다.", ()=>{router.push('/store');}, ()=>{router.push('/store');}); // 허용되지 않으면 스토어 페이지로
          }
          sessionStorage.removeItem('cartps');
          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
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
      redirected.current = true;
    }
  }, []);

  const userId = user?.id ?? "guest";

  // 장바구니 결제 승인 처리
  useEffect(() => {
    const confirmPayment = async () => {
      try {

        const paidFlag = sessionStorage.getItem(`paid_${orderId}`);
        if (paidFlag) {
          setMessage("✅ 결제가 이미 처리되었습니다.");
          return;
        }
        const items = JSON.parse(sessionStorage.getItem(`cartItems_${userId}`) || "[]");

        if(realaccess){
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/purchase/cart/success`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentKey,
                orderId,
                amount: parseInt(amount),
                userId: user ? user.username : userIdFromQuery,
                items: items.map(({ title, price, quantity }) => ({
                  title,
                  price,
                  quantity
                })),
              }),
            }
          );

          if (!res.ok) throw new Error("승인 실패");

          const result = await res.json();
          setPayment(result);
          // 중복 방지를 위해 저장
          sessionStorage.setItem(`paid_${orderId}`, "true");
          setMessage("✅ 결제가 완료되었습니다!");

          sessionStorage.removeItem(`cartItems_${userId}`);
          sessionStorage.removeItem(`cartItems_guest`);
          localStorage.removeItem(`cartItems_${userId}`);
          localStorage.removeItem(`cartItems_guest`);
        }
      } catch (e) {
        console.error("❌ 결제 처리 실패:", e);
        setMessage("❌ 결제 승인 중 오류가 발생했습니다.");
      }
    };

    // ✅ 모든 값이 준비되고 유저 정보 로딩이 끝난 후 실행
    if (paymentKey && orderId && amount && isUserLoaded) {
      confirmPayment()
    }
  }, [paymentKey, orderId, amount, user, isUserLoaded]);

  
  if(!realaccess){
    return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />
      {isModalOpen && (
        <Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}
        />
      )}
    </>
    );
  }

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
        
        {(payment&&Object.keys(payment).length>0) && (
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
      {isModalOpen && (
        <Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}
        />
      )}
    </>
  );
}
