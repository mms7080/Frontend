import EventUploader from '../../../components/event/upload/page';
import {fetch} from "../../../lib/server";

export const metadata = {
    title: '이벤트 업로드 - FILMORA',
    description: '이벤트를 업로드 할 수 있는 페이지입니다.',
};

export default async function EventuploadPage() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <EventUploader userData={res} />;
  
}
