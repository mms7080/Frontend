'use client';

import { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default function NoticePage({ notices }) {
  const [searchOption, setSearchOption] = useState('title');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.log('로그인 정보 없음');
      }
    })();
  }, []);

  useEffect(() => {
    const sorted = [...notices].sort((a, b) => b.id - a.id);
    setFiltered(
      sorted.filter(n => {
        const target =
          searchOption === 'title' ? n.title :
          searchOption === 'content' ? n.content :
          searchOption === 'author' ? n.writer :
          searchOption === 'title_content' ? `${n.title} ${n.content}` :
          '';
        return target?.toLowerCase().includes(searchKeyword.toLowerCase());
      })
    );
  }, [searchKeyword, searchOption, notices]);

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
        <h1 style={{
          fontSize: '30px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#222',
          marginBottom: '36px',
          borderBottom: '2px solid #ccc',
          paddingBottom: '10px'
        }}>
          📢 NOTICE
        </h1>

        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <button
            style={{
              backgroundColor: '#333',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#111'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onClick={() => window.location.href = '/notice/new'}
          >
            ✏️ 공지 작성
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <select
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #aaa',
              fontSize: '15px',
              width: '140px'
            }}
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="title_content">제목+내용</option>
            <option value="author">작성자</option>
          </select>
          <input
            style={{
              padding: '10px',
              width: '320px',
              borderRadius: '4px',
              border: '1px solid #aaa',
              fontSize: '15px'
            }}
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <thead style={{ backgroundColor: '#f7f7f7' }}>
            <tr>
              <th style={{ padding: '14px', borderBottom: '1px solid #ddd', width: '10%' }}>번호</th>
              <th style={{ padding: '14px', borderBottom: '1px solid #ddd' }}>제목</th>
              <th style={{ padding: '14px', borderBottom: '1px solid #ddd', width: '20%' }}>작성자</th>
              <th style={{ padding: '14px', borderBottom: '1px solid #ddd', width: '15%' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', fontSize: '15px' }}>📭 공지사항이 없습니다.</td>
              </tr>
            ) : (
              filtered.map((notice) => (
                <tr key={notice.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '14px', textAlign: 'center' }}>{notice.id}</td>
                  <td style={{ padding: '14px' }}>
                    <a href={`/notice/${notice.id}`} style={{
                      color: 'black',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}>
                      {notice.title}
                    </a>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>{notice.writer}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button
                      style={{
                        backgroundColor: '#e53e3e',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                      onClick={async () => {
                        if (confirm('정말 삭제하시겠습니까?')) {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${notice.id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                          });
                          if (res.ok) {
                            alert('삭제 완료');
                            location.reload();
                          } else {
                            alert('삭제 실패');
                          }
                        }
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ height: '230px' }} />
      <Footer footerBg="white" footerColor="black" />
    </>
  );
}
