"use client";
import React from 'react';
import { HStack, Button, Flex, Text, Box } from '@chakra-ui/react';

export default function TimeSelector({ selectedShowtime, onSelectShowtime, movieTitle, availableTimes }) {
  return (
    <HStack spacing={3} wrap="wrap" width="100%">
      {availableTimes.filter((item) => {
          const now = new Date(); // 현재 시간
          const movieTime = new Date(item.startTime.replace(" ", "T")); // ISO 형식으로 변환
          return movieTime > now; // 현재보다 후이면 true
        }).map((item) => {
        const time = item.startTime.split(" ")[1]; // "2025-06-04 10:00" → "10:00"
        const screen = item.auditoriumName || "-관";

        // const isSelected = selectedTime === time;
        const isSelected = selectedShowtime?.showtimeId === item.showtimeId;

        return (
          <Button
            key={item.showtimeId}
            // onClick={() => setSelectedTime(time)}
            onClick={() => onSelectShowtime(item)}
            variant="outline"
            bg={isSelected ? '#6B46C1' : 'transparent'}
            color={isSelected ? 'white' : 'gray.200'}
            borderColor={isSelected ? 'white' : 'transparent'}
            _hover={{ bg: '#6B46C1', color: 'white' }}
            w="100%"
            h="80px"
            fontSize="lg"
            px={6}
          >
            <Flex w="100%" align="center" justify="space-between">
              <Box minW="80px">
                <Text fontSize="lg">{time}</Text>
              </Box>
              <Box flex="1" textAlign="center">
                <Text fontSize="lg" noOfLines={1}>{movieTitle}</Text>
              </Box>
              <Box minW="80px" textAlign="right">
                <Text fontSize="md" color="gray.400">{screen}</Text>
              </Box>
            </Flex>
          </Button>
        );
      })}
    </HStack>
  );
}
