'use client';

import React,{useState,useEffect} from 'react';
import {Flex,Box,VStack,Input,Button,Text,Textarea,RadioGroup} from '@chakra-ui/react';
import {fetch} from '../../lib/client';

export default function Joindetail(){

    const handleBeforeInput = (e) => {
    const inputChar = e.data;
    if (!inputChar) return;

    // 한글 자음/모음/완성형 + 특수문자 정규식
    const forbiddenRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣!@#$%^&*(),.?":{}|<>~`\\[\];'_+\-=/]/;

    if (forbiddenRegex.test(inputChar)) {
      e.preventDefault();
      alert('한글 및 특수문자는 입력할 수 없습니다!');
    }
  };

    const [form, setForm] = useState({
        zipcode:"",
        address:"",
        address_detail:""
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        document.body.appendChild(script);

        async function fetchAgreement() {
            const term1 = document.querySelector("#term1");
            const term2 = document.querySelector("#term2");
            const term3 = document.querySelector("#term3");

            const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/agreement`);

            term1.value=res[0];
            term2.value=res[1];
            term3.value=res[2];
        }

        fetchAgreement();

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
        }
      }).open();
    };

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
    const [isComposing, setIsComposing] = useState(false);

    const [buttonlabel1,setButtonLabel1]=useState('글자 확대');
    const [buttonlabel2,setButtonLabel2]=useState('글자 확대');
    const [buttonlabel3,setButtonLabel3]=useState('글자 확대');

    const [fontsize1,setFontSize1]=useState(14);
    const [fontsize2,setFontSize2]=useState(14);
    const [fontsize3,setFontSize3]=useState(14);

    const handleCompositionStart = () => {
      setIsComposing(true);
    };

    const handleCompositionEnd = (e) => {
      setIsComposing(false);
      const value = e.target.value;
      // 조합이 끝난 후 필터링하여 저장
      const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
      setInputsValue(filteredValue);
      setId(filteredValue);
    };

    const handleChange = (e) => {
      const value = e.target.value;
      if (isComposing) {
        // 조합 중일 땐 필터링 없이 그대로 저장
        setInputsValue(value);
        setId(value);
      } else {
        // 조합 중이 아닐 땐 필터링 진행
        const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
        setInputsValue(filteredValue);
        setId(filteredValue);
      }
    };
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

    const adjustsize1=()=>{
        if(buttonlabel1==='글자 확대'){
            setFontSize1(18);
            setButtonLabel1('글자 축소');
        }
        else if(buttonlabel1==='글자 축소'){
            setFontSize1(14);
            setButtonLabel1('글자 확대');
        }
    }

    const adjustsize2=()=>{
        if(buttonlabel2==='글자 확대'){
            setFontSize2(18);
            setButtonLabel2('글자 축소');
        }
        else if(buttonlabel2==='글자 축소'){
            setFontSize2(14);
            setButtonLabel2('글자 확대');
        }
    }

    const adjustsize3=()=>{
        if(buttonlabel3==='글자 확대'){
            setFontSize3(18);
            setButtonLabel3('글자 축소');
        }
        else if(buttonlabel3==='글자 축소'){
            setFontSize3(14);
            setButtonLabel3('글자 확대');
        }
    }

    return <Box w='100vw' minW={{ base: "auto", md: "1000px" }}>
            <style jsx>{`
              .responsive-form {
                width: 100%;
              }

              @media (min-width: 768px) {
                .responsive-form {
                  width: auto;
                }
              }
            `}</style>
            <VStack w='100%'>
                <form className="responsive-form" action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/join/logic`} method='post' onSubmit={handleSubmit}>
                    <Box w={{base: "100%", md: "900px"}} px={{base:0,md:'30px'}} m={{base:0,md:'40px'}} borderRadius='10px' bg='white'>
                        <Flex w={{ base: "100%", md: "840px" }} flexDirection='column' gap='30px' py='50px'>
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
                                                        handleChange(e);
                                                        setIsIdAvailable(null);
                                                        setIdMessage('');
                                                        setIdCheck(false);
                                                    }}
                                                    onBeforeInput={handleBeforeInput}
                                                    onCompositionStart={handleCompositionStart}
                                                    onCompositionEnd={handleCompositionEnd}
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
                                                    if(value.length>=1)
                                                        setPwMessage('⚠️ 비밀번호가 약합니다. (최소 10자 필요)');
                                                    else
                                                        setPwMessage('');
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
                                                if(value.length>0 && pw.length>0){
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
                                            <Input id="birthdate" name="birthdate" defaultValue="연도-월-일" type="date" max={new Date().toISOString().split("T")[0]}/>
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
                                                <Flex gap='5px'>
                                                    <Input id="zipcode" name="zipcode" placeholder="우편번호" value={form.zipcode} readOnly onClick={() => handlePostcodeSearch()}/>
                                                    <Button type='button' w='150px' onClick={()=>handlePostcodeSearch()} bg='#6B46C1' _hover={{bg:'#553C9A'}}>
                                                        주소 검색
                                                    </Button>
                                                </Flex>
                                                <Input id="address" name="address" placeholder="기본 주소" value={form.address} readOnly onClick={() => handlePostcodeSearch()}/>
                                                <Input id="address_detail" name="address_detail" value={form.address_detail}
                                                onChange={(e) => setForm({ ...form, address_detail: e.target.value })}
                                                 placeholder="상세 주소"/>
                                            </Flex>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <Textarea resize="none" id='term1' name='term1' rows='10' fontSize={fontsize1} readOnly></Textarea>
                            <Flex justifyContent='space-between'><Button onClick={adjustsize1}>{buttonlabel1}</Button><Flex><input id="agreement1" name="agreement1" type="checkbox" style={{position:'relative',bottom:'10px'}} required/><label htmlFor="agreement1">&nbsp;&nbsp;[필수] 이용약관에 동의합니다.</label></Flex></Flex>
                            <Textarea resize="none" id='term2' name='term2' rows='10' fontSize={fontsize2} readOnly></Textarea>
                            <Flex justifyContent='space-between'><Button onClick={adjustsize2}>{buttonlabel2}</Button><Flex><input id="agreement2" name="agreement2" type="checkbox" style={{position:'relative',bottom:'10px'}} required/><label htmlFor="agreement2">&nbsp;&nbsp;[필수] 개인정보 수집 및 이용에 동의합니다.</label></Flex></Flex>
                            <Textarea resize="none" id='term3' name='term3' rows='10' fontSize={fontsize3} readOnly></Textarea>
                            <Flex justifyContent='space-between'><Button onClick={adjustsize3}>{buttonlabel3}</Button><Flex><input id="agreement3" name="agreement3" type="checkbox" style={{position:'relative',bottom:'10px'}}/><label htmlFor="agreement3">&nbsp;&nbsp;[선택] 위치기반 서비스 이용약관에 동의합니다.</label></Flex></Flex>

                            <Button type="submit" bg='#6B46C1' _hover={{bg:'#553C9A'}}>회원가입</Button>
                        </Flex>
                    </Box>
                </form>
            </VStack>
        </Box>;
}