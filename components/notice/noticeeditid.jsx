"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../header";
import Modal, { useModal } from '../movie/modal';

export default function NoticeEditIdPage({userData}) {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(userData);
  const [notice, setNotice] = useState({ title: "", content: "", writer: "" });
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();

  useEffect(() => {
  try {
      if (!user) throw new Error();
      // ✅ 관리자 권한이 아닌 경우 접근 제한
       if (user.auth !== "ADMIN") {
            openModal("접근 권한이 없습니다.", ()=>{router.push("/notice");}, ()=>{router.push("/notice");});
            
        }
  } catch (e) {
    openModal("로그인이 필요합니다.", ()=>{router.push("/signin");}, ()=>{router.push("/signin");});
  }
  },[user]);
  
  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${id}`
      );
      const data = await res.json();
      setNotice(data);
    })();
  }, [id]);

  const handleUpdate = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(notice),
      }
    );
    if (res.ok) {
      openModal("공지사항이 수정되었습니다!", ()=>{router.push(`/notice/${id}`);}, ()=>{router.push(`/notice/${id}`);});
    } else {
      openModal("공지사항 수정에 실패했습니다.");
    }
  };

  if(!user || user?.auth !== "ADMIN"){
    return <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
      {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      onConfirm={onConfirm}
	    onCancel={onCancel}
      content={modalContent}/>)}
    </>;
  }

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />

      <main className="form-container">
        <h1>🛠️ 공지사항 수정</h1>

        <div className="form-group">
          <label>제목</label>
          <input
            placeholder="제목을 입력하세요"
            value={notice.title}
            onChange={(e) => setNotice({ ...notice, title: e.target.value })}
          />

          <label>작성자</label>
          <input
            placeholder="작성자 이름"
            value={notice.writer}
            readOnly
            style={{ backgroundColor: "#eee", cursor: "not-allowed" }}
          />

          <label>내용</label>
          <textarea
            placeholder="공지사항 내용을 입력하세요"
            value={notice.content}
            onChange={(e) => setNotice({ ...notice, content: e.target.value })}
            rows={10}
          />

          <div className="button-group">
            <button className="submit-btn" onClick={handleUpdate}>
              수정 완료
            </button>
            <button
              className="cancel-btn"
              onClick={() => router.push(`/notice/${id}`)}
            >
              취소
            </button>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        .form-container {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
          font-family: "Segoe UI", sans-serif;
        }

        h1 {
          text-align: center;
          font-size: 30px;
          margin-bottom: 40px;
          border-bottom: 2px solid #ccc;
          padding-bottom: 10px;
          font-weight: normal;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        label {
          font-size: 15px;
          margin-bottom: 4px;
          font-weight: normal;
        }

        input,
        textarea {
          padding: 12px;
          font-size: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
          outline: none;
          background-color: #fcfcfc;
          font-weight: normal;
        }

        textarea {
          resize: vertical;
        }

        .button-group {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .submit-btn {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-weight: normal;
        }

        .submit-btn:hover {
          background-color: #005bb5;
        }

        .cancel-btn {
          background-color: #ccc;
          color: black;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: normal;
        }

        .cancel-btn:hover {
          background-color: #bbb;
        }
      `}</style>
            {isModalOpen && (<Modal
      isModalOpen={isModalOpen}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      onConfirm={onConfirm}
	    onCancel={onCancel}
      content={modalContent}/>)}
    </>
  );
}
