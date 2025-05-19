import React, { useState } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

const dates = ["2025-05-01", "2025-05-02", "2025-05-03", "2025-05-04"];     // 실험용 데이터 - 추후에 fetch로 백엔드 데이터 가져올 예정

export default function DateSelector({ selectedMovie, selectedDate, onDateSelect }) {
    return (
        <Box
            w="90%" 
            p="20px" 
            bg="white" 
            borderRadius="15px" 
            boxShadow="0 0 15px rgba(0, 0, 0, 0.1)"
        >
            <HStack spacing="10px" overflowX="auto" p="10px" justify="center">
                {dates.map(date => (
                    <Box 
                        key={date} 
                        p="10px" 
                        borderRadius="10px" 
                        bg={selectedDate === date ? "purple" : "gray.200"} 
                        cursor="pointer"
                        onClick={() => onDateSelect(date)}
                        _hover={{ bg: "purple", color: "white" }}
                        transition="all 0.2s"
                    >
                        <Text>{date}</Text>
                    </Box>
                ))}
            </HStack>
        </Box>
    );
}