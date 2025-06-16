'use client';

import React, { useState } from 'react';

import { Flex, Text, Box, Button, Image, Menu, Portal } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { fetch } from '../../lib/client';
import Modal, { useModal } from '../../components/movie/modal';

export default function Detailreview({ isMobile = false, id, userInfo, author, score, content, likenum, likeusers, reviewList, setReviewList, setModifyId, movieInfo, isHome = false, authorColor = 'black', bgColor = '#F8F8FA', contentColor = '#666691', titleColor = 'gray', likeColor = '#666691', currentPage, setCurrentPage }) {

  let username = userInfo ? userInfo.username : '';

  const didilikeit = () => likeusers.includes(username);

  const handleSubmit = async () => {/* 공감/비공감시 fetch로 데이터를 넘겨주는 과정 */

    let dataToSend = {};
    dataToSend.liked = didilikeit();
    dataToSend.liker = username;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/like/logic/${id}`, {
      method: 'POST',
      body: JSON.stringify(dataToSend)
    });

    setReviewList(prevList => prevList.map(review => {
      if (review.id === id) {
        return {
          ...review,
          likeusers: res,
          likenumber: res.length
        };
      }
      return review;
    }));
  };

  const deletereview = async () => {
    openModal('리뷰를 삭제하시겠습니까?',
      () => {
        async () => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/delete/logic/${id}`, {
            method: "POST",
            credentials: "include"  // 쿠키 세션 등 필요하면
          });

          if (reviewList.filter(review => review.id !== id).length % 10 === 0 && currentPage > 1) setCurrentPage(currentPage - 1);
          setReviewList(prevList => prevList.filter(review => review.id !== id));
        }
      }, ()=>{}, true
    );
  }

  const bounce = keyframes`
      0% { transform: scale(1); }
      10% { transform: scale(0.9); }
      50% { transform: scale(1.3) rotateZ(-15deg); }
      100% {transform:scale(1) rotateZ(0deg);}
    `;

  const [animate, setAnimate] = useState(false);
  const { isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel, isConfirm } = useModal();

  const triggerAnimation = () => {
    setAnimate(true);
    // 애니메이션 끝나면 상태 초기화 (1초 후)
    setTimeout(() => setAnimate(false), 800);
  };

  return <>
    <Flex w={!isMobile ? '100%' : '95%'} m={!isMobile ? '0' : 'auto'} gap='15px' transition='all 0.2s ease' {...(isHome && { _hover: { transform: 'translateY(-5px)' } })}>
      {!isMobile && <Flex w='125px' h='100px' justifyContent='center' alignItems='center' mr='5px' color={authorColor} whiteSpace="normal" wordBreak="break-word">{author.substring(0, 2) + '**' + author.substring(4)}</Flex>}
      <Flex w='100%' h='100px' flex='1' borderRadius='5px' alignItems='center' bg={bgColor}>
        <Flex w='100%' gap='15px' alignItems='center'>
          <span style={{ color: '#352461', paddingLeft: 20, width: !isMobile ? 100 : 70 }}>관람평</span>
          <span style={{ color: '#352461', fontSize: !isMobile ? 40 : 24, width: !isMobile ? 50 : 25 }}>{score}</span>
          <Box bg='#DFDFE1' w='1px' h='50px'></Box>
          <Text pl='20px' flex='1' color={contentColor}>{content}</Text>
          {!isHome ?
            <>
              <Flex flexDirection='column' justifyContent='center' alignItems='center' w='60px' h='60px' borderRadius='50%'
                {...(username && { _hover: { bg: 'gray.300' } })} position='relative' {...(author === username || userInfo?.auth === 'ADMIN') ? { mr: '-24.5px' } : { mr: '30px' }} {...(isHome && { transition: 'all 0.4s ease' })}>
                {username ? (<Button type='button' bg='transparent' h='30px' fontSize='16px' border='none' outline='none' onClick={() => {
                  if (!didilikeit()) triggerAnimation();
                  handleSubmit();
                }}>
                  <Box
                    key={animate ? 'bounce' : 'static'}
                    animation={animate ? `${bounce} 0.8s ease` : 'none'}
                    as="span"
                    transition="transform 0.2s ease" // 클릭할 때 부드럽게
                    _active={{ transform: "scale(0.8)" }}
                  >
                    <Image loading='lazy' src={didilikeit() ? `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/liked.png`
                      : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/unliked.png`} w='20px' h='20px' />
                  </Box>
                </Button>
                ) : <Image loading='lazy' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/unliked.png`} w='20px' h='20px' opacity='0.5'></Image>
                }

                <Text textAlign='center' overflow='visible' ml='2px' w='50px' h='13px' fontSize='13px' border='none' outline='none' color='#666691'>{likenum}</Text>
              </Flex>
              {author === username || userInfo?.auth === 'ADMIN' ?
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button variant="outline" fontSize='20px' bg='transparent' outline='none' border='none'>
                      ⋮
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner overflow='visible'>
                      <Menu.Content position='relative' bottom='25px'>
                        <Menu.Item value="new-txt" onSelect={() => setModifyId(id)}>수정</Menu.Item>
                        <Menu.Item value="new-file" onSelect={() => deletereview()}>삭제</Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                : <></>}
            </>
            :
            <>
              {!isMobile && <Text pr='50px' color={titleColor}>-  {movieInfo.title}</Text>}
              <Flex flexDirection='column' justifyContent='center' alignItems='center' w='60px' h='60px'>
                <Image loading='lazy' src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/unliked.png`} w='20px' h='20px' opacity='0.5'></Image>
                <Text textAlign='center' overflow='visible' ml='2px' w='50px' h='13px' fontSize='13px' border='none' outline='none' color={likeColor}>{likenum}</Text>
              </Flex>
            </>
          }

        </Flex>
      </Flex>
    </Flex>
    {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isConfirm={isConfirm}
      content={modalContent} />)}
  </>
}