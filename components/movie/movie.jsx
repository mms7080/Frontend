"use client"
import React, {useState} from 'react';
import { Flex, Image, Button, Text, Box, Kbd, createIcon } from '@chakra-ui/react';

const HeartIcon = createIcon({
  displayName: "HeartIcon",
  path: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        stroke="#00aaff"
        strokeWidth="1.5"
        fill="currentColor"
        d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
      />
    </>
  ),
  viewBox: "0 0 28 28"
});

export default function Movie({ title, rate, releaseDate, likeNumber, image }) {
  const [liked, likedController] = useState(false);
  const likeChange = () => {likedController(!liked)};

  let rateColor = '';
  if(rate == 'ALL') rateColor = 'green';
  else if(rate == '12') rateColor = 'yellow';
  else if(rate == '15') rateColor = 'orange';
  else if(rate == '19') rateColor = 'red';
  else {rate='X'; rateColor = 'gray';}

  return (
    <Flex 
      w='100%' 
      h='100%' 
      flexDirection='column' 
      bg='white' 
      border="1px solid #eee" 
      borderRadius='10px'
      transition="0.2s"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-5px)' }}
    >
      <Image 
        objectFit='cover' 
        w='100%' 
        h='400px' 
        borderRadius='6px' 
        src={image} 
        loading='lazy'
      />
      <Box w="100%" p="3">
        <Text 
          noOfLines="1" 
          fontSize='xl'
          overflow="hidden"
          textOverflow="ellipsis"
          width="100%"
          css={{
            WebkitBoxOrient: "vertical",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal"
          }}
        >
          <Kbd variant='subtle' colorPalette={rateColor}>{rate}</Kbd> {title}
        </Text>
      </Box>
      <Text px='3' pb='3' fontSize='md'>개봉일 {releaseDate}</Text>
      <Flex  
        alignItems='center'
        px='3'
        pb='3'
        gap='3'
      >
        <Button bg='white' color='black' border="1px solid #eee"  w='30%' 
        _hover={{bg:'#ebebeb'}}
        onClick={likeChange}>
          <HeartIcon size="lg" color={liked ? "#00aaff" : "white"} /> {likeNumber}</Button>
        <Button bg='#00aaff' w='65%' _hover={{bg:'#008acf'}}>예매</Button>
      </Flex>
    </Flex>
  );
}