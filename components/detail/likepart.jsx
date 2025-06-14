'use client';

import React,{useState} from 'react';

import {Button} from '@chakra-ui/react';
import Modal,{useModal} from '../movie/modal';
import {fetch} from '../../lib/client';
import {AiOutlineHeart,AiFillHeart} from 'react-icons/ai';

export default function LikePart({id,res,movieinfo}){


    // 🔹 모달 내용 상태 추가 
    const [modalContent, setModalContent] = useState('로그인 후 이용해주세요.');
  
    const address = `http://localhost:3000/detail/${id}`; // 복사할 주소

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(address);
        setModalContent('현재 페이지의 주소가 클립보드에 복사되었습니다!');
        openModal();
      } catch (err) {
        setModalContent('클립보드 접근이 차단되었습니다.');
        openModal();
      }
    };

    const [liked, likedController] = useState(res?(res.likemovies.includes(Number(id))):false);
    const [likeNumber, setLikeNumber] = useState(movieinfo.likeNumber > 999 ? Math.floor(movieinfo.likeNumber / 100) / 10 + 'k' : movieinfo.likeNumber);
    const {isModalOpen, isModalVisible, openModal, closeModal} = useModal();
    
    const likeChange = async () => {
        if(!res){
            setModalContent('로그인 후 이용해주세요.');
            openModal();
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
        <Button transition="all 0.3s" _hover={{bg:"#6B46C1"}} fontSize='15px' boxShadow='4px 4px 6px black' onClick={likeChange}>{liked?<AiFillHeart style={{width:25,height:25}} color='red'/>:<AiOutlineHeart style={{width:25,height:25}} color='red'/>}{
            likeNumber                             
        }</Button>
        <Button transition="all 0.3s" _hover={{bg:"#6B46C1"}} fontSize='15px' boxShadow='4px 4px 6px black' onClick={handleCopy}>공유하기</Button>
        {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        content={modalContent}/>)}
    </>;

}