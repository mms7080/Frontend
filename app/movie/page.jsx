"use client";

import React,{useEffect,useState} from 'react';
import {Text, Flex, Box, Grid, GridItem} from '@chakra-ui/react';

import Movie, {movie} from '../../components/movie/movie';
import {Header,Footer} from '../../components';

import {fetch} from '../../lib/client';

export default function Moviepage(){
    
    useEffect(() => {
        document.title = '전체 영화';
    }, []);

    let headerColor='black';
    let headerBg='#F9F9F9';
    let footerColor='black';
    let footerBg='#F9F9F9';
    let footerBorder='#ccc';


    return <>
        <Header headerColor={headerColor} headerBg={headerBg}></Header>
        <Box w='calc(100vw - 17px)' minW='1000px'>
            <Text fontSize="xl" fontWeight="bold" mb={6} borderLeft="4px solid #5f0080" pl={2}>
                전체 영화
            </Text>
            <Grid templateColumns='repeat(4, 1fr)' gap='6' w='80%' alignItems='center'>
                <GridItem><Movie src='https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg' name='미션 임파서블' reserve_rate='55.5%' release_date='2025.05.17' like_number='1k'></Movie></GridItem>
                <GridItem><Movie src='https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg' name='미션 임파서블' reserve_rate='55.5%' release_date='2025.05.17' like_number='1k'></Movie></GridItem>
                <GridItem><Movie src='https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg' name='미션 임파서블' reserve_rate='55.5%' release_date='2025.05.17' like_number='1k'></Movie></GridItem>
                <GridItem><Movie src='https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1700795880/catalog/1600659718750367744/xiry6ufbjttckqxpfzrw.jpg' name='미션 임파서블' reserve_rate='55.5%' release_date='2025.05.17' like_number='1k'></Movie></GridItem>

            </Grid>
        </Box>
        <Footer footerColor={footerColor} footerBg={footerBg} footerBorder={footerBorder}></Footer>
        </>;
}