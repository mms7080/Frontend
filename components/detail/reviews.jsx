'use client';

import React,{useState} from 'react';
import {Flex,VStack} from '@chakra-ui/react';
import Detailreview from '../element/detailreview';
import Reviewwrite from '../element/reviewwrite';

import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

export default function Reviews({userInfo,movieInfo,reviewInfo}){

    const [modifyid,setModifyId]=useState(-1);
    const [acolor, setacolor] = useState('black'); 
    const [bcolor, setbcolor] = useState('gray.500');
    const [ccolor, setccolor] = useState('gray.500');
    const [sortkey, setSortkey] = useState('writetime');// writetime - 최신순 , likenumber - 공감순 , score - 평점순
    const [reviewList, setReviewList] = useState([...reviewInfo].sort((a,b) => (new Date(b.writetime)-new Date(a.writetime)!=0)?(new Date(b.writetime)-new Date(a.writetime)):(b.likenumber-a.likenumber)));

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 10;

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviewList.slice(indexOfFirstReview, indexOfLastReview);

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
                    <Reviewwrite modifyid={-1} username={userInfo?userInfo.username:''} reviewList={reviewList} sortkey={sortkey} 
                    setReviewList={setReviewList} movieInfo={movieInfo}
                    initialContent='' initialScore={10}></Reviewwrite>
                </Flex>
                {currentReviews.map((review,index)=>
                {
                    if(modifyid===review.id)return <Reviewwrite setModifyId={setModifyId} modifyid={modifyid} username={review.author} key={indexOfFirstReview+index} 
                    reviewList={reviewList} sortkey={sortkey} 
                    setReviewList={setReviewList} movieInfo={movieInfo}
                    initialContent={review.content} initialScore={review.score}></Reviewwrite>;
                    else return <Detailreview userInfo={userInfo} key={indexOfFirstReview+index}
                      id={review.id} author={review.author} score={review.score} content={review.content}
                      likenum={review.likenumber} likeusers={review.likeusers}
                      setReviewList={setReviewList} setModifyId={setModifyId} movieInfo={movieInfo} isHome={false}></Detailreview>;
                }
                )}
            </Flex>
            
        </Flex>

        <VStack pt='15px'>
        <Pagination.Root count={reviewList.length} 
         pageSize={reviewsPerPage} page={currentPage} onPageChange={({page}) =>setCurrentPage(page)}>
  <ButtonGroup variant="ghost" size="sm">
    <Pagination.PrevTrigger asChild>
      <IconButton>
        <LuChevronLeft />
      </IconButton>
    </Pagination.PrevTrigger>

{/* 10개씩 페이지 그룹 렌더링 */}
      {(() => {
        const totalPages = Math.ceil(reviewList.length / reviewsPerPage);
        const pageGroupSize = 10;
        const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
        const startPage = currentGroup * pageGroupSize + 1;
        const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

        return Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
          const pageNum = startPage + idx;
          return (
            <Pagination.Item key={pageNum} value={pageNum} asChild>
              <IconButton
                variant={{ base: "ghost", _selected: "outline" }}
              >
                {pageNum}
              </IconButton>
            </Pagination.Item>
          );
        });
      })()}

    <Pagination.NextTrigger asChild>
      <IconButton>
        <LuChevronRight />
      </IconButton>
    </Pagination.NextTrigger>
  </ButtonGroup>
</Pagination.Root>
    </VStack>
    </>;
}