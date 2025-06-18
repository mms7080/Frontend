"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../../../../components"; 

export default function StorePaymentFailPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "결제 - FILMORA";
    // 로그인된 유저 정보 불러오기
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
        <h1>❌ 결제 실패</h1>
        <p style={{ marginTop: "20px", color: "#888" }}>
          스토어 결제가 정상적으로 처리되지 않았습니다.<br />다시 시도해 주세요.
        </p>
        <Link href="/store">
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
            스토어로 돌아가기
          </button>
        </Link>
      </div>
    </>
  );
}
