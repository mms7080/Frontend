import {VStack,Grid} from '@chakra-ui/react';
import Movie from '../element/movie';

export default function Movies(){
    return <VStack w='100%' bg='#141414' pt='80px' pb='50px'>
                <h1 style={{color:'white',fontSize:25,paddingBottom:15}}>박스 오피스</h1>
                <Grid templateColumns='repeat(4,280px)' gap='50px'>
                    <Movie likenumber='5.3k' src='https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg'></Movie>
                    <Movie likenumber='2.1k' src='https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700796426/catalog/1600659718750367744/iqmiudmmo6s7zcofwmpf.jpg'></Movie>
                    <Movie likenumber='1.5k' src='https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'></Movie>
                    <Movie likenumber='1.3k' src='https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'></Movie>
                    <Movie likenumber='986' src='https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg'></Movie>
                    <Movie likenumber='734' src='https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp'></Movie>
                    <Movie likenumber='521' src='https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp'></Movie>
                    <Movie likenumber='342' src='https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg'></Movie>
                </Grid>
            </VStack>;
}