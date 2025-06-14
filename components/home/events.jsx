'use client';

import React from 'react';
import Link from "next/link";
import {VStack,Grid,Flex,Box} from '@chakra-ui/react';
import Event from '../element/event';

export default function Events({Fetchedevents}){

    const getEventStatus = (dateRange) => {
        const now = new Date();
        const [_, endStr] = dateRange
          .split("~")
          .map((s) => s.trim().replace(/\./g, "-"));
        const endDate = new Date(endStr);
        return now > endDate ? "종료됨" : "진행중";
    };

    return <VStack w='100%' bg='#f9f9f9' pt='80px' pb='50px'>
        <h1 style={{color:'black',fontSize:25,paddingBottom:15}}>진행 중인 이벤트</h1>
        <Flex w={{base:'100%',md:'1050px'}} mr={{base:'130px',md:'0px'}} justifyContent='flex-end' color='black' _hover={{color:'gray.500'}}><Link href='/event'>더 보기</Link></Flex>
        <Grid templateColumns={{base:'1fr',md:'repeat(4,240px)'}} gap='30px' overflow='visible'>
            {(Fetchedevents["Pick"]).filter(event=>getEventStatus(event.date)!=='종료됨').map((event,index) =>{
                if(index<4)
                    return <Box overflow='visible' key={event.id}>
                            <Event content={event.title} src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`} url={`/event/view/${event.id}`}></Event>
                        </Box>;
            })}
        </Grid>
    </VStack>;
}