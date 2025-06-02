"use client"
import {useState, useEffect} from 'react';
import NaverMap from "./navermap";
import { Box, Heading } from "@chakra-ui/react";



const Theater = ({userInfo}) => {
    const [address, setAddress] = useState("");

    useEffect(() => {
        if(userInfo && userInfo.address) {
            setAddress(userInfo.address);
        }
    },[]);

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
        </Box>
    );
}

export default Theater;