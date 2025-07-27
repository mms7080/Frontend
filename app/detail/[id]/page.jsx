import React from 'react';
import Link from 'next/link';
import {Box,Flex,VStack,Image,Button} from '@chakra-ui/react';
import {Likepart,Bottombox} from '../../../components/detail';
import {fetch} from '../../../lib/server';

export const metadata = {
    title: '영화 상세 페이지 - FILMORA',
    description: '영화에 대한 상세한 정보를 볼 수 있는 페이지입니다.',
};

export default async function Detailpage({params}){

        const {id} = await params;
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
        const allmovies = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`);
        const movieinfo = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${id}`);
        const reviewinfo = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/${id}`);
        const reserverate = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/reserveRate/${id}`);
        let ranking='-';

        let reserverateArray = new Array(100);
        for(let i=0;i<allmovies.length;i++){
            const reserverate_of_movie = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/reserveRate/${allmovies[i].id}`);
            reserverateArray[i]={id:allmovies[i].id,reserverate:reserverate_of_movie}
        }

        // 예매율 기준으로 내림차순 정렬
        reserverateArray.sort((a, b) => b.reserverate - a.reserverate);

        for(let i=0;i<allmovies.length;i++){
            if(reserverateArray[i].id===parseInt(id)){
                ranking=i+1;
                break;
            }
        }

        let sum=0;

        for(let i=0;i<reviewinfo.length;i++)sum+=reviewinfo[i].score;
        if(reviewinfo.length>0)sum/=reviewinfo.length;
        if(Number.isInteger(sum))sum+='.0';
        else sum=Math.round(sum*10)/10;

        return <>
            <Box mb='100px'>
                <Flex display={{base:'none',md:'flex'}} w='100vw' h='660px' position='relative' backgroundSize='cover' justifyContent='space-around' backgroundRepeat='no-repeat' backgroundImage={`url(${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${movieinfo.wideImage})`}>
                    <Box w='100%' h='100%' position='absolute' bg='rgba(0,0,0,0.6)'></Box>
                    <Flex justifyContent='center' alignItems='flex-start' flexDirection='column' gap='10px' color='white' position='relative' zIndex='1'>
                        <span style={{fontSize:50,textShadow:'4px 4px 6px black'}}>{movieinfo.title}</span>
                        <span style={{fontSize:30,position:'relative',bottom:15}}>{movieinfo.titleEnglish}</span>
                        <Flex gap='10px' pt='10px' overflow='visible'>
                            <Likepart id={id} res={res} movieinfo={movieinfo}/>
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
                                <span style={{fontSize:20,textShadow:'4px 4px 6px black'}}>{ranking}위 ({reserverate+'%'})</span>
                            </Flex>
                            <Flex flexDirection='column'>
                                <span style={{textShadow:'4px 4px 6px black'}}>누적관객수</span>
                                <span style={{fontSize:20,textShadow:'4px 4px 6px black'}}>👥 {movieinfo.totalView}명</span>
                            </Flex>
                        </Flex>
                    </Flex>

                    <VStack pt='80px' overflow='visible'>
                        <Image w='280px' borderRadius='10px' position='relative' boxShadow='4px 4px 6px black' zIndex='1' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${movieinfo.poster}`} loading='lazy'/>
                        <Link style={{width:280}} href={`/booking?id=${id}`}>
                            <Button transition="all 0.3s" _hover={{bg:"#6B46C1"}} w='280px' boxShadow='4px 4px 6px black'>예매</Button>
                        </Link>
                    </VStack>
                </Flex>
                <Flex display={{base:'flex',md:'none'}} flexDirection='column' alignItems='center' mt='50px' gap='30px'>
                    <Image w='90%' borderRadius='10px' position='relative' boxShadow='4px 4px 6px black' zIndex='1' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${movieinfo.poster}`} loading='lazy'/>
                    <Link style={{width:'90%',overflow:'visible'}} href={`/booking?id=${id}`}>
                        <Button transition="all 0.3s" _hover={{bg:"#6B46C1"}} w='100%' boxShadow='4px 4px 6px black' mt='20px'>예매</Button>
                    </Link>
                    <Flex w='90%' h='50px' justifyContent='space-around' overflow='visible' gap='30px'>
                        <Likepart id={id} res={res} movieinfo={movieinfo} isMobile={true}/>
                    </Flex>
                </Flex>
                <VStack my={{base:'0px',md:'50px'}}>
                    <Box w={{base:'100%',md:'1200px'}} px={{base:'0px',md:'30px'}} m={{base:'0px',md:'40px'}} borderRadius='10px' bg='white'>
                        <Flex w={{base:'100%',md:'1140px'}} flexDirection='column' gap='30px' px={{base:'0px',md:'50px'}} pt='40px' pb={{base:'0px',md:'80px'}}>
                            <Flex display={{base:'none',md:'flex'}}>
                                <iframe width="100%" height="500px" src={`${movieinfo.trailer}?autoplay=1&mute=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </Flex>
                            <Flex display={{base:'flex',md:'none'}}>
                                <iframe style={{margin:'auto'}} width="90%" height="180.288px" src={`${movieinfo.trailer}?autoplay=1&mute=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </Flex>
                            <Flex display={{base:'none',md:'flex'}}>
                                <span style={{lineHeight:'40px'}}>
                                    {movieinfo.title}<br/><br/>
                                    {movieinfo.description}<br/><br/><br/><br/>
                                </span>
                            </Flex>
                            <Flex display={{base:'flex',md:'none'}}>
                                <span style={{lineHeight:'40px',paddingLeft:'20px',paddingRight:'20px'}}>
                                    {movieinfo.title}<br/><br/>
                                    {movieinfo.description}<br/><br/><br/><br/>
                                </span>
                            </Flex>
                            <Flex w='100%' px={{base:'20px',md:'0px'}}>
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
                <Bottombox res={res} movieinfo={movieinfo} reviewinfo={reviewinfo}></Bottombox>
            </Box>
        </>;
}