'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

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
        if (!detailRes.ok || !listRes.ok) throw new Error("데이터 불러오기 실패");
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
        alert("공지사항을 불러오는 데 실패했습니다.");
      }
    };
    fetchData();
  }, [id]);

  if (!notice) return <div>로딩 중...</div>;

  return (
    <>
      <Header headerColor="black" headerBg="#f9f9f9" userInfo={user} />

      <main>
        <h1>📢 NOTICE</h1>
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
              <button disabled style={{ opacity: 0.5 }}>이전글</button>
            )}
            {nextId ? (
              <button onClick={() => router.push(`/notice/${nextId}`)}>다음글</button>
            ) : (
              <button disabled style={{ opacity: 0.5 }}>다음글</button>
            )}
          </div>
          <div className="delete-buttons">
            <button>수정</button>
          </div>
        </div>


        <div className="inven-buttons">
          <button onClick={() => router.push('/notice')}>목록</button>
        </div>
      </main>
      <div style={{ height: '230px' }} />
      <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />

      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
        }
        main {
          width: 80%;
          margin: 20px auto;
        }
        h1 {
          font-size: 24px;
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        .detail-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .detail-table th, .detail-table td {
          padding: 10px;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          border-left: none;
          border-right: none;
          text-align: left;
        }
        .detail-table th {
          background-color: #f9f9f9;
          font-weight: bold;
          width: 15%;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
          margin-bottom: 20px;
          line-height: 1.8;
        }
        .main-buttons-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .navigation-buttons,
        .delete-buttons {
          display: flex;
        }
        .navigation-buttons button,
        .delete-buttons button {
          padding: 10px 20px;
          font-size: 14px;
          border: 1px solid #ddd;
          background-color: #fff;
          cursor: pointer;
          margin: 0 5px;
        }
        .navigation-buttons button:hover,
        .delete-buttons button:hover {
          background-color: #f5f5f5;
        }
        .inven-buttons {
          text-align: center;
          margin-bottom: 40px;
        }
        .inven-buttons button {
          padding: 10px 20px;
          font-size: 14px;
          border: 1px solid #ddd;
          background-color: #fff;
          cursor: pointer;
          margin: 0 5px;
        }
        .inven-buttons button:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </>
  );
}
