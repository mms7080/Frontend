'use client';

import { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default function NoticePage({ notices }) {
  const [searchOption, setSearchOption] = useState('title');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filtered, setFiltered] = useState(notices || []);

  useEffect(() => {
    setFiltered(
      notices.filter(n => {
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
      <Header headerColor="black" headerBg="#f5f5f5" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '24px' }}>📢 NOTICE</h1>

        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
          <button
            style={{
              backgroundColor: '#555',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/notices/new'}
          >
            공지 작성
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          <select
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="title_content">제목+내용</option>
            <option value="author">작성자</option>
          </select>
          <input
            style={{
              padding: '8px',
              width: '300px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>번호</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>제목</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>작성자</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '16px' }}>📭 공지사항이 없습니다.</td>
              </tr>
            ) : (
              filtered.map((notice) => (
                <tr key={notice.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{notice.id}</td>
                  <td style={{ padding: '12px' }}>
                    <a href={`/notices/view/${notice.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                      {notice.title}
                    </a>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{notice.writer}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      style={{
                        backgroundColor: '#e53e3e',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      onClick={() =>
                        confirm('삭제하시겠습니까?') &&
                        alert('✅ TODO: 삭제 API 연결 필요')
                      }
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
       <br></br>
        <br></br>
         <br></br>
          <br></br>
           <br></br>
            <br></br>
             <br></br>

      <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />
    </>
  );
}
