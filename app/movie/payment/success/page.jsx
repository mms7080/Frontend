"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "../../../../components";

export default function MoviePaymentSuccessPage() {
  const [status, setStatus] = useState("🎬 결제 확인 중입니다...");
  const [reservationInfo, setReservationInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [movie, setMovie] = useState(null);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const confirmAndReserve = async () => {
      const paymentKey = params.get("paymentKey");
      const orderId = params.get("orderId");
      const amount = parseInt(params.get("amount"));
      const userId = params.get("userId");

      const movieId = parseInt(params.get("movieId"));
      const region = params.get("region");
      const theater = params.get("theater");
      const date = params.get("date"); // YYYY-MM-DD
      const time = params.get("time"); // HH:mm
      const seats = params.get("seats")?.split(",") || [];
      const adult = parseInt(params.get("adult") || "0");
      const teen = parseInt(params.get("teen") || "0");
      const senior = parseInt(params.get("senior") || "0");
      const special = parseInt(params.get("special") || "0");

      try {
        // 1. 결제 승인
        await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/payments/confirm/reservation`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ paymentKey, orderId, amount, userId }),
          }
        );

        // 2. 예매 저장
        const reservation = {
          userId,
          movieId,
          region,
          theater,
          date,
          time,
          seats: seats.join(","),
          adultCount: adult,
          teenCount: teen,
          seniorCount: senior,
          specialCount: special,
          totalPrice: amount,
          orderId,
        };

        await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/reservations`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(reservation),
          }
        );

        // 3. 영화 정보 불러오기
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${movieId}`
        );
        const data = await res.json();
        const base = process.env.NEXT_PUBLIC_SPRING_SERVER_URL;
        const fullMovie = {
          ...data,
          poster: base + data.poster,
          wideImage: data.wideImage ? base + data.wideImage : null,
        };
        setMovie(fullMovie);

        // 4. 로컬스토리지 알림 저장 (상영 30분 전)
        const rawTime = new Date(`${date}T${time}:00`);
        const showKST = new Date(rawTime.getTime() + 9 * 60 * 60 * 1000); // KST → UTC
        const notifyTime = new Date(showKST.getTime() - 30 * 60 * 1000); // 30분 전

        localStorage.setItem(
          "latestReservationAlert",
          JSON.stringify({
            title: data.title,
            movieId,
            notifyTime: notifyTime.toISOString(), // UTC 기준 저장
          })
        );

        // 5. 상태 업데이트
        setReservationInfo({
          movie: fullMovie,
          region,
          theater,
          date,
          time,
          seats: seats.join(", "),
          people: `성인 ${adult}, 청소년 ${teen}, 경로 ${senior}, 우대 ${special}`,
          amount,
        });

        setStatus("✅ 예매가 완료되었습니다.");
      } catch (err) {
        console.error("❌ 처리 중 오류 발생:", err);
        setStatus("❌ 오류가 발생했습니다. 관리자에게 문의하세요.");
      }
    };

    confirmAndReserve();
  }, [params]);

  return (
    <>
      <Header headerColor="white" headerBg="#1a1a1a" userInfo={user} />

      <div className="wrapper">
        <div className="container">
          <h1 className="status">{status}</h1>

          {reservationInfo && reservationInfo.movie && (
            <div className="card">
              <img
                src={reservationInfo.movie.poster}
                alt={reservationInfo.movie.title}
                className="poster"
              />
              <div className="details">
                <h2>{reservationInfo.movie.title}</h2>
                <p>
                  <strong>상영 지역:</strong> {reservationInfo.region}
                </p>
                <p>
                  <strong>극장:</strong> {reservationInfo.theater}
                </p>
                <p>
                  <strong>날짜:</strong> {reservationInfo.date}
                </p>
                <p>
                  <strong>시간:</strong> {reservationInfo.time}
                </p>
                <p>
                  <strong>좌석:</strong> {reservationInfo.seats}
                </p>
                <p>
                  <strong>인원:</strong> {reservationInfo.people}
                </p>
                <p>
                  <strong>결제 금액:</strong>{" "}
                  {reservationInfo.amount.toLocaleString()}원
                </p>
              </div>
            </div>
          )}

          <button className="home-button" onClick={() => router.push("/")}>
            홈으로 돌아가기
          </button>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 20px;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 900px;
          width: 100%;
          text-align: center;
        }

        .status {
          font-size: 24px;
          margin-bottom: 40px;
        }

        .card {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 30px;
          padding: 30px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 800px;
        }

        .poster {
          width: 200px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .details {
          text-align: left;
          flex: 1;
          font-size: 16px;
        }

        .details h2 {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .details p {
          margin: 6px 0;
        }

        .home-button {
          margin-top: 50px;
          padding: 12px 28px;
          font-size: 16px;
          background-color: #6b46c1;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .home-button:hover {
          background-color: #553c9a;
        }
      `}</style>
    </>
  );
}
