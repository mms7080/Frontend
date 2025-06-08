'use client';

export default function Qna({userInfo,qnaInfo,replyInfo}){
    //let itemlist=[...qnaInfo];
    let currentItems=[1,2,3];
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
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
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
                  width: "12%",
                }}
              >
                작성자
              </th>
              <th
                style={{
                  padding: "14px",
                  borderBottom: "1px solid #ddd",
                  width: "13%",
                }}
              >
                작성일
              </th>
              {userInfo?.auth === "ADMIN" && (
                <th
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #ddd",
                    width: "10%",
                  }}
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
                  📭 QnA가 없습니다.
                </td>
              </tr>
            ) : (
              currentItems.map((qna) => (
                <tr
                  key={qna.id}
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
                    {qna.id}
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
                        display: "block",
                        transition: "color 0.1s",
                        fontWeight: 400,
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "#6B46C1")
                      }
                      onMouseOut={(e) => (e.currentTarget.style.color = "#222")}
                    >
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
                    {qna.author}
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
                  {userInfo?.auth === "ADMIN" && (
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
                        onClick={() => {
                          {/* 답변 */}
                        }}
                      >
                        답변
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
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
    </>;
}