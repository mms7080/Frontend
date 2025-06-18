"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Header } from "../../components";
import Modal, { useModal } from '../movie/modal';

export default function RandomBoxPage({ userData }) {
  const [user] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showBox, setShowBox] = useState(false);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();

  useEffect(()=>{
    if (!userData)openModal('로그인이 필요합니다.');
  },[userData]);

  const openBox = async () => {
    if (!user) {
      openModal("로그인이 필요합니다.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const lastOpened = localStorage.getItem("lastOpenedDate");

    // ✅ 실제 사용 시 주석 해제
    // if (lastOpened === today) {
    //   alert("오늘은 이미 열었습니다.");
    //   return;
    // }

    setLoading(true);
    setResult(null);
    setShowBox(true); 

    const boxSound = new Audio("http://localhost:9999/sounds/box.mp3");
boxSound.play().catch(() => {});
setTimeout(() => {
  boxSound.pause();
  boxSound.currentTime = 0;
}, 2500);


    setTimeout(async () => {
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
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        new Audio("http://localhost:9999/sounds/win.mp3").play().catch(() => {});
      } else {
        new Audio("http://localhost:9999/sounds/lose.mp3").play().catch(() => {});
      }
        // ✅ 실제 사용 시 주석 해제
        // localStorage.setItem("lastOpenedDate", today);
      } catch (err) {
        openModal("에러 발생: " + err.message);
      } finally {
        setLoading(false);
        setShowBox(false);
      }
    }, 3000);
  };

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
      

      <div className="random-box-container">
        <div className="event-banner">
          <h1>🎁 오늘의 럭키박스</h1>
          <p>하루에 한 번, 클릭 한 번으로 쿠폰을 획득해보세요!</p>
        </div>

        {!loading && !showBox && !result && (
          <button className="open-button" onClick={openBox}>
            랜덤박스 열기
          </button>
        )}

        {showBox && (
          <div className="box-animation-wrapper">
            <img
              src="http://localhost:9999/images/box.gif"
              alt="상자 열기"
              className="shaking-box"
              loading='lazy'
            />
            <p className="box-text">열리는 중...</p>
          </div>
        )}

        {result && result.result === "당첨!" && (
          <div className="result-box win">
            <h2>🎉 축하합니다! 할인 쿠폰 당첨!</h2>
            <p className="coupon-text">₩1,000 할인쿠폰</p>
            {result.item.imgUrl && (
              <img
                src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${result.item.imgUrl}`}
                alt={result.item.title}
                loading='lazy'
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

.box-animation-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  margin-top: 40px;
}

.box-wrapper {
  padding: 12px;
  border: 4px dashed #6b46c1;
  background: linear-gradient(135deg, #fefefe, #f0f0ff);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}


.box-gif {
  width: 190px;
}

        .box-text {
          margin-top: 16px;
          font-size: 18px;
          color: #666;
        }

        @keyframes shake {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(4deg);
          }
          50% {
            transform: rotate(-4deg);
          }
          75% {
            transform: rotate(4deg);
          }
          100% {
            transform: rotate(0deg);
          }
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
