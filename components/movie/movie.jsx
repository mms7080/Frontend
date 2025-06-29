"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from 'next/link';
import {
  Button,
  Flex,
  HStack,
  Grid,
  Box,
  Input,
  useMediaQuery,
} from "@chakra-ui/react";

import MovieCard from "./moviecard";
import { fetch } from "../../lib/client";
import Modal, { useModal } from '../../components/movie/modal';
import Spinner from '../Spinner';

const categories = ["전체영화", "개봉작", "상영예정작"];

const Movie = (userInfo) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [activeCategory, setActiveCategory] = useState("전체영화");
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(userInfo?.userInfo);
  const [searchWord, setSearchWord] = useState("");
  const [displayNumber, setDisplayNumber] = useState(8);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();

  const [sortedMovieIds, setSortedMovieIds] = useState([]);
  const [loadedMoviesData, setLoadedMoviesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const syncUserData = async () => {
      if (userInfo?.userInfo) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
            method: 'GET',
            credentials: 'include'
          });
            const updatedUser = res;
            setUser(updatedUser);
        } catch (err) {
          console.log('Error syncing user data:', err.message);
        }
      }
    };
    syncUserData();

    const handlePageShow = (event) => {
      if (event.persisted) {
        syncUserData();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [userInfo?.userInfo]);

  const clearInputValue = () => {
    setSearchWord("");
  };

  useEffect(() => {
    document.title = "영화 - FILMORA";

    // Movie Fetch
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie`
        );
        setMovies(Object.values(res));
      } catch (err) {
        console.log("MOVIE FETCH ERROR! : " + err.message);
      }
    })();
  }, []);

  const filteredMovies = useMemo(() => {
    const filtered =
      activeCategory === "전체영화"
        ? movies
        : movies.filter((movie) => {
          let rd = new Date(movie.releaseDate);
          let nd = new Date();
          return (activeCategory === "개봉작") === rd <= nd && !isNaN(rd);
        });

    const searched =
      searchWord === ""
        ? filtered
        : filtered.filter(
          (movie) =>
            movie.title
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(searchWord.replace(/\s+/g, "").toLowerCase()) ||
            movie.titleEnglish
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(searchWord.replace(/\s+/g, "").toLowerCase()) ||
            movie.description
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(searchWord.replace(/\s+/g, "").toLowerCase()) ||
            movie.genre
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(searchWord.replace(/\s+/g, "").toLowerCase()) ||
            movie.director
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(searchWord.replace(/\s+/g, "").toLowerCase()) ||
            movie.cast
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(searchWord.replace(/\s+/g, "").toLowerCase())
        );

    return searched;
  }, [movies, activeCategory, searchWord]);

  // 모든 영화의 예매율을 가져와서 정렬
  const sortAllMoviesByReserveRate = async (movieList) => {
  const promises = movieList.map(async (movie) => {
    try {
      const reserveRate = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/reserveRate/${movie.id}`);
      return {
        id: movie.id,
        reserveRate: parseFloat(reserveRate) || 0
      };
    } catch (err) {
      console.log(`Reserve rate fetch error for ${movie.id}:`, err.message);
      return {
        id: movie.id,
        reserveRate: 0
      };
    }
  });

  const movieReserveRates = await Promise.all(promises);
  // 예매율 순으로 정렬하고 ID만 반환
  return movieReserveRates
    .sort((a, b) => b.reserveRate - a.reserveRate)
    .map(item => item.id);
  };

// 개별 영화 상세 데이터 로드
const loadMovieDetails = async (movieIds) => {
  const promises = movieIds.map(async (movieId) => {
    const movie = filteredMovies.find(m => m.id === movieId);
    if (!movie) return null;

    try {
      // 리뷰 점수 가져오기
      const reviewData = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/${movie.id}`);
      let score = "N/A";
        if (reviewData.length > 0) {
          let sum = 0;
          for (let review of reviewData) sum += review.score;
          score = (sum / reviewData.length).toFixed(1);
        } else {
          score = "없음";
        }

      // 예매율 가져오기
      const reserveRate = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/reserveRate/${movie.id}`);

      return {
        ...movie,
        realScore: score,
        realReserveRate: reserveRate
      };
    } catch (err) {
      console.log(`Movie details load error for ${movie.id}:`, err.message);
      return {
        ...movie,
        realScore: "N/A",
        realReserveRate: "N/A"
      };
    }
  });

  return Promise.all(promises);
};

// filteredMovies가 변경될 때 전체 정렬 후 초기 8개 로드
useEffect(() => {
  const initializeMovies = async () => {
    if (filteredMovies.length > 0) {
      setIsLoading(true);
      
      // 1. 모든 영화를 예매율 순으로 정렬
      const sortedIds = await sortAllMoviesByReserveRate(filteredMovies);
      setSortedMovieIds(sortedIds);
      
      // 2. 처음 8개 영화의 상세 데이터 로드
      const initialIds = sortedIds.slice(0, 8);
      const initialMoviesData = await loadMovieDetails(initialIds);
      
      // 3. 로드된 데이터를 객체로 저장 (ID를 키로 사용)
      const dataMap = {};
      initialMoviesData.forEach(movieData => {
        if (movieData) {
          dataMap[movieData.id] = movieData;
        }
      });
      
      setLoadedMoviesData(dataMap);
      setIsLoading(false);
    } else {
      setSortedMovieIds([]);
      setLoadedMoviesData({});
    }
  };

  initializeMovies();
  setDisplayNumber(8);
}, [filteredMovies]);

  // 카테고리 부분
  const CategoryPart = ({ isMobile }) => {
    return (
      <HStack
        w={isMobile ? "80%" : "30%"}
        minW="338.51px"
        gap={0}
        overflow="visible"
      >
        {categories.map((category) => (
          <Button
            key={category}
            w={Math.floor((100 * category.length) / 12) + "%"}
            variant="ghost"
            borderBottom={
              activeCategory === category
                ? "2px solid white"
                : "1px solid transparent"
            }
            borderRadius="0"
            fontSize={"2xl"}
            color={activeCategory === category ? "white" : "gray.500"}
            onClick={() => {
              setActiveCategory(category);
              setSearchWord("");
              clearInputValue();
            }}
            _hover={{ bg: "transparent", color: "white" }}
          >
            {category}
          </Button>
        ))}
      </HStack>
    );
  };

  // 더보기 누를 시 이동 안하도록
  const scrollRef = useRef(0);

// 더보기 버튼 수정
const MoreButton = () => {
  if (displayNumber < sortedMovieIds.length)
    return (
      <Box pt={10}>
        <Button
          w="100%"
          bg="#1e1e1e"
          border="1px solid gray"
          _hover={{ borderColor: "white" }}
          disabled={isLoading}
          onClick={async () => {
            scrollRef.current = window.scrollY;
            setIsLoading(true);
            
            // 다음 8개 영화 ID 가져오기
            const nextIds = sortedMovieIds.slice(displayNumber, displayNumber + 8);
            // 아직 로드되지 않은 영화들만 필터링
            const unloadedIds = nextIds.filter(id => !loadedMoviesData[id]);
            
            if (unloadedIds.length > 0) {
              const newMoviesData = await loadMovieDetails(unloadedIds);
              const newDataMap = {};
              newMoviesData.forEach(movieData => {
                if (movieData) {
                  newDataMap[movieData.id] = movieData;
                }
              });
              
              setLoadedMoviesData(prev => ({ ...prev, ...newDataMap }));
            }
            
            setDisplayNumber(prev => prev + 8);
            setIsLoading(false);
          }}
        >
          더보기
        </Button>
      </Box>
    );
};

  // 렌더 후 위치 복원
  useEffect(() => {
    if (displayNumber > 8) {
      setTimeout(() => {
        window.scrollTo({ top: scrollRef.current, behavior: "auto" });
      }, 0);
    }
  }, [displayNumber]);

  useEffect(() => {
    setDisplayNumber(8);
  }, [activeCategory, searchWord]);

const MovieCards = ({ isMobile }) => {
  if (searchWord != "" && filteredMovies.length < 1)
    return (
      <Box
        w="100%"
        h="50vh"
        bg="#141414"
        fontSize={{base:"18px",md:"4xl"}}
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        검색 결과가 없습니다
      </Box>
    );
  else
    return (
      <Grid
        w="100%"
        bg="#141414"
        justifyContent={isMobile ? "center" : "start"}
        templateColumns="repeat(auto-fit, minmax(280px, auto))"
        gap="30px"
        overflow="visible"
      >
        {sortedMovieIds.slice(0, displayNumber).map((movieId, index) => {
          const movieData = loadedMoviesData[movieId];
          if (movieData) {
            return (
              <MovieCard
                key={movieId}
                movie={movieData}
                user={user}
                crit={"예매"}
                rank={index + 1}
                preloadedData={{
                  score: movieData.realScore,
                  reserveRate: movieData.realReserveRate
                }}
                setMovies={setMovies}
              />
            );
          }
          return null;
        })}
      </Grid>
    );
  };

  // 업로드 버튼
  const UploadButton = () => {
    return <Flex justify="flex-end" pb={3}><Link href={`/movie/upload`}>
          <Button
            bg="#1e1e1e" border="1px solid gray" _hover={{ borderColor: "white" }}
          >영화 등록</Button>
    </Link></Flex>
  }

  const LoadingSpinner = () => {
    return <Box
      position="fixed" inset="0" zIndex="9999" 
      display="flex" alignItems="center" justifyContent="center"
      bg="blackAlpha.500"
    >
      <Spinner/>
    </Box>
  }

  return <>
    {!isMobile ? <>
      <Flex
        bg="#141414" minH="100vh"
        pt={20} pb={10} px={6}
        maxW="1280px" mx="auto"
        flexDirection="column"
      >
        {user?.auth === "ADMIN" && <UploadButton/>}
        {/* 카테고리 분류 */}
        <Flex flexWrap="wrap" justify={"space-between"} pb={6}>
          <CategoryPart isMobile={isMobile} />
          <>
      <HStack
        w={isMobile ? "80%" : "40%"}
        minWidth="282px"
        gap="16px"
        overflow="visible"
      >
        <Input
          id="keyword1"
          placeholder="영화명 검색"
          w="80%"
          minW="150px"
          p="10px"
          bg="#1e1e1e"
          border="1px solid gray"
          fontSize="15px"
          color="white"
          _hover={{ borderColor: "white" }}
          onKeyDown={(e) => {
            if (e.key === "Enter"){
              if (e.target.value.replace(/\s+/g, "") === "") {
                openModal("유효한 검색어를 입력해주세요!");
                return;
              }
              setSearchWord(e.target.value);
            }
          }}
        />
        <Button
          w="10%"
          px={6}
          bg="#1e1e1e"
          border="1px solid gray"
          _hover={{ borderColor: "white" }}
          onClick={() => {
            if (document.querySelector('#keyword1').value.replace(/\s+/g, "") === "") {
              openModal("유효한 검색어를 입력해주세요!");
              return;
            }
            setSearchWord(document.querySelector('#keyword1').value);
          }}
        >
          검색
        </Button>

        <Button
          w="10%"
          px={6}
          bg="#1e1e1e"
          border="1px solid gray"
          _hover={{ borderColor: "white" }}
          onClick={() => setSearchWord("")}
        >
          전체
        </Button>
      </HStack>
    </>
        </Flex>
        <MovieCards isMobile={isMobile} />
        <MoreButton />
      </Flex>
    </>
     : <>
      <Flex
        bg="#141414" minH="100vh"
        pt={20} pb={10} px={6}
        maxW="1280px" mx="auto"
        flexDirection="column"
      >
        {user?.auth === "ADMIN" && <UploadButton/>}
        {/* 카테고리 분류 */}
        <Flex flexDirection={"column"} align={"center"} gap={6} pb={6}>
          <>
      <HStack
        w={isMobile ? "80%" : "40%"}
        minWidth="282px"
        gap="16px"
        overflow="visible"
      >
        <Input
          id="keyword2"
          placeholder="영화명 검색"
          w="80%"
          minW="150px"
          p="10px"
          bg="#1e1e1e"
          border="1px solid gray"
          fontSize="15px"
          color="white"
          _hover={{ borderColor: "white" }}
          onKeyDown={(e) => {
            if (e.key === "Enter"){
              if (e.target.value.replace(/\s+/g, "") === "") {
                openModal("유효한 검색어를 입력해주세요!");
                return;
              }
              setSearchWord(e.target.value);
            }
          }}
        />
        <Button
          w="10%"
          px={6}
          bg="#1e1e1e"
          border="1px solid gray"
          _hover={{ borderColor: "white" }}
          onClick={() => {
            if (document.querySelector('#keyword2').value.replace(/\s+/g, "") === "") {
              openModal("유효한 검색어를 입력해주세요!");
              return;
            }
            setSearchWord(document.querySelector('#keyword2').value);
          }}
        >
          검색
        </Button>

        <Button
          w="10%"
          px={6}
          bg="#1e1e1e"
          border="1px solid gray"
          _hover={{ borderColor: "white" }}
          onClick={() => setSearchWord("")}
        >
          전체
        </Button>
      </HStack>
    </>
          <CategoryPart isMobile={isMobile} />
        </Flex>
        <MovieCards isMobile={isMobile} />
        <MoreButton />
      </Flex>
    </>
  }
  {isModalOpen && (<Modal
  isModalOpen={isModalOpen}
  isModalVisible={isModalVisible}
  closeModal={closeModal}
  content={modalContent}/>)}
  {isLoading && <LoadingSpinner/>}
  </>
};

export default Movie;
