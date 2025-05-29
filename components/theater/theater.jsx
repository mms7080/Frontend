import KakaoMap from "./kakaomap";
import { Box, Heading } from "@chakra-ui/react";
import './theater.css';

const Theater = () => {
    return (
        <Box maxW="1200px" mx="auto" pt={{ base: 10, md: 20 }} px={{ base: 4 }} pb={10}>
            <Heading
                mb={10}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="normal"
                textAlign="center"
                color="#222"
                borderBottom="2px solid #ccc"
                pb={3}
            >
                🛍️ 영화관
            </Heading>
            <div 
                className="map-container"
            >
                <KakaoMap address="부산광역시 부산진구 중앙대로" />
            </div>
        </Box>
    );
}

export default Theater;