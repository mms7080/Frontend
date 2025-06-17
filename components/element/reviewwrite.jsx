import React,{useState} from 'react';
import {Button,Flex,Textarea,NativeSelect} from '@chakra-ui/react';
import {fetch} from '../../lib/client';
import Modal, { useModal } from '../movie/modal';

export default function ReviewWrite({isMobile=false,topindex=0,modifyid,setModifyId,username,reviewList,sortkey,setReviewList,movieInfo,initialContent,initialScore}){

    const [content, setContent] = useState(initialContent);
    const [score, setScore] = useState(initialScore);
    const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();

    const reviewExist=()=>{
        if(modifyid!=-1)return false;
        for(let i=0;i<reviewList.length;i++)
            if(reviewList[i].author===username)
                return true;
        return false;
    }

    const reviewOK=()=>username && !reviewExist();

    const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // 줄바꿈 방지
              handleSubmit();
            }
        };
    
    const handleSubmit=async (e)=>{/* fetch로 데이터를 넘겨주는 과정 */

        let dataToSend={content:'',score:10};

        if(content===''){
            e.preventDefault();
            openModal('내용을 입력해주세요.');
            return;
        }

        dataToSend.content=content;
        dataToSend.score=score;

        const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/logic/${movieInfo.id}`, {
            method: 'POST',
            body: JSON.stringify(dataToSend)
        });

        let writtenindex,writtenitem;

        for(let i=0;i<res.length;i++)
            if(res[i].author===username){
                writtenindex=i;
                writtenitem=res[i];
                break;
            }

        let filtered=res.filter((_, idx) => idx !== writtenindex);
        let sorted;

        if(sortkey==='writetime')sorted=[...filtered].sort((a,b) => (new Date(b.writetime)-new Date(a.writetime)!=0)?(new Date(b.writetime)-new Date(a.writetime)):(b.likenumber-a.likenumber));
        else if(sortkey==='likenumber')sorted=[...filtered].sort((a,b) => (b.likenumber-a.likenumber!=0)?(b.likenumber-a.likenumber):(new Date(b.writetime)-new Date(a.writetime)));
        else if(sortkey==='score')sorted=[...filtered].sort((a,b) => (b.score-a.score!=0)?(b.score-a.score):(new Date(b.writetime)-new Date(a.writetime)));

        sorted.splice(topindex,0,writtenitem);

        setReviewList(sorted);
        setContent(''); // 입력값 초기화
        setScore(10);
    };

    const handleModify=async (e)=>{/* 댓글 수정시에 fetch로 데이터를 넘겨주는 과정 */

        let dataToSend={id:modifyid,content:content,score:score};

        if(content===''){
            e.preventDefault();
            openModal('내용을 입력해주세요.');
            return;
        }

        let modifyindex,modifyitem,newmindex;

        for(let i=0;i<reviewList.length;i++)
            if(reviewList[i].id===modifyid){
                modifyindex=i;
                break;
            }

        const res=await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/review/modify/logic`, {
            method: 'POST',
            body: JSON.stringify(dataToSend)
        });


        for(let i=0;i<res.length;i++)
            if(res[i].id===modifyid){
                newmindex=i;
                modifyitem=res[i];
                break;
            }

        let filtered=res.filter((_, idx) => idx !== newmindex);
        let sorted;

        if(sortkey==='writetime')sorted=[...filtered].sort((a,b) => (new Date(b.writetime)-new Date(a.writetime)!=0)?(new Date(b.writetime)-new Date(a.writetime)):(b.likenumber-a.likenumber));
        else if(sortkey==='likenumber')sorted=[...filtered].sort((a,b) => (b.likenumber-a.likenumber!=0)?(b.likenumber-a.likenumber):(new Date(b.writetime)-new Date(a.writetime)));
        else if(sortkey==='score')sorted=[...filtered].sort((a,b) => (b.score-a.score!=0)?(b.score-a.score):(new Date(b.writetime)-new Date(a.writetime)));

        sorted.splice(modifyindex,0,modifyitem);

        setReviewList(sorted);
        setContent(''); // 입력값 초기화
        setScore(10);
        setModifyId(-1);
    };

    return <>
    <Flex w='100%' gap='15px'>
     {!isMobile?<Flex w='125px' h='70px' justifyContent='center' alignItems='center' mr='5px' whiteSpace="normal" wordBreak="break-word">{username?username:'로그인 필요'}</Flex>:<></>}
        <Flex h='70px' border='1px solid #666666' borderRadius='5px' alignItems='center' flex='1' mx={{base:15,md:0}}>
            <Textarea border='none' outline='none' 
                maxLength='150'
                /* 1) 리사이즈 자체를 막아 사선무늬 제거 */
                resize="none"
                /* 스크롤 자체를 숨김 */
                overflow="hidden"
                /* 또는 개별 축 숨김 */
                overflowX="hidden"
                overflowY="hidden"
                /* CSS 커스터마이징으로 모든 브라우저에서 스크롤바 숨기기 */
                sx={{
                /* 공통 overflow 숨기기 */
                overflow: "hidden",
                /* Chrome, Safari, Edge Chromium */
                "::-webkit-scrollbar": {
                    width: "0px",
                    height: "0px",
                },
                /* Firefox */
                scrollbarWidth: "none",
                /* IE 10+ */
                msOverflowStyle: "none",
                }}
            id='content' name='content' h='70px' fontSize='16px' onKeyDown={handleKeyDown}
            placeholder={!username?'로그인이 필요합니다.'
                :(reviewExist()?'리뷰는 한 영화당 한 개만 작성할 수 있습니다.':(!isMobile?`${movieInfo.title} 재미있게 보셨나요? 영화의 어떤 점이 좋았는지 이야기해주세요.(최대 150자)`:''))}
            readOnly={!reviewOK()}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            _hover={{cursor:'default'}}
            />
            <span style={{overflow:'visible'}}>⭐</span>
            <span style={{padding:!isMobile?5:3}}>:</span>
            <NativeSelect.Root w={{base:'60px',md:"90px"}} pr={{base:'0px',md:'10px'}} flexShrink={0}>
                <NativeSelect.Field w={{base:'60px',md:"90px"}} id='score' name='score' value={score} onChange={(e) => setScore(Number(e.target.value))} disabled={!reviewOK()} // 여기서 제어
                    style={{ cursor: !reviewOK() ? 'default' : 'pointer' }} // 금지 커서 막기
                    >
                    <option value={10}>10</option>
                    <option value={9}>9</option>
                    <option value={8}>8</option>
                    <option value={7}>7</option>
                    <option value={6}>6</option>
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator/>
            </NativeSelect.Root>
            {reviewOK() && (<Button w={{base:'100px',md:'126.06px'}}bg='white' color='#666666' h='60px' fontSize='16px' onClick={modifyid===-1?handleSubmit:handleModify}>✏️ {modifyid===-1?'관람평쓰기':'리뷰 수정하기'}</Button>)}
        </Flex>
        </Flex>
        {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        content={modalContent}/>)}
    </>;
}