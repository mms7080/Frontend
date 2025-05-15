import {Flex} from '@chakra-ui/react';
import {FiUser} from 'react-icons/fi';

export default function Header({headerColor,headerBg,userInfo}){
    return <Flex w='calc(100vw - 17px)' minW='1000px' h='100px' justifyContent='space-between' alignItems='center' bg={headerBg} p='40px' boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)' borderBottom='1px solid rgba(0, 0, 0, 0.1)'>
                <Flex flexDirection='column' lineHeight='30px'>
                    <span style={{color:headerColor,fontSize:24,letterSpacing:3}}>FILMORA</span>
                    <span style={{color:'#ccc',fontSize:10,letterSpacing:2}}>MEET PLAY SHARE</span>
                </Flex>
    
                <Flex gap='20px' fontSize='20px'>
                    <span style={{color:headerColor}}>영화</span>
                    <span style={{color:headerColor}}>예매</span>
                    <span style={{color:headerColor}}>극장</span>
                    <span style={{color:headerColor}}>이벤트</span>
                    <span style={{color:headerColor}}>스토어</span>
                    <span style={{color:headerColor}}>혜택</span>
                </Flex>
    
                <Flex gap='15px' fontSize='15px'>
                    {userInfo
                    ?(<>
                        <span style={{color:headerColor}}>{userInfo.name}님 환영합니다</span>
                        <span style={{color:headerColor}}><a href={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/logout`}>로그아웃</a></span>
                    </>)
                    :(<>
                    <span style={{color:headerColor}}><a href='/signin'>로그인</a></span>
                    <span style={{color:headerColor}}><a href='/join'>회원가입</a></span>
                    </>
                    )}
                    <span style={{color:'#ff4d4d'}}>빠른예매</span>
                    <FiUser size={25} color={headerColor} style={{bottom:5,position:'relative'}}/>
                </Flex>
            </Flex>;
}