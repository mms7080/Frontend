"use client";

import { useState, useEffect } from "react";
import { Header, Footer } from "..";

export default function NoticePage({ notices }) {
  const [searchOption, setSearchOption] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.log("로그인 정보 없음");
      }
    })();
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
      return target?.toLowerCase().includes(searchKeyword.toLowerCase());
    });
    setFiltered(result);
    setCurrentPage(1);
  }, [searchKeyword, searchOption, notices]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
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
    if (!searchKeyword.trim()) return [text];
    const regex = new RegExp(`(${searchKeyword})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} style={{ backgroundColor: "#FBB6CE" }}>{part}</mark> : part
    );
  };

  const isNew = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = (now - created) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  };

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", fontFamily: "'Pretendard', sans-serif" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", textAlign: "center", color: "black", marginBottom: "40px", borderBottom: "3px solid #6B46C1", paddingBottom: "12px" }}>
          공지사항
        </h1>

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
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#553C9A"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "black"}
            onClick={() => window.location.href = "/notice/new"}
          >
            + 공지 등록
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
          <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)} style={{ padding: "10px", borderRadius: "4px", border: "1px solid #aaa", fontSize: "15px", width: "140px" }}>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="title_content">제목+내용</option>
            <option value="author">작성자</option>
          </select>
          <input style={{ padding: "10px", width: "320px", borderRadius: "4px", border: "1px solid #aaa", fontSize: "15px" }} placeholder="검색어를 입력하세요" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
          <thead style={{ backgroundColor: "#f1e8ff" }}>
            <tr style={{ color: "#5f0080" }}>
              <th style={{ padding: "14px", borderBottom: "1px solid #ddd", width: "6%" }}>번호</th>
              <th style={{ padding: "14px", borderBottom: "1px solid #ddd" }}>제목</th>
              <th style={{ padding: "14px", borderBottom: "1px solid #ddd", width: "12%" }}>작성자</th>
              <th style={{ padding: "14px", borderBottom: "1px solid #ddd", width: "13%" }}>작성일</th>
              <th style={{ padding: "14px", borderBottom: "1px solid #ddd", width: "10%" }}>조회수</th>
              <th style={{ padding: "14px", borderBottom: "1px solid #ddd", width: "10%" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px", fontSize: "15px" }}>📭 공지사항이 없습니다.</td>
              </tr>
            ) : (
              currentItems.map((notice) => (
                <tr key={notice.id} style={{ borderBottom: "1px solid #eee", backgroundColor: "#fff" }}>
                  <td style={{ padding: "14px", textAlign: "center", fontSize: "14px", color: "#666" }}>{notice.id}</td>
                  <td style={{ padding: "14px", fontWeight: "600", fontSize: "16px", lineHeight: "1.4", color: "#222" }}>
                    <a
                      href={`/notice/${notice.id}`}
                      style={{
                        color: "#222",
                        textDecoration: "none",
                        display: "block",
                        transition: "color 0.2s"
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "#6B46C1")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "#222")}
                    >
                      {highlightKeyword(notice.title)}
                      {isNew(notice.createdAt) && <span style={{ backgroundColor: "#e53e3e", color: "white", borderRadius: "6px", fontSize: "10px", padding: "2px 6px", marginLeft: "8px" }}>NEW</span>}
                    </a>
                  </td>
                  <td style={{ padding: "14px", textAlign: "center", fontSize: "14px", color: "#555" }}>{notice.writer}</td>
                  <td style={{ padding: "14px", textAlign: "center", fontSize: "13px", color: "#999" }}>{formatDate(notice.createdAt)}</td>
                  <td style={{ padding: "14px", textAlign: "center", fontSize: "13px", color: "#666" }}>{notice.views}</td>
                  <td style={{ padding: "14px", textAlign: "center" }}>
                    <button style={{ backgroundColor: "#e53e3e", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                      onClick={async () => {
                        if (confirm("정말 삭제하시겠습니까?")) {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/notice/${notice.id}`, {
                            method: "DELETE",
                            credentials: "include"
                          });
                          if (res.ok) {
                            alert("삭제 완료");
                            location.reload();
                          } else {
                            alert("삭제 실패");
                          }
                        }
                      }}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                margin: "0 6px",
                padding: "8px 12px",
                backgroundColor: "#eee",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d3d3d3")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#eee")}
            >
              &lt;
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                margin: "0 6px",
                padding: "8px 14px",
                backgroundColor: currentPage === page ? "#6B46C1" : "#eee",
                color: currentPage === page ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => {
                if (currentPage !== page) e.currentTarget.style.backgroundColor = "#d3d3d3";
              }}
              onMouseOut={(e) => {
                if (currentPage !== page) e.currentTarget.style.backgroundColor = "#eee";
              }}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                margin: "0 6px",
                padding: "8px 12px",
                backgroundColor: "#eee",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d3d3d3")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#eee")}
            >
              &gt;
            </button>
          )}
        </div>
      </div>
      <div style={{ height: "230px" }} />
      <Footer footerBg="white" footerColor="black" />
    </>
  );
}
