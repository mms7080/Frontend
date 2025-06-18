import EventUploader from '../../../components/event/upload/page';
import {fetch} from "../../../lib/server";

export default async function EventuploadPage() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  return <EventUploader userData={res} />;
  
}
