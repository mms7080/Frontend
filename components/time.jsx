import React from 'react';
import { Box, Wrap, WrapItem } from '@chakra-ui/react';

const times = ["12:00", "14:30", "17:00", "19:30", "22:00"];        // 실험용 데이터 - 추후에 fetch로 백엔드 데이터 가져올 예정

export default function TimeSelector({ selectedTime, onTimeSelect }) {
    return (
        <Box 
            w="100%" 
            p="20px" 
            bg="transparent" 
            borderRadius="15px" 
            // boxShadow="0 0 15px rgba(0, 0, 0, 0.1)"
        >
            <Wrap spacing="10px" p="10px" justify="center">
                {times.map(time => (
                    <WrapItem 
                        key={time} 
                        p="10px" 
                        borderRadius="10px" 
                        bg={selectedTime === time ? "gray.200" : "purple"} 
                        color={selectedTime === time ? "black" : "white"}
                        cursor="pointer"
                        onClick={() => onTimeSelect(time)}
                        _hover={{ bg: "gray.200", color: "black" }}
                        transition="all 0.2s"
                    >
                        {time}
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    );
}