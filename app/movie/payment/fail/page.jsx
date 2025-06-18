"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header,Footer } from "../../../../components"; 

export default function MoviePaymentFailPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
      } catch (e) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Header headerColor="black" headerBg="white" userInfo={user} />

      <div style={{ padding: "60px", textAlign: "center" }}>
        <h1>❌ 예매 실패</h1>
        <p style={{ marginTop: "20px", color: "#888" }}>
          영화 예매 결제에 실패했습니다. 다시 시도해 주세요.
        </p>
        <Link href="/movie">
          <button
            style={{
              marginTop: "40px",
              padding: "12px 24px",
              backgroundColor: "#6b46c1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            영화 목록으로
          </button>
        </Link>
      </div>
      <Footer/>
    </>
  );
}
