import {Flex,Button,Image} from '@chakra-ui/react';

export default function Movie({likenumber,src}){
    return <Flex w='100%' h='100%' flexDirection='column' bg='#1e1e1e' borderRadius='10px' p='10px'>
                <Image objectFit='cover' w='100%' h='100%' borderRadius='6px' src={src} />
                <Flex justifyContent='space-between' alignItems='center' pt='10px'>
                    <span style={{color:'white',fontSize:14}}>❤️ {likenumber}</span>
                    <Button bg='#00aaff' color='white' h='30px' w='45px'>예매</Button>
                </Flex>
            </Flex>;
}