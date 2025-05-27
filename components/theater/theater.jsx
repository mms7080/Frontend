"use client"

import { Box, Heading } from "@chakra-ui/react";

const Theater = ({}) => {
    
    return <Box maxW="1200px" mx="auto" pt={{ base: 10, md: 20 }} px={{ base: 4 }} pb={10}>
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
    </Box>
}

export default Theater;