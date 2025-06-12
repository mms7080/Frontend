"use client"
import { useState, useEffect } from 'react';
import { Box, Flex, Button, Text } from "@chakra-ui/react";
import NaverMap from "./navermap";
import Modal, { useModal } from '../../components/theater/modal';

const Theater = ({ userInfo, regionInfo, theaterInfo }) => {

    const regions = regionInfo.data;
    const theaters = theaterInfo.data;
    if(!regions) console.error("region fetch error");
    if(!theaters) console.error("theater fetch error")

    const [myAddress, setMyAddress] = useState(null);
    const [activeRegion, setActiveRegion] = useState(regions[0]);
    const [activeTheater, setActiveTheater] = useState(((theaters)=>{
        for(let th of theaters) {
            if(th.region === regions[0])
                return th;
        }
    })(theaters));
    const [activeInfo, setActiveInfo] = useState("");
    const { isModalOpen, isModalVisible, openModal, closeModal } = useModal();

        useEffect(() => {
            document.title = '영화관 - FILMORA';
        })

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
            // if (text.includes('상영시간표')) return '상영시간표';
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
        <Box maxW="1200px" mx="auto" pt={{ base: 10, md: 20 }} px={{ base: 4 }}>
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
                    loading='lazy'
                />
            </h1>
            {/* 중앙의 [지도 | 정보 버튼] 부분 */}
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
                        <Text fontSize="md" color="gray.800">{activeTheater.address}</Text>
                        <InfoButton text="🚌 교통안내" />
                        <InfoButton text="🚗 주차안내" />
                        {/* <InfoButton text="🎥 상영시간표" /> */}
                    </Flex>
                )}
            </Flex>
            {/* 지역 카테고리 */}
            <Flex gap={2} borderBottom="1px solid #6B46C1" flexWrap="wrap" pt={6} mb={5}>
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
                        fontWeight="normal"
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
            <Flex gap={6} pb={16} flexWrap="wrap">
                {filteredTheaters.map((theater, index) => {
                    return <Button
                        key={index} textAlign="center" alignContent="center"
                        fontSize="md" color="black"
                        width="200px" height="60px"
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
                        {(!activeTheater.subway && !activeTheater.bus) 
                            && (<Text>관련 정보가 없습니다</Text>)}
                        {activeTheater.subway && (
                            <>
                                <Text
                                    fontSize="xl"
                                    fontWeight="md"
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
                                    fontWeight="md"
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
                        {(!activeTheater.parkGuide && !activeTheater.parkCheck && !activeTheater.parkFee) 
                            && (<Text>관련 정보가 없습니다</Text>)}
                        {activeTheater.parkGuide && (
                            <>
                                <Text
                                    fontSize="xl"
                                    fontWeight="md"
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
                                    fontWeight="md"
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
                                    fontWeight="md"
                                    pl={2}
                                    borderLeft="4px solid #6B46C1"
                                >
                                    주차요금
                                </Text>
                                {activeTheater.parkFee}
                            </>
                        )}
                    </Flex>
                    // : activeInfo === "상영시간표" ? <Box>
                    //     <Text>관련 정보가 없습니다</Text>
                    // </Box>
                    : <Text>activeInfo error : {activeInfo}</Text>
                } />)}

        </Box>
    );
}

export default Theater;