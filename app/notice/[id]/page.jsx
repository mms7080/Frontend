'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';



export default function NoticeDetailPage({ params }) {
  const { id } = params;
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${id}`);
        if (!res.ok) throw new Error("데이터 불러오기 실패");
        const data = await res.json();
        setNotice(data);
      } catch (err) {
        console.error(err);
        alert("공지사항을 불러오는 데 실패했습니다.");
      }
    };
    fetchNotice();
  }, [id]);

  if (!notice) return <div>로딩 중...</div>;

  return (
    <>
      <Header headerColor="black" headerBg="#f9f9f9" />

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
            <button disabled>이전글</button>
            <button disabled>다음글</button>
          </div>
          <div className="delete-buttons">
            <button>수정</button>
          </div>
        </div>

        <div className="inven-buttons">
          <button onClick={() => window.history.back()}>목록</button>
        </div>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      </main>

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
