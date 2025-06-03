import React from 'react';

import {VStack,Flex,Box} from '@chakra-ui/react';
import Link from "next/link";
import Detailreview from '../element/detailreview';
import {fetch} from '../../lib/server';

export default async function Reviews({reviewInfo}){
    let entiremovieinfo=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/all`);;

    reviewInfo.sort((a,b) => (b.likenumber-a.likenumber!=0)?(b.likenumber-a.likenumber):(new Date(b.writetime)-new Date(a.writetime)))
    console.log(reviewInfo);
    return <VStack w='100%' bg='#f1f1f1' pt='80px' pb='100px'>
        <h1 style={{color:'black',fontSize:25,paddingBottom:15}}>🔥 관람평 BEST</h1>
        <Flex w='60%' direction='column' gap='30px' overflow='visible'>
            {reviewInfo.map((review,index)=>{
                    if(index<4){
                        let movieinfo=entiremovieinfo[review.movieid-1];
                        return <Link href={`/detail/${review.movieid}`}><Box h='70px' overflow='visible'><Detailreview key={index}
                        id={review.id} author={review.author} score={review.score} content={review.content}
                        likenum={review.likenumber} likeusers={review.likeusers} movieInfo={movieinfo} isHome={true}></Detailreview></Box></Link>;
                    }
                }
            )}
        </Flex>
    </VStack>;
}