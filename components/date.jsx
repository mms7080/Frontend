"use client";
import React from 'react';
import { HStack, Button } from '@chakra-ui/react';

const getNext14Days = () => {
  const days = [];
  const today = new Date();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'];

  for (let i = 0; i < 14; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);

    const dateStr = day.toISOString().split('T')[0];  // YYYY-MM-DD
    const dayOfWeek = weekday[day.getDay()];          // 요일 문자

    days.push({ value: dateStr, label: `${dateStr} (${dayOfWeek})` });
  }
  return days;
};

export default function DateSelector({ selectedDate, setSelectedDate }) {
  const dates = getNext14Days();

  return (
    <HStack spacing={3} wrap="wrap">
        {dates.map(({ value, label }) => {
        const isSelected = selectedDate === value;
        return (
            <Button
            key={value}
            onClick={() => setSelectedDate(value)}
            variant="outline"
            bg={isSelected ? '#6B46C1' : 'transparent'}
            color={isSelected ? 'white' : 'gray.200'}
            borderColor={isSelected ? 'white' : 'transparent'}
            _hover={{ bg: '#6B46C1', color: 'white' }}
            w="100%"
            h="100px"
            fontSize="lg"
            >
            {label}
            </Button>
        );
        })}
    </HStack>
  );
}