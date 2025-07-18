'use client';

import React,{useState} from 'react';
import {RadioGroup,Input,Box,VStack,Flex,Button,Text,useMediaQuery} from '@chakra-ui/react';
import {Header} from '../../components';
import {fetch} from '../../lib/client';
import Modal, { useModal } from '../movie/modal';

export default function Findpwdetail({userData}){
    const [found,setFound]=useState(false);
    const [layout,setLayout]=useState('email');
    const [formData,setFormData]=useState({method:'email',id:'',name:'',email:'',phone_number:''});

    const [pw,setPw]=useState('');
    const [pwMessage,setPwMessage]=useState('');/* 비밀번호 입력창 밑의 메세지 */
    const [isPwAvailable,setIsPwAvailable]=useState(null);/* 비밀번호 유효성 여부 */
    const [pwr,setPwr]=useState('');
    const [pwrMessage,setPwrMessage]=useState('');/* 비밀번호 확인 입력창 밑의 메세지 */
    const [isPwrAvailable,setIsPwrAvailable]=useState(null);/* 비밀번호 확인이 비밀번호와 같은지 여부 */
    const [foundID,setFoundID]=useState('');
    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm} = useModal();
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    const handleFindPW=async ()=>{

        let dataToSend={...formData};/* 기존 formData 복사 */

        dataToSend.id = document.querySelector('#id').value;
        dataToSend.name = document.querySelector('#name').value;
        
        if(formData.method==='email')
            dataToSend.email = document.querySelector('#email').value;
        else if(formData.method==='phone_number')
            dataToSend.phone_number = document.querySelector('#phone_number').value;
        
        const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/find_pw/logic`, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
        });
        
        if(document.querySelector('#id').value===''){
            openModal('아이디를 입력하세요.');
            setFound(false);
            return;
        }

        if(document.querySelector('#name').value===''){
            openModal('이름을 입력하세요.');
            setFound(false);
            return;
        }

        if(formData.method==='email'&&document.querySelector('#email').value===''){
            openModal('이메일을 입력하세요.');
            setFound(false);
            return;
        }
        if(formData.method==='phone_number'&&document.querySelector('#phone_number').value===''){
            openModal('휴대폰 번호를 입력하세요.');
            setFound(false);
            return;
        }

        if(!res) {
            openModal('해당하는 사용자 정보가 없습니다.');
            setFound(false);
            return;
        }

        setFoundID(dataToSend.id);
        setFound(true);/* 객체에서 문자열만 꺼내서 저장 */
    }

    const changePassword=async (e)=>{
        if(!isPwrAvailable){
            e.preventDefault();/* 비밀번호 확인과 비밀번호가 일치되지 않았으면 폼 제출 막기 */
            openModal('비밀번호 확인과 비밀번호가 일치하나 확인해주세요.');
            return;
        }

        e.preventDefault();
        openModal('비밀번호가 성공적으로 변경되었습니다!', ()=>{e.target.submit()}, ()=>{e.target.submit()});
    }

    if(!found){/* 비밀번호 재설정 이전에 보이는 부분 */
        return <>
            <Header userInfo={userData}></Header>
            <Box w='100vw' minW={{base:'0px',md:'1000px'}} h='540px'>
                <VStack w='100%' h='540px'>
                    <Box w={{base:'100%',md:'900px'}} px='30px' m='40px' borderRadius='10px' bg='white'>
                        <Flex w={{base:'100%',md:'840px'}} flexDirection='column' gap='15px' py='50px'>
                            <span style={{fontSize:28,marginBottom:10,textAlign:'center'}}>비밀번호 재설정</span>
                            <label htmlFor="method_email">비밀번호 재설정 방법</label>{/* 비밀번호 재설정 방법을 선택하는 단계 */}
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
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="id">아이디</label></td>
                                        <td style={{width:605,height:50,paddingLeft:15}}><Input id="id" name="id" placeholder="아이디"/></td>
                                    </tr>
                                    <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='name'>이름</label></td>
                                        <td style={{width:605,height:50,paddingLeft:15}}><Input id="name" name="name" placeholder="이름"/></td>
                                    </tr>
                                    <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}>{<label htmlFor={layout}>{layout==='email'?'이메일':'휴대폰 번호'}</label>}</td>
                                        <td style={{width:605,height:50,paddingLeft:15}}>{layout==='email'?<Input id="email" name="email" placeholder="example@email.com"/>:<Input id="phone_number" name="phone_number" placeholder="01012345678"/>}</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <Button bg='#6B46C1' _hover={{bg:'#553C9A'}} mt='20px' onClick={handleFindPW}>비밀번호 재설정</Button>
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
    }else{/* 본격적으로 비밀번호를 재설정하는 과정 */
        return <>
            <Header userInfo={userData}></Header>
            <style jsx>{`
                .pw,.pwr{
                    width:35%
                }
                .pw2,.pwr2{
                    width:65%
                }
                @media (min-width: 768px) {
                    .pw,.pwr{
                        width:235px
                    }
                    .pw2,.pwr2{
                        width:605px
                    }
                }
            `}</style>
            <Box w='100vw' minW={{base:'0px',md:'1000px'}} h='540px'>
                <VStack w='100%' h='540px'>
                    <Box w={{base:'100%',md:'900px'}} px='30px' m='40px' borderRadius='10px' bg='white'>
                        <form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/set_pw/logic`} method='post' onSubmit={changePassword}>
                            <Flex w={{base:'100%',md:'840px'}} flexDirection='column' gap='15px' py='50px'>

                                <Input name='id' type='hidden' value={foundID}/>

                                <table>
                                    <tbody>
                                        <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='pw'>아이디</label></td>
                                            <td style={{width:605,height:50,paddingLeft:15,position:'relative'}}>
                                                {foundID.substring(0,foundID.length-3)+'***'}
                                            </td>
                                        </tr>
                                        <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                            <td className='pw' style={{height:90,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='pw'>새 비밀번호</label></td>
                                            <td className='pw2' style={{height:90,paddingLeft:15,position:'relative'}}>
                                                <Input
                                                id="pw"
                                                name="pw"
                                                minLength='10'
                                                type="password"
                                                placeholder='비밀번호를 입력하세요 (10자 이상)'
                                                required
                                                onChange={(e)=>{
                                                    const value=e.target.value;
                                                    setPw(value);
                                                    setIsPwAvailable(null);/* 비밀번호 값이 바뀌면 다시 유효성 여부를 검사 */
                                                    if(!value||value.length<10){
                                                        setIsPwAvailable(false);
                                                        if(value.length>=1)
                                                            setPwMessage(!isMobile?'⚠️ 비밀번호가 약합니다. (최소 10자 필요)':'⚠️ 비밀번호가 약합니다.');
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
                                                    position='absolute'
                                                    bottom='0'
                                                    >
                                                    {pwMessage}
                                                    </Text>
                                                )}
                                            </td>
                                        </tr>
                                        <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                            <td className='pwr' style={{height:90,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="pwr">비밀번호 확인</label></td>
                                            <td className='pwr2' style={{height:90,paddingLeft:15,position:'relative'}}>
                                                <Input 
                                                 id="pwr"
                                                 name="pwr"
                                                 minLength='10'
                                                 type="password"
                                                 placeholder='비밀번호를 다시 입력하세요'
                                                 required
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
                                                     position='absolute'
                                                     bottom='0'
                                                     >
                                                     {pwrMessage}
                                                     </Text>
                                                 )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>     
        
                                <Button bg='#6B46C1' _hover={{bg:'#553C9A'}} mt='20px' type='submit'>비밀번호 재설정</Button>
                            </Flex>
                        </form>
                    </Box>
                </VStack>
            </Box>
            {isModalOpen && (<Modal
            isModalOpen={isModalOpen}
            isModalVisible={isModalVisible}
            closeModal={closeModal}
            onConfirm={onConfirm}
            content={modalContent}
            isPaddingLarge={true}/>)}
        </>;
    }
}