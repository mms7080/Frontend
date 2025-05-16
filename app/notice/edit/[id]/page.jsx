'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

export default function NoticeEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState({ title: '', content: '', writer: '' });

  useEffect(() => {
    (async () => {
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
        credentials: 'include',
      });
      const userData = await userRes.json();
      setUser(userData);
    })();

    (async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${id}`);
      const data = await res.json();
      setNotice(data);
    })();
  }, [id]);

  const handleUpdate = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(notice),
    });
    if (res.ok) {
      alert('수정 완료');
      router.push(`/notice/${id}`);
    } else {
      alert('수정 실패');
    }
  };

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />

      <main className="form-container">
        <h1>🛠️ 공지사항 수정</h1>

        <div className="form-group">
          <label>제목</label>
          <input
            placeholder="제목을 입력하세요"
            value={notice.title}
            onChange={(e) => setNotice({ ...notice, title: e.target.value })}
          />

          <label>작성자</label>
          <input
            placeholder="작성자 이름"
            value={notice.writer}
            readOnly
            style={{ backgroundColor: '#eee', cursor: 'not-allowed' }}
          />

          <label>내용</label>
          <textarea
            placeholder="공지사항 내용을 입력하세요"
            value={notice.content}
            onChange={(e) => setNotice({ ...notice, content: e.target.value })}
            rows={10}
          />

          <div className="button-group">
            <button className="submit-btn" onClick={handleUpdate}>수정 완료</button>
            <button className="cancel-btn" onClick={() => router.push(`/notice/${id}`)}>취소</button>
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
          font-weight: bold;
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
          font-weight: 600;
          margin-bottom: 4px;
        }

        input, textarea {
          padding: 12px;
          font-size: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
          outline: none;
          background-color: #fcfcfc;
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
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
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
          font-weight: bold;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background-color: #bbb;
        }
      `}</style>
    </>
  );
}
