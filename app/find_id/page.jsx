"use client";

import React,{useState} from 'react';
import {RadioGroup,Input,Box,VStack,Flex,Button} from '@chakra-ui/react';
import {Header,Footer} from '../../components';

import Link from 'next/link';
import {fetch} from '../../lib/client';

export default function Find_id(){

    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';

    const [foundID,setFoundID]=useState('');
    const [layout,setLayout]=useState('email');
    const [formData,setFormData]=useState({method:'email',name:'',email:'',phone_number:''});

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
            alert('이름을 입력하세요.');
            setFoundID('');
            return;
        }
        if(formData.method==='email'&&document.querySelector('#email').value===''){
            alert('이메일을 입력하세요.');
            setFoundID('');
            return;
        }
        if(formData.method==='phone_number'&&document.querySelector('#phone_number').value===''){
            alert('휴대폰 번호를 입력하세요.');
            setFoundID('');
            return;
        }

        if(!res||!res.foundID) {
            alert('해당하는 사용자 정보가 없습니다.');
            setFoundID('');
            return;
        }

        alert(`회원님의 아이디는 [${res.foundID}]입니다.]`)
        setFoundID(res.foundID);/* 객체에서 문자열만 꺼내서 저장 */
    }

    const EmailLayout=()=>{
        return <>
                <Input id="email" name="email" placeholder="example@email.com"/>
            </>;
    }

    const PhoneLayout=()=>{
        return <>
                <Input id="phone_number" name="phone_number" placeholder="01012345678"/>
            </>;
    }

    if(foundID===''){/* 아이디 찾기 이전에 보이는 부분 */
        return <>
            <Header headerColor={headerColor} headerBg={headerBg}></Header>
            <Box w='calc(100vw - 17px)' minW='1000px' h='540px'>
                <VStack w='100%' bg='#F9F9F9' h='540px'>
                    <Box w='900px' px='30px' m='40px' borderRadius='10px' bg='white' boxShadow='-5px 5px 5px rgba(0, 0, 0, 0.05), 5px 5px 5px rgba(0, 0, 0, 0.05)'>
                        <Flex w='840px' flexDirection='column' gap='15px' py='50px'>
                            <span style={{fontSize:28,marginBottom:10,textAlign:'center'}}>아이디 찾기</span>
                            <label htmlFor="method_email">찾기 방법</label>{/* ID 찾기 방법을 선택하는 단계 */}
                            <RadioGroup.Root defaultValue="email" onChange={(e) => {
                                  setLayout(e.target.value);
                                  setFormData(f=>({...f,method:e.target.value}));
                                }}>
                                <RadioGroup.Item id="method_email" name="method" type="radio" value="email">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator style={{backgroundColor:'#352461'}}/>
                                    <RadioGroup.ItemText>이메일</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                <RadioGroup.Item id="method_phone_number" name="method" type="radio" value="phone_number">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator style={{backgroundColor:'#352461'}}/>
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
                                        <td style={{width:605,height:50,paddingLeft:15}}>{layout==='email'?<EmailLayout/>:<PhoneLayout/>}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <Button bg='#352461' mt='20px' onClick={handleFindID}>아이디 찾기</Button>
                        </Flex>
                    </Box>
                </VStack>
            </Box>
            <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>            
        </>;
    }else{/* 찾은 아이디를 보여주는 부분 */
        return <>
            <Header headerColor={headerColor} headerBg={headerBg}></Header>
            <Box w='calc(100vw - 17px)' minW='1000px' h='540px'>
                <VStack w='100%' bg='#F9F9F9' h='540px'>
                    <Box w='900px' px='30px' m='40px' borderRadius='10px' bg='white' boxShadow='-5px 5px 5px rgba(0, 0, 0, 0.05), 5px 5px 5px rgba(0, 0, 0, 0.05)'>
                        <Flex w='840px' flexDirection='column' alignItems='center' gap='15px' py='50px'>
                            <Button bg='#352461' onClick={()=>setFoundID('')}>
                                <Link href='/find_id'>
                                    아이디 다시 찾기
                                </Link>
                            </Button>
                            <Button bg='#352461'>
                                <Link href='/find_pw'>
                                    비밀번호 재설정
                                </Link>
                            </Button>
                            <Button bg='#352461'>
                                <Link href='/signin'>
                                    로그인 화면으로 이동
                                </Link>
                            </Button>
                        </Flex>
                    </Box>
                </VStack>
            </Box>
            <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
        </>;
    }

}