'use client';

import { useEffect, useState } from 'react';
import { Header } from '../components';
import Link from 'next/link';

export default function Error({ error, reset }) {
  const [user, setUser] = useState(null);


  useEffect(() => {
    document.title = "오류 - FILMORA";
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
        <h1 style={styles.title}>💥 500 - 서버 오류</h1>
        <p style={styles.text}>
          죄송합니다. 서버에 문제가 발생했습니다.
        </p>

        {/* 홈으로 이동 */}
        <Link href="/" style={styles.link}>
          ⬅ 홈으로 돌아가기
        </Link>

        {/* 에러 복구 버튼 */}
        <button onClick={() => reset()} style={styles.button}>
          다시 시도
        </button>
      </div>
    </>
  );
}

const styles = {
  wrapper: {
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'normal',
    marginBottom: '20px',
    color: '#c53030',
  },
  text: {
    fontSize: '18px',
    marginBottom: '30px',
    color: '#742a2a',
  },
  link: {
    fontSize: '16px',
    color: '#6B46C1',
    textDecoration: 'none',
    fontWeight: 'normal',
    marginBottom: '15px',
  },
  button: {
    backgroundColor: '#c53030',
    color: '#fff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};
