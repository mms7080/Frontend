'use client';

import React, { useState, useEffect } from 'react'
import { Text, Box, Button} from '@chakra-ui/react'

// 모달 애니메이션 CSS + 스크롤바 CSS
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

    .modal-scroll {
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
    }
    .modal-scroll::-webkit-scrollbar {
        width: 8px;
    }
    .modal-scroll::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    .modal-scroll::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }
    .modal-scroll::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
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
            p="4"
        >
            {/* 모달창 */}
            <Box
                className={`modal-content ${isModalVisible ? 'show' : ''}`}
                position="relative" overflow="hidden"
                bg="white" borderRadius="xl" 
                shadow="2xl" marginTop="-5%"
                maxW="xl" w="full" mx="4" maxH="80vh"
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
                    flexShrink="0"
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
                <Box
                    className="modal-scroll"
                    overflowY="auto"
                    flex="1"
                    minH="0"
                    maxH="calc(80vh - 80px)"
                    sx={{
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#c1c1c1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#a8a8a8',
                        },
                    }}
                >
                    {content}
                </Box>
            </Box>
        </Box>
    </>
}

export default Modal;