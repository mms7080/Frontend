import {VStack,Grid} from '@chakra-ui/react';
import Event from '../element/event';

export default function Events(){
    return <VStack w='100%' bg='#f9f9f9' pt='80px' pb='50px'>
        <h1 style={{color:'black',fontSize:25,paddingBottom:15}}>진행 중인 이벤트</h1>
        <Grid templateColumns='repeat(3,240px)' gap='30px'>
            <Event content='🍿 무비데이: 수요일 예매 시 팝콘 무료!' src='https://png.pngtree.com/thumb_back/fh260/background/20200618/pngtree-gift-background-for-event-promotion-image_339596.jpg'></Event>
            <Event content='🎁 럭키박스 응모 이벤트 - 영화보고 선물받자!' src='https://png.pngtree.com/thumb_back/fh260/background/20200618/pngtree-gift-background-for-event-promotion-image_339596.jpg'></Event>
            <Event content='🎁 럭키박스 응모 이벤트 - 영화보고 선물받자!' src='https://png.pngtree.com/thumb_back/fh260/background/20200618/pngtree-gift-background-for-event-promotion-image_339596.jpg'></Event>
        </Grid>
    </VStack>;
}