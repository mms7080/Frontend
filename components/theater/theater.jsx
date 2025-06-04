"use client"
import {useState, useEffect} from 'react';
import NaverMap from "./navermap";
import { Box, Flex, Button, Text } from "@chakra-ui/react";

// fetch 이전 임시 데이터들
const regions = ["서울","경기/인천","충청/대전","전라/광주","경남/부산","강원","제주"];
const theaters = [
  {region:"서울", name:"CGV 강남", address:"서울특별시 강남구 강남대로 438 스타플렉스 4층~8층"},
  {region:"서울", name:"롯데시네마 월드타워", address:"서울특별시 송파구 올림픽로 300 롯데월드타워 7층~11층"},
  {region:"서울", name:"메가박스 코엑스", address:"서울특별시 강남구 영동대로 513 코엑스몰 B1층"},
  {region:"서울", name:"대한극장", address:"서울특별시 중구 퇴계로 212"},
  {region:"서울", name:"CGV 용산아이파크몰", address:"서울특별시 용산구 한강대로23길 55 아이파크몰 6층~7층"},
  {region:"경기/인천", name:"CGV 판교", address:"경기도 성남시 분당구 판교역로 146번길 20 알파리움타워 6층"},
  {region:"경기/인천", name:"롯데시네마 수원", address:"경기도 수원시 권선구 세화로 134 롯데몰 수원점 4층"},
  {region:"경기/인천", name:"메가박스 송도", address:"인천광역시 연수구 송도국제대로 123 송도 트리플스트리트 D동"},
  {region:"경기/인천", name:"CGV 인천터미널", address:"인천광역시 미추홀구 연남로 35 뉴코아아울렛 6층"},
  {region:"경기/인천", name:"메가박스 킨텍스", address:"경기도 고양시 일산서구 대화동 2600 KINTEX 제2전시장"},
  {region:"충청/대전", name:"CGV 대전터미널", address:"대전광역시 동구 동서대로 1689 대전복합터미널 4층"},
  {region:"충청/대전", name:"롯데시네마 대전센트럴", address:"대전광역시 중구 중앙로 123 롯데백화점 9층"},
  {region:"충청/대전", name:"메가박스 대전중앙로", address:"대전광역시 중구 중앙로 119"},
  {region:"충청/대전", name:"CGV 청주지웰시티", address:"충청북도 청주시 흥덕구 대농로 47 지웰시티몰 5층"},
  {region:"전라/광주", name:"CGV 광주터미널", address:"광주광역시 서구 무진대로 904 광주종합버스터미널 U-Square 6층"},
  {region:"전라/광주", name:"롯데시네마 광주광산", address:"광주광역시 광산구 장신로 98 롯데아울렛 광주수완점 4층"},
  {region:"전라/광주", name:"메가박스 전주객사", address:"전라북도 전주시 완산구 전주객사3길 22"},
  {region:"전라/광주", name:"CGV 광주상무", address:"광주광역시 서구 치평로 20 상무지구 이노비즈센터"},
  {region:"경남/부산", name:"CGV 센텀시티", address:"부산광역시 해운대구 센텀남대로 35 신세계 센텀시티몰 4층"},
  {region:"경남/부산", name:"롯데시네마 부산본점", address:"부산광역시 부산진구 가야대로 772 롯데백화점 부산본점 10층"},
  {region:"경남/부산", name:"메가박스 해운대(장산)", address:"부산광역시 해운대구 해운대로 813 반도보라빌딩"},
  {region:"경남/부산", name:"CGV 서면", address:"부산광역시 부산진구 동천로 62"},
  {region:"경남/부산", name:"영화의전당", address:"부산광역시 해운대구 수영강변대로 120 영화의전당"},
  {region:"강원", name:"CGV 춘천", address:"강원특별자치도 춘천시 춘천로 15 명동 CGV"},
  {region:"강원", name:"롯데시네마 원주무실", address:"강원특별자치도 원주시 능라동길 73 롯데시네마"},
  {region:"강원", name:"메가박스 강릉", address:"강원특별자치도 강릉시 경강로 2101"},
  {region:"제주", name:"CGV 제주", address:"제주특별자치도 제주시 노연로 80"},
  {region:"제주", name:"롯데시네마 제주아라", address:"제주특별자치도 제주시 아란13길 15"},
  {region:"제주", name:"메가박스 제주삼화", address:"제주특별자치도 제주시 삼화로 82"},
  {region:"제주", name:"CGV 제주노형", address:"제주특별자치도 제주시 원노형로 37"}
]

const Theater = ({userInfo}) => {
    const [myAddress, setMyAddress] = useState(null);
    const [activeRegion, setActiveRegion] = useState('서울');
    const [activeTheater, setActiveTheater] = useState(null);

    // 사용자의 주소 정보가 있으면 그 주소를 세팅
    useEffect(() => {
        if(userInfo && userInfo.address) {
            setMyAddress(userInfo.address);
        }
    },[userInfo]);

    // 영화관 지역에 따라 분류
    const filteredTheaters = theaters.filter((theater) => {
         return (activeRegion === theater.region);
       });

    return (
        <Box maxW="1200px" mx="auto" pt={{ base: 10, md: 20 }} px={{ base: 4 }} pb={10}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "normal",
            color: "#222",
            borderBottom: "2px solid #ccc",
            paddingBottom: "12px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/logo.png`}
            alt="logo"
            style={{ width: "141px", height: "68px", objectFit: "contain" }}
          />
        </h1>
            <Box>
                <NaverMap 
                    myAddress={myAddress} 
                    activeAddress={activeTheater ? activeTheater.address : null}
                />
            </Box>
            {/* 지역 카테고리리 */}
            <Flex gap={2} borderBottom="1px solid #6B46C1" flexWrap="wrap" pt={5} mb={10}>
                {regions.map((region) => (
                    <Button
                        key={region}
                        variant="ghost"
                        borderBottom={
                            activeRegion === region
                            ? "3px solid #6B46C1"
                            : "2px solid transparent"
                        }
                        borderRadius="0"
                        fontWeight={activeRegion === region ? "bold" : "normal"}
                        color={activeRegion === region ? "#6B46C1" : "black"}
                        onClick={() => setActiveRegion(region)}
                        _hover={{ bg: "transparent", color: "#6B46C1" }}
                        fontSize="lg"
                        py={4}
                        px={6}
                        minW="120px"
                        h="50px"
                    >
                        {region}
                    </Button>
                ))}
            </Flex>
            <Flex gap={6} pt={2} pb={2}>
                {filteredTheaters.map((theater, index) => {
                    return <Box 
                                key={index} textAlign="center" alignContent="center"
                                width="15%" height="60px"
                                backgroundColor={activeTheater.name === theater.name ? "#e2e8f0" : "white"}
                                border="1px solid #e2e8f0" borderRadius="md"
                                position="relative"
                                transition="transform 0.2s ease, box-shadow 0.2s ease"
                                _hover={{backgroundColor:"#e2e8f0"}}
                                onClick={()=>{setActiveTheater(theater);}}
                            >

                        <Text>{theater.name}</Text>
                    </Box>
                })}
            </Flex>
        </Box>
    );
}

export default Theater;