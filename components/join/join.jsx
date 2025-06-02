'use client';

import React,{useState} from 'react';
import {Flex,Box,VStack,Input,HStack,Button,Text,RadioGroup} from '@chakra-ui/react';
import {fetch} from '../../lib/client';

export default function Joindetail(){
    const [id,setId]=useState('');
    const [idMessage,setIdMessage]=useState('');/* 아이디 입력창 밑의 메세지 */
    const [isIdAvailable,setIsIdAvailable]=useState(null);/* 아이디 유효성 여부 */
    const [idCheck,setIdCheck]=useState(false);/* 아이디 중복확인 여부 */
    const [pw,setPw]=useState('');
    const [pwMessage,setPwMessage]=useState('');/* 비밀번호 입력창 밑의 메세지 */
    const [isPwAvailable,setIsPwAvailable]=useState(null);/* 비밀번호 유효성 여부 */
    const [pwr,setPwr]=useState('');
    const [pwrMessage,setPwrMessage]=useState('');/* 비밀번호 확인 입력창 밑의 메세지 */
    const [isPwrAvailable,setIsPwrAvailable]=useState(null);/* 비밀번호 확인이 비밀번호와 같은지 여부 */
    const [gender,setGender]=useState('');
    const [inputsvalue, setInputsValue] = useState('');

    const handleIdCheck=async ()=>{
        try{
            if(id.length==0){
                alert('아이디를 입력해주세요.');
                return;
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/idexist?id=${id}`);/* 아이디 중복 확인을 위한 fetch */
            if(res){/* 중복된 아이디가 존재하면 res=true */
                setIdMessage('❌ 이미 사용 중인 아이디입니다.');
                setIdCheck(false);
                setIsIdAvailable(false);
            }else{/* 중복된 아이디가 존재하지 않으면 res=false */
                setIdMessage('✅ 사용 가능한 아이디입니다.');
                setIdCheck(true);
                setIsIdAvailable(true);
            }
        }catch(err){
            console.log(err);
            setIdMessage('서버 오류로 확인할 수 없습니다.');
            setIdCheck(false);
            setIsIdAvailable(false);
        }
    };
    
    const handleSubmit = async (e) => {
        if(!idCheck){
            e.preventDefault();/* 아이디 중복 확인이 안되었으면 폼 제출 막기 */
            alert('아이디 중복 확인을 완료해 주세요.');
            return;
        }
        if(!isPwrAvailable){
            e.preventDefault();/* 비밀번호 확인과 비밀번호가 일치되지 않았으면 폼 제출 막기 */
            alert('비밀번호 확인과 비밀번호가 일치하나 확인해주세요.');
            return;
        }

        alert('회원가입이 완료되었습니다!');
    };

    const handleChange = (inputedvalue) => {
        // 영어 대소문자와 숫자만 허용
        const inputValue = inputedvalue;
        const filteredValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
        setInputsValue(filteredValue);
    };

    return <Box w='100vw' minW='1000px'>
            <VStack w='100%'>
                <form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/join/logic`} method='post' onSubmit={handleSubmit}>
                    <Box w='900px' px='30px' m='40px' borderRadius='10px' bg='white' boxShadow='-5px 5px 5px rgba(0, 0, 0, 0.05), 5px 5px 5px rgba(0, 0, 0, 0.05)'>
                        <Flex w='840px' flexDirection='column' gap='30px' py='50px'>
                            <span style={{fontSize:28,marginBottom:10,textAlign:'center'}}>회원가입</span>
                            <span style={{fontSize:20}}>기본 정보</span>
                            <table>
                                <tbody>
                                    <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:90,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='id'>아이디<span style={{color:'#FF0000'}}>*</span></label></td>
                                        <td style={{width:605,height:90,paddingLeft:15,position:'relative'}}>
                                            <Flex w='590px' gap='15px'>
                                                <Input
                                                    w='425px'
                                                    id="id"
                                                    name="id"
                                                    minLength="4"
                                                    maxLength="16"
                                                    placeholder="영문 대소문자와 숫자 조합 (4~16자)"
                                                    value={inputsvalue}
                                                    onChange={(e)=>{
                                                        handleChange(e.target.value);
                                                        setId(e.target.value);
                                                        setIsIdAvailable(null);/* 아이디 값 바꾸면 유효성 여부를 다시 체크해야 함 */
                                                        setIdMessage('');
                                                        setIdCheck(false);/* 아이디 값이 바뀌면 아이디 중복 확인 여부를 false로 함 */
                                                    }}
                                                    required
                                                />
                                                <Button w='150px' onClick={handleIdCheck} type="button" bg='#6B46C1' _hover={{bg:'#553C9A'}}>
                                                    아이디 중복 확인
                                                </Button>
                                            </Flex>
                                            {idMessage && (
                                                <Text
                                                fontSize='sm'
                                                color={isIdAvailable ? '#0E870E' : '#FF2222'}
                                                mt="-10px"
                                                ml="5px"
                                                position='absolute'
                                                bottom='0'
                                                >
                                                {idMessage}
                                                </Text>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table>
                                <tbody>
                                    <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:90,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='pw'>비밀번호<span style={{color:'#FF0000'}}>*</span></label></td>
                                        <td style={{width:605,height:90,paddingLeft:15,position:'relative'}}>
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
                                                    fontSize='sm'
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
                                        <td style={{width:235,height:90,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='pwr'>비밀번호 확인<span style={{color:'#FF0000'}}>*</span></label></td>
                                        <td style={{width:605,height:90,paddingLeft:15,position:'relative'}}>
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
                            
                            <table>
                                <tbody>
                                    <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='name'>이름<span style={{color:'#FF0000'}}>*</span></label></td>
                                        <td style={{width:605,height:50,paddingLeft:15}}>
                                            <Input id="name" name="name" placeholder='이름을 입력하세요' required/>
                                        </td>
                                    </tr>
                                    <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor='area_code'>전화번호<span style={{color:'#FF0000'}}>*</span></label></td>
                                        <td style={{width:605,height:50,paddingLeft:15}}>
                                            <Flex justifyContent='space-between'>
                                                <select id='area_code' name='area_code' style={{width:180,border:'1px solid #E4E4E7', borderRadius:5,fontSize:14}} defaultValue='010' required>
                                                    <option value="010">&nbsp;&nbsp;010</option>
                                                    <option value="011">&nbsp;&nbsp;011</option>
                                                    <option value="016">&nbsp;&nbsp;016</option>
                                                    <option value="017">&nbsp;&nbsp;017</option>
                                                    <option value="018">&nbsp;&nbsp;018</option>
                                                    <option value="019">&nbsp;&nbsp;019</option>
                                                </select>
                                                <Input w='180px' id="phone_first" name="phone_first" maxLength="4" placeholder="1234" required/>
                                                <Input w='180px' id="phone_second" name="phone_second" maxLength="4" placeholder="5678" required/>
                                            </Flex>
                                        </td>
                                    </tr>
                                    <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="email_id">이메일<span style={{color:'#FF0000'}}>*</span></label></td>
                                        <td style={{width:605,height:50,paddingLeft:15}}>
                                            <Flex justifyContent='space-between'>
                                                <Input w='280px' id="email_id" name="email_id" placeholder="example" required/>
                                                <span style={{lineHeight:'40px'}}>@</span>
                                                <select id="email_address" name="email_address" style={{width:280,border:'1px solid #E4E4E7',borderRadius:5,fontSize:14}} defaultValue='naver.com' required>
                                                    <option value="naver.com">&nbsp;&nbsp;naver.com</option>
                                                    <option value="gmail.com">&nbsp;&nbsp;gmail.com</option>
                                                    <option value="daum.net">&nbsp;&nbsp;daum.net</option>
                                                    <option value="nate.com">&nbsp;&nbsp;nate.com</option>
                                                    <option value="hotmail.com">&nbsp;&nbsp;hotmail.com</option>
                                                </select>
                                            </Flex>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <span style={{fontSize:20}}>선택 정보</span>
                            
                            <table>
                                <tbody>
                                    <tr style={{borderTop:'1px solid #555555',borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="birthdate">생년월일</label></td>
                                        <td style={{width:605,height:50,paddingLeft:15}}>
                                            <Input id="birthdate" name="birthdate" defaultValue="연도-월-일" type="date"/>
                                        </td>
                                    </tr>
                                    <tr style={{borderBottom:'1px solid #D1D5DD'}}>
                                        <td style={{width:235,height:50,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="birthdate"><label htmlFor="gender">성별</label></label></td>
                                        <td style={{width:605,height:50,paddingLeft:15}}>
                                            <RadioGroup.Root display='flex' alignItems='center'>
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
                                        <td style={{width:235,height:140,backgroundColor:'#F7F8F9',paddingLeft:15}}><label htmlFor="address">주소</label></td>
                                        <td style={{width:605,height:140,paddingLeft:15}}>
                                            <Flex flexDirection='column' gap='5px'>
                                                <Input id="zipcode" name="zipcode" placeholder="우편번호"/>
                                                <Input id="address" name="address" placeholder="기본 주소"/>
                                                <Input id="address_detail" name="address_detail" placeholder="상세 주소"/>
                                            </Flex>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <HStack><input id="agreement1" name="agreement1" type="checkbox" required/><label htmlFor="agreement1">[필수] 이용약관에 동의합니다.</label></HStack>
                            <HStack><input id="agreement2" name="agreement2" type="checkbox" required/><label htmlFor="agreement2">[필수] 개인정보 수집 및 이용에 동의합니다.</label></HStack>
                            <HStack><input id="agreement3" name="agreement3" type="checkbox"/><label htmlFor="agreement3">[선택] 쇼핑정보 수신에 동의합니다.</label></HStack>

                            <Button type="submit" bg='#6B46C1' _hover={{bg:'#553C9A'}}>회원가입</Button>
                        </Flex>
                    </Box>
                </form>
            </VStack>
        </Box>;
}