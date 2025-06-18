"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "..";
import Modal, { useModal } from '../movie/modal';

export default function NoticePage({ notices, userData }) {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [searchOption, setSearchOption] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [confirmedKeyword, setConfirmedKeyword] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [user, setUser] = useState(userData);
  const [currentPage, setCurrentPage] = useState(1);
  const { isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel, isConfirm } = useModal();
  const itemsPerPage = !isMobile?10:5;

  useEffect(() => {
    document.title = "공지 - FILMORA";
  }, []);

  useEffect(() => {
    const sorted = [...notices].sort((a, b) => b.id - a.id);
    const result = sorted.filter((n) => {
      const target =
        searchOption === "title"
          ? n.title
          : searchOption === "content"
            ? n.content
            : searchOption === "author"
              ? n.writer
              : searchOption === "title_content"
                ? `${n.title} ${n.content}`
                : "";
      return target
        ?.replace(/\s+/g, "")
        .toLowerCase()
        .includes(confirmedKeyword.replace(/\s+/g, "").toLowerCase());
    });
    setFiltered(result);
    setCurrentPage(1);
  }, [confirmedKeyword, searchOption, notices]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  }, [filtered]);

  const pageGroupSize = !isMobile?10:5;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const highlightKeyword = (text) => {
    if (!confirmedKeyword.trim()) return [text];
    const regex = new RegExp(`(${confirmedKeyword})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ backgroundColor: "yellow" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const isNew = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = (now - created) / (1000 * 60 * 60 * 24);
    return diff <= 2;
  };

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
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
            src="http://localhost:9999/images/logo.png"
            alt="logo"
            style={{ width: "141px", height: "68px", objectFit: "contain" }}
            loading="lazy"
          />
        </h1>

        {user?.auth === "ADMIN" && !isMobile && (
          <div style={{ textAlign: "right", marginBottom: "24px" }}>
            <button
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "8px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "15px",
              }}
              onClick={() => (window.location.href = "/notice/new")}
            >
              + 공지 등록
            </button>
          </div>
        )}

        <style jsx>{`
          @media (min-width: 768px) {
            .responsive-inputs {
              flex-direction: row;
              flex-wrap: nowrap;
            }
            .responsive-inputs select {
              width: 140px;
            }
            .responsive-inputs input {
              width: 320px;
            }
            .responsive-inputs button {
              width: auto;
            }
          }
          @media (max-width: 767px) {
            .responsive-inputs {
              flex-direction: column;
              align-items: stretch;
            }
            .responsive-inputs select,
            .responsive-inputs input,
            .responsive-inputs button {
              width: 100%;
            }
            .responsive-hide {
              display: none;
            }
          }
        `}</style>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="responsive-inputs"
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "32px",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              maxWidth: "768px",
            }}
          >
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #aaa",
                fontSize: "15px",
              }}
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="title_content">제목+내용</option>
              <option value="author">작성자</option>
            </select>
            <input
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (searchKeyword.replace(/\s+/g, "") === "") {
                    openModal("유효한 검색어를 입력해주세요!");
                    return;
                  }
                  setConfirmedKeyword(searchKeyword);
                }
              }}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #aaa",
                fontSize: "15px",
              }}
            />
            <button
              onClick={() => {
                if (searchKeyword.replace(/\s+/g, "") === "") {
                  openModal("유효한 검색어를 입력해주세요!");
                  return;
                }
                setConfirmedKeyword(searchKeyword);
              }}
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "8px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              검색
            </button>
            <button
              onClick={() => setConfirmedKeyword("")}
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "8px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              전체보기
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              minWidth: "700px",
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <thead style={{ backgroundColor: "white" }}>
              <tr style={{ color: "black" }}>
                <th style={{ padding: "14px", borderBottom: "1px solid #ddd" }}>
                  번호
                </th>
                <th style={{ padding: "14px", borderBottom: "1px solid #ddd" }}>
                  제목
                </th>
                <th
                  className="responsive-hide"
                  style={{ padding: "14px", borderBottom: "1px solid #ddd" }}
                >
                  작성자
                </th>
                <th
                  className="responsive-hide"
                  style={{ padding: "14px", borderBottom: "1px solid #ddd" }}
                >
                  작성일
                </th>
                <th
                  className="responsive-hide"
                  style={{ padding: "14px", borderBottom: "1px solid #ddd" }}
                >
                  조회수
                </th>
                {user?.auth === "ADMIN" && (
                  <th
                    style={{ padding: "14px", borderBottom: "1px solid #ddd" }}
                  >
                    관리
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      fontSize: "15px",
                    }}
                  >
                    📭 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                currentItems.map((notice) => (
                  <tr
                    key={notice.id}
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
                      {notice.id}
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
                      <a
                        href={`/notice/${notice.id}`}
                        style={{
                          color: "#222",
                          textDecoration: "none",
                          display: "block",
                          transition: "color 0.1s",
                          fontWeight: 400,
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = "#6B46C1")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.color = "#222")
                        }
                      >
                        {highlightKeyword(notice.title)}
                        {isNew(notice.createdAt) && (
                          <span
                            style={{
                              backgroundColor: "#6B46C1",
                              color: "white",
                              borderRadius: "2px",
                              fontSize: "10px",
                              padding: "2px 6px",
                              marginLeft: "8px",
                              animation: "sparkle 1s ease-in-out infinite",
                              display: "inline-block",
                              position: "relative",
                              top: "4px",
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </a>
                    </td>
                    <td
                      className="responsive-hide"
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      {notice.writer}
                    </td>
                    <td
                      className="responsive-hide"
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#999",
                      }}
                    >
                      {formatDate(notice.createdAt)}
                    </td>
                    <td
                      className="responsive-hide"
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      {notice.views}
                    </td>
                    {user?.auth === "ADMIN" && (
                      <td style={{ padding: "14px", textAlign: "center" }}>
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
                          onClick={async () => {
                            openModal("정말 삭제하시겠습니까?",
                              async () => {
                                const res = await fetch(
                                  `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${notice.id}`,
                                  {
                                    method: "DELETE",
                                    credentials: "include",
                                  }
                                );
                                if (res.ok) {
                                  openModal("삭제 완료", () => { location.reload(); }, () => { location.reload(); });
                                } else {
                                  openModal("삭제 실패");
                                }
                              }, ()=>{}, true
                            )
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <style jsx global>{`
          @keyframes pulse-badge {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.01);
              opacity: 0.6;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes sparkle {
            0% {
              box-shadow: 0 0 5px #b794f4;
              transform: scale(1);
              opacity: 1;
            }
            50% {
              box-shadow: 0 0 15px #e9d8fd;
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              box-shadow: 0 0 5px #b794f4;
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              margin: "0 8px",
              padding: "6px 12px",
              fontSize: "16px",
              backgroundColor: "white",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: currentPage === 1 ? "default" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
              width: "36px",
              height: "36px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            &lt;
          </button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                margin: "0 4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: currentPage === page ? "#6B46C1" : "white",
                color: currentPage === page ? "white" : "#333",
                cursor: "pointer",
                transition: "all 0.3s",
                width: "36px",
                height: "36px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            style={{
              margin: "0 8px",
              padding: "6px 12px",
              fontSize: "16px",
              backgroundColor: "white",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: currentPage === totalPages ? "default" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
              width: "36px",
              height: "36px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            &gt;
          </button>
        </div>
      </div>
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
