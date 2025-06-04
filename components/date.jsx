"use client";
import React from 'react';
import { HStack, Button } from '@chakra-ui/react';

const formatDates = (availableDates) => {
  const weekday = ['일', '월', '화', '수', '목', '금', '토'];

  return availableDates.map(dateStr => {
    const date = new Date(dateStr);
    const dayOfWeek = weekday[date.getDay()];
    return {
      value: dateStr,
      label: `${dateStr} (${dayOfWeek})`
    };
  });
};

export default function DateSelector({ selectedDate, setSelectedDate, availableDates }) {
  const dates = formatDates(availableDates || []);

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
