// "use client";
// import React from 'react';
// import { HStack, Button, Flex, Text, Box } from '@chakra-ui/react';

// export default function TimeSelector({ selectedTime, setSelectedTime, movieTitle }) {
//   return (
//     <HStack spacing={3} wrap="wrap">
//       {timeSlots.map((time) => {
//         const isSelected = selectedTime === time;
//         return (
//             <Button
//                 key={time}
//                 onClick={() => setSelectedTime(time)}
//                 variant="outline"
//                 bg={isSelected ? '#6B46C1' : 'transparent'}
//                 color={isSelected ? 'white' : 'gray.200'}
//                 borderColor={isSelected ? 'white' : 'transparent'}
//                 _hover={{ bg: '#6B46C1', color: 'white' }}
//                 w="100%"
//                 h="80px"
//                 fontSize="lg"
//                 justifyContent="space-between"
//             >
//                 <Flex w="100%" align="center">
//                     <Text>{time}</Text>
//                     <Box ml={8}>
//                         <Text fontSize="2xl">{movieTitle}</Text>
//                     </Box>
//                 </Flex>
//             </Button>
//         );
//         })}
//     </HStack>
//   );
// }


"use client";
import React from 'react';
import { HStack, Button, Flex, Text, Box } from '@chakra-ui/react';

export default function TimeSelector({ selectedTime, setSelectedTime, movieTitle, availableTimes }) {
  return (
    <HStack spacing={3} wrap="wrap" width="100%">
      {availableTimes.map((item) => {
        const time = typeof item === 'string' ? item : item.time;
        const screen = item.screen || "-관";  // 관 정보만 표시

        const isSelected = selectedTime === time;
        return (
          <Button
            key={time}
            onClick={() => setSelectedTime(time)}
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
              {/* 왼쪽: 시간 */}
              <Box minW="80px">
                <Text fontSize="lg">{time}</Text>
              </Box>

              {/* 가운데: 영화 제목 */}
              <Box flex="1" textAlign="center">
                <Text fontSize="lg" noOfLines={1}>{movieTitle}</Text>
              </Box>

              {/* 오른쪽: 관 정보만 */}
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
