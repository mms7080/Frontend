'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function NoticeCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error();
        const data = await res.json();

        // 🔐 관리자 외에는 접근 불가
        if (data.auth !== 'ADMIN') {
          alert('관리자만 접근 가능한 페이지입니다.');
          return router.push('/notice'); // 홈 또는 접근 허용된 경로
        }

        setUser(data);
        setWriter(data.name || '');
      } catch (e) {
        alert('로그인이 필요합니다.');
        router.push('/signin');
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async () => {
    if (!title || !writer || !content) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, writer, content }),
    });

    if (res.ok) {
      alert('공지사항이 등록되었습니다.');
      router.push('/notice');
    } else {
      alert('등록 실패');
    }
  };

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />

      <main className="form-container">
        <h1>📝 공지사항 작성</h1>

        <div className="form-group">
          <label>제목</label>
          <input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>작성자</label>
          <input
            value={writer}
            readOnly
            style={{ backgroundColor: '#eee', cursor: 'not-allowed' }}
          />

          <label>내용</label>
          <textarea
            placeholder="공지사항 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />

          <div className="button-group">
            <button className="submit-btn" onClick={handleSubmit}>등록하기</button>
            <button className="cancel-btn" onClick={() => router.push('/notice')}>취소</button>
          </div>
        </div>
      </main>

      <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />

      <style jsx>{`
        .form-container {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
          font-family: 'Segoe UI', sans-serif;
        }

        h1 {
          text-align: center;
          font-size: 30px;
          margin-bottom: 40px;
          border-bottom: 2px solid #ccc;
          padding-bottom: 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        label {
          font-size: 15px;
          margin-bottom: 4px;
        }

        input, textarea {
          padding: 12px;
          font-size: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
          outline: none;
          background-color: #fcfcfc;
          font-weight: normal;
        }

        textarea {
          resize: vertical;
        }

        .button-group {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .submit-btn {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-weight: normal;
        }

        .submit-btn:hover {
          background-color: #005bb5;
        }

        .cancel-btn {
          background-color: #ccc;
          color: black;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: normal;
        }

        .cancel-btn:hover {
          background-color: #bbb;
        }
      `}</style>
    </>
  );
}
