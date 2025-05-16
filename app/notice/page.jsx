'use client';

import { useEffect, useState } from 'react';
import NoticePage from '../../components/notice/NoticePage';

export default  function Page() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json();
      setNotices(data);
    };
    fetchData();
  }, []);

  return <NoticePage notices={notices} />;
}
