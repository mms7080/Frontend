import EventPage from '../../components/EventPage';

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event`, {
    cache: 'no-store',
  });
  const eventData = await res.json();

  return <EventPage serverEvents={eventData} />;
}