'use client';

import {useSearchParams,useRouter} from 'next/navigation';
import {useRef,useEffect} from 'react';

export default function SigninClientAlert() {
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const fail = searchParams.get("error");
  const router = useRouter();

  useEffect(() => {
    if (fail==='true' && !hasRun.current) {
      alert("로그인에 실패했습니다.\n아이디 또는 비밀번호를 확인해주세요.");
      router.push('/signin');
      hasRun.current=true;
    }
  }, [fail]);

  return null; // alert만 띄우고 아무것도 렌더링 안 함
}