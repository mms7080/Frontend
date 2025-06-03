"use client"
import {useState, useEffect} from 'react';
import NaverMap from "./navermap";
import { Box, Heading, Flex, Button } from "@chakra-ui/react";

const regions = ["서울","경기/인천","충청/대전","전라/광주","경남/부산","강원","제주"];

const Theater = ({userInfo}) => {
    const [address, setAddress] = useState(null);
    const [activeRegion, setActiveRegion] = useState('서울');

    useEffect(() => {
        if(userInfo && userInfo.address) {
            setAddress(userInfo.address);
        }
    },[userInfo]);

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
            <Box>
                <NaverMap address={address}/>
            </Box>
            <Flex gap={2} borderBottom="1px solid #6B46C1" flexWrap="wrap" mb={10}>
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
        </Box>
    );
}

export default Theater;