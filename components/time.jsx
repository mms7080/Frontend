import React from 'react';
import { Box, Wrap, WrapItem } from '@chakra-ui/react';

const times = ["12:00", "14:30", "17:00", "19:30", "22:00"];        // 실험용 데이터 - 추후에 fetch로 백엔드 데이터 가져올 예정

export default function TimeSelector({ selectedDate, onTimeSelect }) {
    return (
        <Wrap spacing="10px" p="10px">
            {times.map(time => (
                <WrapItem 
                    key={time} 
                    p="10px" 
                    borderRadius="10px" 
                    bg="blue.200" 
                    cursor="pointer"
                    onClick={() => onTimeSelect(time)}
                    _hover={{ bg: "blue.300" }}
                >
                    {time}
                </WrapItem>
            ))}
        </Wrap>
    );
}