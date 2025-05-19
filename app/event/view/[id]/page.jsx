'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Text, Heading, Spinner } from '@chakra-ui/react';
// import Header from '../../../components/header';
// import Footer from '../../../components/footer';










export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event/raw`);
        const data = await res.json();
        const found = data.find(e => e.id === Number(id));
        setEvent(found);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <>
      {/* <Header headerColor="black" headerBg="white" /> */}

      <Box maxW="800px" mx="auto" mt={20} p={8}>
        {loading ? (
          <Spinner />
        ) : event ? (
          <>
            <Heading mb={4}>{event.title}</Heading>
            <Text fontSize="sm" color="gray.500" mb={2}>{event.date}</Text>
            <Box mb={6}>
              <img
                src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`}
                alt={event.title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
          </>
        ) : (
          <Text>이벤트 정보를 찾을 수 없습니다.</Text>
        )}
      </Box>

       {/* <Footer footerColor="black" footerBg="white" footerBorder="#ccc" />  */}
    </>
  );
}
