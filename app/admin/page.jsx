"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "../../components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const dummyStats = {
    movies: 8,
    reservations: 120,
    reviews: 45,
    events: 6,
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.auth !== "ADMIN") {
          alert("접근 권한이 없습니다.");
          router.push("/home");
        } else {
          setUser(data);
        }
      } catch {
        alert("로그인 후 이용해주세요.");
        router.push("/signin");
      }
    })();
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/user-count`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUserCount);

    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/store-count`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setStoreCount);
  }, []);

  useEffect(() => {
    if (selectedSection === "유저") {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/users`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setUsers);
    }
    if (selectedSection === "스토어") {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/store`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setProducts);
    }
  }, [selectedSection]);

  const movieStats = [
    { title: "파묘", reservations: 540 },
    { title: "범죄도시4", reservations: 430 },
    { title: "쿵푸팬더4", reservations: 310 },
    { title: "듄2", reservations: 220 },
    { title: "고질라x콩", reservations: 180 },
  ];

  const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

  const managementSections = [
    { title: "유저 관리", key: "유저" },
    { title: "스토어 관리", key: "스토어" },
    { title: "영화 관리", key: "영화" },
    { title: "예매 관리", key: "예매" },
    { title: "이벤트 관리", key: "이벤트" },
  ];

  const renderList = () => {
    if (selectedSection === "유저") {
      return (
        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            paddingBottom: 40,
          }}
        >
          {users.map((u, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
                {u.name}
              </h3>
              <p style={{ fontSize: 14, color: "#444", marginBottom: 6 }}>
                <strong>ID:</strong> {u.username}
              </p>
              <p style={{ fontSize: 14, color: "#666", marginBottom: 6 }}>
                <strong>Email:</strong> {u.email}
              </p>
              <p style={{ fontSize: 14, color: "#666" }}>
                <strong>Phone:</strong> {u.phone}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (selectedSection === "스토어") {
      const groupedByCategory = products.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});

      const handleDelete = async (id) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/${id}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );
          if (res.ok) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
          } else {
            alert("삭제에 실패했습니다.");
          }
        } catch {
          alert("삭제 중 오류 발생");
        }
      };

      return (
        <div style={{ marginTop: 40 }}>
          {/* 스토어 등록 버튼 */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 20,
            }}
          >
            <button
              onClick={() => router.push("/store/upload")}
              style={{
                backgroundColor: "#6B46C1",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              + 스토어 등록
            </button>
          </div>

          {Object.keys(groupedByCategory).map((category) => (
            <div key={category} style={{ marginBottom: 40 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "16px 0",
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 20,
                    backgroundColor: "#6B46C1",
                    borderRadius: 2,
                    marginRight: 10,
                  }}
                />
                <h2
                  style={{ fontSize: 18, fontWeight: "bold", color: "#2D3748" }}
                >
                  {category}
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 20,
                }}
              >
                {groupedByCategory[category].map((p, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/store/detail/${p.id}`)} // ✅ 카드 전체 클릭으로 이동
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      position: "relative",
                      cursor: "pointer", // ✅ 포인터로 변경
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 14px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 3px 8px rgba(0,0,0,0.05)";
                    }}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${p.imgUrl}`}
                      alt={p.title}
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    <div style={{ padding: "12px 16px" }}>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          marginBottom: 4,
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        style={{ fontSize: 13, color: "#666", marginBottom: 8 }}
                      >
                        {p.subtitle}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "#2D3748",
                          marginBottom: 4,
                        }}
                      >
                        {Number(p.price).toLocaleString()}원
                      </p>
                      {p.badge && (
                        <span
                          style={{
                            display: "inline-block",
                            background: p.badgeColor || "#4e73df",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: 10,
                            fontSize: 11,
                            fontWeight: "500",
                          }}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        {
                          handleDelete(p.id);
                        }
                      }}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "#e53e3e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "4px 8px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Header userInfo={user} />
      <div style={{ display: "flex" }}>
        <aside
          style={{
            width: 220,
            background: "#fff",
            color: "#333",
            padding: "40px 20px",
            borderRight: "1px solid #ddd",
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 40 }}>🎬 FILMORA 관리자</h2>
          <ul style={{ listStyle: "none", padding: 0, fontSize: 14 }}>
            {managementSections.map((section) => (
              <li
                key={section.key}
                style={{
                  margin: "20px 0",
                  cursor: "pointer",
                  color:
                    selectedSection === section.key ? "#4e73df" : undefined,
                }}
                onClick={() => setSelectedSection(section.key)}
              >
                {section.title}
              </li>
            ))}
          </ul>
        </aside>
        <main style={{ flex: 1, background: "#f8f9fc", padding: 30 }}>
          <h1 style={{ fontSize: 24, margin: "40px 0 30px" }}>
            👩‍💼 관리자 대시보드
          </h1>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: 24,
              marginBottom: 50,
            }}
          >
            <SummaryCard title="총 회원" value={`${userCount}명`} icon="🙍‍♂️" />
            <SummaryCard
              title="등록 영화"
              value={`${dummyStats.movies}편`}
              icon="🎬"
            />
            <SummaryCard
              title="스토어 상품"
              value={`${storeCount}개`}
              icon="🛒"
            />
            <SummaryCard
              title="예매 수"
              value={`${dummyStats.reservations}건`}
              icon="📅"
            />
            <SummaryCard
              title="리뷰 수"
              value={`${dummyStats.reviews}개`}
              icon="💬"
            />
            <SummaryCard
              title="이벤트 수"
              value={`${dummyStats.events}개`}
              icon="🎉"
            />
          </section>
          {selectedSection === "영화" && (
            <section
              style={{
                background: "white",
                borderRadius: 10,
                padding: 20,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>
                🎟️ 영화별 예매 현황
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={movieStats}>
                  <XAxis dataKey="title" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="reservations" radius={[4, 4, 0, 0]}>
                    {movieStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>
          )}
          {renderList()}
        </main>
      </div>
      <Footer />
    </div>
  );
}

const SummaryCard = ({ title, value, icon }) => (
  <div
    style={{
      background: "white",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 24 }}>{icon}</div>
    <h4 style={{ fontSize: 16, margin: "10px 0 4px" }}>{title}</h4>
    <p style={{ fontSize: 18, fontWeight: "bold" }}>{value}</p>
  </div>
);
