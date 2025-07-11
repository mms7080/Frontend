import RandomBoxPage from "../../components/RandomBox/page";
import { cookies } from "next/headers";

export const metadata = {
    title: '랜덤박스 - FILMORA',
    description: '랜덤박스를 열 수 있는 페이지입니다.'
};

export default async function RandomboxMainPage() {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    credentials: "include",
    cache: "no-store",
  });

  const text = await res.text();
  
  const userData = text!==""?JSON.parse(text):null;
  return <RandomBoxPage userData={userData} />;
}
