"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "..";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import Modal, { useModal } from '../movie/modal';

export default function PaymentPage({ userData }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const qty = parseInt(searchParams.get("qty") || "1");

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();

  useEffect(()=>{
    if (!userData) {
      openModal("로그인이 필요합니다.", ()=>{router.push("/signin");}, ()=>{router.push("/signin");});
    }
  },[]);

  useEffect(() => {
    let didCancel = false;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!data || !data.username) throw new Error();

        if (!didCancel) {
          setUser(data);

          // 🎟️ 쿠폰 가져오기
          const couponRes = await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/coupons?userId=${data.username}`
          );
          if (couponRes.ok) {
            const list = await couponRes.json();
            setCoupons(list);
          }

          // 🛒 상품 가져오기
          if (id) {
            const productRes = await fetch(
              `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/detail/${id}`,
              { credentials: "include" }
            );
            if (productRes.ok) {
              const productData = await productRes.json();
              setProduct(productData);
            }
          }
        }
      } catch (e) {
        if (!didCancel) {
          openModal("로그인이 필요합니다.", ()=>{router.replace("/signin");}, ()=>{router.replace("/signin");});
        }
      }
    })();

    return () => {
      didCancel = true;
    };
  }, [id]);

  const handleCouponChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCouponId(selectedId);

    const coupon = coupons.find((c) => c.id.toString() === selectedId);
    setDiscountAmount(coupon ? coupon.discountAmount : 0);
  };

  if (!product) return <>
      <div>Loading...</div>
      {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      onConfirm={onConfirm}
      onCancel={onCancel}
      content={modalContent}/>)}
  </>;

  const unitPrice = parseInt(product.price.replace(/[^0-9]/g, ""));
  const totalPrice = unitPrice * qty;
  const finalPrice = Math.max(totalPrice - discountAmount, 0);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const toss = await loadTossPayments("test_ck_KNbdOvk5rkmzvKYA97Ey3n07xlzm");
      const orderId = `order-${Date.now()}`;

      toss.requestPayment("카드", {
        amount: finalPrice,
        orderId,
        orderName: product.title,
        customerName: user?.name || "비회원",
        successUrl: `${window.location.origin}/store/payment/success?userId=${
          user?.username || "guest"
        }&productId=${product.id}${selectedCouponId ? `&couponId=${selectedCouponId}` : ""}`,
        failUrl: `${window.location.origin}/store/payment/fail`,
      });
    } catch (error) {
      openModal("Toss 결제 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={userData} />
      <div className="payment-container">
        <h2>결제하기</h2>

        <div className="purchase-info">
          <div className="product">
            <img
              src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.imgUrl}`}
              alt="상품이미지"
              loading='lazy'
            />
            <div className="details">
              <strong>{product.title}</strong>
              <p>{product.subtitle}</p>
              <p>수량 {qty}개</p>
            </div>
          </div>
          <strong>{totalPrice.toLocaleString()}원</strong>
        </div>

        <div className="payment-summary">
          <div className="summary-row">
            <span>상품금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="summary-row">
            <span>할인</span>
            <span>- {discountAmount.toLocaleString()}원</span>
          </div>
          <hr />
          <div className="summary-total">
            <span>최종 결제금액</span>
            <strong>{finalPrice.toLocaleString()}원</strong>
          </div>
          <div className="button-group">
            <button onClick={() => router.back()} disabled={loading}>
              이전
            </button>
            <button
              className="confirm"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "결제 중..." : "결제하기"}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .payment-container {
          max-width: 900px;
          margin: 50px auto;
          padding: 20px;
        }
        h2 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .purchase-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          padding: 20px 0;
        }
        .product {
          display: flex;
          gap: 20px;
        }
        .product img {
          width: 80px;
          height: auto;
          border-radius: 8px;
          border: 1px solid #ddd;
        }
        .details {
          font-size: 14px;
          color: #444;
        }
        .payment-summary {
          margin-top: 50px;
          background: linear-gradient(to right, #232526, #414345);
          color: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          font-size: 20px;
          color: #9f7aea;
        }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .button-group button {
          flex: 1;
          padding: 14px;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          font-weight: bold;
        }
        .button-group button.confirm {
          background: #6b46c1;
          color: white;
          transition: background 0.3s ease;
        }
        .button-group button.confirm:hover {
          background: #553c9a;
        }
        .button-group button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      onConfirm={onConfirm}
      onCancel={onCancel}
      content={modalContent}/>)}
    </>
  );
}
