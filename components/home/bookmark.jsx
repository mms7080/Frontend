'use client';

import React,{useState} from 'react';
import {VStack,Flex,Button,Input,Image,Box,useMediaQuery} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi'
import {useRouter} from 'next/navigation';
import Link from "next/link";

export default function Bookmark(){

    const router = useRouter();
    const [inputValue,setInputValue]=useState('');
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    return <VStack w='100%' bg='#0f0f0f' p='30px'>
        <Flex gap={{base:'6px',md:'30px'}} alignItems='center'>
            <Flex h='40px' justifyContent='space-between' alignContent='center' py='8px' bg='#1e1e1e' borderRadius='4px' border='1px solid gray' _focusWithin={{borderColor:'white'}}>
                <Input w={{base:'155px',md:'300px'}} h='24px' color='white' border='none' outline='none' fontSize='14px'
                 value={inputValue}
                 onChange={(e)=>setInputValue(e.target.value)}
                 onKeyDown={(e)=>{
                    if(e.key==='Enter'){
                        if(e.target.value.replace(/\s+/g, '')===''){
                            alert('유효한 검색어를 입력해주세요!');
                            return;
                        }
                        router.push(`/search/${e.target.value}`);
                    }
                 }}
                 placeholder='검색 키워드 입력(영화, 이벤트, 리뷰검색)'
                 />
                
                <Button h='24px' bg='none' onClick={()=>{
                    if(inputValue.replace(/\s+/g, '')===''){
                        alert('유효한 검색어를 입력해주세요!');
                        return;
                    }
                    router.push(`/search/${inputValue}`);
                }}>
                    <FiSearch style={{position:'relative',left:'5px'}}/>
                </Button>

            </Flex>
            <Box w='1px' h='32px' bg='#333'></Box>
            <Link href='/booking'>
                <Flex gap='5px' flexDirection='column' h='60px' justifyContent='center' alignItems='center' overflow='visible'>
                    <Image w='24px' h='24px' _hover={{transform:'scale(1.2)',filter:'brightness(1.2)'}} transition='all 0.2s ease' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/bookmark1.png`} alt="ticket" loading='lazy'/>
                    <span style={{color:'#ff4d4d',fontSize:!isMobile?16:13,width:!isMobile?52.78:30}}>{!isMobile?'빠른예매':'예매'}</span>
                </Flex>
            </Link>
            <Box w='1px' h='32px' bg='#333'></Box>
            <Link href='/movie'>
                <Flex gap='5px' flexDirection='column' h='60px' justifyContent='center' alignItems='center' overflow='visible'>
                    <Image w='24px' h='24px' _hover={{transform:'scale(1.2)',filter:'brightness(1.2)'}} transition='all 0.2s ease' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/bookmark2.png`} alt="boxoffice" loading='lazy'/>
                    <span style={{color:'white',fontSize:!isMobile?16:13,width:!isMobile?82.73:30}}>{!isMobile?'영화 몰아보기':'영화'}</span>
                </Flex>
            </Link>
            <Box w='1px' h='32px' bg='#333'></Box>
            <Link href='/store'>
                <Flex gap='5px' flexDirection='column' h='60px' justifyContent='center' alignItems='center' overflow='visible'>
                    <Image w='24px' h='24px' _hover={{transform:'scale(1.2)',filter:'brightness(1.2)'}} transition='all 0.2s ease' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/bookmark3.png`} alt="calendar" loading='lazy'/>
                    <span style={{color:'white',fontSize:!isMobile?16:13,width:!isMobile?38.25:35}}>스토어</span>
                </Flex>
            </Link>
        </Flex>
    </VStack>;
}