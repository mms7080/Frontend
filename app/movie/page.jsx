'use client';

import React,{useEffect,useState} from 'react';
import {Button, Flex, Box, Grid} from '@chakra-ui/react';

import Movie from '../../components/movie/movie';
import {Header,Footer} from '../../components';

import {fetch} from '../../lib/client';
import MovieCard from '../../components/movie/moviecard';

const categories = ['전체영화', '개봉작', '상영예정작'];

export default function Moviepage(){

    const [activeCategory, setActiveCategory] = useState('전체영화');
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(null);
    const [displayNumber, setDisplayNumber] = useState(8);

    useEffect(() => {
        document.title = '전체 영화 - 필모라라';

        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);
                setUser(res);
            } catch(err) {
                console.log("USER FETCH ERROR! : " + err.message);
            }
        })();

        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/get`);
                for(let movie of res) {
                    if(movie.likeNumber > 999)
                        movie.likeNumber = Math.floor(movie.likeNumber / 100) / 10 + 'k';
                }
                setMovies(Object.values(res));
            } catch (err) {
                console.log("MOVIE FETCH ERROR! : " + err.message);
                // fetch 실패시 대신 사용할 데이터
                setMovies(
                    [
                        {id:1, rank:1, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'Fields of Destiny', rate:"12", releaseDate:'2023.05.16', likeNumber:'5.3k', image:'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg'},
                        {id:2, rank:2, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'Killer Advice', rate:"19", releaseDate:'2021.02.05', likeNumber:'2.1k', image:'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700796426/catalog/1600659718750367744/iqmiudmmo6s7zcofwmpf.jpg'},
                        {id:3, rank:3, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'InterStella', rate:"12", releaseDate:'2014.11.06', likeNumber:'1.5k', image:'https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'},
                        {id:4, rank:4, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'My Name is Alfred Hitchcock', rate:"ALL", releaseDate:'2022.09.05', likeNumber:'1.3k', image:'https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'},
                        {id:5, rank:5, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", label:"MEGA ONLY", title:'어벤져스 엔드게임', rate:"15", releaseDate:'2019.04.24', likeNumber:'986', image:'https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg'},
                        {id:6, rank:6, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'범죄도시 4', rate:"15", releaseDate:'2024.04.24', likeNumber:'734', image:'https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp'},
                        {id:7, rank:7, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'귀멸의칼날 무한성편', releaseDate:'2025.08.22', rate:"19", likeNumber:'521', image:'https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp'},
                        {id:8, rank:8, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", label:"Dolby", title:'승부', rate:"12", releaseDate:'2025.03.26', likeNumber:'342', image:'https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg'},
                        {id:9, rank:9, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'Fields of Destiny', rate:"12", releaseDate:'2023.05.16', likeNumber:'5.3k', image:'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg'},
                        {id:10, rank:10, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'Killer Advice', rate:"19", releaseDate:'2021.02.05', likeNumber:'2.1k', image:'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700796426/catalog/1600659718750367744/iqmiudmmo6s7zcofwmpf.jpg'},
                        {id:11, rank:11, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'InterStella', rate:"12", releaseDate:'2014.11.06', likeNumber:'1.5k', image:'https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'},
                        {id:12, rank:12, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'My Name is Alfred Hitchcock', rate:"ALL", releaseDate:'2022.09.05', likeNumber:'1.3k', image:'https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'},
                        {id:13, rank:13, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", label:"MEGA ONLY", title:'어벤져스 엔드게임', rate:"15", releaseDate:'2019.04.24', likeNumber:'986', image:'https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg'},
                        {id:14, rank:14, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'범죄도시 4', rate:"15", releaseDate:'2024.04.24', likeNumber:'734', image:'https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp'},
                        {id:15, rank:15, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'귀멸의칼날 무한성편', releaseDate:'2025.08.22', rate:"19", likeNumber:'521', image:'https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp'},
                        {id:16, rank:16, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", label:"Dolby", title:'승부', rate:"12", releaseDate:'2025.03.26', likeNumber:'342', image:'https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg'},
                        {id:17, rank:17, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'Fields of Destiny', rate:"12", releaseDate:'2023.05.16', likeNumber:'5.3k', image:'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg'},
                        {id:18, rank:18, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'Killer Advice', rate:"19", releaseDate:'2021.02.05', likeNumber:'2.1k', image:'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700796426/catalog/1600659718750367744/iqmiudmmo6s7zcofwmpf.jpg'},
                        {id:19, rank:19, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'InterStella', rate:"12", releaseDate:'2014.11.06', likeNumber:'1.5k', image:'https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'},
                        {id:20, rank:20, description:"타노스 위협으로부터 몸을 지키기 위해 거대한 벽을 쌓고 그 안에서...", score:"9.8", title:'My Name is Alfred Hitchcock', rate:"ALL", releaseDate:'2022.09.05', likeNumber:'1.3k', image:'https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'},
                    ]
                )
            }
        })();
    }, []);

    const handleBooking = (movieId) => {
        console.log(`영화 ID ${movieId} 예매하기`);
        // 여기에 예매 로직 추가
    };

    
    // console.log(movies);
    const filteredMovies = activeCategory === '전체영화' ? movies : 
    movies.filter((movie) => {
        let rd = new Date(movie.releaseDate);
        let nd = new Date();
        return ((activeCategory === '개봉작') === (rd <= nd)) && !isNaN(rd)
    });
    // console.log(filteredMovies);
    
    // 더보기 버튼
    const MoreButton = () => {
        if(displayNumber < filteredMovies.length)
            return (<Box pt={10} >
                        <Button
                            w='100%' bg="#1e1e1e" _hover={{border:"1px solid gray"}}
                            onClick={()=>{setDisplayNumber(displayNumber+8)}}
                        >더보기</Button>
                    </Box>)
    };

    return <>
        <Header headerColor="white" headerBg="#1a1a1a" userInfo={user}/>
        <Box bg="#141414" pt={20} pb={10} px={6} maxW="1280px" mx="auto">
            {/* 카테고리 분류 */}
            <Box pb={6}>
                <Flex gap={2} borderBottom="1px solid white">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant="ghost"
                            borderBottom={activeCategory === category ? '2px solid white' : '1px solid transparent'}
                            borderRadius="0"
                            fontSize={'2xl'}
                            fontWeight={'normal'}
                            color={activeCategory === category ? 'white' : 'gray.500'}
                            onClick={() => {setActiveCategory(category); setDisplayNumber(8);}}
                            _hover={{ bg: 'transparent', color: 'white' }}
                        >
                            {category}
                        </Button>
                    ))}
                </Flex>
            </Box>
            {/* 영화카드들 */}
            <Box className="movie-grid">
                {filteredMovies.map((movie,index) => {
                    if(index < displayNumber)
                        return (<MovieCard 
                            key={movie.id}
                            movie={movie}
                            onBooking={handleBooking}
                        />)
                })}
            </Box>
            <MoreButton/>
        </Box>
        <Footer footerColor="white" footerBg="#1a1a1a" footerBorder="transparent" />
        </>;
}