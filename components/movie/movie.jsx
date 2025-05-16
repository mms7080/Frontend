import {Flex, Image, Button, Icon, Grid, GridItem} from '@chakra-ui/react';

export default function Movie({src, name, reserve_rate, release_date, like_number}) {
    return <Flex w='100%' h='100%' flexDirection='column'>
                <Image objectFit='cover' w='100%' h='100%' borderRadius='6px' src={src} loading='lazy'/>
                <Flex flexDirection='row' gap='6'>
                    <Image objectFit='cover' w='10%' h='10%' borderRadius='6px' src='https://i.namu.wiki/i/4rqHeSQ7TkE85vF3Vlnz59QUtkq5cE095mHuoGagn8GC1uAic4hrujblFA6fJU1zbqNKuu_5AVw01CRnVQsXMQ.svg' loading='lazy'></Image>
                    <span>{name}</span>
                </Flex>
                <Flex flexDirection='row' justify='center' gap='6'> 
                    <span>예매율 {reserve_rate}</span>
                    <span>개봉일 {release_date}</span>
                </Flex>
                <Grid templateColumns='repeat(3, 1fr)' gap='6'>
                    <GridItem><Button>❤️{like_number}</Button></GridItem>
                    <GridItem><Button paddingLeft='10' paddingRight='10'>예매</Button></GridItem>
                </Grid>
            </Flex>;
}