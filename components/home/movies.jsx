'use client';

import React,{useEffect,useState} from 'react';
import Link from "next/link";
import {VStack,Grid,Flex,Box} from '@chakra-ui/react';
import MovieCard from '../movie/moviecard';

export default function Movies({userInfo,movieInfo}){
    const [sortkey, setSortkey] = useState('likeNumber');
    const [rdcolor, setrdColor] = useState('white'); 
    const [lncolor, setlnColor] = useState('gray.500');
    // 20230516
    // 20210205
    // 20141106
    // 20220905
    // 20190424
    // 20240424
    // 20250822 
    // 20250326
    // 첫번째 귀멸의 칼날
    // 두번째 승부
    // 세번째 범죄도시 4
    // 네번째 필즈오브데스티니

    // {id:1, rank:1, description:"씨앗은 땅에만 뿌려지는 것이 아니다. 희망과 용기, 사랑도 이 황무지 위에서 자란다. 대공황의 그늘 아래, 미국 중부의 한 농장을 배경으로 펼쳐지는 한 가족의 세대 간 갈등과 화해, 그리고 삶의 터전을 지켜내려는 치열한 이야기. 하늘을 나는 꿈을 품은 딸, 땅을 지키려는 아버지, 이상과 현실 사이에서 갈등하는 오빠. 그들은 각자의 방식으로 ‘운명의 들판’을 가꾸며 자신만의 길을 찾아 나선다.", score:"9.8", title:'필즈 오브 데스티니', rate:"12", releaseDate:'2023.05.16', likeNumber:'5.3k', poster:'https://live.staticflickr.com/65535/52900840054_14af3e493c_z.jpg'},
    // {id:2, rank:2, description:"When Beth (Kate Watson) suffers a traumatic attack, her family and friends suggest she see a therapist to help her cope. However, her new therapist gives her more than she bargained for.", score:"9.8", title:'킬러 어드바이스', rate:"19", releaseDate:'2021.02.05', likeNumber:'2.1k', poster:'https://m.media-amazon.com/images/M/MV5BYzgxZjY5MGQtODRhZi00ZDQyLWE5MDQtYTk3NGJkN2I5M2M1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'},
    // {id:3, rank:3, description:"세계 각국의 정부와 경제가 완전히 붕괴된 미래가 다가온다. 지난 20세기에 범한 잘못이 전 세계적인 식량 부족을 불러왔고, NASA도 해체되었다. 이때 시공간에 불가사의한 틈이 열리고, 남은 자들에게는 이 곳을 탐험해 인류를 구해야 하는 임무가 주어진다. 사랑하는 가족들을 뒤로 한 채 인류라는 더 큰 가족을 위해, 그들은 이제 희망을 찾아 우주로 간다. 그리고 우린 답을 찾을 것이다. 늘 그랬듯이...", score:"9.8", title:'인터스텔라', rate:"12", releaseDate:'2014.11.06', likeNumber:'1.5k', poster:'https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'},
    // {id:4, rank:4, description:"내 이름은 알프레드 히치콕(My Name Is Alfred Hitchcock)은 마크 커즌스(Mark Cousins)가 각본과 감독을 맡은 2022년 영국 다큐멘터리 영화입니다. 영국의 영화감독 알프레드 히치콕에 관한 이야기이다", score:"9.8", title:'내 이름은 알프레드 히치콕', rate:"ALL", releaseDate:'2022.09.05', likeNumber:'1.3k', poster:'https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'},
    // {id:5, rank:5, description:"인피니티 워 이후 많은 사람이 죽고 또 많은 것을 잃게 된 지구는 더 이상 희망이 남지 않아 절망 속에 살아간다. 전쟁 후 남아 있던 어벤저스는 그런 그들의 모습을 보게 된다. 마지막으로 지구를 살리려 모든 것을 건 타노스와 최후의 전쟁을 치른다.", score:"9.8", label:"MEGA ONLY", title:'어벤져스 엔드게임', rate:"15", releaseDate:'2019.04.24', likeNumber:'986', poster:'https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg'},
    // {id:6, rank:6, description:"신종 마약 사건 3년 뒤, 괴물형사 ‘마석도’(마동석)와 서울 광수대는 배달앱을 이용한 마약 판매 사건을 수사하던 중 수배 중인 앱 개발자가 필리핀에서 사망한 사건이 대규모 온라인 불법 도박 조직과 연관되어 있음을 알아낸다. 필리핀에 거점을 두고 납치, 감금, 폭행, 살인 등으로 대한민국 온라인 불법 도박 시장을 장악한 특수부대 용병 출신의 빌런 ‘백창기’(김무열)와 한국에서 더 큰 판을 짜고 있는 IT업계 천재 CEO ‘장동철’(이동휘). ‘마석도’는 더 커진 판을 잡기 위해 ‘장이수’(박지환)에게 뜻밖의 협력을 제안하고 광역수사대는 물론, 사이버수사대까지 합류해 범죄를 소탕하기 시작하는데… 나쁜 놈 잡는데 국경도 영역도 제한 없다! 업그레이드 소탕 작전! 거침없이 싹 쓸어버린다!", score:"9.8", title:'범죄도시 4', rate:"15", releaseDate:'2024.04.24', likeNumber:'734', poster:'https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp'},
    // {id:7, rank:7, description:"혈귀로 변한 여동생 ‘네즈코’를 되돌리기 위해 귀살대가 된 ‘탄지로’! 어둠 속을 달리는 무한열차에서 승객들이 흔적 없이 사라진다는 소식에 ‘젠이츠’, ‘이노스케’와 함께 임무 수행을 위해 무한열차에 탑승한다. 그리고 그 곳에서 만난 귀살대 최강 검사 염주 ‘렌고쿠’! 이들은 무한열차에 숨어 있는 혈귀의 존재를 직감하고 모두를 구하기 위해 목숨을 건 혈전을 시작하는데… 그 칼로 악몽을 끊어라!", score:"9.8", title:'귀멸의칼날 무한성편', releaseDate:'2025.08.22', rate:"19", likeNumber:'521', poster:'https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp'},
    // {id:8, rank:8, description:"세계 최고 바둑 대회에서 국내 최초 우승자가 된 조훈현. 전 국민적 영웅으로 대접받던 그는 바둑 신동이라 불리는 이창호를 제자로 맞는다. “실전에선 기세가 8할이야” 제자와 한 지붕 아래에서 먹고 자며 가르친 지 수년. 모두가 스승의 뻔한 승리를 예상했던 첫 사제 대결에서 조훈현은 전 국민이 지켜보는 가운데, 기세를 탄 제자에게 충격적으로 패한다. 오랜만에 패배를 맛본 조훈현과 이제 승부의 맛을 알게 된 이창호 조훈현은 타고난 승부사적 기질을 되살리며 다시 한번 올라갈 결심을 하게 되는데…", score:"9.8", label:"Dolby", title:'승부', rate:"12", releaseDate:'2025.03.26', likeNumber:'342', poster:'https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg'},
    // {id:9, rank:9, description:"씨앗은 땅에만 뿌려지는 것이 아니다. 희망과 용기, 사랑도 이 황무지 위에서 자란다. 대공황의 그늘 아래, 미국 중부의 한 농장을 배경으로 펼쳐지는 한 가족의 세대 간 갈등과 화해, 그리고 삶의 터전을 지켜내려는 치열한 이야기. 하늘을 나는 꿈을 품은 딸, 땅을 지키려는 아버지, 이상과 현실 사이에서 갈등하는 오빠. 그들은 각자의 방식으로 ‘운명의 들판’을 가꾸며 자신만의 길을 찾아 나선다.", score:"9.8", title:'필즈 오브 데스티니', rate:"12", releaseDate:'2023.05.16', likeNumber:'5.3k', poster:'https://live.staticflickr.com/65535/52900840054_14af3e493c_z.jpg'},
    // {id:10, rank:10, description:"When Beth (Kate Watson) suffers a traumatic attack, her family and friends suggest she see a therapist to help her cope. However, her new therapist gives her more than she bargained for.", score:"9.8", title:'킬러 아드바이스', rate:"19", releaseDate:'2021.02.05', likeNumber:'2.1k', poster:'https://m.media-amazon.com/images/M/MV5BYzgxZjY5MGQtODRhZi00ZDQyLWE5MDQtYTk3NGJkN2I5M2M1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'},
    // {id:11, rank:11, description:"세계 각국의 정부와 경제가 완전히 붕괴된 미래가 다가온다. 지난 20세기에 범한 잘못이 전 세계적인 식량 부족을 불러왔고, NASA도 해체되었다. 이때 시공간에 불가사의한 틈이 열리고, 남은 자들에게는 이 곳을 탐험해 인류를 구해야 하는 임무가 주어진다. 사랑하는 가족들을 뒤로 한 채 인류라는 더 큰 가족을 위해, 그들은 이제 희망을 찾아 우주로 간다. 그리고 우린 답을 찾을 것이다. 늘 그랬듯이...", score:"9.8", title:'인터스텔라', rate:"12", releaseDate:'2014.11.06', likeNumber:'1.5k', poster:'https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'},
    // {id:12, rank:12, description:"내 이름은 알프레드 히치콕(My Name Is Alfred Hitchcock)은 마크 커즌스(Mark Cousins)가 각본과 감독을 맡은 2022년 영국 다큐멘터리 영화입니다. 영국의 영화감독 알프레드 히치콕에 관한 이야기이다", score:"9.8", title:'내 이름은 알프레드 히치콕', rate:"ALL", releaseDate:'2022.09.05', likeNumber:'1.3k', poster:'https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'},
    // {id:13, rank:13, description:"인피니티 워 이후 많은 사람이 죽고 또 많은 것을 잃게 된 지구는 더 이상 희망이 남지 않아 절망 속에 살아간다. 전쟁 후 남아 있던 어벤저스는 그런 그들의 모습을 보게 된다. 마지막으로 지구를 살리려 모든 것을 건 타노스와 최후의 전쟁을 치른다.", score:"9.8", label:"MEGA ONLY", title:'어벤져스 엔드게임', rate:"15", releaseDate:'2019.04.24', likeNumber:'986', poster:'https://upload.wikimedia.org/wikipedia/ko/thumb/f/f2/%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/1200px-%EC%96%B4%EB%B2%A4%EC%A0%B8%EC%8A%A4-_%EC%97%94%EB%93%9C%EA%B2%8C%EC%9E%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg'},
    // {id:14, rank:14, description:"신종 마약 사건 3년 뒤, 괴물형사 ‘마석도’(마동석)와 서울 광수대는 배달앱을 이용한 마약 판매 사건을 수사하던 중 수배 중인 앱 개발자가 필리핀에서 사망한 사건이 대규모 온라인 불법 도박 조직과 연관되어 있음을 알아낸다. 필리핀에 거점을 두고 납치, 감금, 폭행, 살인 등으로 대한민국 온라인 불법 도박 시장을 장악한 특수부대 용병 출신의 빌런 ‘백창기’(김무열)와 한국에서 더 큰 판을 짜고 있는 IT업계 천재 CEO ‘장동철’(이동휘). ‘마석도’는 더 커진 판을 잡기 위해 ‘장이수’(박지환)에게 뜻밖의 협력을 제안하고 광역수사대는 물론, 사이버수사대까지 합류해 범죄를 소탕하기 시작하는데… 나쁜 놈 잡는데 국경도 영역도 제한 없다! 업그레이드 소탕 작전! 거침없이 싹 쓸어버린다!", score:"9.8", title:'범죄도시 4', rate:"15", releaseDate:'2024.04.24', likeNumber:'734', poster:'https://i.namu.wiki/i/KwJ2dfIySu2k8JWlK3nD-gS7A9G-2I2EWKkNjoVRqaHabjK88STUo8FXi545XV6Pe8ERSX5DjF4e5k0IkOvznQ.webp'},
    // {id:15, rank:15, description:"혈귀로 변한 여동생 ‘네즈코’를 되돌리기 위해 귀살대가 된 ‘탄지로’! 어둠 속을 달리는 무한열차에서 승객들이 흔적 없이 사라진다는 소식에 ‘젠이츠’, ‘이노스케’와 함께 임무 수행을 위해 무한열차에 탑승한다. 그리고 그 곳에서 만난 귀살대 최강 검사 염주 ‘렌고쿠’! 이들은 무한열차에 숨어 있는 혈귀의 존재를 직감하고 모두를 구하기 위해 목숨을 건 혈전을 시작하는데… 그 칼로 악몽을 끊어라!", score:"9.8", title:'귀멸의칼날 무한성편', releaseDate:'2025.08.22', rate:"19", likeNumber:'521', poster:'https://i.namu.wiki/i/YvPBZ1kzk8Dku4HhOC2FGB7xKVXj5bpg8cSdRWsAZg-3Knqu5LcWJchrZDIVmz-08V3OV9uFLMfCRNCZRcnTxQ.webp'},
    // {id:16, rank:16, description:"세계 최고 바둑 대회에서 국내 최초 우승자가 된 조훈현. 전 국민적 영웅으로 대접받던 그는 바둑 신동이라 불리는 이창호를 제자로 맞는다. “실전에선 기세가 8할이야” 제자와 한 지붕 아래에서 먹고 자며 가르친 지 수년. 모두가 스승의 뻔한 승리를 예상했던 첫 사제 대결에서 조훈현은 전 국민이 지켜보는 가운데, 기세를 탄 제자에게 충격적으로 패한다. 오랜만에 패배를 맛본 조훈현과 이제 승부의 맛을 알게 된 이창호 조훈현은 타고난 승부사적 기질을 되살리며 다시 한번 올라갈 결심을 하게 되는데…", score:"9.8", label:"Dolby", title:'승부', rate:"12", releaseDate:'2025.03.26', likeNumber:'342', poster:'https://img.megabox.co.kr/SharedImg/2025/03/27/O6RnDMOAnUw6geDdlaAXRlkqgy0mSSDb_420.jpg'},
    // {id:17, rank:17, description:"씨앗은 땅에만 뿌려지는 것이 아니다. 희망과 용기, 사랑도 이 황무지 위에서 자란다. 대공황의 그늘 아래, 미국 중부의 한 농장을 배경으로 펼쳐지는 한 가족의 세대 간 갈등과 화해, 그리고 삶의 터전을 지켜내려는 치열한 이야기. 하늘을 나는 꿈을 품은 딸, 땅을 지키려는 아버지, 이상과 현실 사이에서 갈등하는 오빠. 그들은 각자의 방식으로 ‘운명의 들판’을 가꾸며 자신만의 길을 찾아 나선다.", score:"9.8", title:'필즈 오브 데스티니', rate:"12", releaseDate:'2023.05.16', likeNumber:'5.3k', poster:'https://live.staticflickr.com/65535/52900840054_14af3e493c_z.jpg'},
    // {id:18, rank:18, description:"When Beth (Kate Watson) suffers a traumatic attack, her family and friends suggest she see a therapist to help her cope. However, her new therapist gives her more than she bargained for.", score:"9.8", title:'킬러 어드바이스', rate:"19", releaseDate:'2021.02.05', likeNumber:'2.1k', poster:'https://m.media-amazon.com/images/M/MV5BYzgxZjY5MGQtODRhZi00ZDQyLWE5MDQtYTk3NGJkN2I5M2M1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'},
    // {id:19, rank:19, description:"세계 각국의 정부와 경제가 완전히 붕괴된 미래가 다가온다. 지난 20세기에 범한 잘못이 전 세계적인 식량 부족을 불러왔고, NASA도 해체되었다. 이때 시공간에 불가사의한 틈이 열리고, 남은 자들에게는 이 곳을 탐험해 인류를 구해야 하는 임무가 주어진다. 사랑하는 가족들을 뒤로 한 채 인류라는 더 큰 가족을 위해, 그들은 이제 희망을 찾아 우주로 간다. 그리고 우린 답을 찾을 것이다. 늘 그랬듯이...", score:"9.8", title:'인터스텔라', rate:"12", releaseDate:'2014.11.06', likeNumber:'1.5k', poster:'https://rukminim2.flixcart.com/image/850/1000/l2dmky80/poster/y/f/b/small-poster-interstellar-sl407-wall-poster-13x19-inches-matte-original-imagdqezkfchjkhz.jpeg?q=20&crop=false'},
    // {id:20, rank:20, description:"내 이름은 알프레드 히치콕(My Name Is Alfred Hitchcock)은 마크 커즌스(Mark Cousins)가 각본과 감독을 맡은 2022년 영국 다큐멘터리 영화입니다. 영국의 영화감독 알프레드 히치콕에 관한 이야기이다", score:"9.8", title:'내 이름은 알프레드 히치콕', rate:"ALL", releaseDate:'2022.09.05', likeNumber:'1.3k', poster:'https://www.mvtimes.com/mvt/uploads/2024/11/film-my-name-alfred-hitchcock-2.jpg'},
                 

    return <VStack w='100%' bg='#141414' pt='80px' pb='50px'>
                <h1 style={{color:'white',fontSize:25,paddingBottom:50}}>박스 오피스</h1>

                <Flex w='1250px' justifyContent='space-between'>
                    <Flex gap='10px'>
                        <Flex color={rdcolor} _hover={{cursor:'pointer'}} onClick={(e)=>{
                            setSortkey('likeNumber');
                            setrdColor((rdcolor==='white')?'gray.500':'white');
                            setlnColor((lncolor==='white')?'gray.500':'white');
                        }}>좋아요순</Flex>
                        <Flex color='white'>|</Flex>
                        <Flex color={lncolor} _hover={{cursor:'pointer'}} onClick={(e)=>{
                            setSortkey('releaseDate');
                            setrdColor((rdcolor==='white')?'gray.500':'white');
                            setlnColor((lncolor==='white')?'gray.500':'white');
                        }}>최신순</Flex>
                    </Flex>
                    <Link href='/movie'><Flex color='white' _hover={{color:'gray.500'}}>더 보기</Flex></Link>
                </Flex>

                <Grid templateColumns='repeat(4,280px)' gap='50px' overflow='visible'>
                    {(sortkey==='releaseDate')
                    ?
                    movieInfo.sort((a,b)=>b.releaseDate.localeCompare(a.releaseDate)).map((movie,index) => {
                        if(index < 8)
                            return (<Box overflow='visible' key={movie.id}>
                                    <MovieCard 
                                        user={userInfo}
                                        movie={movie}
                                    /></Box>);
                    }):
                    movieInfo.sort((a,b)=>b.likeNumber-a.likeNumber).map((movie,index) => {
                        if(index < 8)
                            return (<Box overflow='visible' key={movie.id}>
                                        <MovieCard 
                                        user={userInfo}
                                        movie={movie}
                                    /></Box>);
                    })}
                </Grid>
            </VStack>;
}