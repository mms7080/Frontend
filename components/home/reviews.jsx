import {VStack,Grid} from '@chakra-ui/react';
import Review from '../element/review';

export default function Reviews(){
    return <VStack w='100%' bg='#f1f1f1' pt='80px' pb='50px'>
        <h1 style={{color:'black',fontSize:25,paddingBottom:15}}>🔥 관람평 BEST</h1>
        <Grid templateColumns='repeat(3,240px)' gap='30px'>
            <Review author='user123' content='진짜 몰입감 장난 없음... 범죄도시 시리즈 중 최고 👊'></Review>
            <Review author='user123' content='액션도 감동도 완벽! 두 번 봐도 아깝지 않다💯'></Review>
            <Review author='익명' content='기대 이상! 배우들 연기력 미쳤음...'></Review>
        </Grid>
    </VStack>;
}