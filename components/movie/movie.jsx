"use client"

import React,{useEffect,useState, useMemo} from 'react';
import {Button, Flex, Box, Input} from '@chakra-ui/react';

import MovieCard from '../../components/movie/moviecard';
import {fetch} from '../../lib/client';

const categories = ['전체영화', '개봉작', '상영예정작'];


const Movie = (userInfo) => {

    const [activeCategory, setActiveCategory] = useState('전체영화');
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(userInfo.userInfo);
    const [searchWord, setSearchWord] = useState("");
    const [displayNumber, setDisplayNumber] = useState(8);

    useEffect(() => {
        document.title = '전체 영화 - 필모라';

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
        if(inputValue != searchWord) 
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
        movie.title.includes(searchWord) || 
        movie.titleEnglish.toLowerCase().includes(searchWord.toLowerCase())
      );
    
    return searched.sort((a,b) => b.reserveRate - a.reserveRate);
  }, [movies, activeCategory, searchWord]);
    
    
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
    const MovieCards = () => {
        if(searchWord != "" && filteredMovies.length < 1)
            return <Box w='100%' h='50vh' bg='#1e1e1e' fontSize='4xl' color='white'
                        display='flex' alignItems='center' justifyContent='center'>
                    검색 결과가 없습니다
                    </Box>
        else return (<Box className="movie-grid">
                        {filteredMovies.map((movie,index) => {
                            if(index < displayNumber)
                                return (<MovieCard 
                                            key={movie.id}
                                            movie={movie}
                                            user={user}
                                            crit={"예매"}
                                            rank={index+1}
                                        />)
                        })}
                    </Box>)
    }
    
    return <>(
    <Box bg="#141414" pt={20} pb={10} px={6} maxW="1280px" mx="auto">
        {/* 카테고리 분류 */}
        <Box pb={6}>
            <Flex gap={2} justify={'space-between'} >
                <Box>
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant="ghost"
                            borderBottom={activeCategory === category ? '2px solid white' : '1px solid transparent'}
                            borderRadius="0"
                            fontSize={'2xl'}
                            fontWeight={'normal'}
                            color={activeCategory === category ? 'white' : 'gray.500'}
                            onClick={() => {setActiveCategory(category);}}
                            _hover={{ bg: 'transparent', color: 'white' }}
                        >
                            {category}
                        </Button>
                    ))}
                </Box>
                <Box transform="translate(-23px, 0)">
                    <Input
                        placeholder="영화명 검색"
                        w="320px" p="10px" bg="#1e1e1e"
                        border="1px solid gray"
                        fontSize="15px" color="white"
                        _hover={{borderColor : "white"}}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') handleSearch(e.target.value);
                        }}
                    />
                    <Button
                        marginLeft={4} px={6} bg="#1e1e1e"
                        border="1px solid gray" 
                        _hover={{borderColor : "white"}}
                        onClick={(e)=>{handleSearch(e.target.previousSibling.value)}}
                        transform="translate(0, 1px)"
                    >
                        검색
                    </Button>
                </Box>
            </Flex>
        </Box>
        <MovieCards/>
        <MoreButton/>
    </Box>
                    
    );</>
}

export default Movie;