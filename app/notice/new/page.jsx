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
        setUser(data);
        setWriter(data.username || data.name || data.userId || '');
      } catch (e) {
        console.log('로그인 정보 없음');
      }
    };
    fetchUser();
  }, []);

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

      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>공지 작성</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #333',
              outline: 'none',
              borderRadius: '4px'
            }}
          />
          <input
            placeholder="작성자"
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #333',
              outline: 'none',
              borderRadius: '4px'
            }}
          />
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            style={{
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #333',
              outline: 'none',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '15px'
            }}
          >
            등록하기
          </button>
        </div>
      </main>

      <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />
    </>
  );
}
