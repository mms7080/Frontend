'use client';

import React, {useState,useEffect} from "react";
import {Box,Flex,Text,Input,Textarea,Button} from '@chakra-ui/react';
import All from './all';
import {fetch} from '../../lib/client';

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  backgroundColor: "#ffffff",
  width: "20%",
  fontWeight: 400,
  borderBottom: "1px solid #ddd",
  color: "#555",
  fontSize: "14px"
};

const tdStyle = {
  padding: "12px 16px",
  borderBottom: "1px solid #ddd",
  color: "#444",
  fontWeight: 400,
  fontSize: "14px"
};

const disabledStyle = {
  opacity: 0.4,
  cursor: "not-allowed"
};

const navBtn = {
  padding: "8px 16px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 400,
  color: "#6B46C1",
  transition: "all 0.3s ease"
};

const editBtn = {
  padding: "8px 16px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#eeeeee",
  fontWeight: 400,
  fontSize: "14px",
  cursor: "pointer",
  color: "#333",
  transition: "all 0.3s ease"
};


const listBtn = {
  padding: "8px 16px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#6B46C1",
  fontWeight: 400,
  fontSize: "14px",
  color: "#fff",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

export default function Qna({userInfo,qnaInfo,replyInfo}){

    const [currentPage, setCurrentPage] = useState(1);

    const [whichpage,setWhichPage]=useState('all');//'all'-전체 qna 열람 , 'write'-qna 작성창, 'view'-특정 qna 열람

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [viewid,setViewId]=useState(null);
    const [viewindex,setViewIndex]=useState(null);
    const [viewcontent,setViewContent]=useState(null);
    const [modifyid,setModifyId]=useState(null);
    const [replyto,setReplyTo]=useState(null);
    const [replytoid,setReplyToId]=useState(null);

    let count=0;
    
    let arrs=[...qnaInfo,...replyInfo];
    arrs=[...arrs].filter((item, index, self) =>index === self.findIndex(obj => obj.id === item.id));

    let tempItems=arrs.sort((a,b) => (new Date(b.writetime)-new Date(a.writetime)));
    let initialv=[...tempItems].filter((item,index)=>item.replyto===null);
    tempItems=[...tempItems].filter((item,index)=>item.replyto!==null);
    tempItems=[...tempItems].sort((a,b) => (new Date(a.writetime)-new Date(b.writetime)));
    while(tempItems.length>0){
      for(let i=0;i<initialv.length;i++){
        count=0;
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

    useEffect(()=>{
      for(let i=0;i<rawItems.length;i++){
        if(rawItems[i].id===viewid){
          setViewIndex(i);
          setViewContent(rawItems[i]);
          break;
        }
      }
    },[viewid,rawItems,viewindex]);

    // 날짜 포맷: YYYY.MM.DD
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    };

    const handleSubmit=async ()=>{
      let dataToSend={title,content,replyto,replytoid};

      if(title===''){
          alert('제목을 입력해주세요.');
          return;
      }

      if(content===''){
          alert('내용을 입력해주세요.');
          return;
      }

      if(modifyid===null){

        const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/qna/write/logic`, {
            method: 'POST',
            body: JSON.stringify(dataToSend)
        });

        let replyindex,targetindex;

        if(replytoid!==null){/* 답변을 작성하는 경우 */
          for(let findindex=0;findindex<rawItems.length;findindex++){
            if(rawItems[findindex].id===replytoid){
              replyindex=findindex+1;
              targetindex=replyindex;
              while(rawItems[(replyindex<rawItems.length)?replyindex:replyindex-1].replytoid!==null && replyindex<rawItems.length){
                replyindex++;
                if(targetindex<replyindex && rawItems[replyindex-1].replytoid===rawItems[findindex].id)
                  targetindex=replyindex;
              }
              break;
            }
          }
          let arr=[...rawItems];
          arr.splice(targetindex,0,res);
          setrawItems(arr);
          
        }else{/* 답변이 아닌 글을 작성하는 경우 */
          setrawItems([res,...rawItems]);
          setCurrentPage(1);
        }

        setReplyTo(null);
        setReplyToId(null);
        alert('QnA가 등록되었습니다!');
      }
      else{

        dataToSend.id=modifyid;

        const res2=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/qna/modify/logic`, {
            method: 'POST',
            body: JSON.stringify(dataToSend)
        });

        setrawItems([...rawItems].map((item,index)=>(item.id===modifyid?res2:item)));
        setModifyId(null);

        alert('QnA가 수정되었습니다!');
      }
      setWhichPage('all');
    }

    if(whichpage==='all'){
     return <>
      <Box w='100%' h='30px'></Box>
      <All setrawItems={setrawItems} setTitle={setTitle} setContent={setContent} setWhichPage={setWhichPage} userInfo={userInfo} rawItems={rawItems} setViewId={setViewId} setViewIndex={setViewIndex} setViewContent={setViewContent} currentPage={currentPage} setCurrentPage={setCurrentPage} setModifyId={setModifyId}></All>
      </>;
    }
    else if(whichpage==='write'){
      return <>
        <Box maxWidth='800px' my='40px' mx='auto' py='0' px='20px' fontFamily='Segoe UI, sans-serif'>
          <Text textAlign='center' fontSize='30px' mb='40px' borderBottom='2px solid #ccc' pb='10px'>📝 {!modifyid?'1:1 QnA 작성':'1:1 QnA 수정'}</Text>
  
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
              placeholder="QnA 내용을 입력하세요(1000글자 제한)"
              maxLength='999'
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
              onClick={()=>handleSubmit()}>{!modifyid?'QnA 등록하기':'QnA 수정하기'}</Button>
              <Button bg='#ccc' color='black' py='10px' px='20px' 
              border='none' borderRadius='4px' cursor='pointer' fontWeight='normal'
              _hover={{bg:'#bbb'}}
              onClick={() => {
                setWhichPage('all');
                setModifyId(null);
              }}>목록으로 돌아가기</Button>
            </Flex>
          </Flex>
        </Box>
        <All setrawItems={setrawItems} setTitle={setTitle} setContent={setContent} setWhichPage={setWhichPage} userInfo={userInfo} rawItems={rawItems} setViewId={setViewId} setViewIndex={setViewIndex} setViewContent={setViewContent}  currentPage={currentPage} setCurrentPage={setCurrentPage} setModifyId={setModifyId}></All>
      </>;
    }
    else{
      return <>
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "80px 16px 40px",
          boxSizing: "border-box",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "24px",
          }}
        >
          <tbody>
            <tr>
              <th style={thStyle}>제목</th>
              <td style={{ ...tdStyle, color: "#000" }}>{viewcontent.title}</td>
            </tr>
            <tr>
              <th style={thStyle}>작성자</th>
              <td style={{ ...tdStyle, color: "#000" }}>{viewcontent.author==='root'?'관리자':viewcontent.author}</td>
            </tr>
            <tr>
              <th style={thStyle}>작성일</th>
              <td style={{ ...tdStyle, color: "#000" }}>
              {formatDate(viewcontent.writetime)}
              </td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.8",
            padding: "20px",
            backgroundColor: "#ffffff",
            border: "1px solid #eee",
            borderRadius: "6px",
            fontSize: "17px",
            color: "#333",
            marginBottom: "30px",
            fontWeight: 400,
          }}
        >
          {viewcontent.content}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{ ...navBtn, ...(viewindex > 0 ? {} : disabledStyle) }}
              disabled={!(viewindex > 0)}
              onClick={() =>{
                if(viewindex>0){
                  setViewIndex(viewindex-1);
                  setViewId(rawItems[viewindex-1].id);
                  setViewContent(rawItems[viewindex-1]);
                }
              }}
              onMouseOver={(e) =>
                (viewindex > 0) && (e.currentTarget.style.backgroundColor = "#f3e8ff")
              }
              onMouseOut={(e) =>
                (viewindex > 0) && (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              이전글
            </button>
            <button
              style={{ ...navBtn, ...(viewindex < rawItems.length-1 ? {} : disabledStyle) }}
              disabled={!(viewindex < rawItems.length-1)}
              onClick={() => {
                if(viewindex < rawItems.length-1){
                  setViewIndex(viewindex+1);
                  setViewId(rawItems[viewindex+1].id);
                  setViewContent(rawItems[viewindex+1]);
                }
              }}
              onMouseOver={(e) =>
                (viewindex < rawItems.length-1) && (e.currentTarget.style.backgroundColor = "#f3e8ff")
              }
              onMouseOut={(e) =>
                (viewindex < rawItems.length-1) && (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              다음글
            </button>
          </div>
          {(userInfo?.username === viewcontent.author||userInfo?.auth==='ADMIN') && (
          <div style={{ display: "flex", gap: "20px" }}>
            <button
              style={editBtn}
              onClick={()=>{
                setTitle('');
                setContent('');
                setReplyTo(viewcontent.author);
                setReplyToId(viewcontent.id);
                setWhichPage('write');
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#ddd")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#eee")
              }
            >
              답변
            </button>
            <button
              style={editBtn}
              onClick={()=>{
                setTitle(viewcontent.title);
                setContent(viewcontent.content);
                setModifyId(viewcontent.id);
                setWhichPage('write');
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#ddd")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#eee")
              }
            >
              수정
            </button>
            <button
              style={editBtn}
              onClick={async () => {
                if (confirm("정말 삭제하시겠습니까?")) {
                  const res3=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/qna/delete/logic/${viewcontent.id}`);
                  setrawItems([...rawItems].map((item,index)=>(item.id===viewcontent.id?res3:item)));
                  setWhichPage('all');
                }
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#ddd")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#eee")
              }
            >
              삭제
            </button>
          </div>
          )}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                setWhichPage('all');
                setModifyId(null);
              }}
              style={listBtn}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#553C9A")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B46C1")
              }
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>

        <All setrawItems={setrawItems} setTitle={setTitle} setContent={setContent} setWhichPage={setWhichPage} userInfo={userInfo} rawItems={rawItems} setViewId={setViewId} setViewIndex={setViewIndex} setViewContent={setViewContent} currentPage={currentPage} setCurrentPage={setCurrentPage} setModifyId={setModifyId}></All>
      </>;
    }
}