// app/not-found.jsx
'use client';

import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {

  useEffect(() => {
    document.title = "페이지 없음 - FILMORA";
  }, []);

  return (
    <>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>🚫 404 - 페이지를 찾을 수 없습니다.</h1>
        <p style={styles.text}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link href="/" style={styles.link}>
          ⬅ 홈으로 돌아가기
        </Link>
      </div>
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
