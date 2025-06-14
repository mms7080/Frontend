'use client';

import React,{useEffect,useState} from 'react';
import {VStack,Button,Flex,Grid,Box,Input,Text,useMediaQuery} from '@chakra-ui/react';
import {useRouter} from 'next/navigation';
import Link from "next/link";

import {Header} from '..';
import MovieCard from '../movie/moviecard';
import Event from '../element/event';
import Detailreview from '../element/detailreview';

export default function Searchdetail({userData,movieData,serverEvents,reviewInfo,keywordData}){
    const router = useRouter();
    const [movies, setMovies] = useState(movieData);
    const [searchWord, setSearchWord] = useState(keywordData);
    const [displayNumber, setDisplayNumber] = useState(8);/* 검색된 영화 더보기 버튼 */
    const [displayNumber2, setDisplayNumber2] = useState(8);/* 검색된 이벤트 더보기 버튼 */
    const [displayNumber3, setDisplayNumber3] = useState(5);/* 검색된 리뷰 더보기 버튼 */
    const [events] = useState(serverEvents || {});
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    const handleSearch = () => {
        if(document.querySelector('#keyword').value.replace(/\s+/g, '')===''){
            alert('유효한 검색어를 입력해주세요!');
            return;
        }
        router.push(`/search/${document.querySelector('#keyword').value}`);
    }    
    
    // 검색어 포함 유무로 분류
    const searchedMovies = searchWord === "" ? movies:
    movies.filter((movie) => {
        return (
          movie.title.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
          movie.titleEnglish.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
          movie.description.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
          movie.genre.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
          movie.director.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
          movie.cast.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase())
        );
    });
    
    // 영화 더보기 버튼
    const MoreButton = () => {
        if(displayNumber < searchedMovies.length)
            return (<VStack pt={10} >
                        <Button
                            w={!isMobile?'100%':'95%'} bg="#1e1e1e" border="1px solid gray" 
                            _hover={{borderColor : "white"}}
                            onClick={()=>{setDisplayNumber(displayNumber+8)}}
                        >영화 더보기</Button>
                    </VStack>);
    };

    useEffect(()=>{
        setDisplayNumber(8);
        setDisplayNumber2(8);
        setDisplayNumber3(5);
    },[searchWord]);

    {/* 영화카드들 */}
    const MovieCards = () => {
        if(searchWord != "" && searchedMovies.length < 1)
            return <Box w='100%' h='50vh' bg='#141414' fontSize='4xl' color='white'
                    display='flex' alignItems='center' justifyContent='center' pb='50px'>
                    검색 결과가 없습니다
                    </Box>;
        else return (<Grid templateColumns={!isMobile?"repeat(4, 1fr)":"1fr"} gap={!isMobile?'4px':'25px'} placeItems={isMobile ? "center" : "stretch"}>
                        {searchedMovies.map((movie,index) => {
                            if(index < displayNumber)
                                return (<MovieCard 
                                            user={userData}
                                            key={movie.id}
                                            movie={movie}
                                        />)
                        })}
                    </Grid>);
    }

    const categoryOrder = ["Pick", "영화", "극장", "제휴/할인", "시사회/무대인사"];
    const arrangedEvents=categoryOrder.filter((cat) => events[cat]).map((cat) => [cat, events[cat]]);/* 전체 이벤트를 포함하는 변수 생성 */

    const searchedEvents = searchWord === "" ? arrangedEvents:arrangedEvents/* 검색 키워드를 포함하는 이벤트 추려내기 */
        .map(([category, items]) => [
          category,
          items.filter((e) =>
            [e.title, e.date, e.category].some((v) =>
              v?.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase())
            )
          ),
        ])
        .filter(([_, items]) => items.length > 0);

    // 이벤트 더보기 버튼
    const MoreButton2 = () => {
        if(displayNumber2 < searchedEvents.flat().filter((_,index)=>index%2=== 1).flat().length)
            return (<VStack pt={10} >
                        <Button
                            w={!isMobile?'100%':'95%'} bg="#1e1e1e" border="1px solid gray" 
                            _hover={{borderColor : "white"}}
                            onClick={()=>{setDisplayNumber2(displayNumber2+8)}}
                        >이벤트 더보기</Button>
                    </VStack>);
    };        

    const EventCards = () => {/* 이벤트 카드들 */
        if(searchWord != "" && searchedEvents.length < 1)
            return <Box w='100%' h='50vh' bg='#141414' fontSize='4xl' color='white'
                    display='flex' alignItems='center' justifyContent='center' pb='50px'>
                    검색 결과가 없습니다
                    </Box>;
        else return (<Grid templateColumns={!isMobile?"repeat(4, 1fr)":"1fr"} gap={!isMobile?'4px':'25px'}  placeItems={isMobile ? "center" : "stretch"} overflow='visible'>
                    {searchedEvents.flat().filter((_,index)=>index%2=== 1).flat().map((items,index) =>{
                        if(index<displayNumber2)
                            return <Box overflow='visible' key={items.id} scroll={true} passHref>
                                    <Event content={items.title} src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${items.image}`} url={`/event/view/${items.id}`}></Event>
                                </Box>;
                    })}
                </Grid>);
    }

    const searchedReviews = searchWord === "" ? reviewInfo:reviewInfo/* 검색 키워드를 포함하는 리뷰 추려내기 */
        .filter((review,index)=>{
            let result=review.content.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase());
            let movie;
            for(let i=0;i<movies.length;i++){
                if(movies[i].id===review.movieid)
                {
                    movie=movies[i];
                    break;
                }
            }
            return result || movie.title.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
                movie.titleEnglish.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
                movie.description.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
                movie.genre.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
                movie.director.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
                movie.cast.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase());
        });

    // 리뷰 더보기 버튼
    const MoreButton3 = () => {
        if(displayNumber3 < searchedReviews.length)
            return (<VStack pt={10} >
                        <Button
                            w={!isMobile?'100%':'95%'} bg="#1e1e1e" border="1px solid gray" 
                            _hover={{borderColor : "white"}}
                            onClick={()=>{setDisplayNumber3(displayNumber3+5)}}
                        >리뷰 더보기</Button>
                    </VStack>);
    };        

    const ReviewCards = () => {/* 리뷰 카드들 */
        if(searchWord != "" && searchedReviews.length < 1)
            return <Box w='100%' h='50vh' bg='#141414' fontSize='4xl' color='white'
                    display='flex' alignItems='center' justifyContent='center' pb='50px'>
                    검색 결과가 없습니다
                    </Box>;
        else return (<Flex w='100%' direction='column' gap='30px' overflow='visible'>
            {searchedReviews.map((review,index)=>{
                    if(index<displayNumber3){
                        let movieinfo;
                        for(let i=0;i<movies.length;i++){
                            if(movies[i].id===review.movieid)
                            {
                                movieinfo=movies[i];
                                break;
                            }
                        }
                        return <Link href={`/detail/${review.movieid}`} scroll={true} passHref style={{width:'100%',overflow:'visible'}} key={index}><Detailreview 
                        id={review.id} author={review.author} score={review.score} content={review.content}
                        likenum={review.likenumber} likeusers={review.likeusers}
                        movieInfo={movieinfo} isHome={true} authorColor='white' bgColor='gray.400' contentColor='black'
                        titleColor='black.300' likeColor='black.100' isMobile={isMobile}
                        ></Detailreview></Link>;
                    }
                }
            )}
        </Flex>);

    }

    return <>
        <Header userInfo={userData}></Header>
        <div style={{width:'100%'}} className="bg-[#141414]">
            <Box w={!isMobile?'70%':'100%'} bg="#141414" pt={20} pb={10} px={!isMobile?'6px':0} mx="auto">
                <Box pb={6}>
                    <Flex gap={2} justify={'space-between'}>
                        <Box transform="translate(-23px, 0)">
                            <Input
                                id='keyword'
                                placeholder="키워드 입력"
                                w={!isMobile?"320px":'100px'} p="10px" bg="#1e1e1e"
                                border="1px solid gray"
                                fontSize="15px" color="white"
                                _hover={{borderColor : "white"}}
                                ml={!isMobile?'25px':'35px'}
                                defaultValue={keywordData}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') handleSearch();
                                }}
                            />
                            <Button
                                marginLeft={4} px={6} bg="#1e1e1e"
                                border="1px solid gray" 
                                _hover={{borderColor : "white"}}
                                onClick={handleSearch}
                                transform="translate(0, 1px)"
                                w={!isMobile?'72.55px':'30px'}
                            >
                            검색
                            </Button>
                            <Button
                                marginLeft={4} px={6} bg="#1e1e1e"
                                border="1px solid gray" 
                                _hover={{borderColor : "white"}}
                                onClick={()=>setSearchWord('')}
                                transform="translate(0, 1px)"
                                w={!isMobile?'95.78px':'70px'}
                            >
                            전체보기
                            </Button>
                            <Button
                                marginLeft={4} px={0} bg="#1e1e1e"
                                border="1px solid gray" 
                                _hover={{borderColor : "white"}}
                                transform="translate(0, 1px)"
                                w={!isMobile?'83.28px':'55px'}
                            >
                                <Link href='/home'>
                                    홈으로
                                </Link>
                            </Button>
                        </Box>
                    </Flex>

                    <Text
                    fontSize="xl"
                    pl='10px'
                    py='10px'
                    mt='30px'
                    ml={isMobile?'10px':'0px'}
                    borderLeft="4px solid #6B46C1"
                    color='white'
                    >
                        영화 검색결과
                    </Text>
                </Box>
                <MovieCards/>
                <MoreButton/>
                <Text
                fontSize="xl"
                pl='10px'
                py='10px'
                mt='30px'
                mb='30px'
                ml={isMobile?'10px':'0px'}
                borderLeft="4px solid #6B46C1"
                color='white'
                >
                    이벤트 검색결과
                </Text>
                <EventCards/>
                <MoreButton2/>

                <Text
                fontSize="xl"
                pl='10px'
                py='10px'
                mt='30px'
                mb='30px'
                ml={isMobile?'10px':'0px'}
                borderLeft="4px solid #6B46C1"
                color='white'
                >
                    리뷰 검색결과
                </Text>

                <ReviewCards/>
                <MoreButton3/>
            </Box>
        </div>
        </>;
}