'use client';

import React,{useState,useEffect,useMemo} from "react";
import {Box,Text,VStack,ButtonGroup,IconButton,Pagination} from '@chakra-ui/react';
import {LuChevronLeft,LuChevronRight} from "react-icons/lu"

export default function Bookingcheck({reservationInfo,paymentInfo}){

    const [reservations,setReservations]=useState([...reservationInfo].sort((a, b) => {
        const timeA = new Date(a.approvedAt || 0).getTime();
        const timeB = new Date(b.approvedAt || 0).getTime();
        return timeB - timeA; // 결제 시각 최신순
      }));
    const [payments,setPayments]=useState([...paymentInfo].sort((a, b) => {
        const dateA = new Date(a.approvedAt);
        const dateB = new Date(b.approvedAt);
        return dateB - dateA;
      }));
    const [movies,setMovies]=useState([]);

    const contentsPerPage = 10;

    const [currentPage1, setCurrentPage1] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);

    const indexOfLast1 = currentPage1 * contentsPerPage;
    const indexOfFirst1 = indexOfLast1 - contentsPerPage;
    const paginatedReservations = [...reservations].slice(indexOfFirst1, indexOfLast1);

    const indexOfLast2 = currentPage2 * contentsPerPage;
    const indexOfFirst2 = indexOfLast2 - contentsPerPage;
    const paginatedPayments = [...payments].slice(indexOfFirst2, indexOfLast2);    

    useEffect(()=>{
        fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/movies`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setMovies);
    },[]);

    // 📌 영화 ID → 영화 제목으로 매핑 (그래프나 표에 표시할 때 사용)
    const movieMap = useMemo(() => {
      const map = {};
      movies.forEach((m) => {
        map[m.id] = m.title;
      });
      return map;
    }, [movies]);

    const thStyle = {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      textAlign: "left",
      cursor: "pointer",
    };

    const tdStyle = {
      padding: "10px",
      borderBottom: "1px solid #eee",
    };

    return <>
          <Box w='100%' h='30px'></Box>
           <Text
              fontSize="xl"
              fontWeight="bold"
              mb={6}
              borderLeft="4px solid #6B46C1"
              pl={2}
            >
              예매내역
            </Text>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f1f1" }}>
                  <th style={thStyle}>주문번호</th>
                  <th style={thStyle}>유저</th>
                  <th style={thStyle}>영화</th>
                  <th style={thStyle}>지역</th>
                  <th style={thStyle}>극장</th>
                  <th style={thStyle}>날짜</th>
                  <th style={thStyle}>시간</th>
                  <th style={thStyle}>좌석</th>
                  <th style={thStyle}>총액</th>
                  <th style={thStyle}>결제 시각</th>
                  <th style={thStyle}>상태</th>
                  <th style={thStyle}>환불</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReservations.map((r, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{r.orderId}</td>
                    <td style={tdStyle}>{r.userId}</td>
                    <td style={tdStyle}>{movieMap[r.movieId] || r.movieId}</td>
                    <td style={tdStyle}>{r.region}</td>
                    <td style={tdStyle}>{r.theater}</td>
                    <td style={tdStyle}>{r.date}</td>
                    <td style={tdStyle}>{r.time}</td>
                    <td style={tdStyle}>{r.seats}</td>
                    <td style={tdStyle}>
                      {Number(r.totalPrice).toLocaleString()}원
                    </td>
                    <td style={tdStyle}>
                      {r.approvedAt
                        ? new Date(r.approvedAt).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td style={tdStyle}>
                      {r.status === "CANCELED" ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          환불됨
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>정상</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {r.status !== "CANCELED" && (
                        <button
                          onClick={async () => {
                            if (!confirm("이 예매를 환불 처리하시겠습니까?"))
                              return;
                            try {
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/reservations/${r.id}/cancel`,
                                {
                                  method: "PATCH",
                                  credentials: "include",
                                }
                              );
                              if (res.ok) {
                                alert("환불 처리 완료");
                                // 상태값 업데이트를 위해 목록 재요청
                                const refreshed = await fetch(
                                  `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/reservations`,
                                  { credentials: "include" }
                                );
                                const data = await refreshed.json();
                                setReservations(data);
                              } else {
                                console.log(res);
                                alert("환불 실패");
                              }
                            } catch (e) {
                              alert("환불 요청 중 오류 발생: " + e.message);
                            }
                          }}
                          style={{
                            background: "#e53e3e",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 8px",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          환불
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <VStack pt='15px'>
              <Pagination.Root count={reservations.length} 
               pageSize={contentsPerPage} page={currentPage1} onPageChange={({page}) =>setCurrentPage1(page)}>
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>
      
      {/* 10개씩 페이지 그룹 렌더링 */}
            {(() => {
              const totalPages = Math.ceil(reservations.length / contentsPerPage);
              const pageGroupSize = 10;
              const currentGroup = Math.floor((currentPage1 - 1) / pageGroupSize);
              const startPage = currentGroup * pageGroupSize + 1;
              const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
      
              return Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                const pageNum = startPage + idx;
                return (
                  <Pagination.Item key={pageNum} value={pageNum} asChild>
                    <IconButton
                      variant={{ base: "ghost", _selected: "outline" }}
                    >
                      {pageNum}
                    </IconButton>
                  </Pagination.Item>
                );
              });
            })()}
      
          <Pagination.NextTrigger asChild>
            <IconButton>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
          </VStack>

            <Box w='100%' h='30px'></Box>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={6}
              borderLeft="4px solid #6B46C1"
              pl={2}
            >
              구매내역
            </Text>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f1f1" }}>
                  <th style={thStyle}>주문번호</th>
                  <th style={thStyle}>상품명</th>
                  <th style={thStyle}>유저ID</th>
                  <th style={thStyle}>결제금액</th>
                  <th style={thStyle}>결제일</th>
                  <th style={thStyle}>결제수단</th>
                  <th style={thStyle}>카드사</th>
                  <th style={thStyle}>환불</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((p, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{p.orderId}</td>
                    <td style={tdStyle}>{p.orderName}</td>
                    <td style={tdStyle}>{p.userId}</td>
                    <td style={tdStyle}>{p.amount.toLocaleString()}원</td>
                    <td style={tdStyle}>
                      {new Date(p.approvedAt).toLocaleString()}
                    </td>
                    <td style={tdStyle}>{p.method}</td>
                    <td style={tdStyle}>{p.cardCompany || "-"}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={async () => {
                          if (confirm("환불 및 취소 처리하시겠습니까?")) {
                            try {
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/payments/refund/${p.id}`,
                                {
                                  method: "DELETE",
                                  credentials: "include",
                                }
                              );
                              if (res.ok) {
                                alert("환불 완료");
                                setPayments((prev) =>
                                  prev.filter((item) => item.id !== p.id)
                                );
                              } else {
                                alert("환불 실패");
                              }
                            } catch (e) {
                              alert("에러 발생: " + e.message);
                            }
                          }
                        }}
                        style={{
                          background: "#e53e3e",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 8px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        환불
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <VStack pt='15px'>
              <Pagination.Root count={payments.length} 
               pageSize={contentsPerPage} page={currentPage2} onPageChange={({page}) =>setCurrentPage2(page)}>
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>
      
      {/* 10개씩 페이지 그룹 렌더링 */}
            {(() => {
              const totalPages = Math.ceil(payments.length / contentsPerPage);
              const pageGroupSize = 10;
              const currentGroup = Math.floor((currentPage2 - 1) / pageGroupSize);
              const startPage = currentGroup * pageGroupSize + 1;
              const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
      
              return Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                const pageNum = startPage + idx;
                return (
                  <Pagination.Item key={pageNum} value={pageNum} asChild>
                    <IconButton
                      variant={{ base: "ghost", _selected: "outline" }}
                    >
                      {pageNum}
                    </IconButton>
                  </Pagination.Item>
                );
              });
            })()}
      
          <Pagination.NextTrigger asChild>
            <IconButton>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
          </VStack>
    </>;
}