"use client"

import { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Input,
    Text,
    VStack,
    HStack,
    RadioCard,
    CheckboxCard
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MovieUploader = ({userInfo}) => {
    const [form, setForm] = useState({
        title: "",
        titleEnglish: "",
        rate: "",
        description: "",
        runningTime: 0,
        genre: "",
        director: "",
        cast: "",
        poster: null,
        wideImage: null,
        stillCut: [],
        trailer: "",
        label: "",
    });
    
    const [user, setUser] = useState(userInfo);
    const [releaseDate, setReleaseDate] = useState(null);
    const router = useRouter()

    try {
        if (!user) throw new Error();
        // 관리자 체크
        if (user.auth !== "ADMIN") {
            alert("관리자만 접근 가능한 페이지입니다.");
            return router.push("/movie");
        }
        } catch {
            alert("로그인이 필요합니다.");
            router.push("/signin");
        }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name.startsWith("label-")) {
            const lavelValue = name.replace("label-", "");
            if(form.label.includes(lavelValue))
                setForm((prev) => ({ ...prev, label: form.label.replace(`${lavelValue},`,"")}));
            else
                setForm((prev) => ({ ...prev, label: form.label + `${lavelValue},`}));
        } else if(name.startsWith("runningTime-")) {
            const timeUnit = name.replace("runningTime-", "");
            const numValue = parseInt(value) || 0;
            if(timeUnit === "hour" && value >= 0)
                setForm((prev) => ({ ...prev, runningTime: form.runningTime % 60 + numValue * 60}))
            else if(timeUnit === "minute" && (value >= 0 || form.runningTime >= 60))
                setForm((prev) => ({ ...prev, runningTime: Math.floor(form.runningTime / 60) * 60 + numValue}))
        } else
            setForm((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e) => {
        const {name} = e.target;
        if(name === "stillCut") {
            const files = Array.from(e.target.files);
            const previews = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setForm((prev) => ({ ...prev, stillCut: previews }));
        }
        else {
            const file = e.target.files[0];
            if(file) {
                const preview = ({
                    file,
                    url: URL.createObjectURL(file),
                });
                setForm((prev) => ({ ...prev, [name]: preview }));
            } else console.log("no file");
        }
    };
    
    const formatDate = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    };
    
    const handleSubmit = async () => {
            const { title, titleEnglish, rate, description, runningTime, genre, director, cast, poster, wideImage, stillCut, trailer, label } = form;
        
            if (!title || !titleEnglish || !rate || !releaseDate || !description || runningTime < 1 || !genre || !director || !cast || !poster || !wideImage || !stillCut || !trailer) {
                alert("모든 항목을 입력해주세요.");
                return;
            }

        const formattedDate = `${formatDate(releaseDate)}`;

        const data = new FormData();
        data.append("title", title);
        data.append("titleEnglish", titleEnglish);
        data.append("rate", rate);
        data.append("releaseDate", formattedDate);
        data.append("description", description);
        data.append("runningTime", runningTime);
        data.append("genre", genre);
        data.append("director", director);
        data.append("cast", cast);
        data.append("poster", poster.file);
        data.append("wideImage", wideImage.file);
        stillCut.forEach(({ file }) => data.append("stillCut", file));
        data.append("label", label);
        data.append("trailer", trailer)

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/upload`,
            {
            method: "POST",
            body: data,
            }
        );

        if (res.ok) {
            alert("영화 업로드 성공!");
            router.push("/movie");
        } else {
            const error = await res.text();
            alert("업로드 실패: " + error);
        }
    };
    
    return (
    <>
        <Box
            maxW="700px"
            mx="auto"
            mt={16}
            p={8}
            border="1px solid #ccc"
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
        >
            <Heading fontSize="2xl" mb={6} color="purple.600" textAlign="center">
                📤 영화 등록
            </Heading>

        <VStack spacing={8}>
            {" "}
            {/* spacing 값 증가 */}
            {/* 제목 */}
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    제목
                </Text>{" "}
                {/* mb 증가 */}
                <Input
                    name="title"
                    value={form.title}
                    placeholder="제목"
                    onChange={handleChange}
                />
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    영어 제목
                </Text>{" "}
                {/* mb 증가 */}
                <Input
                    name="titleEnglish"
                    value={form.titleEnglish}
                    placeholder="영어 제목"
                    onChange={handleChange}
                />
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    상영 등급
                </Text>
                <RadioCard.Root
                    name="rate"
                    align="center"
                    justify="center"
                    // maxW="lg"
                    colorPalette="purple"
                    defaultValue=""
                    onChange={handleChange}
                >
                  <HStack align="stretch" px={1}>
                    {[{value:"ALL"},{value:"12"},{value:"15"},{value:"19"}].map((item) => (
                      <RadioCard.Item key={item.value} value={item.value}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                          <RadioCard.ItemText>{item.value}</RadioCard.ItemText>
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    ))}
                  </HStack>
                </RadioCard.Root>
            </Box>
            {/* 날짜 선택기 */}
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    개봉일
                </Text>
                <DatePicker
                    selected={releaseDate}
                    onChange={(releaseDate) => setReleaseDate(releaseDate)}
                    selectsRelease
                    releaseDate={releaseDate}
                    placeholderText="개봉일"
                    dateFormat="yyyy.MM.dd"
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        width: "140px",
                    }}
                />
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    설명
                </Text>{" "}
                {/* mb 증가 */}
                <Input
                    name="description"
                    value={form.description}
                    placeholder="설명"
                    onChange={handleChange}
                />
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    상영 시간
                </Text>{" "}
                {/* mb 증가 */}
                <HStack>
                    <Input
                    w="45%"
                    name="runningTime-hour"
                    type="number"
                    value={Math.floor(form.runningTime / 60)}
                    placeholder="상영 시간(시간)"
                    onChange={handleChange}
                    />
                    <Text>시간</Text>
                    <Input
                    w="45%"
                    name="runningTime-minute"
                    type="number"
                    value={form.runningTime % 60}
                    placeholder="상영 시간(분)"
                    onChange={handleChange}
                    />
                    <Text>분</Text>
                </HStack>
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    장르
                </Text>{" "}
                {/* mb 증가 */}
                <Input
                    name="genre"
                    value={form.genre}
                    placeholder="장르"
                    onChange={handleChange}
                />
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    감독
                </Text>{" "}
                {/* mb 증가 */}
                <Input
                    name="director"
                    value={form.director}
                    placeholder="감독"
                    onChange={handleChange}
                />
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    출연진
                </Text>{" "}
                {/* mb 증가 */}
                <Input
                    name="cast"
                    value={form.cast}
                    placeholder="출연진"
                    onChange={handleChange}
                />
            </Box>
            {/* 이미지 업로드 */}
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    포스터 업로드
                </Text>
                <Input
                    name="poster"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {form.poster && (
                    <Flex mt={4} gap={4} wrap="wrap">
                        <Box
                            key={"poster"} w="100px" h="100px"
                            border="1px solid #ccc" borderRadius="md"
                            overflow="hidden"
                        >
                            <Image
                                src={form.poster.url} alt={`poster-preview`}
                                w="100%" h="100%" objectFit="cover"
                            />
                        </Box>
                    </Flex>
                )}
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    큰 이미지 업로드
                </Text>
                <Input
                    name="wideImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {form.wideImage && (
                    <Flex mt={4} gap={4} wrap="wrap">
                        <Box
                            key={"wideImage"} w="100px" h="100px"
                            border="1px solid #ccc" borderRadius="md"
                            overflow="hidden"
                        >
                            <Image
                                src={form.wideImage.url} alt={`wideImage-preview`}
                                w="100%" h="100%" objectFit="cover"
                            />
                        </Box>
                    </Flex>
                )}
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    스틸컷 업로드
                </Text>
                <Input
                    name="stillCut"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                {form.stillCut.length > 0 && (
                    <Flex mt={4} gap={4} wrap="wrap">
                        {form.stillCut.map((img, idx) => {
                            <Box
                                key={`stillCut-${idx}`} w="100px" h="100px"
                                border="1px solid #ccc" borderRadius="md"
                                overflow="hidden"
                            >
                                <Image
                                    src={img.url} alt={`stillCut-preview-${idx}`}
                                    w="100%" h="100%" objectFit="cover"
                                />
                            </Box>
                        })}
                    </Flex>
                )}
            </Box>
            <Box w="100%" p={1}>
                <Text fontWeight="bold" mb={2}>
                    예고편
                </Text>{" "}
                {/* mb 증가 */}
                <Input
                    name="trailer"
                    value={form.trailer}
                    placeholder="예고편 유튜브 주소"
                    onChange={handleChange}
                />
            </Box>
            <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                    비고
                </Text>
                <HStack px={1}>
                  <CheckboxCard.Root
                    name="label-IMAX" onChange={handleChange}
                    colorPalette="purple">
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control>
                      <CheckboxCard.Label>IMAX</CheckboxCard.Label>
                    </CheckboxCard.Control>
                  </CheckboxCard.Root>
    
                  <CheckboxCard.Root
                    name="label-4DX" onChange={handleChange}
                    colorPalette="purple">
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control>
                      <CheckboxCard.Label>4DX</CheckboxCard.Label>
                    </CheckboxCard.Control>
                  </CheckboxCard.Root>
                </HStack>
            </Box>
            {/* 버튼 */}
            <Button w="100%" colorScheme="purple" mt={4} onClick={handleSubmit}>
                영화 등록
            </Button>
        </VStack>
    </Box>

    <Box h="100px" />
    </>
    )
}

export default MovieUploader;