"use client";

import React, { useState, useEffect } from 'react';
import { Box, Flex, Select, Grid } from '@chakra-ui/react';
import DateSelector from './date';
import TimeSelector from './time';

const regions = ['서울', '경기', '충청'];
const theatersByRegion = {
  '서울': ['CGV 여의도', '롯데시네마 강남'],
  '경기': ['메가박스 수원', 'CGV 분당'],
  '충청': ['롯데시네마 대전', '메가박스 청주'],
};

export default function BookingForm({ onBookingComplete }) {
  const [region, setRegion] = useState('');
  const [theater, setTheater] = useState('');
  const [availableTheaters, setAvailableTheaters] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // region이 바뀔 때마다 해당 지역의 상영관 리스트 세팅
  useEffect(() => {
    if (region) {
      setAvailableTheaters(theatersByRegion[region] || []);
      setTheater('');
    } else {
      setAvailableTheaters([]);
      setTheater('');
    }
  }, [region]);

  // 모두 선택되면 부모 콜백으로 전달
  useEffect(() => {
    if (region && theater && date && time) {
      onBookingComplete({ region, theater, date, time });
    }
  }, [region, theater, date, time]);

  return (
    <Box border="1px solid #eee" borderRadius="md" p={4} w="100%" maxW="600px">
      {/* 상단: 지역 / 상영관 선택 */}
      <Flex mb={6} gap={4}>
        <Select
          placeholder="지역 선택"
          value={region}
          onChange={e => setRegion(e.target.value)}
        >
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>

        <Select
          placeholder="상영관 선택"
          value={theater}
          onChange={e => setTheater(e.target.value)}
          flex="1"
        >
          {availableTheaters.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </Flex>

      {/* 하단: 날짜 / 시간 선택 (2:3 비율 그리드) */}
      {theater && (
        <Grid templateColumns="2fr 3fr" gap={4}>
          <DateSelector selectedDate={date} onDateSelect={setDate} />
          <TimeSelector selectedTime={time} onTimeSelect={setTime} />
        </Grid>
      )}
    </Box>
);
}