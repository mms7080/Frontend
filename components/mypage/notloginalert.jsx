'use client';

import React,{useEffect} from 'react';

import {useRouter} from 'next/navigation';

import Modal, { useModal } from '../movie/modal';

export default function Notloginalert({userInfo}){
    const router=useRouter();
    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel, isConfirm} = useModal();

    useEffect(() => {
        if (!userInfo)
            openModal("로그인이 필요합니다.", () => { router.push("/signin"); }, () => { router.push("/signin"); });
    }, []);
    
    return <>
        {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isConfirm={isConfirm}
      content={modalContent} />)}
    </>;    
}