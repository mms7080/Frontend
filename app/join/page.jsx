import react from 'react';
import {Flex,Box,VStack,Input,HStack,Button} from '@chakra-ui/react';

import {Header,Footer} from '../../components';

export const metadata = {
    title: "회원가입",
    description: "영화 예매 사이트 회원가입 페이지"
};

export default function Homepage(){

    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';

    return <>
        <Header headerColor={headerColor} headerBg={headerBg}></Header>
        <Box w='calc(100vw - 17px)' minW='1000px'>
            <Flex w='100%' flexDirection='column'>
                <VStack w='100%' bg='#F9F9F9'>
                    <form action={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/join/logic`} method='post'>
                        <Box w='900px' px='30px' m='40px' borderRadius='10px' bg='white' boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'>
                            <Flex w='840px' flexDirection='column' gap='15px' py='50px'>
                                <span style={{fontSize:28,marginBottom:10,textAlign:'center'}}>회원가입</span>
                                <label htmlFor='id'>아이디<span style={{color:'#FF0000'}}>*</span></label>
                                <Input id="id" name="id" minLength='4' maxLength='16' placeholder='영문 소문자와 숫자 조합 (4~16자)' required/>
                                <label htmlFor='pw'>비밀번호<span style={{color:'#FF0000'}}>*</span></label>
                                <Input id="pw" name="pw" minLength='10' type="password" placeholder='비밀번호를 입력하세요 (10자 이상)' required/>
                                <label htmlFor='pwr'>비밀번호 확인<span style={{color:'#FF0000'}}>*</span></label>
                                <Input id="pwr" name="pwr" minLength='10' type="password" placeholder='비밀번호를 다시 입력하세요' required/>
                                <label htmlFor='name'>이름<span style={{color:'#FF0000'}}>*</span></label>
                                <Input id="name" name="name" placeholder='이름을 입력하세요' required/>
                                <label htmlFor='area_code'>전화번호<span style={{color:'#FF0000'}}>*</span></label>
                                <Flex justifyContent='space-between'>
                                    <select id='area_code' name='area_code' style={{width:270,border:'1px solid #E4E4E7', borderRadius:5}} defaultValue='010' required>
                                        <option value="010">&nbsp;&nbsp;010</option>
                                        <option value="011">&nbsp;&nbsp;011</option>
                                        <option value="016">&nbsp;&nbsp;016</option>
                                        <option value="017">&nbsp;&nbsp;017</option>
                                        <option value="018">&nbsp;&nbsp;018</option>
                                        <option value="019">&nbsp;&nbsp;019</option>
                                    </select>
                                    <Input w='270px' id="phone_first" name="phone_first" maxLength="4" placeholder="1234" required/>
                                    <Input w='270px' id="phone_second" name="phone_second" maxLength="4" placeholder="5678" required/>
                                </Flex>
                                <label htmlFor="email_id">이메일<span style={{color:'#FF0000'}}>*</span></label>
                                <Flex justifyContent='space-between'>
                                    <Input w='400px' id="email_id" name="email_id" placeholder="example" required/>
                                    <span style={{lineHeight:'40px'}}>@</span>
                                    <select id="email_address" name="email_address" style={{width:400,border:'1px solid #E4E4E7',borderRadius:5}} defaultValue='naver.com' required>
                                        <option value="naver.com">&nbsp;&nbsp;naver.com</option>
                                        <option value="gmail.com">&nbsp;&nbsp;gmail.com</option>
                                        <option value="daum.net">&nbsp;&nbsp;daum.net</option>
                                        <option value="nate.com">&nbsp;&nbsp;nate.com</option>
                                        <option value="hotmail.com">&nbsp;&nbsp;hotmail.com</option>
                                    </select>
                                </Flex>
                                <label htmlFor="birthdate">생년월일</label>
                                <Input id="birthdate" name="birthdate" defaultValue="연도-월-일" type="date"/>
                                <label htmlFor="gender">성별</label>
                                <select id="gender" name="gender" style={{height:40,border:'1px solid #E4E4E7',borderRadius:5}} defaultValue=''>
                                    <option value="" disabled>&nbsp;&nbsp;선택하세요</option>
                                    <option value="남성">&nbsp;&nbsp;남성</option>
                                    <option value="여성">&nbsp;&nbsp;여성</option>
                                </select>

                                <label htmlFor="address">주소</label>
                                <Flex flexDirection='column' gap='5px'>
                                    <Input id="zipcode" name="zipcode" placeholder="우편번호"/>
                                    <Input id="address" name="address" placeholder="기본 주소"/>
                                    <Input id="address_detail" name="address_detail" placeholder="상세 주소"/>
                                </Flex>

                                <HStack><input id="agreement1" name="agreement1" type="checkbox" required/><label htmlFor="agreement1">[필수] 이용약관에 동의합니다.</label></HStack>
                                <HStack><input id="agreement2" name="agreement2" type="checkbox" required/><label htmlFor="agreement2">[필수] 개인정보 수집 및 이용에 동의합니다.</label></HStack>
                                <HStack><input id="agreement3" name="agreement3" type="checkbox"/><label htmlFor="agreement3">[선택] 쇼핑정보 수신에 동의합니다.</label></HStack>

                                <Button type="submit" bg='#2d2d2d'>회원가입</Button>
                            </Flex>
                        </Box>
                    </form>
                </VStack>
            </Flex>
        </Box>
        <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
        </>;
}