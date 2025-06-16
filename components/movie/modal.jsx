'use client';

import {Box, Button, Flex, CloseButton} from '@chakra-ui/react'
import React, {useState, useEffect, useRef} from 'react'

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
    const [modalContent, setModalContent] = useState('');
    const [isConfirm, setIsConfirm] = useState(false);
    const onConfirmRef = useRef(()=>{});
    const onCancelRef = useRef(()=>{});

    const openModal = (content='', onConfirm=()=>{}, onCancel=()=>{}, isConfirm=false) => {
        console.log("modal opened");
        onConfirmRef.current = onConfirm;
        onCancelRef.current = onCancel;
        setIsConfirm(isConfirm);
        setModalContent(content);
        setIsModalOpen(true);
        setTimeout(() => setIsModalVisible(true), 10);
    };
    const closeModal = () => {
        console.log("modal closed");
        setIsModalVisible(false);
        setTimeout(() => {
            setIsModalOpen(false);
            onConfirmRef.current = ()=>{};
            onCancelRef.current = ()=>{};
            setIsConfirm(false);
            setModalContent('');
        }, 300);
    };

    return {isModalOpen, isModalVisible, openModal, closeModal, modalContent
            , onConfirm : onConfirmRef.current, onCancel : onCancelRef.current, isConfirm}
}

const Modal = ({isModalOpen, isModalVisible, closeModal, content, 
                isVideo=false, isConfirm=false, onConfirm, onCancel}) => {

    const handleConfirm = () => {
        closeModal();
        setTimeout(() => {
            if (onConfirm) onConfirm(); // 모달 확인 후 후속 작업 실행
        }, 300); // closeModal 애니메이션 시간과 동일하게 맞춰야 깔끔
    };

    const handleCancel = () => {
        closeModal();
        setTimeout(() => {
            if (onCancel) onCancel(); // 모달 취소 후 후속 작업 실행
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
            position="fixed" inset="0" zIndex="9999" 
            display="flex" alignItems="center" justifyContent="center"
            bg="blackAlpha.500"
            onClick={handleCancel}
        >
            {/* 모달창 */}
            <Flex
                className={`modal-content ${isModalVisible ? 'show' : ''}`}
                position="relative" bg={!isVideo?"white":'black'} borderRadius="xl" shadow="2xl" 
                maxW={isVideo ? "970px" : "md"} w="full" mx="4" marginTop="-5%"
                justifyContent='center' alignItems='center'
                pt='15px' pb={!isVideo?'30px':'0px'}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 모달창 내부 */}
                <Flex flexDirection='column' textAlign="center" w='100%' justifyContent='center' alignItems='center'>
                    {/* 동영상 모달창 닫기 버튼 */}
                    {isVideo && <Button
                        position='absolute'
                        top='-3px'
                        right='-8px'
                        fontSize=''
                        bg='transparent'
                        onClick={handleCancel}
                    >
                        <CloseButton color='white' width='15px' height='15px' position='relative' left='12px' _hover={{bg:'transparent'}}></CloseButton>
                    </Button>}

                    {/* 메인 내용 */}
                    <Box mb="6" fontSize="xl" color="black" pt='10px' pb='0px'>
                        <div dangerouslySetInnerHTML={{ __html: content }}/>
                    </Box>
                    
                    {/* 확인 / 닫기 버튼 */}
                    {!isVideo && (
                        <Flex w="60%" justifyContent={isConfirm ? "space-between" : "center"}>
                            <Button
                                width="33%" py="3" padding="8px" fontSize="large"
                                bg="#6b46c1" color="white" borderRadius="4px" 
                                _hover={{bg : "#553c9a"}}
                                onClick={handleConfirm}
                            >
                                확인
                            </Button>
                            {isConfirm && (
                            <Button
                                width="33%" py="3" padding="8px" fontSize="large"
                                bg="gray.200" color="black" borderRadius="4px" 
                                _hover={{bg : "gray.400"}}
                                onClick={handleCancel}
                            >
                                취소
                            </Button>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Box>
    </>
}

export default Modal;