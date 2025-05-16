import NoticePage from '../../components/notice/NoticePage';


export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return <NoticePage notices={data} />;
}
