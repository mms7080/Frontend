import React from 'react';
import {Flex} from '@chakra-ui/react';

export default ({author,content})=>{
    return <Flex w='240px' py='25px' px='20px' bg='white' borderRadius='6px' boxShadow='0 0 10px rgba(0,0,0,0.1)' flexDirection='column' transition='all 0.2s ease'
    _hover={{transform:'translateY(-5px)',boxShadow:'0 4px 20px rgba(0, 0, 0, 0.4)'}}>
        <span style={{fontStyle:'italic',fontSize:'14px'}}>“{content}”</span>
        <span style={{color:'#666',fontSize:'12px',paddingTop:15}}>- {author}</span>
    </Flex>;
}