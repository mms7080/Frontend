"use client";
export default async function fetchClient(url, options={}) {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'accept': 'application/json;charset=UTF-8',
      'Content-Type':'application/json',
      ...options.headers
    }
  };
  return await fetch(url, { cache:'no-cache', ...defaultOptions, ...options })
  .then(v=>{
    try { return v.json(); }
    catch { return v.text(); }
  });
}