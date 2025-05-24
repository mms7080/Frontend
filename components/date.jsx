"use client";

import React from 'react';
import { VStack, Button } from '@chakra-ui/react';

// 임시 날짜 데이터
const dates = [
  '2025-05-24',
  '2025-05-25',
  '2025-05-26',
  '2025-05-27',
];

export default function DateSelector({ selectedDate, onDateSelect }) {
  return (
    <VStack align="stretch" spacing={2}>
      {dates.map(d => (
        <Button
          key={d}
          variant={selectedDate === d ? 'solid' : 'outline'}
          onClick={() => onDateSelect(d)}
        >
          {d}
        </Button>
      ))}
    </VStack>
  );
}