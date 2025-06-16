"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Header } from "../../../../components";
import Link from "next/link";
import { VStack, Text, Button } from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function MoviePaymentSuccessPage() {
  const [status, setStatus] = useState("🎬 결제 확인 중입니다...");
  const [reservationInfo, setReservationInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [movie, setMovie] = useState(null);
  const router = useRouter();
  const params = useSearchParams();
  const ticketRef = useRef();
  const executedRef = useRef(false); // ✅ 중복 실행 방지용
  const couponId = params.get("couponId");
  const userLocalKey = user?.id ?? "guest";

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const scheduleNotification = (title, notifyTime) => {
    const now = new Date();
    const fireAt = new Date(notifyTime);
    const delay = fireAt.getTime() - now.getTime();
    if (delay <= 0) return;
    setTimeout(() => {
      new Notification("🎬 영화 상영 알림", {
        body: `\"${title}\" 상영까지 30분 남았습니다.`,
        icon: "/favicon.ico",
        requireInteraction: true,
      });
    }, delay);
  };

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
    if (!user || executedRef.current) return;
    executedRef.current = true;

    const confirmAndReserve = async () => {
      const paymentKey = params.get("paymentKey");
      const orderId = params.get("orderId");
      const amount = parseInt(params.get("amount"));
      const userId = user.username;
      const movieId = parseInt(params.get("movieId"));
      const region = params.get("region");
      const theater = params.get("theater");
      const date = params.get("date");
      const time = params.get("time");
      const seats = params.get("seats")?.split(",") || [];
      const adult = parseInt(params.get("adult") || "0");
      const teen = parseInt(params.get("teen") || "0");
      const senior = parseInt(params.get("senior") || "0");
      const special = parseInt(params.get("special") || "0");
      const showtimeId = params.get("showtimeId");

      const paidKey = `paid_${orderId}`;
      if (sessionStorage.getItem(paidKey)) {
        setStatus("✅ 이미 예매가 완료된 주문입니다.");
        return;
      }

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/payments/confirm/reservation`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ paymentKey, orderId, amount, userId }),
          }
        );

        await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/reservations`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
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
            }),
          }
        );

        for (let seat of seats) {
          await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/booking/showtimes/${showtimeId}/seat/${seat}/RESERVED`
          );
        }

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

        const showKST = new Date(`${date}T${time}:00`);
        const notifyTime = new Date(showKST.getTime() - 30 * 60 * 1000);

        localStorage.setItem(
          `latestReservationAlert_${userLocalKey}`,
          JSON.stringify({
            title: data.title,
            movieId,
            notifyTime: notifyTime.toISOString(),
          })
        );

        localStorage.setItem(
          `latestReservationCountdown_${userLocalKey}`,
          JSON.stringify({
            title: data.title,
            movieId,
            showTime: showKST.toISOString(),
          })
        );

        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
          scheduleNotification(data.title, notifyTime);
        }

        setReservationInfo({
          movie: fullMovie,
          region,
          theater,
          date,
          time,
          seats: seats.join(", "),
          people: `성인 ${adult}, 청소년 ${teen}, 경로 ${senior}, 우대 ${special}`,
          amount,
          orderId,
        });

        if (couponId) {
          await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/coupons/use`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ couponId }),
            }
          );
        }

        sessionStorage.setItem(paidKey, "true");
        setStatus("✅ 예매가 완료되었습니다.");
      } catch (err) {
        console.error("❌ 처리 중 오류 발생:", err);
        setStatus("❌ 오류가 발생했습니다. 관리자에게 문의하세요.");
      }
    };

    confirmAndReserve();
  }, [user]);

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("ticket.pdf");
  };

  const handlePrint = () => {
    const content = ticketRef.current;
    const win = window.open();
    win.document.write(
      `<html><head><title>Print</title></head><body>${content.innerHTML}</body></html>`
    );
    win.document.close();
    win.print();
  };

  return (
    <>
      <Header headerColor="white" headerBg="#1a1a1a" userInfo={user} />
      <div className="wrapper">
        <div className="container">
          <h1 className="status">{status}</h1>
          {reservationInfo && reservationInfo.movie && (
            <>
              <div className="card" ref={ticketRef}>
                <img
                  src={reservationInfo.movie.poster}
                  alt={reservationInfo.movie.title}
                  className="poster"
                  loading="lazy"
                />
                <div className="details">
                  <h2>{reservationInfo.movie.title}</h2>
                  <p>
                    <strong>주문번호:</strong> {reservationInfo.orderId}
                  </p>
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
                  <div className="qr-code">
                    <QRCodeCanvas value={reservationInfo.orderId} size={100} />
                  </div>
                </div>
              </div>
              <div className="button-group">
                <button
                  onClick={() => router.push("/")}
                  className="home-button"
                >
                  홈으로 돌아가기
                </button>
                <button onClick={handleDownloadPDF} className="home-button">
                  PDF 저장
                </button>
                <button onClick={handlePrint} className="home-button">
                  프린트
                </button>
              </div>
              <VStack pt="20px">
                <Text>팝콘,콜라 주문도 필요하세요?</Text>
                <Button>
                  <Link href="/store">스토어로 이동</Link>
                </Button>
              </VStack>
            </>
          )}
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
          font-size: 20px;
          margin-bottom: 20px;
        }
        .card {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          width: 100%;
        }
        @media (min-width: 768px) {
          .card {
            flex-direction: row;
            align-items: flex-start;
            gap: 30px;
            padding: 30px;
          }
        }
        @media (max-width: 767px) {
          .qr-code {
            position: static;
            margin-top: 20px;
            text-align: center;
          }
        }
        .poster {
          width: 100%;
          max-width: 200px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: 0 auto;
        }
        .details {
          flex: 1;
          text-align: left;
          font-size: 14px;
          position: relative;
        }
        .details h2 {
          font-size: 20px;
          margin-bottom: 10px;
        }
        .details p {
          margin: 4px 0;
          font-size: 14px;
        }
        .qr-code {
          position: absolute;
          bottom: 0;
          right: 0;
          text-align: right;
        }

        .button-group {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .home-button {
          padding: 10px 16px;
          font-size: 14px;
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
