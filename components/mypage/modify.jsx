"use client";

import React,{useState,useEffect} from 'react';
import {Flex,Box,Input,Button,Text,RadioGroup,useMediaQuery} from '@chakra-ui/react';
import Link from "next/link";
import Modal, { useModal } from '../movie/modal';

export default function Modify({userInfo}) {/* 마이페이지에서 수정할 수 있는 정보들인 비밀번호, address_detail, phone, email, birthdate, gender 수정사항 반영 */
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    const [form, setForm] = useState({
        zipcode:userInfo?.zipcode ?? '',
        address:userInfo?.address ?? '',
        address_detail:userInfo?.address_detail ?? ''
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        document.body.appendChild(script);
    }, []);

    // 2. 주소 검색 버튼 클릭 시 실행할 함수
    const handlePostcodeSearch = () => {
        new window.daum.Postcode({
          oncomplete: function (data) {
            setForm({
              ...form,
              zipcode: data.zonecode,
              address: data.address
            });
            setZipcode(data.zonecode);
            setAddress(data.address);
          }
        }).open();
      };

    const [phone,setPhone] = useState(userInfo?.phone);
    const [email,setEmail] = useState(userInfo?.email);
    const [birthdate,setBirthdate] = useState(userInfo?.birthdate ?? '');
    const [gender,setGender]=useState('');
    const [zipcode,setZipcode]=useState(userInfo?.zipcode ?? '');
    const [address,setAddress]=useState(userInfo?.address ?? '');
    const [address_detail,setAddressDetail]=useState(userInfo?.address_detail ?? '');

    const [pw,setPw]=useState('');
    const [pwMessage,setPwMessage]=useState('');/* 비밀번호 입력창 밑의 메세지 */
    const [isPwAvailable,setIsPwAvailable]=useState(true);/* 비밀번호 유효성 여부 */
    const [pwr,setPwr]=useState('');
    const [pwrMessage,setPwrMessage]=useState('');/* 비밀번호 확인 입력창 밑의 메세지 */
    const [isPwrAvailable,setIsPwrAvailable]=useState(true);/* 비밀번호 확인이 비밀번호와 같은지 여부 */

    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel, isConfirm} = useModal();

    const handleSubmit = async (e) => {
        if(!isPwAvailable){
            e.preventDefault();
            openModal('비밀번호는 10자 이상 입력해주세요.');
            return;
        }
        if(!isPwrAvailable){
            e.preventDefault();/* 비밀번호 확인과 비밀번호가 일치되지 않았으면 폼 제출 막기 */
            openModal('비밀번호 확인과 비밀번호가 일치하나 확인해주세요.');
            return;
        }

        e.preventDefault();
        openModal('개인정보가 수정되었습니다!',()=>{e.target.submit()},()=>{e.target.submit()});
    };

    return <><form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/modify/logic`} method='post' onSubmit={handleSubmit}>
                        <Box w='100%' px='30px' borderRadius='10px' bg='white'>
                            <Flex w='100%' flexDirection='column' gap='30px' py='50px'>
                                <span style={{fontSize:28,marginBottom:10,textAlign:'center'}}>개인정보 수정</span>
                                <span style={{fontSize:20}}>기본 정보</span>
                                <table>
                                    <tbody>
                                        <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='id'>아이디</label></td>
                                            <td style={{width:605,height:50,paddingLeft:15}}>
                                                <Text>{userInfo?.username}</Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                
                                <table>
                                    <tbody>
                                        <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:90,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='pw'>비밀번호</label></td>
                                            <td style={{width:605,height:90,paddingLeft:15,position:'relative'}}>
                                                <Input 
                                                  id="pw"
                                                  name="pw"
                                                  type="password"
                                                  placeholder='새 비밀번호를 입력 (변경하지 않으려면 비워두세요)'
                                                  onChange={(e)=>{
                                                      const value=e.target.value;
                                                      setPw(value);
                                                      setIsPwAvailable(null);/* 비밀번호 값이 바뀌면 다시 유효성 여부를 검사 */
                                                      if(!value||value.length<10){
                                                          setIsPwAvailable(false);
                                                          if(value.length>=1)
                                                              setPwMessage(!isMobile?'⚠️ 비밀번호가 약합니다. (최소 10자 필요)':'⚠️ 비밀번호가 약합니다.');
                                                          else{
                                                              setPwMessage('');
                                                              setIsPwAvailable(true);
                                                          }
                                                      }
                                                      else{
                                                          setIsPwAvailable(true);
                                                          setPwMessage('✅ 강한 비밀번호입니다!');
                                                      }
                                                      if(value.length>0 && pwr.length>0){
                                                          if(pwr===value){/* 비밀번호를 바꾸다가 비밀번호 확인과 일치할 경우를 대비한 코드 */
                                                              setPwrMessage('✅ 비밀번호가 일치합니다.');
                                                              setIsPwrAvailable(true);
                                                          }
                                                          else{
                                                              setPwrMessage(!isMobile?'❌ 비밀번호가 일치하지 않습니다.':'❌ 비밀번호 불일치');
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
                                            <td style={{width:235,height:90,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='pwr'>비밀번호 확인</label></td>
                                            <td style={{width:605,height:90,paddingLeft:15,position:'relative'}}>
                                            <Input 
                                               id="pwr"
                                               name="pwr"
                                               type="password"
                                               placeholder='비밀번호를 다시 입력하세요'
                                               onChange={(e)=>{
                                                   const value=e.target.value;
                                                   setPwr(value);
                                                   if(value.length>0 && pw.length>0){
                                                       if(pw===value){/* 비밀번호와 비밀번호 확인이 일치할 경우 */
                                                           setPwrMessage('✅ 비밀번호가 일치합니다.');
                                                           setIsPwrAvailable(true);
                                                       }
                                                       else{
                                                           setPwrMessage(!isMobile?'❌ 비밀번호가 일치하지 않습니다.':'❌ 비밀번호 불일치');
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
                                <table>
                                    <tbody>
                                        <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='name'>이름</label></td>
                                            <td style={{width:605,height:50,paddingLeft:15}}>
                                                <Text>{userInfo?.name}</Text>
                                            </td>
                                        </tr>
                                        <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='phone_number'>전화번호<span style={{color:'#FF0000'}}>*</span></label></td>
                                            <td style={{width:605,height:50,paddingLeft:15}}>
                                                <Input id="phone_number" name="phone_number" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                                            </td>
                                        </tr>
                                        <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="email">이메일<span style={{color:'#FF0000'}}>*</span></label></td>
                                            <td style={{width:605,height:50,paddingLeft:15}}>
                                                <Input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <span style={{fontSize:20}}>선택 정보</span>
                                <Box textAlign='center' display={{base:'block',md:'none'}}>
                                    PC버전 사이트에서만 입력 가능합니다.
                                </Box>
                                <table style={{display:!isMobile?'table':'none'}}>
                                    <tbody>
                                        <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="birthdate">생년월일</label></td>
                                            <td style={{width:605,height:50,paddingLeft:15}}>
                                               <Input id="birthdate" name="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} type="date" max={new Date().toISOString().split("T")[0]}/>
                                            </td>
                                        </tr>
                                        <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="birthdate"><label htmlFor="gender">성별</label></label></td>
                                            <td style={{width:605,height:50,paddingLeft:15}}>
                                                <RadioGroup.Root defaultValue={userInfo?.gender} display='flex' alignItems='center'>
                                                    <RadioGroup.Item type="radio" value="남성" onClick={(e)=>{setGender(e.target.value)}}>
                                                        <RadioGroup.ItemHiddenInput />
                                                        <RadioGroup.ItemIndicator/>
                                                        <RadioGroup.ItemText>남성</RadioGroup.ItemText>
                                                    </RadioGroup.Item>
                                                    &nbsp;
                                                    &nbsp;
                                                    &nbsp;
                                                    <RadioGroup.Item type="radio" value="여성" onClick={(e)=>{setGender(e.target.value)}}>
                                                        <RadioGroup.ItemHiddenInput />
                                                        <RadioGroup.ItemIndicator/>
                                                        <RadioGroup.ItemText>여성</RadioGroup.ItemText>
                                                    </RadioGroup.Item>
                                                </RadioGroup.Root>
                                                <input type="hidden" name="gender" value={gender}/>
                                            </td>
                                        </tr>
                                        <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                            <td style={{width:235,height:140,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="address_detail">주소</label></td>
                                            <td style={{width:605,height:140,paddingLeft:15}}>
                                               <Flex flexDirection='column' gap='5px'>
                                                    <Flex gap='5px'>
                                                        <Input id="zipcode" name="zipcode" value={form.zipcode} readOnly onClick={() => handlePostcodeSearch()}/>
                                                        <Button type='button' w='150px' onClick={()=>handlePostcodeSearch()} bg='#6B46C1' _hover={{bg:'#553C9A'}}>
                                                            주소 검색
                                                        </Button>
                                                    </Flex>
                                                    <Input id="address" name="address" value={form.address} readOnly onClick={() => handlePostcodeSearch()}/>
                                                    <Input id="address_detail" name="address_detail" value={address_detail} onChange={(e)=>setAddressDetail(e.target.value)}/>
                                                </Flex>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Link style={{textAlign:'right',color:'#352461',textDecoration:'underline'}}
                                href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/unregister`}
                                onClick={(e) => {
                                      e.preventDefault(); // 기본 이동 막기
                                      openModal("정말로 회원탈퇴하시겠습니까?",
                                        () => {
                                            window.location.href = `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/unregister`;
                                        }, ()=>{}, true
                                      )
                                    }}
                                 >회원탈퇴</Link>

                                <Button mt='10px' type="submit" bg='#6B46C1' _hover={{bg:'#553C9A'}}>회원정보 수정</Button>
                            </Flex>
                        </Box>
                    </form>
                    {isModalOpen && (<Modal
                    isModalOpen={isModalOpen}
                    isModalVisible={isModalVisible}
                    closeModal={closeModal}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isConfirm={isConfirm}
                    content={modalContent}
                    isPaddingLarge={true}/>)}
                    </>;
}