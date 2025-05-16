import React, { useState } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

const dates = ["2025-05-01", "2025-05-02", "2025-05-03", "2025-05-04"];     // 실험용 데이터 - 추후에 fetch로 백엔드 데이터 가져올 예정

export default function DateSelector({ selectedMovie, onDateSelect }) {
    return (
        <HStack spacing="10px" overflowX="auto" p="10px">
            {dates.map(date => (
                <Box 
                    key={date} 
                    p="10px" 
                    borderRadius="10px" 
                    bg="gray.200" 
                    cursor="pointer"
                    onClick={() => onDateSelect(date)}
                    _hover={{ bg: "gray.300" }}
                >
                    <Text>{date}</Text>
                </Box>
            ))}
        </HStack>
    );
}