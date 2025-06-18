import EventPage from '../../components/event/EventPage';
import {fetch as serverfetch} from "../../lib/server";

export const metadata = {
    title: '이벤트 - FILMORA',
    description: ''
};

export default async function Eventmainpage() {

  const userres = await serverfetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event`, {
    cache: 'no-store',
  });
  const eventData = await res.json();

  return <EventPage serverEvents={eventData} userData={userres}/>;
}