import {VStack,Flex,Button,Input,Image,Box} from '@chakra-ui/react';

export default function Bookmark(){
    return <VStack w='100%' bg='#0f0f0f' p='30px'>
        <Flex gap='30px' alignItems='center'>
            <Flex h='40px' justifyContent='space-between' alignContent='center' py='8px' px='12px' bg='#1e1e1e' borderRadius='4px'>
                <Input h='24px' color='white' border='none' outline='none' fontSize='14px' _focus={{borderBottom:'1px solid #00c3ff'}}/>
                <Button h='24px' bg='none'>
                    <Image w='16px' h='16px' src="https://cdn-icons-png.flaticon.com/512/54/54481.png" alt="search" loading='lazy'/>
                </Button>
            </Flex>
            <Box w='1px' h='32px' bg='#333'></Box>
            <VStack>
                <Image w='24px' h='24px' src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="calendar" loading='lazy'/>
                <span style={{color:'white'}}>상영시간표</span>
            </VStack>
            <Box w='1px' h='32px' bg='#333'></Box>
            <VStack>
                <Image w='24px' h='24px' src="https://cdn-icons-png.flaticon.com/512/4305/4305567.png" alt="boxoffice" loading='lazy'/>
                <span style={{color:'white'}}>박스오피스</span>
            </VStack>
            <Box w='1px' h='32px' bg='#333'></Box>
            <VStack>
                <Image w='24px' h='24px' src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png" alt="ticket" loading='lazy'/>
                <span style={{color:'#ff4d4d'}}>빠른예매</span>
            </VStack>
        </Flex>
    </VStack>;
}