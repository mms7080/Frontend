"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { movies } from '../../components/moviePoster';
import { Header, Footer } from '../../components';

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();

  const movieId = parseInt(params.get("movieId"));
  const movie = movies.find((m) => m.id === movieId);
  const region = params.get("region");
  const theater = params.get("theater");
  const date = params.get("date");
  const time = params.get("time");
  const seats = params.get("seats")?.split(",") || [];

  const adult = parseInt(params.get("adult") || "0");
  const teen = parseInt(params.get("teen") || "0");
  const senior = parseInt(params.get("senior") || "0");
  const special = parseInt(params.get("special") || "0");

  const totalPrice = adult * 15000 + teen * 12000 + senior * 10000 + special * 8000;

  const priceDetails = [
    { label: "성인", count: adult, price: 15000 },
    { label: "청소년", count: teen, price: 12000 },
    { label: "경로", count: senior, price: 10000 },
    { label: "우대", count: special, price: 8000 },
  ].filter(item => item.count > 0);

  let headerColor = 'white';
  let headerBg = '#1a1a1a';

  useEffect(() => {
    document.title = "예매 - 결제";
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch (e) {
        setUser(null);
      }
    })();
  }, []);

  const handlePayment = async () => {
    // setLoading(true);
    // try {
    //   const toss = await loadTossPayments(
    //     "test_ck_KNbdOvk5rkmzvKYA97Ey3n07xlzm"
    //   );
    //   const orderId = `order-${Date.now()}`;

    //   toss.requestPayment("카드", {
    //     amount: totalPrice,
    //     orderId,
    //     orderName: product.title,
    //     customerName: user?.name || "비회원",
    //     successUrl: `${window.location.origin}/store/payment/success?userId=${
    //       user?.id || "guest"
    //     }&productId=${product.id}`,
    //     failUrl: `${window.location.origin}/store/payment/fail`,
    //   });
    // } catch (error) {
    //   alert("Toss 결제 실패: " + error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
        <Header headerColor="black" headerBg="white" userInfo={user} />
        <div className="payment-container">
            <h2>결제하기</h2>

            <div className="purchase-info">
            <div className="product">
                <img
                    src={movie.poster}
                    alt={movie.title}
                />
                <div className="details">
                    <strong>{movie.title}</strong>
                    <p>{movie.subtitle}</p>
                    <p>{theater}</p>
                    <p>{date}</p>
                    <p>{time}</p>
                </div>
            </div>
            <strong>{seats.length > 0 ? seats.join(", ") : "좌석 정보 없음"}</strong>
            </div>

            <div className="payment-summary">
            {priceDetails.map((item, idx) => (
                <div className="summary-row" key={idx}>
                    <span>{item.label} x {item.count}</span>
                    <span>{(item.price * item.count).toLocaleString()}원</span>
                </div>
            ))}
            <div className="summary-row">
                <span>총 금액</span>
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
                // border: 1px solid #ddd;
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
