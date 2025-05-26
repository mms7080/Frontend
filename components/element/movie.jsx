import {Flex,Button,Image} from '@chakra-ui/react';

export default function Movie({likenumber,src}){
    return <Flex w='100%' h='100%' flexDirection='column' bg='#1e1e1e' borderRadius='10px' p='10px' transition='all 0.2s ease' _hover={{boxShadow:'0 0 30px rgba(0, 0, 0, 0.6)',transform:'translateY(-10px)'}} position='relative'>
                <Flex w='100%' h='100%' bg='rgba(0, 0, 0, 0.8)' opacity='0' _hover={{opacity:1}} transition='all 0.2s ease' position='absolute' top='0' left='0'>{/* 오버레이 되는 부분 */}

                </Flex>
                <Image objectFit='cover' w='100%' h='100%' borderRadius='6px' src={src} loading='lazy'/>
                <Flex justifyContent='space-between' alignItems='center' pt='10px'>
                    <span style={{color:'white',fontSize:14}}>❤️ {likenumber}</span>
                    <Button bg='#00aaff' color='white' h='30px' w='45px'>예매</Button>
                </Flex>
            </Flex>;
}