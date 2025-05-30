'use client';

import React,{useState} from 'react';
import {Button,Flex,Textarea,NativeSelect} from '@chakra-ui/react';
import Detailreview from '../element/detailreview';
import {fetch} from '../../lib/client';

export default function Reviews({userInfo,movieInfo,reviewInfo}){

    const [content, setContent] = useState('');
    const [score, setScore] = useState(10);

    const [acolor, setacolor] = useState('black'); 
    const [bcolor, setbcolor] = useState('gray.500');
    const [ccolor, setccolor] = useState('gray.500');
    const [sortkey, setSortkey] = useState('writetime');// writetime - 최신순 , likenumber - 공감순 , score - 평점순
    const [reviewList, setReviewList] = useState([...reviewInfo]);

    const reviewExist=()=>{
        for(let i=0;i<reviewList.length;i++)
            if(reviewList[i].author===userInfo.username)
                return true;
        return false;
    }

    const reviewOK=()=>userInfo && !reviewExist();
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // 줄바꿈 방지
          handleSubmit();
        }
    };

    const handleSubmit=async (e)=>{/* fetch로 데이터를 넘겨주는 과정 */

        let dataToSend={content:'',score:10};

        if(content===''){
            e.preventDefault();
            alert('내용을 입력해주세요.');
            return;
        }

        dataToSend.content=content;
        dataToSend.score=score;

        const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/logic/${movieInfo.id}`, {
            method: 'POST',
            body: JSON.stringify(dataToSend)
        });

        let sorted;

        if(sortkey==='writetime')sorted=[...res].sort((a,b) => (new Date(b.writetime)-new Date(a.writetime)!=0)?(new Date(b.writetime)-new Date(a.writetime)):(b.likenumber-a.likenumber));
        else if(sortkey==='likenumber')sorted=[...res].sort((a,b) => (b.likenumber-a.likenumber!=0)?(b.likenumber-a.likenumber):(new Date(b.writetime)-new Date(a.writetime)));
        else if(sortkey==='score')sorted=[...res].sort((a,b) => (b.score-a.score!=0)?(b.score-a.score):(new Date(b.writetime)-new Date(a.writetime)));

        setReviewList(sorted);
        setContent(''); // 입력값 초기화
        setScore(10);
    };

    return <>
        <Flex flexDirection='column'>
            <span style={{color:'#352461',fontSize:25}}>{movieInfo.title}에 대한 <span style={{color:'#01738B'}}>{reviewList.length}</span>개의 이야기가 있어요!</span>
            <Flex justifyContent='space-between' pt='50px' pb='15px'>
                <span>전체 <span style={{color:'#01738B'}}>{reviewList.length}</span>건</span>
                <Flex w='150px' justifyContent='space-between'>
                    <Flex color={acolor} _hover={{cursor:'pointer'}} onClick={(e)=>{
                        setSortkey('writetime');
                        setacolor('black');
                        setbcolor('gray.500');
                        setccolor('gray.500');
                        setReviewList([...reviewList].sort((a,b) => (new Date(b.writetime)-new Date(a.writetime)!=0)?(new Date(b.writetime)-new Date(a.writetime)):(b.likenumber-a.likenumber)));
                    }}>최신순</Flex>
                    <Flex color='gray.500'>|</Flex>
                    <Flex color={bcolor} _hover={{cursor:'pointer'}} onClick={(e)=>{
                        setSortkey('likenumber');
                        setacolor('gray.500');
                        setbcolor('black');
                        setccolor('gray.500');
                        setReviewList([...reviewList].sort((a,b) => (b.likenumber-a.likenumber!=0)?(b.likenumber-a.likenumber):(new Date(b.writetime)-new Date(a.writetime))));
                    }}>공감순</Flex>
                    <Flex color='gray.500'>|</Flex>
                    <Flex color={ccolor} _hover={{cursor:'pointer'}} onClick={(e)=>{
                        setSortkey('score');
                        setacolor('gray.500');
                        setbcolor('gray.500');
                        setccolor('black');
                        setReviewList([...reviewList].sort((a,b) => (b.score-a.score!=0)?(b.score-a.score):(new Date(b.writetime)-new Date(a.writetime))));
                    }}>평점순</Flex>
                </Flex>
            </Flex>
            
            
            <Flex flexDirection='column' gap='15px'>
                <Flex w='100%' gap='15px'>
                    <Flex w='120px' h='70px' justifyContent='center' alignItems='center' mr='5px'>{userInfo?userInfo.username:'로그인 필요'}</Flex>
                    <Flex h='70px' border='1px solid #666666' borderRadius='5px' alignItems='center' flex='1'>
                        <Textarea border='none' outline='none' 
                            maxLength='150'
                            /* 1) 리사이즈 자체를 막아 사선무늬 제거 */
                            resize="none"
                            /* 스크롤 자체를 숨김 */
                            overflow="hidden"
                            /* 또는 개별 축 숨김 */
                            overflowX="hidden"
                            overflowY="hidden"
                            /* CSS 커스터마이징으로 모든 브라우저에서 스크롤바 숨기기 */
                            sx={{
                            /* 공통 overflow 숨기기 */
                            overflow: "hidden",
                            /* Chrome, Safari, Edge Chromium */
                            "::-webkit-scrollbar": {
                                width: "0px",
                                height: "0px",
                            },
                            /* Firefox */
                            scrollbarWidth: "none",
                            /* IE 10+ */
                            msOverflowStyle: "none",
                            }}
                        id='content' name='content' h='70px' fontSize='16px' onKeyDown={handleKeyDown}
                        placeholder={!userInfo?'로그인이 필요합니다.':(reviewExist()?'리뷰는 한 영화당 한 개만 작성할 수 있습니다.':`${movieInfo.title} 재미있게 보셨나요? 영화의 어떤 점이 좋았는지 이야기해주세요.`)}
                        readOnly={!reviewOK()}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        _hover={{cursor:'default'}}
                        />
                        <span style={{overflow:'visible'}}>⭐</span>
                        <span style={{padding:5}}>:</span>
                        <NativeSelect.Root w="90px" pr='10px' flexShrink={0}>
                            <NativeSelect.Field w='90px' id='score' name='score' defaultValue='10' value={score} onChange={(e) => setScore(Number(e.target.value))} disabled={!reviewOK()} // 여기서 제어
                                style={{ cursor: !reviewOK() ? 'default' : 'pointer' }} // 금지 커서 막기
                                >
                                <option value={10}>10</option>
                                <option value={9}>9</option>
                                <option value={8}>8</option>
                                <option value={7}>7</option>
                                <option value={6}>6</option>
                                <option value={5}>5</option>
                                <option value={4}>4</option>
                                <option value={3}>3</option>
                                <option value={2}>2</option>
                                <option value={1}>1</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator/>
                        </NativeSelect.Root>
                        {reviewOK() && (<Button bg='white' color='#666666' h='60px' fontSize='16px' onClick={handleSubmit}>✏️ 관람평쓰기</Button>)}
                    </Flex>
                </Flex>
                {reviewList.map((review,index)=>
                    <Detailreview key={index} author={review.author} score={review.score} content={review.content} likenum={review.likenumber}></Detailreview>    
                )}
            </Flex>
            
        </Flex>
    </>;
}