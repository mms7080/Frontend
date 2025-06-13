"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "../../components";
import { loadTossPayments } from "@tosspayments/payment-sdk";

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const router = useRouter();
  const params = useSearchParams();

  const movieId = parseInt(params.get("movieId"));
  const region = params.get("region");
  const theater = params.get("theater");
  const date = params.get("date");
  const time = params.get("time");
  const seats = params.get("seats")?.split(",") || [];
  const showtimeId = params.get("showtimeId");

  const adult = parseInt(params.get("adult") || "0");
  const teen = parseInt(params.get("teen") || "0");
  const senior = parseInt(params.get("senior") || "0");
  const special = parseInt(params.get("special") || "0");

  const totalPrice = adult * 15000 + teen * 12000 + senior * 10000 + special * 8000;
  const finalAmount = Math.max(0, totalPrice - discountAmount);

  const priceDetails = [
    { label: "성인", count: adult, price: 15000 },
    { label: "청소년", count: teen, price: 12000 },
    { label: "경로", count: senior, price: 10000 },
    { label: "우대", count: special, price: 8000 },
  ].filter((item) => item.count > 0);





  useEffect(() => {
    document.title = "예매 - 결제";
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, { credentials: "include" });
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${movieId}`);
        const data = await res.json();
        const baseURL = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;
        setMovie({
          ...data,
          poster: baseURL + data.poster,
          wideImage: data.wideImage ? baseURL + data.wideImage : null,
        });
      } catch (e) {
        console.error("영화 정보 로딩 실패", e);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/coupons?userId=${user.username}`, {
          credentials: "include",
        });
        const data = await res.json();
        setCoupons(data.filter((c) => !c.used));
      } catch (e) {
        console.error("❌ 쿠폰 불러오기 실패", e);
      }
    })();
  }, [user]);

  const handlePayment = async () => {
    setLoading(true);
    const orderId = `movie-${Date.now()}`;
    const queryString =
      `orderId=${orderId}` +
      `&amount=${finalAmount}` +
      `&userId=${encodeURIComponent(user?.username || "guest")}` +
      `&movieId=${movieId}` +
      `&region=${encodeURIComponent(region)}` +
      `&theater=${encodeURIComponent(theater)}` +
      `&date=${encodeURIComponent(date)}` +
      `&time=${encodeURIComponent(time)}` +
      `&seats=${encodeURIComponent(seats.join(","))}` +
      `&adult=${adult}&teen=${teen}&senior=${senior}&special=${special}` +
      (selectedCouponId ? `&couponId=${selectedCouponId}` : "");

    try {
      if (finalAmount === 0) {
        for (let seat of seats) {
          await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/showtimes/${showtimeId}/seat/${seat}/RESERVED`);
        }
        if (selectedCouponId) {
          await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/coupons/use`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ couponId: selectedCouponId }),
          });
        }
        router.push(`${window.location.origin}/movie/payment/success?${queryString}`);
        return;
      }

      const toss = await loadTossPayments("test_ck_KNbdOvk5rkmzvKYA97Ey3n07xlzm");
      await toss.requestPayment("카드", {
        amount: finalAmount,
        orderId,
        orderName: "Movie Ticket",
        customerName: user?.name || "비회원",
      }).then(async () => {
        for (let seat of seats) {
          await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/showtimes/${showtimeId}/seat/${seat}/RESERVED`);
        }
        if (selectedCouponId) {
          await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/coupons/use`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ couponId: selectedCouponId }),
          });
        }
        router.push(`${window.location.origin}/movie/payment/success?${queryString}`);
      }).catch(() => {
        router.push(`${window.location.origin}/movie/payment/fail`);
      });

    } catch (error) {
      alert("Toss 결제 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!movie) {
    return (
      <>
        <Header headerColor="black" headerBg="white" userInfo={user} />
        <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
          🎬 영화 정보를 불러오는 중입니다...
        </div>
      </>
    );
  }

  return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />
      <div className="payment-container">
        <h2>결제하기</h2>
        <div className="purchase-info">
          <div className="product">
            <img src={movie.poster} alt={movie.title} loading='lazy' />
            <div className="details">
              <strong>{movie.title}</strong>
              <p>{movie.titleEnglish}</p>
              <p>{theater}</p>
              <p>{date}</p>
              <p>{time}</p>
            </div>
          </div>
          <strong>{seats.length > 0 ? seats.join(", ") : "좌석 정보 없음"}</strong>
        </div>

        <div style={{ margin: "40px 0" }}>
          <label htmlFor="coupon" style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "white" }}>
            쿠폰 선택
          </label>
          <select
            id="coupon"
            value={selectedCouponId || "none"}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedCouponId(id === "none" ? null : id);
              const selected = coupons.find((c) => c.id === parseInt(id));
              setDiscountAmount(selected ? selected.discountAmount : 0);
            }}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%",
              fontSize: "16px",
              color: 'white'
            }}
          >
            <option style={{ color: 'black' }} value="none">선택 안함</option>
            {coupons.map((c) => (
              <option key={c.id} style={{ color: 'black' }} value={c.id}>
                {c.description} ({c.discountAmount.toLocaleString()}원 할인)
              </option>
            ))}
          </select>
        </div>

        <div className="payment-summary">
          {priceDetails.map((item, idx) => (
            <div className="summary-row" key={idx}>
              <span>{item.label} x {item.count}</span>
              <span>{(item.price * item.count).toLocaleString()}원</span>
            </div>
          ))}
          <div className="summary-row"><span>총 금액</span><span>{totalPrice.toLocaleString()}원</span></div>
          <div className="summary-row"><span>할인</span><span>- {discountAmount.toLocaleString()}원</span></div>
          <hr />
          <div className="summary-total">
            <span>최종 결제금액</span>
            <strong>{finalAmount.toLocaleString()}원</strong>
          </div>
          <div className="button-group">
            <button onClick={() => router.back()} disabled={loading}>이전</button>
            <button className="confirm" onClick={handlePayment} disabled={loading}>
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
        }
        .details {
          font-size: 14px;
          color: white;
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
    </>
  );
}
