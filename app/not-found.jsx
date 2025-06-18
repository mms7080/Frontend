// app/not-found.jsx
'use client';

import { useEffect, useState } from "react";
import { Header,Footer } from "../components";
import Link from "next/link";

export default function NotFound() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <Header userInfo={user} />
      <div style={styles.wrapper}>
        <h1 style={styles.title}>🚫 404 - 페이지를 찾을 수 없습니다</h1>
        <p style={styles.text}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link href="/" style={styles.link}>
          ⬅ 홈으로 돌아가기
        </Link>
      </div>
      <Footer/>
    </>
  );
}

const styles = {
  wrapper: {
    height: "calc(100vh - 100px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "normal",
    marginBottom: "20px",
    color: "#222",
  },
  text: {
    fontSize: "18px",
    marginBottom: "30px",
    color: "#555",
  },
  link: {
    fontSize: "16px",
    color: "#6B46C1",
    textDecoration: "none",
    fontWeight: "normal",
  },
};
