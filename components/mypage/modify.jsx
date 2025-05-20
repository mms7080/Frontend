"use client";

import React,{useState,useEffect} from 'react';
import {Flex,Box,VStack,Input,HStack,Button,Text} from '@chakra-ui/react';

export default function Modify({userInfo}) {/* 마이페이지에서 수정할 수 있는 정보들인 비밀번호, address_detail, phone, email, birthdate, gender 수정사항 반영 */

    const [address_detail,setAddressDetail]=useState(userInfo.address_detail);
    const [phone,setPhone] = useState(userInfo.phone);
    const [email,setEmail] = useState(userInfo.email);
    const [birthdate,setBirthdate] = useState(userInfo.birthdate);
    const [gender,setGender] = useState(userInfo.gender);

    const [pw,setPw]=useState('');
    const [pwMessage,setPwMessage]=useState('');/* 비밀번호 입력창 밑의 메세지 */
    const [isPwAvailable,setIsPwAvailable]=useState(true);/* 비밀번호 유효성 여부 */
    const [pwr,setPwr]=useState('');
    const [pwrMessage,setPwrMessage]=useState('');/* 비밀번호 확인 입력창 밑의 메세지 */
    const [isPwrAvailable,setIsPwrAvailable]=useState(true);/* 비밀번호 확인이 비밀번호와 같은지 여부 */

    const handleSubmit = async (e) => {
        if(!isPwAvailable){
            e.preventDefault();/* 비밀번호 확인과 비밀번호가 일치되지 않았으면 폼 제출 막기 */
            alert('비밀번호는 10자 이상 입력해주세요.');
            return;
        }
        if(!isPwrAvailable){
            e.preventDefault();/* 비밀번호 확인과 비밀번호가 일치되지 않았으면 폼 제출 막기 */
            alert('비밀번호 확인과 비밀번호가 일치하나 확인해주세요.');
            return;
        }
    };

    return <Box w='calc(100vw - 17px)' minW='1000px'>
                <VStack w='100%' bg='#F9F9F9'>
                    <form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/modify/logic`} method='post' onSubmit={handleSubmit}>
                        <Box w='900px' px='30px' m='40px' borderRadius='10px' bg='white' boxShadow='-5px 5px 5px rgba(0, 0, 0, 0.05), 5px 5px 5px rgba(0, 0, 0, 0.05)'>
                            <Flex w='840px' flexDirection='column' gap='15px' py='50px'>
                                <span style={{fontSize:28,marginBottom:10,textAlign:'center'}}>회원가입</span>
                                <label htmlFor='id'>아이디</label>
                                
                                <Input w='675px' id="id" name="id" value={userInfo.username} readOnly/>
                                <label htmlFor='pw'>비밀번호</label>
                                <Input 
                                    id="pw"
                                    name="pw"
                                    type="password"
                                    placeholder='새 비밀번호를 입력 (변경하지 않으려면 비워두세요)'
                                    onChange={(e)=>{
                                        const value=e.target.value;
                                        setPw(value);
                                        setIsPwAvailable(null);/* 비밀번호 값이 바뀌면 다시 유효성 여부를 검사 */
                                        if(value.length>0 && value.length<10){
                                            setIsPwAvailable(false);
                                            if(value.length>=5)
                                                setPwMessage('⚠️ 비밀번호가 약합니다. (최소 10자 필요)');
                                            else
                                                setPwMessage('');
                                        }
                                        else{
                                            setIsPwAvailable(true);
                                            setPwMessage('✅ 강한 비밀번호입니다!');
                                        }
                                        if(value.length>0){
                                            if(pwr===value){/* 비밀번호를 바꾸다가 비밀번호 확인과 일치할 경우를 대비한 코드 */
                                                setPwrMessage('✅ 비밀번호가 일치합니다.');
                                                setIsPwrAvailable(true);
                                            }
                                            else{
                                                setPwrMessage('❌ 비밀번호가 일치하지 않습니다.');
                                                setIsPwrAvailable(false);
                                            }
                                        }else{
                                            setPwrMessage('');
                                            setIsPwrAvailable(false);
                                        }
                                    }}
                                />
                                {pwMessage && (
                                        <Text
                                        fontSize="sm"
                                        color={isPwAvailable ? '#0E870E' : '#FFB62F'}
                                        mt="-10px"
                                        ml="5px"
                                        >
                                        {pwMessage}
                                        </Text>
                                    )}
                                <label htmlFor='pwr'>비밀번호 확인<span style={{color:'#FF0000'}}>*</span></label>
                                <Input 
                                id="pwr"
                                name="pwr"
                                type="password"
                                placeholder='비밀번호를 다시 입력하세요'
                                onChange={(e)=>{
                                    const value=e.target.value;
                                    setPwr(value);
                                    if(value.length>0){
                                        if(pw===value){/* 비밀번호와 비밀번호 확인이 일치할 경우 */
                                            setPwrMessage('✅ 비밀번호가 일치합니다.');
                                            setIsPwrAvailable(true);
                                        }
                                        else{
                                            setPwrMessage('❌ 비밀번호가 일치하지 않습니다.');
                                            setIsPwrAvailable(false);
                                        }
                                    }else{
                                        setPwrMessage('');
                                        setIsPwrAvailable(false);
                                    }
                                }}
                                />
                                {pwrMessage && (
                                    <Text
                                    fontSize="sm"
                                    color={isPwrAvailable ? '#0E870E' : '#FF2222'}
                                    mt="-10px"
                                    ml="5px"
                                    >
                                    {pwrMessage}
                                    </Text>
                                )}
                                <label htmlFor='name'>이름<span style={{color:'#FF0000'}}>*</span></label>
                                <Input id="name" name="name" value={userInfo.name} readOnly/>
                                <label htmlFor='phone_number'>전화번호</label>
                                <Input id="phone_number" name="phone_number" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                                <label htmlFor="email">이메일</label>
                                <Input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                    
                                <label htmlFor="birthdate">생년월일</label>
                                <Input id="birthdate" name="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} type="date"/>
                                <label htmlFor="gender">성별</label>
                                <select id="gender" name="gender" style={{height:40,border:'1px solid #E4E4E7',borderRadius:5}}>
                                    <option value="" disabled>&nbsp;&nbsp;선택하세요</option>
                                    <option value="남성" selected={userInfo.gender==='남성'}>&nbsp;&nbsp;남성</option>
                                    <option value="여성" selected={userInfo.gender==='여성'}>&nbsp;&nbsp;여성</option>
                                </select>
    
                                <label htmlFor="address">주소</label>
                                <Flex flexDirection='column' gap='5px'>
                                    <Input id="zipcode" name="zipcode" value={userInfo.zipcode} readOnly/>
                                    <Input id="address" name="address" value={userInfo.address} readOnly/>
                                    <Input id="address_detail" name="address_detail" value={address_detail} onChange={(e)=>setAddressDetail(e.target.value)}/>
                                </Flex>

                                <Button type="submit" bg='#2d2d2d'>회원정보 수정</Button>
                            </Flex>
                        </Box>
                    </form>
                </VStack>
            </Box>;
}