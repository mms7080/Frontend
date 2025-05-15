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
  return await fetch(url, { cache:'no-store', ...defaultOptions, ...options })
    .then(v=>{
      try { return v.json(); }
      catch { return v.text(); }
    });
}