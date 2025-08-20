'use client';

import React,{useState} from 'react';

import {Button} from '@chakra-ui/react';
import Modal,{useModal} from '../movie/modal';
import {fetch} from '../../lib/client';
import {AiOutlineHeart,AiFillHeart} from 'react-icons/ai';

export default function LikePart({id,res,movieinfo,isMobile=false}){
  
    const address = `https://filmora.kafolio.kr/detail/${id}`; // 복사할 주소

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(address);
        openModal('현재 페이지의 주소가 클립보드에<br/>복사되었습니다!');
      } catch (err) {
        openModal('클립보드 접근이 차단되었습니다.');
      }
    };

    const [liked, likedController] = useState(res?(res.likemovies.includes(Number(id))):false);
    const [likeNumber, setLikeNumber] = useState(movieinfo.likeNumber > 999 ? Math.floor(movieinfo.likeNumber / 100) / 10 + 'k' : movieinfo.likeNumber);
    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();
    
    const likeChange = async () => {
        if(!res){
            openModal('로그인이 필요합니다.');
            return;
        }
        else{
            const data = Number(await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/update/like?id=${id}&updown=${liked ? "down" : "up"}`));
            const respond = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movieLikeToggle/${id}`);
            likedController(!liked);
            setLikeNumber(data > 999 ? Math.floor(data / 100) / 10 + 'k' : data);
        }
    };    

    return <>
        <Button w={!isMobile?'93.27px':'45%'} transition="all 0.3s" _hover={{bg:"#6B46C1"}} fontSize='15px' boxShadow='4px 4px 6px black' onClick={likeChange}>{liked?<AiFillHeart style={{width:25,height:25}} color='red'/>:<AiOutlineHeart style={{width:25,height:25}} color='red'/>}{
            likeNumber                             
        }</Button>
        <Button w={!isMobile?'82.22px':'45%'} transition="all 0.3s" _hover={{bg:"#6B46C1"}} fontSize='15px' boxShadow='4px 4px 6px black' onClick={handleCopy}>공유하기</Button>
        {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        content={modalContent}
        isPaddingLarge={true}/>)}
    </>;

}