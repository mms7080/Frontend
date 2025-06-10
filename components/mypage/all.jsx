import React, {useState} from "react";
import {Box,Flex,VStack,ButtonGroup,IconButton,Pagination} from '@chakra-ui/react';
import {LuChevronLeft,LuChevronRight} from "react-icons/lu"

export default function QnaAll({setTitle,setContent,setWhichPage,userInfo,rawItems,setViewId,setViewIndex,setViewContent,currentPage,setCurrentPage}){

    
    const qnasPerPage = 10;

    const indexOfLastReview = currentPage * qnasPerPage;
    const indexOfFirstReview = indexOfLastReview - qnasPerPage;
    const currentItems = rawItems.slice(indexOfFirstReview, indexOfLastReview);

    /*currentItems에 최종 리스트 삽입*/

    // 날짜 포맷: YYYY.MM.DD
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      };
  
    // 작성일 기준으로 NEW 뱃지 표시 여부 확인 (작성일로부터 2일)
    const isNew = (createdAt) => {
      const created = new Date(createdAt);
      const now = new Date();
      const diff = (now - created) / (1000 * 60 * 60 * 24);
      return diff <= 2;
    };

    return <>
    <Box boxShadow="0 4px 10px rgba(0,0,0,0.05)">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead style={{ backgroundColor: "white" }}>
              <tr style={{ color: "black" }}>
                <th
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #ddd",
                    width: "6%",
                  }}
                >
                  번호
                </th>
                <th style={{ padding: "14px", borderBottom: "1px solid #ddd" }}>
                  제목
                </th>
                <th
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #ddd",
                    width: "20%",
                  }}
                >
                  작성자
                </th>
                <th
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #ddd",
                    width: "10%",
                  }}
                >
                  작성일
                </th>
                <th
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #ddd",
                    width: "12%",
                  }}
                >
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {rawItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      fontSize: "15px",
                    }}
                  >
                    📭 QnA가 없습니다.
                  </td>
                </tr>
              ) : (
                currentItems.map((qna,_index) => (
                  <tr
                    key={indexOfFirstReview+1+_index}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: "#fff",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {indexOfFirstReview+1+_index}
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        fontWeight: "600",
                        fontSize: "16px",
                        lineHeight: "1.4",
                        color: "#222",
                      }}
                    >
                      <div
                          style={{
                          color: "#222",
                          textDecoration: "none",
                          textAlign:'left',
                          display: "block",
                          transition: "color 0.1s",
                          fontWeight: 400,
                          paddingRight:isNew(qna.writetime)?0:'40px',
                          cursor:'pointer',
                        }}
                        onClick={()=>{
                            setViewId(qna.id);
                            for(let i=0;i<rawItems.length;i++){
                                if(rawItems[i].id===qna.id){
                                  setViewIndex(i);
                                  setViewContent(rawItems[i]);
                                  break;
                                }
                            }
                            setWhichPage('view');
                        }
                        }
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = "#6B46C1")
                        }
                        onMouseOut={(e) => (e.currentTarget.style.color = "#222")}
                      >
                        {qna.replytoid && <span style={{paddingLeft:35}}>↳(답변)&nbsp;</span>} {/* reply일 경우 앞에 표시 추가 */}
                        {qna.title}
                        {isNew(qna.writetime) && (
                          <span
                            style={{
                              backgroundColor: "#6B46C1",
                              color: "white",
                              borderRadius: "6px",
                              fontSize: "10px",
                              padding: "2px 10px",
                              marginLeft: "15px",
                              animation: "pulse-badge 1.2s ease-in-out infinite",
                              display: "inline-block",
                              position: "relative",
                              top: "4px",
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      {qna.author==='root'?'관리자':qna.author}
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#999",
                      }}
                    >
                      {formatDate(qna.writetime)}
                    </td>
                    {!(userInfo?.username === qna.author || userInfo?.auth==='ADMIN') &&
                    (<td style={{width:140.16,height:60.5}}></td>)
                    }
                    {(userInfo?.username === qna.author || userInfo?.auth==='ADMIN') && (
                      <td style={{ padding: "14px", textAlign: "center" }}>
                        <Flex w='100%' justifyContent='center' gap='10px'>
                        <button
                          style={{
                            backgroundColor: "#e53e3e",
                            color: "white",
                            padding: "6px 12px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                          onClick={() => {
                            {/* 수정 */}
                          }}
                        >
                          수정
                        </button>
                        <button
                          style={{
                            backgroundColor: "#e53e3e",
                            color: "white",
                            padding: "6px 12px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                          onClick={() => {
                              /* 삭제 */
                          }}
                        >
                          삭제
                        </button>
                        </Flex>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* NEW 뱃지 애니메이션 */}
          <style jsx global>{`
            @keyframes pulse-badge {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.25);
                opacity: 0.6;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
          </Box>
          <Flex w='100%' justifyContent='flex-end' pt='10px'>
            <button
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "8px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "15px",
              transition: "all 0.3s",
              width:110
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#6B46C1")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "black")
            }
            onClick={() => {
              setTitle('');
              setContent('');
              setWhichPage('write');
            }}
          >
            질문글쓰기
          </button>
          </Flex>
          <VStack pt='15px'>
                  <Pagination.Root count={rawItems.length} 
                   pageSize={qnasPerPage} page={currentPage} onPageChange={({page}) =>setCurrentPage(page)}>
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
          
          {/* 10개씩 페이지 그룹 렌더링 */}
                {(() => {
                  const totalPages = Math.ceil(rawItems.length / qnasPerPage);
                  const pageGroupSize = 10;
                  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
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