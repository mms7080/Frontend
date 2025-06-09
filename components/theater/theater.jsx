"use client"
import { useState, useEffect } from 'react';
import { Box, Flex, Button, Text } from "@chakra-ui/react";
import NaverMap from "./navermap";
import Modal, { useModal } from '../../components/theater/modal';

// fetch 이전 임시 데이터들
const regions = ["서울", "경기/인천", "충청/대전", "전라/광주", "경남/부산", "강원", "제주"];
const theaters = [
    { region: "서울", name: "CGV 강남", address: "서울특별시 강남구 강남대로 438 스타플렉스 4층~8층", subway: "2호선 강남역 11번 출구 도보 5분\n9호선 신논현역 5번 출구 도보 5분\n신분당선 신논현역 6번 출구 도보 3분", bus: "- 간선버스 : 140, 144, 145, 146, 360, 400, 402, 420, 421, 440, 441, 452, 470, 640, 643, 741\n  심야) N13, N31, N37, N75\n- 지선버스 : 3412, 4312, 8146, 8541\n- 광역버스 : 1005, 1100, 1101, 1151, 1241, 1311, 1311B, 1550, 1550-1, 1551, 1551B, 1552, 1560, 1570, 1700, 2000, 2000-1, 3008, 3030, 3100, 3401, 3600, 4403, 5001, 5001-1, 5002A, 5002B, 5003A, 5003B,5006, 5100, 5200, 5300, 6001, 6002, 6002-1, 6004, 6427, 6600, 7007, 8001, 8502, 9004, 9202, 9303, 9400, 9404, 9408, 9409, 9500, 9501, 9600, 9700, 9711, 9800, 9802, G5100,G7426, M4403, M4434, M4448, M4449, M5422, M5438, M6427, M7412, P9201, 이음2\n  심야) 1101N, 3100N\n- 마을버스 : 서초03\n- 공항버스 : 6009", parkGuide: "- 스타플렉스 건물 지하2층~4층\n- 발렛서비스 운영시간\n : 오전 8시 이후 ~ 오후 20시\n : 발렛 무료 서비스는  영화 관람 고객 한 함 (영화 미관람 시 건물 주차장에서 별도 정산)\n   (20시 이후 입차 차량은 발렛서비스 이용이 제한될 수 있으며, 별도 운영되는 주차팀의 사정에 따라 변경될 수 있습니다.)", parkCheck: "- 출차 시 영화티켓 제시\n  (모바일/지류 모두가능)", parkFee: "- 영화 관람 시 3시간 5,000원\n- 주차시간(3시간) 초과 시 10분 당 1,000원" },
    { region: "서울", name: "롯데시네마 월드타워", address: "서울특별시 송파구 올림픽로 300 롯데월드타워 5층~11층", subway: "[8호선 잠실역]\n8호선 개찰구 통과 후 지하 1층 대합실 이동(10번, 11번 출구 방면) > 우측 10M 앞 쇼핑몰 게이트 통과(10번 11번 출구 사이 통로) > 아쿠아리움 출구 옆 엘리베이터 이용\n[2호선 잠실역]\n<롯데몰 영업시간 내> 2호선 출구 중앙 잠실광역버스 환승센터 방면 > 좌측 쇼핑몰 게이트(삼송빵집 옆)통과 후 우측 방면 > 케이스티파이(CASETiFY)샵 / 전망대 입구 사이 300M 직진 > 아쿠아리움 출구 옆 엘리베이터 이용\n<롯데몰 영업시간 외> 1층 지상으로 이동(1번 출구) > 약 300m 직진 > 송파구청(8호선 11,12번 출구) 방면 엔제리너스 옆 쇼핑몰 게이트 통과 > 자라(ZARA)/유니클로 사이 엘리베이터 이용", bus: "[지선버스]\n잠실역1번,11번출구 정류장 하차(정류장번호 24134) > 송파구청(8호선 11,12번 출구) 방면 엔제리너스 옆 쇼핑몰 게이트 이용 > 투명 엘리베이터 또는 자라(ZARA)/유니클로 사이 엘리베이터 이용\n[광역버스]\n<롯데몰 영업시간 내> 잠실광역환승센터(지하) 하차(정류장번호 24050) > 2호선 출구 중앙 잠실광역버스 환승센터 방면 > 좌측 쇼핑몰 게이트(삼송빵집 옆)통과 후 우측 방면 > 케이스티파이(CASETiFY)샵 / 전망대 입구 사이 300M 직진 > 아쿠아리움 출구 옆 엘리베이터 이용\n<롯데몰 영업시간 외> 1층 지상으로 이동(잠실역 1번 출구) > 약 300m 직진 > 송파구청(8호선 11,12번 출구) 방면 엔제리너스 옆 쇼핑몰 게이트 통과 > 자라(ZARA)/유니클로 사이 엘리베이터 이용", parkGuide: "롯데월드 몰/타워 주차장 입구로 이동 (모든 주차장 입구 영화관 주차장 연결 가능)\nB2 ~ B6층 기둥 알파벳 S ~ W 구역 인근 주차\n기둥 알파벳 V/W 양쪽 입구 내부 엘리베이터 이용하여 5~10층 이동", parkCheck: null, parkFee: "영화 관람 후 할인 적용 시 10분당 200원(최대 4시간 4,800원)\n심야 할인 적용\n 오후 10시 ~ 오전 6시 10분당 100원 (최대 4시간 2,400원)\n모바일/앱 예매 시 우측 상단 ‘주차권’ 버튼 클릭\n주차 정산은 지하 주차장 층별 주차 정산기 이용\n롯데월드몰 주차 요금\n 운영 시간에 따라 요금 상이 (10분당 300원 ~ 500원)" },
    { region: "서울", name: "메가박스 코엑스", address: "서울특별시 강남구 봉은사로524, (삼성동) 코엑스몰 지하2층", subway: "지하철 2호선 ‘삼성역’하차 → 지하철 5,6번 출구 이용\n지하철 9호선 '봉은사역'하차 → 지하철 7번 출구 이용", bus: "143번, 146번, 301번, 333번, 341번, 342번, 345번, 350번, 401번, 740번\n2413번, 2415번, 3217번, 3411번, 3412번, 3414번, 3417번, 3425번, 4318번, 4419번\n500-2번, 1100번, 1700번, 2000번, 7007번, 8001번, 9407번, 9414번, 9507번, 9607번\n강남01번, 강남06번, 강남07번, 강남08번, N13(심야), N61(심야)", parkGuide: "코엑스몰 주차장 이용", parkCheck: "종이티켓: B2 매표소에서 티켓 제시 후 적용\n모바일티켓: 관람 후 예매내역 하단 \"차량등록\" 클릭 후 할인 적용\n출차 시 정산", parkFee: "22시 이전 출차: 4시간 4,800원\n22시 이후 출차: 4시간 2,400원\n22시 이후 입차 차량은 4시간 무료\n주차 요금은 입차시간을 기준으로 정산\n미 인증시 시간당 6,000원, 초과 15분당 1,500원 부과\n가장 가까운 주차구역: 블루존\n주차장이 혼잡할 수 있으니, 가급적이면 대중교통을 이용 바랍니다. (9호선 봉은사역 7번 출구)" },
    { region: "서울", name: "대한극장", address: "서울특별시 중구 퇴계로 212" },
    { region: "서울", name: "CGV 용산아이파크몰", address: "서울특별시 용산구 한강대로23길 55 아이파크몰 6층", subway: "1호선 | 용산역에서 연결\n4호선 | 신용산역 4번 출구(도보 5분)", bus: "용산역 또는 신용산역 앞에서 하차 후 이동\n[공항] 6050, 6001\n[순환] 90S투어\n[지선] 0017, 0018, 5012, 2016, 7016, 1711\n[간선] 502, 100, 150, 151, 152, 500, 752, 506, 507, 750A\n[마을] 용산03, 용산04", parkGuide: "- 용산아이파크몰 달/해주차장 4층~5.5층 주차 (Mall 내 6층)\n※ Mall 영업시간 외(조조/심야)\n- 달/해주차장 : 4층~5.5층 주차 후 4층 주차장으로 이동 후 Mall 내부 진입(4층 패션파크 GATE 진입→6층 CGV 이동)\n※ 휠체어 이용고객\n- 달주차장 : 4층~5.5층 E/V이용 (4,5층 9,10번 맞은편, 4.5층 6,7번 맞은편, 5.5층 17~19번 맞은편 E/V)\n- 해주차장 : 4층~4.5층 매장입구 진입 후 E/V이용 (Mall 영업시간 외에는 4층 주차장으로 이동 후 Mall 내부로 이동)\n- 주말 주차 공간 협소로 대중교통 이용 권장", parkCheck: "- 6,7층 티켓판매기/CGV APP에서 당일 관람 후 주차 인증", parkFee: "- 티켓판매기/APP에서 당일 관람후 티켓 인증시 3시간 무료 (※2편 이상 관람 시에도 최대 3시간 무료)\n- 무료주차 시간 이후 10분 초과 시 1,300원 부과(1시간 7,800원)\n- 심야영화 관람 시 30시 이전까지 관람일 주차 인증 가능 (30시 이후 직원문의)" },
    { region: "경기/인천", name: "CGV 판교", address: "경기도 성남시 분당구 판교역로 146번길 20 알파리움타워 6층" },
    { region: "경기/인천", name: "롯데시네마 수원", address: "경기도 수원시 권선구 세화로 134 롯데몰 수원점 4층" },
    { region: "경기/인천", name: "메가박스 송도", address: "인천광역시 연수구 송도국제대로 123 송도 트리플스트리트 D동" },
    { region: "경기/인천", name: "CGV 인천터미널", address: "인천광역시 미추홀구 연남로 35 뉴코아아울렛 6층" },
    { region: "경기/인천", name: "메가박스 킨텍스", address: "경기도 고양시 일산서구 대화동 2600 KINTEX 제2전시장" },
    { region: "충청/대전", name: "CGV 대전터미널", address: "대전광역시 동구 동서대로 1689 대전복합터미널 4층" },
    { region: "충청/대전", name: "롯데시네마 대전센트럴", address: "대전광역시 중구 중앙로 123 롯데백화점 9층" },
    { region: "충청/대전", name: "메가박스 대전중앙로", address: "대전광역시 중구 중앙로 119" },
    { region: "충청/대전", name: "CGV 청주지웰시티", address: "충청북도 청주시 흥덕구 대농로 47 지웰시티몰 5층" },
    { region: "전라/광주", name: "CGV 광주터미널", address: "광주광역시 서구 무진대로 904 광주종합버스터미널 U-Square 6층" },
    { region: "전라/광주", name: "롯데시네마 광주광산", address: "광주광역시 광산구 장신로 98 롯데아울렛 광주수완점 4층" },
    { region: "전라/광주", name: "메가박스 전주객사", address: "전라북도 전주시 완산구 전주객사3길 22" },
    { region: "전라/광주", name: "CGV 광주상무", address: "광주광역시 서구 치평로 20 상무지구 이노비즈센터" },
    { region: "경남/부산", name: "CGV 센텀시티", address: "부산광역시 해운대구 센텀남대로 35 신세계 센텀시티몰 4층" },
    { region: "경남/부산", name: "롯데시네마 부산본점", address: "부산광역시 부산진구 가야대로 772 롯데백화점 부산본점 10층" },
    { region: "경남/부산", name: "메가박스 해운대(장산)", address: "부산광역시 해운대구 해운대로 813 반도보라빌딩" },
    { region: "경남/부산", name: "CGV 서면", address: "부산광역시 부산진구 동천로 62" },
    { region: "경남/부산", name: "영화의전당", address: "부산광역시 해운대구 수영강변대로 120 영화의전당" },
    { region: "강원", name: "CGV 춘천", address: "강원특별자치도 춘천시 춘천로 15 명동 CGV" },
    { region: "강원", name: "롯데시네마 원주무실", address: "강원특별자치도 원주시 능라동길 73 롯데시네마" },
    { region: "강원", name: "메가박스 강릉", address: "강원특별자치도 강릉시 경강로 2101" },
    { region: "제주", name: "CGV 제주", address: "제주특별자치도 제주시 노연로 80" },
    { region: "제주", name: "롯데시네마 제주아라", address: "제주특별자치도 제주시 아란13길 15" },
    { region: "제주", name: "메가박스 제주삼화", address: "제주특별자치도 제주시 삼봉로 11" },
    { region: "제주", name: "CGV 제주노형", address: "제주특별자치도 제주시 원노형로 37" }
]

const Theater = ({ userInfo }) => {
    const [myAddress, setMyAddress] = useState(null);
    const [activeRegion, setActiveRegion] = useState('서울');
    const [activeTheater, setActiveTheater] = useState(theaters[0]);
    const [activeInfo, setActiveInfo] = useState("");
    const { isModalOpen, isModalVisible, openModal, closeModal } = useModal();

    // 사용자의 주소 정보가 있으면 그 주소를 세팅
    useEffect(() => {
        if (userInfo && userInfo.address) {
            setMyAddress(userInfo.address);
        }
    }, [userInfo]);

    // 영화관 지역에 따라 분류
    const filteredTheaters = theaters.filter((theater) => {
        return (activeRegion === theater.region);
    });


const InfoButton = ({ text = "" }) => {
    const getInfoType = (text) => {
        if (text.includes('교통안내')) return '교통안내';
        if (text.includes('주차안내')) return '주차안내';
        if (text.includes('상영시간표')) return '상영시간표';
        return '';
    };
    
    return <Button
        textAlign="center" alignContent="center"
        fontSize="xl" color="black"
        width="80%" height="60px"
        backgroundColor="white"
        border="1px solid #e2e8f0" borderRadius="md"
        _hover={{ borderColor: "#6E4AC2" }}
        onClick={() => {
            setActiveInfo(getInfoType(text));
            openModal();
        }}
    >
        <Text>{text}</Text>
    </Button>
}

    return (
        <Box maxW="1200px" mx="auto" pt={{ base: 10, md: 20 }} px={{ base: 4 }} pb={10}>
            {/* 상단 로고 */}
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
            <Flex justifyContent="space-between">
                <Box w="50%">
                    <NaverMap
                        myAddress={myAddress}
                        activeAddress={activeTheater ? activeTheater.address : null}
                    />
                </Box>
                {activeTheater && (
                    <Flex w="50%" flexDirection="column" textAlign="center" alignItems='center' gap="3%">
                        <Text fontSize="3xl">{activeTheater.name}</Text>
                        <Text fontSize="md">{activeTheater.address}</Text>
                        <InfoButton text="🚌 교통안내" />
                        <InfoButton text="🚗 주차안내" />
                        <InfoButton text="🎥 상영시간표" />
                    </Flex>
                )}
            </Flex>
            {/* 지역 카테고리 */}
            <Flex gap={2} borderBottom="1px solid #6B46C1" flexWrap="wrap" pt={5} mb={5}>
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
            {/* 영화관 목록 */}
            <Flex gap={6}>
                {filteredTheaters.map((theater, index) => {
                    return <Button
                        key={index} textAlign="center" alignContent="center"
                        fontSize="md" color="black"
                        width="15%" height="60px"
                        backgroundColor={(activeTheater && activeTheater.name === theater.name) ? "#e2e8f0" : "white"}
                        border="1px solid #e2e8f0" borderRadius="md"
                        _hover={{ backgroundColor: "#e2e8f0" }}
                        onClick={() => { setActiveTheater(theater); }}
                    >
                        <Text>{theater.name}</Text>
                    </Button>
                })}
            </Flex>
            {isModalOpen && (<Modal
                isModalOpen={isModalOpen}
                isModalVisible={isModalVisible}
                closeModal={closeModal}
                title={activeInfo}
                content={
                    activeInfo === "교통안내" ? <Flex flexDirection="column" gap={6} style={{ whiteSpace: 'pre-wrap' }}>
                        {activeTheater.subway && (
                            <>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    pl={2}
                                    borderLeft="4px solid #6B46C1"
                                >
                                    지하철
                                </Text>
                                {activeTheater.subway}
                            </>
                        )}
                        {activeTheater.bus && (
                            <>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    pl={2}
                                    borderLeft="4px solid #6B46C1"
                                >
                                    버스
                                </Text>
                                {activeTheater.bus}
                            </>
                        )}
                    </Flex>
                    : activeInfo === "주차안내" ? <Flex flexDirection="column" gap={6} style={{ whiteSpace: 'pre-wrap' }}>
                        {activeTheater.parkGuide && (
                            <>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    pl={2}
                                    borderLeft="4px solid #6B46C1"
                                >
                                    주차안내
                                </Text>
                                {activeTheater.parkGuide}
                            </>
                        )}
                        {activeTheater.parkCheck && (
                            <>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    pl={2}
                                    borderLeft="4px solid #6B46C1"
                                >
                                    주차확인
                                </Text>
                                {activeTheater.parkCheck}
                            </>
                        )}
                        {activeTheater.parkFee && (
                            <>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    pl={2}
                                    borderLeft="4px solid #6B46C1"
                                >
                                    주차요금
                                </Text>
                                {activeTheater.parkFee}
                            </>
                        )}
                    <br/>
                    </Flex>
                    : activeInfo === "상영시간표" ? <Box>

                    </Box>
                    : <Text>activeInfo error : {activeInfo}</Text>
                } />)}

        </Box>
    );
}

export default Theater;