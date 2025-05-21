import React from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

const dates = ["05/01(목)", "05/02(금)", "05/03(토)", "05/04(일)"];     // 실험용 데이터 - 추후에 fetch로 백엔드 데이터 가져올 예정

export default function DateSelector({ selectedDate, onDateSelect }) {
    return (
        <Box
            w="100%" 
            p="20px" 
            bg="transparent" 
            borderRadius="15px" 
            // boxShadow="0 0 15px rgba(0, 0, 0, 0.1)"
        >
            <HStack spacing="10px" overflowX="auto" p="10px" justify="center">
                {dates.map(date => (
                    <Box 
                        key={date} 
                        p="10px" 
                        borderRadius="10px" 
                        bg={selectedDate === date ? "gray.200" : "purple"} 
                        color={selectedDate === date ? "black" : "white"}
                        cursor="pointer"
                        onClick={() => onDateSelect(date)}
                        _hover={{ bg: "gray.200", color: "black" }}
                        transition="all 0.2s"
                    >
                        <Text>{date}</Text>
                    </Box>
                ))}
            </HStack>
        </Box>
    );
}