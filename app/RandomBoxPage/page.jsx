import RandomBoxPage from "../../components/RandomBox/page";
import { fetch as serverfetch } from "../../lib/server";

export default async function RandomBoxMainPage() {
  let userInfo = null;
  try {
    const res = await serverfetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
    if (res) userInfo = res;
  } catch (e) {
    console.log("유저 정보 가져오기 실패", e);
  }

  return <RandomBoxPage userData={userInfo} />;
}
