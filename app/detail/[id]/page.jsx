import React from 'react';
import {Box,Flex,VStack,Image,Button,Tabs} from '@chakra-ui/react';
import {Header} from '../../../components';
import {Reviews,Trailer} from '../../../components/detail';
import {FaHeart} from 'react-icons/fa';

import {fetch} from '../../../lib/server';

export const metadata = {
    title: '영화 상세 페이지',
    description: '영화에 대한 상세한 정보를 볼 수 있는 페이지입니다.',
};

export default async function detail({params}){
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
        const movieinfo = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${params.id}`);
        const reviewinfo = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/${params.id}`);
        let sum=0;

        for(let i=0;i<reviewinfo.length;i++)sum+=reviewinfo[i].score;
        if(reviewinfo.length>0)sum/=reviewinfo.length;
        if(Number.isInteger(sum))sum+='.0';
        else sum=Math.round(sum*10)/10;

        return <>
            <Header userInfo={res}></Header>
            <Box mb='100px'>
                <Flex w='100vw' h='660px' position='relative' backgroundSize='cover' justifyContent='space-around' backgroundRepeat='no-repeat' backgroundImage={`url(${movieinfo.wideImage})`}>
                    <Box w='100%' h='100%' position='absolute' bg='rgba(0,0,0,0.6)'></Box>
                    <Flex justifyContent='center' alignItems='flex-start' flexDirection='column' gap='10px' color='white' position='relative' zIndex='1'>
                        <span style={{fontSize:50,textShadow:'4px 4px 6px black'}}>{movieinfo.title}</span>
                        <span style={{fontSize:30,position:'relative',bottom:15}}>{movieinfo.titleEnglish}</span>
                        <Flex gap='10px' pt='10px' overflow='visible'>
                            <Button fontSize='15px' boxShadow='4px 4px 6px black'><FaHeart color='red'/>{
                                movieinfo.likeNumber > 999 ? Math.floor(movieinfo.likeNumber / 100) / 10 + 'k' : movieinfo.likeNumber                                
                            }</Button>
                            <Button fontSize='15px' boxShadow='4px 4px 6px black'>공유하기</Button>
                        </Flex>

                        <Flex gap='10px' color='black' fontSize='15px' py='5px' overflow='visible'>
                            {
                                movieinfo.label?movieinfo.label.split(',').map((name,index)=><Box key={index} px='5px' borderRadius='5px' bg='white' boxShadow='4px 4px 6px black'>{name.trim()}</Box>):<></>
                            }
                        </Flex>

                        <Flex justifyContent='space-between' gap='60px' fontSize='25px' pt='170px'>
                            <Flex flexDirection='column'>
                                <span style={{textShadow:'4px 4px 6px black'}}>실관람 평점</span>
                                <span style={{fontSize:20,textShadow:'4px 4px 6px black'}}>🎬 {sum}</span>
                            </Flex>
                            <Flex flexDirection='column'>
                                <span style={{textShadow:'4px 4px 6px black'}}>예매율</span>
                                <span style={{fontSize:20,textShadow:'4px 4px 6px black'}}>{movieinfo.rank}위 ({movieinfo.reserveRate+'%'})</span>
                            </Flex>
                            <Flex flexDirection='column'>
                                <span style={{textShadow:'4px 4px 6px black'}}>누적관객수</span>
                                <span style={{fontSize:20,textShadow:'4px 4px 6px black'}}>👥 {movieinfo.totalView}명</span>
                            </Flex>
                        </Flex>
                    </Flex>

                    <VStack pt='80px' overflow='visible'>
                        <Image w='280px' borderRadius='10px' position='relative' boxShadow='4px 4px 6px black' zIndex='1' src={movieinfo.poster}/>
                        <Button w='280px' boxShadow='4px 4px 6px black'>예매</Button>
                    </VStack>
                </Flex>
                <VStack my='50px'>
                    <Box w='1200px' px='30px' m='40px' borderRadius='10px' bg='white'>
                        <Flex w='1140px' flexDirection='column' gap='30px' px='50px' pt='40px' pb='80px'>
                            <span style={{lineHeight:'40px'}}>
                                {movieinfo.title}<br/><br/>
                                {movieinfo.description}<br/><br/><br/><br/>
                            </span>
                            <Flex w='100%'>
                                <Flex w='50%' flexDirection='column' lineHeight='40px'>
                                    <span>러닝 타임:</span>
                                    <span style={{color:'#6D6D96'}}>{Math.floor(movieinfo.runningTime/60)}시간 {movieinfo.runningTime%60}분</span>
                                    <span>공개일:</span>
                                    <span style={{color:'#6D6D96'}}>{(()=>{
                                            const [year, month, day] = movieinfo.releaseDate.split('.').map(part => parseInt(part, 10));
                                            return `${year}년 ${month}월 ${day}일`;
                                        })()
                                    }</span>
                                    <span>장르:</span>
                                    <span style={{color:'#6D6D96'}}>{movieinfo.genre}</span>
                                    <span>관람 등급:</span>
                                    <Flex bg={
                                        movieinfo.rate == "ALL" ? "green" :
                                        movieinfo.rate == "12" ? "yellow" :
                                        movieinfo.rate == "15" ? "orange" :
                                        movieinfo.rate == "19" ? "red" : "none"
                                    } w={movieinfo.rate=='ALL'?'40px':'25px'} h='25px' borderRadius='5px' justifyContent='center' alignItems='center' color='black' fontSize='18px'>{movieinfo.rate}</Flex>
                                </Flex>
                                <Flex w='50%' flexDirection='column' lineHeight='40px'>
                                    <span>감독:</span>
                                    {movieinfo.director.split(',').map((name,index)=><span key={index} style={{color:'#6D6D96'}}>{name.trim()}</span>)}
                                    <span>출연:</span>
                                    {movieinfo.cast.split(',').map((name,index)=><span key={index} style={{color:'#6D6D96'}}>{name.trim()}</span>)}
                                </Flex>
                                
                            </Flex>
                            <span></span>
                        </Flex>
                    </Box>
                </VStack>
                <VStack>
                    <Box w='1200px' px='30px' borderRadius='10px' bg='white'>
                        <Flex w='1140px' flexDirection='column' gap='30px' pt='40px' pb='80px'>
                            <Tabs.Root key='outline' defaultValue="trailer" variant='outline' fitted>
                                <Tabs.List>
                                    <Tabs.Trigger value="trailer">
                                        예고편/스틸컷
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="review">
                                        실관람평
                                    </Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content value="trailer">
                                    <Trailer></Trailer>
                                </Tabs.Content>
                                <Tabs.Content value="review">
                                    <Reviews userInfo={res} movieInfo={movieinfo} reviewInfo={reviewinfo}></Reviews>
                                </Tabs.Content>
                            </Tabs.Root>
                        </Flex>
                    </Box>
                </VStack>
            </Box>
        </>;
}