'use client';

import React,{useEffect,useState} from 'react';
import {Button,Flex,Box,Input,Text} from '@chakra-ui/react';
import {useRouter} from 'next/navigation';
import Link from "next/link";

import {Header} from '..';
import MovieCard from '../movie/moviecard';
import Event from '../element/event';

export default function Searchdetail({userData,movieData,serverEvents,keywordData}){
    const router = useRouter();
    const [movies, setMovies] = useState(movieData);
    const [searchWord, setSearchWord] = useState(keywordData);
    const [displayNumber, setDisplayNumber] = useState(8);/* 검색된 영화 더보기 버튼 */
    const [displayNumber2, setDisplayNumber2] = useState(8);/* 검색된 이벤트 더보기 버튼 */
    const [events] = useState(serverEvents || {});

    const handleSearch = () => {
        router.push(`/search/${document.querySelector('#keyword').value}`);
    }    
    
    // 검색어 포함 유무로 분류
    const searchedMovies = searchWord === "" ? movies:
    movies.filter((movie) => {
        return movie.title.toLowerCase().includes(searchWord.toLowerCase()) || movie.titleEnglish.toLowerCase().includes(searchWord.toLowerCase());
    });
    
    // 영화 더보기 버튼
    const MoreButton = () => {
        if(displayNumber < searchedMovies.length)
            return (<Box pt={10} >
                        <Button
                            w='100%' bg="#1e1e1e" border="1px solid gray" 
                            _hover={{borderColor : "white"}}
                            onClick={()=>{setDisplayNumber(displayNumber+8)}}
                        >더보기</Button>
                    </Box>)
    };

    useEffect(()=>{
        setDisplayNumber(8);
        setDisplayNumber2(8);
    },[searchWord]);

    {/* 영화카드들 */}
    const MovieCards = () => {
        if(searchWord != "" && searchedMovies.length < 1)
            return <Box w='100%' h='50vh' bg='#1e1e1e' fontSize='4xl' color='white'
                    display='flex' alignItems='center' justifyContent='center'>
                    검색 결과가 없습니다
                    </Box>
        else return (<Box className="movie-grid">
                        {searchedMovies.map((movie,index) => {
                            if(index < displayNumber)
                                return (<MovieCard 
                                            key={movie.id}
                                            movie={movie}
                                        />)
                        })}
                    </Box>)
    }

    const categoryOrder = ["Pick", "영화", "극장", "제휴/할인", "시사회/무대인사"];
    const arrangedEvents=categoryOrder.filter((cat) => events[cat]).map((cat) => [cat, events[cat]]);/* 전체 이벤트를 포함하는 변수 생성 */

    const searchedEvents = searchWord === "" ? arrangedEvents:arrangedEvents/* 검색 키워드를 포함하는 이벤트 추려내기 */
        .map(([category, items]) => [
          category,
          items.filter((e) =>
            e.title.toLowerCase().includes(searchWord.toLowerCase())
          ),
        ])
        .filter(([_, items]) => items.length > 0);

    // 이벤트 더보기 버튼
    const MoreButton2 = () => {
        if(displayNumber2 < searchedEvents.flat().filter((_,index)=>index%2=== 1).flat().length)
            return (<Box pt={10} >
                        <Button
                            w='100%' bg="#1e1e1e" border="1px solid gray" 
                            _hover={{borderColor : "white"}}
                            onClick={()=>{setDisplayNumber2(displayNumber2+8)}}
                        >더보기</Button>
                    </Box>)
    };        

    const EventCards = () => {/* 이벤트 카드들 */
        if(searchWord != "" && searchedEvents.length < 1)
            return <Box w='100%' h='50vh' bg='#1e1e1e' fontSize='4xl' color='white'
                    display='flex' alignItems='center' justifyContent='center'>
                    검색 결과가 없습니다
                    </Box>
        else return (<Box className="movie-grid" overflow='visible'>
                    {searchedEvents.flat().filter((_,index)=>index%2=== 1).flat().map((items,index) =>{
                        if(index<displayNumber2)
                            return <Box overflow='visible' key={items.id}>
                                    <Event content={items.title} src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${items.image}`} url={`/event/view/${items.id}`}></Event>
                                </Box>;
                    })}
                </Box>)
    }    

    return <>
        <Header userInfo={userData}></Header>
        <div className="bg-[#141414]">
            <Box bg="#141414" pt={20} pb={10} px={6} maxW="1280px" mx="auto" style={{ overflow: 'hidden' }}>
                <Box pb={6}>
                    <Flex gap={2} justify={'space-between'} >
                        <Box transform="translate(-23px, 0)">
                            <Input
                                id='keyword'
                                placeholder="키워드 입력"
                                w="320px" p="10px" bg="#1e1e1e"
                                border="1px solid gray"
                                fontSize="15px" color="white"
                                _hover={{borderColor : "white"}}
                                ml='25px'
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
                            >
                            검색
                            </Button>
                            <Button
                                marginLeft={4} px={6} bg="#1e1e1e"
                                border="1px solid gray" 
                                _hover={{borderColor : "white"}}
                                transform="translate(0, 1px)"
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
                borderLeft="4px solid #6B46C1"
                color='white'
                >
                    리뷰 검색결과
                </Text>
            </Box>
        </div>
        </>;
}