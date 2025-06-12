"use client"

import React,{useEffect,useState, useMemo, useRef} from 'react';
import {Button, Flex, HStack, Grid, Box, Input} from '@chakra-ui/react';
import { useMediaQuery } from '@chakra-ui/react';

import MovieCard from '../../components/movie/moviecard';
import {fetch} from '../../lib/client';

const categories = ['전체영화', '개봉작', '상영예정작'];


const Movie = (userInfo) => {
    
    const [isMobile] = useMediaQuery('(max-width: 768px)')
    const [activeCategory, setActiveCategory] = useState('전체영화');
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(userInfo.userInfo);
    const [searchWord, setSearchWord] = useState("");
    const [displayNumber, setDisplayNumber] = useState(8);
    const inputRef = useRef("");
    const clearInputValue = () => {
        if(inputRef.current) {
            inputRef.current.value = '';
        }
    };
    const getInputValue = () => {
        if (inputRef.current) {
            return inputRef.current.value;
        }
        return '';
    };

    useEffect(() => {
        document.title = '영화 - FILMORA';

        // Movie Fetch
        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`);
                setMovies(Object.values(res));
            } catch (err) {
                console.log("MOVIE FETCH ERROR! : " + err.message);
            }
        })();
    }, []);

    const handleSearch = (inputValue) => {
        if(inputValue.replace(/\s+/g, '')===''){
            alert('유효한 검색어를 입력해주세요!');
            return;
        }
        setSearchWord(inputValue);
    }
    
   const filteredMovies = useMemo(() => {
    const filtered = activeCategory === '전체영화' ? movies : 
      movies.filter((movie) => {
        let rd = new Date(movie.releaseDate);
        let nd = new Date();
        return ((activeCategory === '개봉작') === (rd <= nd)) && !isNaN(rd);
      });
    
    const searched = searchWord === "" ? filtered :
      filtered.filter((movie) => 
        movie.title.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) || 
        movie.titleEnglish.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
        movie.description.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
        movie.genre.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
        movie.director.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase()) ||
        movie.cast.replace(/\s+/g, '').toLowerCase().includes(searchWord.replace(/\s+/g, '').toLowerCase())
      );
    
    return searched.sort((a,b) => b.reserveRate - a.reserveRate);
  }, [movies, activeCategory, searchWord]);
    
    // 카테고리 부분
    const CategoryPart = ({isMobile}) => {
        return <HStack w={isMobile ? "80%" : "30%"} minW="338.51px" gap={0} overflow="visible">
            {categories.map((category) => (
                <Button
                    key={category}
                    w={Math.floor(100 * category.length / 12) + "%"}
                    variant="ghost"
                    borderBottom={activeCategory === category ? '2px solid white' : '1px solid transparent'}
                    borderRadius="0"
                    fontSize={'2xl'}
                    color={activeCategory === category ? 'white' : 'gray.500'}
                    onClick={() => {setActiveCategory(category); setSearchWord(""); clearInputValue();}}
                    _hover={{ bg: 'transparent', color: 'white' }}
                >
                    {category}
                </Button>
            ))}
        </HStack>
    }

    // 검색 부분
    const SearchPart = ({isMobile}) => {
        return <HStack w={isMobile ? "80%" : "40%"} minWidth="282px" gap="16px" 
                       overflow="visible">
            <Input
                placeholder="영화명 검색"
                w="80%" minW="150px" p="10px" bg="#1e1e1e"
                border="1px solid gray"
                fontSize="15px" color="white"
                _hover={{borderColor : "white"}}
                ref={inputRef}
                onKeyDown={(e) => {
                    if(e.key === 'Enter') handleSearch(getInputValue());
                }}
            />
            <Button
                w="10%" px={6} bg="#1e1e1e"
                border="1px solid gray" 
                _hover={{borderColor : "white"}}
                onClick={()=>{handleSearch(getInputValue())}}
            >
                검색
            </Button>

            <Button
                w="10%" px={6} bg="#1e1e1e"
                border="1px solid gray" 
                _hover={{borderColor : "white"}}
                onClick={()=>setSearchWord('')}
            >
            전체
            </Button>
        </HStack>
    }

    // 더보기 버튼
    const MoreButton = () => {
        if(displayNumber < filteredMovies.length)
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
    },[activeCategory,searchWord]);
    
    // 영화카드들
    const MovieCards = ({isMobile}) => {
        if(searchWord != "" && filteredMovies.length < 1)
            return <Box w='100%' h='50vh' bg='#141414' fontSize='4xl' color='white'
                        display='flex' alignItems='center' justifyContent='center'>
                    검색 결과가 없습니다
                    </Box>
        else return (   <Grid 
                            w='100%' 
                            justifyContent={isMobile ? "center" : "start"}
                            templateColumns="repeat(auto-fit, minmax(280px, auto))"
                            gap="30px"
                            overflow="visible"
                        >
                            {filteredMovies.map((movie, index) => {
                                if(index < displayNumber)
                                    return (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            user={user}
                                            crit={"예매"}
                                            rank={index+1}
                                        />
                                    )
                            })}
                        </Grid>)
    }
    
    return !isMobile ? <>(
    <Flex bg="#141414" pt={20} pb={10} px={6} maxW="1280px" mx="auto"
            flexDirection="column">
        {/* 카테고리 분류 */}
        <Flex flexWrap="wrap" justify={'space-between'} pb={6}>
            <CategoryPart isMobile = {isMobile}/>
            <SearchPart isMobile = {isMobile}/>
        </Flex>
        <MovieCards isMobile = {isMobile}/>
        <MoreButton/>
    </Flex>
                    
    );</> : <>(
        <Flex bg="#141414" pt={20} pb={10} px={6} maxW="1280px" mx="auto"
            flexDirection="column">
        {/* 카테고리 분류 */}
        <Flex flexDirection={'column'} align={'center'} gap={6} pb={6}>
            <SearchPart isMobile = {isMobile}/>
            <CategoryPart isMobile = {isMobile}/>
        </Flex>
        <MovieCards isMobile = {isMobile}/>
        <MoreButton/>
        </Flex>
    )</>
}

export default Movie;