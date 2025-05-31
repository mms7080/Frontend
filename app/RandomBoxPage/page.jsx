"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../../components";
import SkeletonHeader from "../../components/SkeletonHeader";
import confetti from "canvas-confetti";

export default function RandomBoxPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("로그인 정보 없음");
        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.log("유저 없음", e);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  const openBox = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastOpened = localStorage.getItem("lastOpenedDate");

    //테스트할때는 주석처리
    // if (lastOpened === today) {
    //   alert("이미 오늘 랜덤박스를 열었습니다. 내일 다시 도전해보세요!");
    //   return;
    // }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/random-box?userId=${user.username}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      setResult(data);

      if (data.result === "당첨!") {
        launchConfetti();
      }

      // 오늘 날짜 저장(테스트할때는 주석처리)
      // localStorage.setItem("lastOpenedDate", today);
    } catch (err) {
      alert("에러 발생: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  return (
    <>
      {loadingUser ? (
        <SkeletonHeader />
      ) : (
        <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
      )}

      <div className="random-box-container">
        <div className="event-banner">
          <h1>🎁 오늘의 럭키박스</h1>
          <p>하루에 한 번, 클릭 한 번으로 쿠폰을 획득해보세요!</p>
        </div>

        <button className="open-button" onClick={openBox} disabled={loading}>
          {loading ? "열리는 중..." : "랜덤박스 열기"}
        </button>

        {result && result.result === "당첨!" && (
          <div className="result-box win">
            <h2>🎉 축하합니다! 할인 쿠폰 당첨!</h2>
            <p className="coupon-text">₩1,000 할인쿠폰</p>
            {result.item.imgUrl && (
              <img
                src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${result.item.imgUrl}`}
                alt={result.item.title}
              />
            )}
          </div>
        )}

        {result && result.result.startsWith("꽝") && (
          <div className="result-box fail">
            <h2>😭 아쉽지만 다음 기회를!</h2>
            <p>내일 다시 도전해보세요!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .random-box-container {
          max-width: 600px;
          margin: 60px auto;
          padding: 20px;
          text-align: center;
        }

        .event-banner h1 {
          font-size: 32px;
          color: #6b46c1;
          margin-bottom: 8px;
        }

        .event-banner p {
          color: #333;
          font-size: 16px;
        }

        .open-button {
          background-color: #6b46c1;
          color: white;
          padding: 14px 28px;
          font-size: 18px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 30px;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .open-button:hover {
          background-color: #553c9a;
          transform: scale(1.05);
        }

        .open-button:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }

        .result-box {
          margin-top: 40px;
          padding: 24px;
          border-radius: 14px;
          border: 2px dashed #ccc;
        }

        .result-box.win {
          border-color: #4caf50;
          background-color: #f1fff1;
          animation: fadeIn 1s ease-in-out;
        }

        .result-box.fail {
          border-color: #ddd;
          background-color: #fefefe;
          animation: fadeIn 1s ease-in-out;
        }

        .coupon-text {
          font-size: 24px;
          color: #e53e3e;
          font-weight: bold;
          margin-top: 12px;
        }

        .result-box img {
          width: 220px;
          margin-top: 16px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pop {
          0% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
