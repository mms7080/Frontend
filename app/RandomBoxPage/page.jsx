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
  if (!res.ok || !text) {
    return (
      <meta httpEquiv="refresh" content="0;url=/signin" />
    );
  }

  const userData = JSON.parse(text);
  return <RandomBoxPage userData={userData} />;
}
