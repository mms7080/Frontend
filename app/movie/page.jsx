'use client';

import React,{useEffect,useState} from 'react';
import {Text, Button, Flex, Box, Grid} from '@chakra-ui/react';

import Movie from '../../components/movie/movie';
import {Header,Footer} from '../../components';

const categories = ['전체영화', '개봉작', '상영예정작'];

export default function Moviepage(){

    useEffect(() => {
        document.title = '전체 영화 - 필모라라';
    }, []);

    const [activeCategory, setActiveCategory] = useState('전체영화');
    const movies = 
    // (async () => await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/get`).then(v=>v.json()))()
    [
        {mid:1, name:'Fields of Destiny', rate:'', releaseDate:'0000.00.00', likeNumber:'5.3k', imageUrl:'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg'},
        {mid:2, name:'Killer Advice', rate:'', releaseDate:'0000.00.00', likeNumber:'2.1k', imageUrl:'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700796426/catalog/1600659718750367744/iqmiudmmo6s7zcofwmpf.jpg'},
        {mid:3, name:'InterStella', rate:'12', releaseDate:'2014.11.06', likeNumber:'1.5k', imageUrl:'https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'},
        {mid:4, name:'My Name is Alfred Hitchcock', rate:'', releaseDate:'0000.00.00', likeNumber:'1.3k', imageUrl:'https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'},
        {mid:5, name:'어벤져스 엔드게임', rate:'12', releaseDate:'2019.04.24', likeNumber:'986', imageUrl:'https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg'},
        {mid:6, name:'범죄도시 4', rate:'15', releaseDate:'2024.04.24', likeNumber:'734', imageUrl:'https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp'},
        {mid:7, name:'귀멸의칼날 무한성편', releaseDate:'2025.08.22', rate:'19', likeNumber:'521', imageUrl:'https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp'},
        {mid:8, name:'승부', rate:'12', releaseDate:'2025.03.26', likeNumber:'342', imageUrl:'https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg'}
    ];

    const filteredMovies = activeCategory === '전체영화' ? movies : 
        movies.filter((movie) => {
            let rd = new Date(movie.releaseDate);
            let nd = new Date();
            return ((activeCategory === '개봉작') === (rd <= nd)) && !isNaN(rd)
        }
        );
    

    return <>
        <Header headerColor="white" headerBg="#1a1a1a"/>
        <Box bg="white" pt={20} pb={10} px={6} maxW="1280px" mx="auto">
            <Box pb={6}>
                <Flex gap={2} borderBottom="1px solid #5f0080">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant="ghost"
                            borderBottom={activeCategory === category ? '2px solid #5f0080' : '1px solid transparent'}
                            borderRadius="0"
                            fontSize={'xl'}
                            fontWeight={activeCategory === category ? 'bold' : 'normal'}
                            color={activeCategory === category ? '#5f0080' : 'black'}
                            onClick={() => setActiveCategory(category)}
                            _hover={{ bg: 'transparent', color: '#5f0080' }}
                        >
                            {category}
                        </Button>
                    ))}
                </Flex>
            </Box>
            <Grid templateColumns='repeat(4, 1fr)' gap='40px' w='100%' alignItems='center'>
                {filteredMovies.map((movie) =>
                    (<Movie key={movie.mid} name={movie.name} rate={movie.rate} releaseDate={movie.releaseDate} likeNumber={movie.likeNumber} image={movie.imageUrl}/>))}
            </Grid>
        </Box>
        <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />
        </>;
}