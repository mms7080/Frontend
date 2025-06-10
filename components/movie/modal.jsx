'use client';

import React, {useState, useEffect} from 'react'
import {Box, Button, Flex} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons';

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

    return {isModalOpen, isModalVisible, openModal, closeModal}
}

const Modal = ({isModalOpen, isModalVisible, closeModal,onConfirm,content,isVideo=false}) => {

    const handleConfirm = () => {
        closeModal();
        setTimeout(() => {
            if (onConfirm) onConfirm(); // 모달 닫힌 후 후속 작업 실행
        }, 300); // closeModal 애니메이션 시간과 동일하게 맞춰야 깔끔
    };

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
        <Box      
            className={`modal-overlay ${isModalVisible ? 'show' : ''}`}
            position="fixed" inset="0" zIndex="50" 
            display="flex" alignItems="center" justifyContent="center"
            bg="blackAlpha.500"
            onClick={handleCancel}
        >
            <Flex
                className={`modal-content ${isModalVisible ? 'show' : ''}`}
                position="relative" bg={!isVideo?"white":'black'} borderRadius="xl" shadow="2xl" 
                maxW={isVideo ? "970px" : "md"} w="full" mx="4" marginTop="-5%"
                justifyContent='center' alignItems='center'
                pt='15px' pb={!isVideo?'30px':'0px'}
                onClick={(e) => e.stopPropagation()}
            >
                <Flex flexDirection='column' textAlign="center" w='100%' justifyContent='center' alignItems='center'>
                    {isVideo && <Button
                        position='absolute'
                        top='-3px'
                        right='-8px'
                        fontSize=''
                        bg='transparent'
                        onClick={handleConfirm}
                    >
                        <CloseIcon color='white' width='15px' height='15px' _hover={{color:'gray.500'}}></CloseIcon>
                    </Button>}
                    <Box mb="6" fontSize="xl" color="black" pt='10px' pb='0px'>
                        <div dangerouslySetInnerHTML={{ __html: content }}/>
                    </Box>
                    {!isVideo && <Button
                        width="20%" py="3" padding="8px" fontSize="large"
                        bg="#6b46c1" color="white" borderRadius="4px" 
                        _hover={{bg : "#553c9a"}}
                        onClick={handleConfirm}
                    >
                        확인
                    </Button>}
                </Flex>
            </Flex>
        </Box>
    </>
}

export default Modal;