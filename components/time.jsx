"use client";

import React from 'react';
import { Wrap, Button } from '@chakra-ui/react';

// 임시 시간 데이터
const times = [
  '10:00', '12:30', '15:00', '17:30', '20:00',
];

export default function TimeSelector({ selectedTime, onTimeSelect }) {
  return (
    <Wrap spacing={2}>
      {times.map(t => (
        <Button
          key={t}
          variant={selectedTime === t ? 'solid' : 'outline'}
          onClick={() => onTimeSelect(t)}
        >
          {t}
        </Button>
      ))}
    </Wrap>
  );
}