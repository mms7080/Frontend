"use client";

import React from 'react';
import {
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter,
  Button, Text, VStack
} from '@chakra-ui/react';

export default function BookingModal({ isOpen, onClose, date, movie, theater, time }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>예매 확인</ModalHeader>
        <ModalBody>
          <VStack align="start" spacing={2}>
            <Text>날짜: {date}</Text>
            <Text>영화: {movie?.title}</Text>
            <Text>극장: {theater?.name}</Text>
            <Text>시간: {time}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => {
            console.log('Booking confirmed', { date, movie, theater, time });
            onClose();
          }}>
            예매하기
          </Button>
          <Button onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
