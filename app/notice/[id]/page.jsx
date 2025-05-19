'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '../../../components/header';
import Footer from '../../../components/footer';

export default function NoticeDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [notice, setNotice] = useState(null);
  const [user, setUser] = useState(null);
  const [allNotices, setAllNotices] = useState([]);
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: 'include',
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
      } catch (err) {
        console.log('로그인 정보 없음');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailRes, listRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice`),
        ]);
        if (!detailRes.ok || !listRes.ok) throw new Error('데이터 불러오기 실패');
        const data = await detailRes.json();
        const list = await listRes.json();
        setNotice(data);
        setAllNotices(list);

        const sorted = list.sort((a, b) => b.id - a.id);
        const currentIndex = sorted.findIndex(n => n.id === Number(id));
        if (currentIndex !== -1) {
          setPrevId(sorted[currentIndex + 1]?.id || null);
          setNextId(sorted[currentIndex - 1]?.id || null);
        }
      } catch (err) {
        console.error(err);
        alert('공지사항을 불러오는 데 실패했습니다.');
      }
    };
    fetchData();
  }, [id]);

  if (!notice) return <div>로딩 중...</div>;

  return (
    <>
      <Header headerColor="black" headerBg="#f9f9f9" userInfo={user} />

      <main className="detail-wrapper">
        <h1 className="notice-title">📢 공지사항</h1>

        <div className="detail-box">
          <table className="detail-table">
            <tbody>
              <tr>
                <th>제목</th>
                <td>{notice.title}</td>
              </tr>
              <tr>
                <th>작성자</th>
                <td>{notice.writer}</td>
              </tr>
              <tr>
                <th>작성일</th>
                <td>{notice.createdAt?.slice(0, 10)}</td>
              </tr>
            </tbody>
          </table>

          <div className="content">
            <p>{notice.content}</p>
          </div>

          <div className="main-buttons-container">
            <div className="navigation-buttons">
              {prevId ? (
                <button onClick={() => router.push(`/notice/${prevId}`)}>이전글</button>
              ) : (
                <button disabled className="disabled-btn">이전글</button>
              )}
              {nextId ? (
                <button onClick={() => router.push(`/notice/${nextId}`)}>다음글</button>
              ) : (
                <button disabled className="disabled-btn">다음글</button>
              )}
            </div>
              <div className="delete-buttons">
                  <button onClick={() => router.push(`/notice/edit/${id}`)}>수정</button>
              </div>

          </div>

          <div className="inven-buttons">
            <button onClick={() => router.push('/notice')}>목록</button>
          </div>
        </div>
      </main>

      <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />

      <style jsx>{`
        .detail-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 50px auto;
          padding: 0 20px;
          font-family: 'Segoe UI', sans-serif;
        }

        .notice-title {
          font-size: 30px;
          font-weight: bold;
          color: #333;
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #ccc;
          padding-bottom: 10px;
        }

        .detail-box {
          background-color: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .detail-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 15px;
        }

        .detail-table th,
        .detail-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #ddd;
        }

        .detail-table th {
          background-color: #f4f4f4;
          font-weight: bold;
          width: 20%;
          text-align: left;
        }

        .content {
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 4px;
          background-color: #fafafa;
          white-space: pre-line;
          line-height: 1.7;
          margin-bottom: 30px;
        }

        .main-buttons-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .navigation-buttons,
        .delete-buttons {
          display: flex;
          gap: 10px;
        }

        .navigation-buttons button,
        .delete-buttons button,
        .inven-buttons button {
          padding: 10px 20px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .navigation-buttons button:hover,
        .delete-buttons button:hover,
        .inven-buttons button:hover {
          background-color: #f0f0f0;
        }

        .disabled-btn {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .inven-buttons {
          text-align: center;
          margin-top: 20px;
        }
      `}</style>
    </>
  );
}