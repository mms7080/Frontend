'use client';

import React from 'react';

import {VStack,Flex,useMediaQuery} from '@chakra-ui/react';
import Link from "next/link";
import Detailreview from '../element/detailreview';

export default function Reviews({reviewInfo,entiremovieinfo}){

    const [isMobile] = useMediaQuery("(max-width: 768px)");

    reviewInfo.sort((a,b) => (b.likenumber-a.likenumber!=0)?(b.likenumber-a.likenumber):(new Date(b.writetime)-new Date(a.writetime)))

    return <VStack w='100%' bg='#f1f1f1' pt='80px' pb='100px'>
        <h1 style={{color:'black',fontSize:25,paddingBottom:15}}>🔥 관람평 BEST</h1>
        <Flex w={{base:'100%',md:'68%'}} direction='column' gap='30px' overflow='visible'>
            {reviewInfo.map((review,index)=>{
                    if(index<4){
                        let movieinfo;
                        for(let i=0;i<entiremovieinfo.length;i++){
                            if(entiremovieinfo[i].id===review.movieid)
                            {
                                movieinfo=entiremovieinfo[i];
                                break;
                            }
                        }
                        return <Link href={`/detail/${review.movieid}`} style={{overflow:'visible'}} key={index}><Detailreview
                        isMobile={isMobile} id={review.id} author={review.author} score={review.score} content={review.content}
                        likenum={review.likenumber} likeusers={review.likeusers} movieInfo={movieinfo} isHome={true}></Detailreview></Link>;
                    }
                }
            )}
        </Flex>
    </VStack>;
}