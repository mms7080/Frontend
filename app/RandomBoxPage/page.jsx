import RandomBoxPage from "../../components/RandomBox/page";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    credentials: "include",
    cache: "no-store",
  });

  const text = await res.text();

  const userData = JSON.parse(text);
  return <RandomBoxPage userData={userData} />;
}
