'use client';

import React,{useState} from 'react';

import {RadioGroup,Input,Box,VStack,Flex,Button} from '@chakra-ui/react';
import {Header} from '../../components';
import Link from 'next/link';
import {fetch} from '../../lib/client';
import Modal, { useModal } from '../movie/modal';

export default function Findiddetail({userData}){
    const [foundID,setFoundID]=useState('');
    const [layout,setLayout]=useState('email');
    const [formData,setFormData]=useState({method:'email',name:'',email:'',phone_number:''});
    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm} = useModal();

    const handleFindID=async ()=>{
        let dataToSend={...formData};/* 기존 formData 복사 */

        dataToSend.name = document.querySelector('#name').value;
        if(formData.method==='email')
            dataToSend.email = document.querySelector('#email').value;
        else if(formData.method==='phone_number')
            dataToSend.phone_number = document.querySelector('#phone_number').value;

        const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/find_id/logic`, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
        });

        if(document.querySelector('#name').value===''){
            openModal('이름을 입력하세요.');
            setFoundID('');
            return;
        }
        if(formData.method==='email'&&document.querySelector('#email').value===''){
            openModal('이메일을 입력하세요.');
            setFoundID('');
            return;
        }
        if(formData.method==='phone_number'&&document.querySelector('#phone_number').value===''){
            openModal('휴대폰 번호를 입력하세요.');
            setFoundID('');
            return;
        }

        if(!res||!res.foundID) {
            openModal('해당하는 사용자 정보가 없습니다.');
            setFoundID('');
            return;
        }

        openModal(`회원님의 아이디는 [${res.foundID}]입니다.]`)
        setFoundID(res.foundID);/* 객체에서 문자열만 꺼내서 저장 */
    }

    if(foundID===''){/* 아이디 찾기 이전에 보이는 부분 */
        return <>
            <Header userInfo={userData}></Header>
            <Box w='100vw' minW={{base:'0px',md:'1000px'}} h='540px'>
                <VStack w='100%' h='540px'>
                    <Box w={{base:'100%',md:'900px'}} px='30px' m='40px' borderRadius='10px' bg='white'>
                        <Flex w={{base:'100%',md:'840px'}} flexDirection='column' gap='15px' py='50px'>
                            <span style={{fontSize:28,marginBottom:10,textAlign:'center'}}>아이디 찾기</span>
                            <label htmlFor="method_email">찾기 방법</label>{/* ID 찾기 방법을 선택하는 단계 */}
                            <RadioGroup.Root defaultValue="email" onChange={(e) => {
                                  setLayout(e.target.value);
                                  setFormData(f=>({...f,method:e.target.value}));
                                }}>
                                <RadioGroup.Item id="method_email" name="method" type="radio" value="email">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator/>
                                    <RadioGroup.ItemText>이메일</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                <RadioGroup.Item id="method_phone_number" name="method" type="radio" value="phone_number">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator/>
                                    <RadioGroup.ItemText>휴대폰 번호</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </RadioGroup.Root>
                            <table>
                                <tbody>
                                    <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='name'>이름</label></td>
                                        <td style={{width:605,height:50,paddingLeft:15}}><Input id="name" name="name" placeholder="이름"/></td>
                                    </tr>
                                    <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}>{<label htmlFor={layout}>{layout==='email'?'이메일':'휴대폰 번호'}</label>}</td>
                                        <td style={{width:605,height:50,paddingLeft:15}}>{layout==='email'?<Input id="email" name="email" placeholder="example@email.com"/>:<Input id="phone_number" name="phone_number" placeholder="01012345678"/>}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <Button bg='#6B46C1' _hover={{bg:'#553C9A'}} mt='20px' onClick={handleFindID}>아이디 찾기</Button>
                        </Flex>
                    </Box>
                </VStack>
            </Box>
            {isModalOpen && (<Modal
            isModalOpen={isModalOpen}
            isModalVisible={isModalVisible}
            closeModal={closeModal}
            onConfirm={onConfirm}
            content={modalContent}/>)}       
        </>;
    }else{/* 찾은 아이디를 보여주는 부분 */
        return <>
            <Header userInfo={userData}></Header>
            <Box w='100vw' minW={{base:'0px',md:'1000px'}} h='540px'>
                <VStack w='100%' h='540px'>
                    <Box w={{base:'100%',md:'900px'}} px='30px' m='40px' borderRadius='10px' bg='white'>
                        <Flex w={{base:'100%',md:'840px'}} flexDirection='column' alignItems='center' gap='15px' py='50px'>
                            <Button bg='#6B46C1' _hover={{bg:'#553C9A'}} onClick={()=>setFoundID('')}>
                                <Link href='/find_id'>
                                    아이디 다시 찾기
                                </Link>
                            </Button>
                            <Button bg='#6B46C1' _hover={{bg:'#553C9A'}}>
                                <Link href='/find_pw'>
                                    비밀번호 재설정
                                </Link>
                            </Button>
                            <Button bg='#6B46C1' _hover={{bg:'#553C9A'}}>
                                <Link href='/signin'>
                                    로그인 화면으로 이동
                                </Link>
                            </Button>
                        </Flex>
                    </Box>
                </VStack>
            </Box>
            {isModalOpen && (<Modal
            isModalOpen={isModalOpen}
            isModalVisible={isModalVisible}
            closeModal={closeModal}
            onConfirm={onConfirm}
            content={modalContent}/>)}
        </>;
    }
}