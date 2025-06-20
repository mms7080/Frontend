"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../header";
import NoticeList from "../../components/notice/noticeList";
import Modal, { useModal } from '../movie/modal';

export default function NoticeIdPage({ userData }) {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [notice, setNotice] = useState(null);
  const [user, setUser] = useState(userData);
  const [allNotices, setAllNotices] = useState([]);
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);
  const { isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel, isConfirm } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailRes, listRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice`),
        ]);
        if (!detailRes.ok || !listRes.ok)
          throw new Error("데이터 불러오기 실패");
        const data = await detailRes.json();
        const list = await listRes.json();
        setNotice(data);
        setAllNotices(list);

        const sorted = list.sort((a, b) => b.id - a.id);
        const currentIndex = sorted.findIndex((n) => n.id === Number(id));
        if (currentIndex !== -1) {
          setPrevId(sorted[currentIndex + 1]?.id || null);
          setNextId(sorted[currentIndex - 1]?.id || null);
        }
      } catch (err) {
        console.error(err);
        openModal("공지사항을 불러오는 데 실패했습니다.");
      }
    };
    fetchData();
  }, [id]);

  if (!notice) return <div>로딩 중...</div>;

  return (
    <>
      <Header headerColor="black" headerBg="#ffffff" userInfo={user} />

      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "80px 16px 40px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "normal",
            color: "#222",
            borderBottom: "2px solid #ccc",
            paddingBottom: "12px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/images/logo.png`}
            alt="logo"
            style={{ width: "141px", height: "68px", objectFit: "contain" }}
            loading="lazy"
          />
        </h1>

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
              <td style={{ ...tdStyle, color: "#000" }}>{notice.title}</td>
            </tr>
            <tr>
              <th style={thStyle}>작성자</th>
              <td style={{ ...tdStyle, color: "#000" }}>{notice.writer}</td>
            </tr>
            <tr>
              <th style={thStyle}>작성일</th>
              <td style={{ ...tdStyle, color: "#000" }}>
                {notice.createdAt?.slice(0, 10)}
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
          {notice.content}
        </div>

        <div
          style={{
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            margin: "40px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 0",
              borderTop: "1px solid #eee",
              fontSize: "15px",
            }}
          >
            <span
              style={{ width: "80px", fontWeight: "normal", color: "#333" }}
            >
              이전글
            </span>
            {prevId ? (
              <span
                style={{
                  color: "#333",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onClick={() => router.push(`/notice/${prevId}`)}
              >
                {allNotices.find((n) => n.id === prevId)?.title}
              </span>
            ) : (
              <span style={{ color: "#aaa" }}>이전 게시글이 없습니다.</span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 0",
              borderTop: "1px solid #eee",
              fontSize: "15px",
            }}
          >
            <span
              style={{ width: "80px", fontWeight: "normal", color: "#333" }}
            >
              다음글
            </span>
            {nextId ? (
              <span
                style={{
                  color: "#333",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onClick={() => router.push(`/notice/${nextId}`)}
              >
                {allNotices.find((n) => n.id === nextId)?.title}
              </span>
            ) : (
              <span style={{ color: "#aaa" }}>다음 게시글이 없습니다.</span>
            )}
          </div>
        </div>

        {user?.name === notice.writer && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={editBtn}
              onClick={() => router.push(`/notice/edit/${id}`)}
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
              style={{ ...editBtn, marginLeft: "10px" }}
              onClick={async () => {
                openModal("정말 삭제하시겠습니까?",
                  async () => {
                    try {
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${id}`,
                        {
                          method: "DELETE",
                          credentials: "include",
                        }
                      );
                      if (res.ok) {
                        openModal("삭제 완료", () => { router.push("/notice"); }, () => { router.push("/notice"); });
                      } else {
                        openModal("삭제 실패");
                      }
                    } catch (err) {
                      console.error(err);
                      openModal("삭제 중 오류 발생");
                    }
                  }, ()=>{}, true
                )

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
          onClick={() => router.push("/notice")}
          style={listBtn}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#553C9A")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#6B46C1")
          }
        >
          목록
        </button>
      </div>
      <div
        style={{
          padding: "60px 0",
          maxWidth: "1200px",
          margin: "0 auto",
          paddingLeft: "16px",
          paddingRight: "16px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        ></h2>
        <NoticeList
          items={allNotices.filter((n) => n.id !== Number(id))}
          user={user}
          highlightKeyword={(text) => [text]} // 검색 없음 처리
          isNew={(createdAt) => {
            const created = new Date(createdAt);
            const now = new Date();
            const diff = (now - created) / (1000 * 60 * 60 * 24);
            return diff <= 2;
          }}
        />
      </div>

      <div style={{ height: "200px" }} />
      {isModalOpen && (<Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        isConfirm={isConfirm}
        content={modalContent} />)}
    </>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  backgroundColor: "#ffffff",
  width: "20%",
  fontWeight: 400,
  borderBottom: "1px solid #ddd",
  color: "#555",
  fontSize: "14px",
};

const tdStyle = {
  padding: "12px 16px",
  borderBottom: "1px solid #ddd",
  color: "#444",
  fontWeight: 400,
  fontSize: "14px",
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
  transition: "all 0.3s ease",
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
  transition: "all 0.3s ease",
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
  transition: "all 0.3s ease",
};

const disabledStyle = {
  opacity: 0.4,
  cursor: "not-allowed",
};
