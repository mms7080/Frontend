import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';

export default function TheaterList({ theaters, selectedTheater, onSelectTheater }) {
  return (
    <Box flex="1" borderRight="1px solid" borderColor="gray.200" p={4} overflowY="auto">
      <VStack align="start" spacing={3}>
        {theaters.map(t => (
          <Text
            key={t.id}
            p={2}
            w="100%"
            bg={selectedTheater?.id === t.id ? 'gray.100' : 'transparent'}
            borderRadius="md"
            cursor="pointer"
            onClick={() => onSelectTheater(t)}
          >
            {t.name} ({t.region})
          </Text>
        ))}
      </VStack>
    </Box>
  );
}