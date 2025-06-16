'use client';

import React,{useEffect} from 'react';

import {useRouter} from 'next/navigation';

import Modal, { useModal } from '../movie/modal';

export default function Notloginalert({userInfo}){
    const router=useRouter();
    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();

    useEffect(() => {
        if (!userInfo)
            openModal('로그인 후 이용해주세요.');
    }, []);

    const handleConfirm = () => {
        router.push('/signin'); // 확인 후 라우팅
    };

    return <>
        {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={handleConfirm}
        content={modalContent}/>)}
    </>;    
}