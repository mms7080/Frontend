"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Modal, { useModal } from '../movie/modal';
import { useMediaQuery } from "@chakra-ui/react";

export default function NoticeList({
  items,
  user,
  searchable = true,
  paginated = true,
  highlightKeywordFromParent,
  isNewFromParent,
}) {
  const [searchOption, setSearchOption] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [confirmedKeyword, setConfirmedKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent} = useModal();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const itemsPerPage = !isMobile?10:5;

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

  const filteredItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => b.id - a.id);
    if (!confirmedKeyword.trim()) return sorted;
    return sorted.filter((n) => {
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
        .replace(/\s+/g, "")
        .toLowerCase()
        .includes(confirmedKeyword.replace(/\s+/g, "").toLowerCase());
    });
  }, [items, searchOption, confirmedKeyword]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / itemsPerPage)
  );
  const pageGroupSize = !isMobile?10:5;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const currentItems = paginated
    ? filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : filteredItems;

  return (<>
    <div>
      <style jsx global>{`
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
              <th style={th}>번호</th>
              <th style={th}>제목</th>
              <th className="responsive-hide" style={th}>
                작성자
              </th>
              <th className="responsive-hide" style={th}>
                작성일
              </th>
              <th className="responsive-hide" style={th}>
                조회수
              </th>
              {user?.auth === "ADMIN" && <th style={th}>관리</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
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
                  <td style={tdCenter}>{notice.id}</td>
                  <td style={tdLeft}>
                    <Link
                      href={`/notice/${notice.id}`}
                      style={{
                        color: "#222",
                        textDecoration: "none",
                        display: "block", // ✅ 원래대로
                        transition: "color 0.1s",
                        fontWeight: 400,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#6B46C1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#222")
                      }
                    >
                      {(highlightKeywordFromParent || highlightKeyword)(
                        notice.title
                      )}
                      {(isNewFromParent || isNew)(notice.createdAt) && (
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
                            top: "6px",
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="responsive-hide" style={tdCenter}>
                    {notice.writer}
                  </td>
                  <td className="responsive-hide" style={tdCenter}>
                    {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="responsive-hide" style={tdCenter}>
                    {notice.views}
                  </td>
                  {user?.auth === "ADMIN" && (
                    <td style={tdCenter}>
                      <button style={deleteBtn}>삭제</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {searchable && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "32px",
          }}
        >
          <div
            className="responsive-inputs"
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              maxWidth: "768px",
            }}
          >
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
              style={inputStyle}
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
                  if (searchKeyword.trim() === "") {
                    openModal("유효한 검색어를 입력해주세요!");
                    return;
                  }
                  setConfirmedKeyword(searchKeyword);
                }
              }}
              style={inputStyle}
            />
            <button
              onClick={() => {
                if (searchKeyword.trim() === "") {
                  openModal("유효한 검색어를 입력해주세요!");
                  return;
                }
                setConfirmedKeyword(searchKeyword);
              }}
              style={buttonStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#333")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "black")
              }
            >
              검색
            </button>
            <button
              onClick={() => setConfirmedKeyword("")}
              style={buttonStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#333")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "black")
              }
            >
              전체보기
            </button>
          </div>
        </div>
      )}

      {paginated && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={pageBtnStyle(currentPage === 1)}
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
                ...pageBtnStyle(false),
                backgroundColor: currentPage === page ? "#6B46C1" : "white",
                color: currentPage === page ? "white" : "#333",
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
            style={pageBtnStyle(currentPage === totalPages)}
          >
            &gt;
          </button>
        </div>
      )}

      {/* ✅ 애니메이션 스타일 포함 */}
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
    </div>
    {isModalOpen && (<Modal
    isModalOpen={isModalOpen}
    isModalVisible={isModalVisible}
    closeModal={closeModal}
    content={modalContent}/>)}
    </>
  );
}

const th = {
  padding: "14px",
  borderBottom: "1px solid #ddd",
};

const tdLeft = {
  padding: "14px",
  fontWeight: "400",
  fontSize: "16px",
  color: "#222",
  verticalAlign: "middle",
  lineHeight: "1.9",
};

const tdCenter = {
  padding: "14px",
  textAlign: "center",
  fontSize: "14px",
  color: "#555",
  verticalAlign: "middle",
};

const deleteBtn = {
  backgroundColor: "#e53e3e",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
};

const pageBtnStyle = (disabled) => ({
  margin: "0 4px",
  padding: "6px 12px",
  fontSize: "16px",
  backgroundColor: "white",
  color: "#333",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: disabled ? "default" : "pointer",
  opacity: disabled ? 0.5 : 1,
  width: "36px",
  height: "36px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const inputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #aaa",
  fontSize: "15px",
};

const buttonStyle = {
  backgroundColor: "black",
  color: "white",
  padding: "8px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "15px",
};
