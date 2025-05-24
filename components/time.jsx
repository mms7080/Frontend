"use client";
import React from 'react';
import { HStack, Button, Flex, Text, Box } from '@chakra-ui/react';

const timeSlots = [
  "10:00", "12:00", "14:00", "16:00",
  "18:00", "20:00", "22:00"
];

export default function TimeSelector({ selectedTime, setSelectedTime, movieTitle }) {
  return (
    <HStack spacing={3} wrap="wrap">
      {timeSlots.map((time) => {
        const isSelected = selectedTime === time;
        return (
            <Button
                key={time}
                onClick={() => setSelectedTime(time)}
                variant="outline"
                bg={isSelected ? 'purple' : 'transparent'}
                color={isSelected ? 'white' : 'gray.200'}
                borderColor={isSelected ? 'white' : 'transparent'}
                _hover={{ bg: 'purple', color: 'white' }}
                w="100%"
                h="80px"
                fontSize="lg"
                justifyContent="space-between"
            >
                <Flex w="100%" align="center">
                    <Text>{time}</Text>
                    <Box ml={8}>
                        <Text fontSize="2xl">{movieTitle}</Text>
                    </Box>
                </Flex>
            </Button>
        );
        })}
    </HStack>
  );
}
