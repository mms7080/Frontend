import { cookies } from "next/headers";
import { cache } from "react";

const getCachedCookies = cache(async ()=>{
  const cookieStore = await cookies();
  return cookieStore.getAll().map(cookie=>`${cookie.name}=${cookie.value}`).join("; ");
});

export default async function fetchServer(url, options = {}) {
  const cookieString = await getCachedCookies();
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'accept':'application/json;charset=UTF-8',
      'Content-Type':'application/json',
      ...options.headers,
      'Cookie':cookieString
    }
  };
  const res = await fetch(url, { cache: 'no-store', ...defaultOptions, ...options });

  /* 1) 응답 상태가 OK가 아니면 null 반환*/
  if (!res.ok) return null;

  /* 2) 텍스트로 읽어서 빈 문자열인지 확인 */
  const text = await res.text();
  if (!text) return null;

  /* 3) JSON 파싱 시도 */
  try {
    return JSON.parse(text);
  } catch (err) {
    /* JSON이 아니라면 그냥 순수 문자열 반환 */
    return text;
  }

}