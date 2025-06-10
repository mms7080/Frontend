'use client';

import React, { useState, useEffect } from 'react'
import { Text, Box, Button} from '@chakra-ui/react'

// 모달 애니메이션 CSS
const modalStyles = `
    .modal-overlay {
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
    }
    .modal-overlay.show {
        opacity: 1;
    }
    .modal-content {
        transform: scale(0.9);
        transition: transform 0.2s ease-in-out;
    }
    .modal-content.show {
        transform: scale(1);
    }
`;

export const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
        setTimeout(() => setIsModalVisible(true), 10);
    };
    const closeModal = () => {
        setIsModalVisible(false);
        setTimeout(() => setIsModalOpen(false), 300);
    };

    return { isModalOpen, isModalVisible, openModal, closeModal }
}

const Modal = ({ isModalOpen, isModalVisible, closeModal, onConfirm, title, content }) => {

    const handleCancel = () => {
        closeModal();
        setTimeout(() => {
            if (onConfirm) onConfirm(); // 모달 닫힌 후 후속 작업 실행
        }, 300); // closeModal 애니메이션 시간과 동일하게 맞춰야 깔끔
    };


    // 모달 나와있는 동안 스크롤 봉인
    useEffect(() => {
        if (isModalOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.overflow = '';
        };
    }, [isModalOpen]);


    return <>
        <style>{modalStyles}</style>
        {/* 모달창 바깥부분 흐려지도록 */}
        <Box
            className={`modal-overlay ${isModalVisible ? 'show' : ''}`}
            position="fixed" inset="0" zIndex="105"
            display="flex" alignItems="center" justifyContent="center"
            bg="blackAlpha.500"
            onClick={handleCancel}
        >
            {/* 모달창 */}
            <Box
                className={`modal-content ${isModalVisible ? 'show' : ''}`}
                position="relative" bg="white" borderRadius="xl" shadow="2xl"
                maxW="xl" w="full" mx="4" overflow="hidden" marginTop="-5%"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 부분 */}
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    p="3"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    backgroundColor="#6b46c1"
                >
                    <Text fontSize="xl" fontWeight="md" color="white">
                        {title}
                    </Text>
                    <Button
                        onClick={handleCancel}
                        backgroundColor="#6b46c1"
                        fontSize="xl"
                        color="white"
                        position="absolute"
                        right="2"
                    >X</Button>
                </Box>
                {/* 메인 부분 */}
                <Box p={6}>
                    {content}
                </Box>
            </Box>
        </Box>
    </>
}

export default Modal;