'use client';

import React from 'react';
import {VStack,Grid} from '@chakra-ui/react';
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
        <Grid templateColumns='repeat(3,240px)' gap='30px'>
            {(Fetchedevents["Pick"]).filter(event=>getEventStatus(event.date)!=='종료됨').map((event,index) =>{
                if(index<3)
                    return <Event key={event.id} content={event.title} src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${event.image}`} url={`/event/view/${event.id}`}></Event>;
            })}
        </Grid>
    </VStack>;
}