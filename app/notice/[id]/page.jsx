'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: 'include',
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch {
        setUser(null);
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

      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'Pretendard, sans-serif' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'black', textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #6B46C1', paddingBottom: '10px' }}>공지사항</h1>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <tbody>
            <tr>
              <th style={thStyle}>제목</th>
              <td style={tdStyle}>{notice.title}</td>
            </tr>
            <tr>
              <th style={thStyle}>작성자</th>
              <td style={tdStyle}>{notice.writer}</td>
            </tr>
            <tr>
              <th style={thStyle}>작성일</th>
              <td style={tdStyle}>{notice.createdAt?.slice(0, 10)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', padding: '20px', backgroundColor: '#f9f5ff', border: '1px solid #e2d8f7', borderRadius: '6px', fontSize: '16px', color: '#333', marginBottom: '30px' }}>
          {notice.content}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{ ...navBtn, ...(prevId ? {} : disabledStyle) }}
              disabled={!prevId}
              onClick={() => prevId && router.push(`/notice/${prevId}`)}
              onMouseOver={e => prevId && (e.currentTarget.style.backgroundColor = '#f3e8ff')}
              onMouseOut={e => prevId && (e.currentTarget.style.backgroundColor = '#fff')}
            >
              이전글
            </button>
            <button
              style={{ ...navBtn, ...(nextId ? {} : disabledStyle) }}
              disabled={!nextId}
              onClick={() => nextId && router.push(`/notice/${nextId}`)}
              onMouseOver={e => nextId && (e.currentTarget.style.backgroundColor = '#f3e8ff')}
              onMouseOut={e => nextId && (e.currentTarget.style.backgroundColor = '#fff')}
            >
              다음글
            </button>
          </div>
          <button
            style={editBtn}
            onClick={() => router.push(`/notice/edit/${id}`)}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#ddd')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#eee')}
          >
            수정
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => router.push('/notice')}
            style={{ ...editBtn, backgroundColor: '#6B46C1', color: '#fff' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#553C9A')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#6B46C1')}
          >
            목록
          </button>
        </div>
      </div>

      <div style={{ height: '200px' }} />
      <Footer footerBg="white" footerColor="black" />
    </>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  backgroundColor: '#f4f1fa',
  width: '20%',
  fontWeight: 'bold',
  borderBottom: '1px solid #ddd',
  color: '#6B46C1'
};

const tdStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #ddd',
  color: '#444'
};

const navBtn = {
  padding: '8px 16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#6B46C1',
  transition: '0.3s all ease'
};

const editBtn = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#eee',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  transition: '0.3s all ease'
};

const disabledStyle = {
  opacity: 0.4,
  cursor: 'not-allowed'
};
