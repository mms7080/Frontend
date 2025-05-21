"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header, Footer } from "../../../components";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const qty = parseInt(searchParams.get("qty") || "1");

  const [product, setProduct] = useState(null);
  const [selectedCard, setSelectedCard] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser);

    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/detail/${id}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setProduct);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const unitPrice = parseInt(product.price.replace(/[^0-9]/g, ""));
  const totalPrice = unitPrice * qty;

  const handlePayment = async () => {
    if (!selectedCard) return alert("결제수단을 선택해주세요");
    setLoading(true);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: qty,
          card: selectedCard,
          userId: user?.id || "guest",
          amount: totalPrice,
        }),
      });
      if (!response.ok) throw new Error("결제 실패");

      alert("결제가 완료되었습니다!");
      router.push("/store");
    } catch (error) {
      alert("가상 결제 API 오류: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />
      <div className="payment-container">
        <h2>결제하기</h2>

        <div className="purchase-info">
          <div className="product">
            <img
              src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${product.imgUrl}`}
              alt="상품이미지"
            />
            <div className="details">
              <strong>{product.title}</strong>
              <p>{product.subtitle}</p>
              <p>수량 {qty}개</p>
            </div>
          </div>
          <strong>{totalPrice.toLocaleString()}원</strong>
        </div>

        <div className="payment-method">
          <h3>💼 결제 수단</h3>
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
          >
            <option value="">카드를 선택하세요</option>
            <option value="card1">💳 우리카드</option>
            <option value="card2">💳 국민카드</option>
          </select>
        </div>

        <div className="payment-summary">
          <div className="summary-row">
            <span>상품금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="summary-row">
            <span>할인</span>
            <span>- 0원</span>
          </div>
          <hr />
          <div className="summary-total">
            <span>최종 결제금액</span>
            <strong>{totalPrice.toLocaleString()}원</strong>
          </div>
          <p className="payment-method-text">사용 카드: {selectedCard || "없음"}</p>
          <div className="button-group">
            <button onClick={() => router.back()} disabled={loading}>
              이전
            </button>
            <button className="confirm" onClick={handlePayment} disabled={loading}>
              {loading ? "결제 중..." : "결제하기"}
            </button>
          </div>
        </div>
      </div>

      <Footer footerBg="white" footerColor="black" />

      <style jsx>{`
        .payment-container {
          max-width: 900px;
          margin: 50px auto;
          padding: 20px;
          font-family: 'Pretendard', sans-serif;
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
        .payment-method {
          margin-top: 40px;
        }
        select {
          margin-top: 10px;
          padding: 12px;
          width: 100%;
          font-size: 15px;
          border-radius: 6px;
          border: 1px solid #ccc;
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
          color: #00e0ff;
        }
        .payment-method-text {
          margin-top: 10px;
          font-size: 13px;
          color: #aaa;
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
          background: #00c6ff;
          color: white;
          transition: background 0.3s ease;
        }
        .button-group button.confirm:hover {
          background: #009ac6;
        }
        .button-group button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
