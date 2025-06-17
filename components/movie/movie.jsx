"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
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

const categories = ["전체영화", "개봉작", "상영예정작"];

const Movie = (userInfo) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [activeCategory, setActiveCategory] = useState("전체영화");
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(userInfo.userInfo);
  const [searchWord, setSearchWord] = useState("");
  const [displayNumber, setDisplayNumber] = useState(8);

  const [loadedMovies, setLoadedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();

  const inputRef = useRef("");
  const clearInputValue = () => {
    if (inputRef.current) {
      inputRef.current.valueOf = "";
    }
  };
  const getInputValue = () => {
    if (inputRef.current) {
      return inputRef.current.valueOf;
    }
    return "";
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

  const handleSearch = (inputValue) => {
    if (inputValue.replace(/\s+/g, "") === "") {
      openModal("유효한 검색어를 입력해주세요!");
      return;
    }
    setSearchWord(inputValue);
  };

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

  // 영화 데이터 로드 함수
  const loadMovieData = async (movieList, startIndex, count) => {
    const moviesToLoad = movieList.slice(startIndex, startIndex + count);
    const promises = moviesToLoad.map(async (movie) => {
      try {
        // 리뷰 점수 가져오기
        const reviewRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/${movie.id}`);
        // console.log(movie.id + "reviewRes")
        // console.log(reviewRes)
        let score = "N/A";
          const reviewData = reviewRes;
          // console.log(movie.id + "reviewData")
          // console.log(reviewData)
          if (reviewData.length > 0) {
            let sum = 0;
            for (let review of reviewData) sum += review.score;
            score = (sum / reviewData.length).toFixed(1);
          } else {
            score = "없음";
          }

        // 예매율 가져오기
        const reserveRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/reserveRate/${movie.id}`);
        // console.log(movie.id + "reserveRes")
        // console.log(reserveRes)
        let reserveRate = "N/A";

          reserveRate = reserveRes;
          // console.log(movie.id + "reserveRate")
          // console.log(reserveRate);
  

        return {
          ...movie,
          realScore: score,
          realReserveRate: reserveRate
        };
      } catch (err) {
        console.log(`Movie data load error for ${movie.id}:`, err.message);
        return {
          ...movie,
          realScore: "N/A",
          realReserveRate: "N/A"
        };
      }
    });

    return Promise.all(promises);
  };

  // filteredMovies가 변경될 때 로드된 영화 초기화
  useEffect(() => {
    const loadInitialMovies = async () => {
      if (filteredMovies.length > 0) {
        setIsLoading(true);
        const initialMovies = await loadMovieData(filteredMovies, 0, 8);
        // 예매율로 정렬
        const sortedMovies = initialMovies.sort((a, b) => {
          const aRate = parseFloat(a.realReserveRate) || 0;
          const bRate = parseFloat(b.realReserveRate) || 0;
          return bRate - aRate;
        });
        setLoadedMovies(sortedMovies);
        setIsLoading(false);
      } else {
        setLoadedMovies([]);
      }
    };

    loadInitialMovies();
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

  // 검색 부분
  const SearchPart = ({ isMobile }) => {
    return (
      <HStack
        w={isMobile ? "80%" : "40%"}
        minWidth="282px"
        gap="16px"
        overflow="visible"
      >
        <Input
          placeholder="영화명 검색"
          w="80%"
          minW="150px"
          p="10px"
          bg="#1e1e1e"
          border="1px solid gray"
          fontSize="15px"
          color="white"
          _hover={{ borderColor: "white" }}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(getInputValue());
          }}
        />
        <Button
          w="10%"
          px={6}
          bg="#1e1e1e"
          border="1px solid gray"
          _hover={{ borderColor: "white" }}
          onClick={() => {
            handleSearch(getInputValue());
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
    );
  };

  // 더보기 누를 시 이동 안하도록
  const scrollRef = useRef(0);

  // 더보기 버튼
  const MoreButton = () => {
    if (displayNumber < filteredMovies.length)
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

              const newMovies = await loadMovieData(filteredMovies, displayNumber, 8);
              setLoadedMovies(prev => {
                const combined = [...prev, ...newMovies];
                // 전체 다시 정렬
                return combined.sort((a, b) => {
                  const aRate = parseFloat(a.realReserveRate) || 0;
                  const bRate = parseFloat(b.realReserveRate) || 0;
                  return bRate - aRate;
                });
              });
              setDisplayNumber(prev => prev + 8);
              setIsLoading(false);
            }}
          >
            {isLoading ? "로딩 중..." : "더보기"}
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

  // 영화카드들
  const MovieCards = ({ isMobile }) => {
    if (searchWord != "" && filteredMovies.length < 1)
      return (
        <Box
          w="100%"
          h="50vh"
          bg="#141414"
          fontSize={{ base: "18px", md: "4xl" }}
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
          {loadedMovies.map((movie, index) => {
            if (index < displayNumber)
              console.log(movie.id + "score : " + movie.realScore)
              console.log(movie.id + "reserveRate : " + movie.realReserveRate)
              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  user={user}
                  crit={"예매"}
                  rank={index + 1}
                  preloadedData={{
                    score: movie.realScore,
                    reserveRate: movie.realReserveRate
                  }}
                />
              );
          })}
        </Grid>
      );
  };

  return <>{!isMobile ? (
    <>
      (
      <Flex
        bg="#141414"
        minH="100vh"
        pt={20}
        pb={10}
        px={6}
        maxW="1280px"
        mx="auto"
        flexDirection="column"
      >
        {/* 카테고리 분류 */}
        <Flex flexWrap="wrap" justify={"space-between"} pb={6}>
          <CategoryPart isMobile={isMobile} />
          <SearchPart isMobile={isMobile} />
        </Flex>
        <MovieCards isMobile={isMobile} />
        <MoreButton />
      </Flex>
      );
    </>
  ) : (
    <>
      (
      <Flex
        bg="#141414"
        minH="100vh"
        pt={20}
        pb={10}
        px={6}
        maxW="1280px"
        mx="auto"
        flexDirection="column"
      >
        {/* 카테고리 분류 */}
        <Flex flexDirection={"column"} align={"center"} gap={6} pb={6}>
          <SearchPart isMobile={isMobile} />
          <CategoryPart isMobile={isMobile} />
        </Flex>
        <MovieCards isMobile={isMobile} />
        <MoreButton />
      </Flex>
      )
    </>
  )}
  {isModalOpen && (<Modal
  isModalOpen={isModalOpen}
  isModalVisible={isModalVisible}
  closeModal={closeModal}
  content={modalContent}/>)}
  </>
};

export default Movie;
