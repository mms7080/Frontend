'use client';

import React, {useState} from "react";
import {Box,Flex,Text,Input,Textarea,VStack,Button,ButtonGroup,IconButton,Pagination} from '@chakra-ui/react';
import {LuChevronLeft,LuChevronRight} from "react-icons/lu"
import {fetch} from '../../lib/client';

export default function Qna({userInfo,qnaInfo,replyInfo}){

    const [whichpage,setWhichPage]=useState('all');//'all'-전체 qna 열람 , 'write'-qna 작성창, 'view'-특정 qna 열람

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [viewid,setViewId]=useState(null);
    const [modifyid,setModifyId]=useState(null);
    let count=0;
  
    let tempItems=[...qnaInfo,...replyInfo].sort((a,b) => (new Date(b.writetime)-new Date(a.writetime)));
    
    let initialv=[...tempItems].filter((item,index)=>item.replyto===null);
    tempItems=[...tempItems].filter((item,index)=>item.replyto!==null);
    tempItems=[...tempItems].sort((a,b) => (new Date(a.writetime)-new Date(b.writetime)));
    while(tempItems.length>0){
      count=0;
      for(let i=0;i<initialv.length;i++){
        let loc=i+count+1;
        for(let j=0;j<tempItems.length;j++){
          if(initialv[i].id===tempItems[j].replytoid){
            initialv.splice(loc,0,tempItems[j]);
            tempItems=[...tempItems].map((item,index)=>(index!=j?item:null));
            count++;
            loc++;
          }
        }
        tempItems=[...tempItems].filter((item,index)=>item!==null);
      }
    }

    const [rawItems,setrawItems]=useState(initialv);

    const [currentPage, setCurrentPage] = useState(1);
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

    const handleSubmit=async (e)=>{
      let dataToSend={title:'',content:''};
      
      if(content===''){
          e.preventDefault();
          alert('내용을 입력해주세요.');
          return;
      }

      dataToSend.title=title;
      dataToSend.content=content;
      dataToSend.replyto=null;
      dataToSend.replytoid=null;

      const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/qna/write/logic`, {
          method: 'POST',
          body: JSON.stringify(dataToSend)
      });

      setrawItems([res,...rawItems])
      setCurrentPage(1);
      setWhichPage('all');
    }

    if(whichpage==='all'){
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
                              /* 이걸 a로 바꿔야함 */
                              /* href={`/notice/${notice.id}`} */
                          color: "#222",
                          textDecoration: "none",
                          textAlign:'left',
                          display: "block",
                          transition: "color 0.1s",
                          fontWeight: 400,
                          paddingRight:isNew(qna.writetime)?0:'40px'
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = "#6B46C1")
                        }
                        onMouseOut={(e) => (e.currentTarget.style.color = "#222")}
                      >
                        {qna.replytoid && <span style={{paddingLeft:35}}>↳</span>} {/* reply일 경우 앞에 표시 추가 */}
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
    else if(whichpage==='write'){
      return <>
        <Box maxWidth='800px' my='40px' mx='auto' py='0' px='20px' fontFamily='Segoe UI, sans-serif'>
          <Text textAlign='center' fontSize='30px' mb='40px' borderBottom='2px solid #ccc' pb='10px'>📝 1:1 QnA 작성</Text>
  
          <Flex flexDirection='column' gap='12px'>
            <Text fontSize='15px' mb='4px'>제목</Text>
            <Input
              placeholder="제목을 입력하세요"
              value={title}
              p='12px'
              fontSize='15px'
              border='1px solid #ccc'
              borderRadius='4px'
              outline='none'
              backgroundColor='#fcfcfc'
              fontWeight='normal'
              onChange={(e) => setTitle(e.target.value)}
            />
  
            <Text fontSize='15px' mb='4px'>작성자</Text>
            <Input
              value={userInfo.username==='root'?'관리자':userInfo.username}
              readOnly
              p='12px'
              fontSize='15px'
              border='1px solid #ccc'
              borderRadius='4px'
              outline='none'
              backgroundColor='#fcfcfc'
              fontWeight='normal'
              style={{ backgroundColor: '#eee', cursor: 'not-allowed' }}
            />
  
            <Text fontSize='15px' mb='4px'>내용</Text>
            <Textarea
              placeholder="QnA 내용을 입력하세요"
              value={content}
              p='12px'
              fontSize='15px'
              border='1px solid #ccc'
              borderRadius='4px'
              outline='none'
              backgroundColor='#fcfcfc'
              fontWeight='normal'
              resize="vertical"
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />
  
            <Flex gap='10px' justifyContent='flex-end' mt='20px'>
              <Button 
              bg='#0070f3' color='white' py='10px' px='20px'
               border='none' borderRadius='4px' cursor='pointer' 
               transition='all 0.2s' fontWeight='normal'
               _hover={{bg:'#005bb5'}}
              onClick={handleSubmit}>QnA 등록하기</Button>
              <Button bg='#ccc' color='black' py='10px' px='20px' 
              border='none' borderRadius='4px' cursor='pointer' fontWeight='normal'
              _hover={{bg:'#bbb'}}
              onClick={() => setWhichPage('all')}>취소</Button>
            </Flex>
          </Flex>
        </Box>
      </>;
    }
    else{
      return <>
      </>;
    }
}