'use client';

import React,{useEffect,useState} from 'react';
import {Button,Flex,Box,Input,Text} from '@chakra-ui/react';
import Link from "next/link";

import {Header} from '..';
import MovieCard from '../movie/moviecard';

export default function Searchdetail({userData,movieData,serverEvents,keywordData}){
    const [movies, setMovies] = useState(movieData);
    const [inputValue, setInputValue] = useState(keywordData);
    const [searchWord, setSearchWord] = useState(keywordData);
    const [displayNumber, setDisplayNumber] = useState(8);
    const [events] = useState(serverEvents || {});

    const handleSearch = () => {
        if(inputValue != searchWord) 
            setSearchWord(inputValue);
    }    
    
    // 검색어 포함 유무로 분류
    const searchedMovies = searchWord === "" ? movies:
    movies.filter((movie) => {
        return movie.title.includes(searchWord);
    });
    
    // 더보기 버튼
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

    // const EventCards = () => {
    //     if(searchWord != "" && searchedMovies.length < 1)
    //         return <Box w='100%' h='50vh' bg='#1e1e1e' fontSize='4xl' color='white'
    //                 display='flex' alignItems='center' justifyContent='center'>
    //                 검색 결과가 없습니다
    //                 </Box>
    //     else return (<Box className="movie-grid">
    //                     {searchedMovies.map((movie,index) => {
    //                         if(index < displayNumber)
    //                             return (<MovieCard 
    //                                         key={movie.id}
    //                                         movie={movie}
    //                                     />)
    //                     })}
    //                 </Box>)
    // }

    

    return <>
        <Header userInfo={userData}></Header>
        <div className="bg-[#141414]">
            <Box bg="#141414" pt={20} pb={10} px={6} maxW="1280px" mx="auto">
                <Box pb={6}>
                    <Flex gap={2} justify={'space-between'} >
                        <Box transform="translate(-23px, 0)">
                            <Input
                                placeholder="영화명 검색"
                                w="320px" p="10px" bg="#1e1e1e"
                                border="1px solid gray"
                                fontSize="15px" color="white"
                                _hover={{borderColor : "white"}}
                                value={inputValue}
                                ml='25px'
                                onChange={(e) => setInputValue(e.target.value)}
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
                borderLeft="4px solid #6B46C1"
                color='white'
                >
                    이벤트 검색결과
                </Text>
            </Box>
        </div>
        </>;
}