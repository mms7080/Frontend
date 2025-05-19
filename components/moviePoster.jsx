import React from 'react';
import { Flex, Image, Box } from '@chakra-ui/react';

const movies = [
    { id: 1, title: "필즈 오브 데스티니", poster: "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg" },
    { id: 2, title: "킬러의 조언", poster: "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700796426/catalog/1600659718750367744/iqmiudmmo6s7zcofwmpf.jpg" },
    { id: 3, title: "인터스텔라", poster: "https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false" },
    { id: 4, title: "알프레드 히치콕", poster: "https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg" },
    { id: 5, title: "어벤져스", poster: "https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg" },
    { id: 6, title: "범죄도시", poster: "https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp" },
    { id: 7, title: "귀멸의 칼날", poster: "https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp" },
    { id: 8, title: "승부", poster: "https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg" },
];

export default function MoviePoster({ onMovieSelect, selectedMovie }) {

    return (
        <Flex 
            w="65%" 
            overflowX="auto" 
            p="10px" 
            gap="15px" 
            justifyContent="flex-start"
            alignItems="flex-start"
            flexDirection="row"
        >
            {movies.map(movie => (
                <Box key={movie.id} textAlign="center" minW="120px" flexShrink="0">
                    <Image 
                        src={movie.poster} 
                        alt={movie.title} 
                        width="120px" 
                        height="180px"
                        cursor="pointer"
                        borderRadius="10px"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="transform 0.2s"
                        onClick={() => onMovieSelect(movie)}
                        border={selectedMovie?.id === movie.id ? "5px solid purple" : "none"}
                    />
                </Box>
            ))}
        </Flex>
    );
}