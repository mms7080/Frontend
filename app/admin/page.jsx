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
  const [selectedMovie, setSelectedMovie] = useState(null);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
          credentials: "include",
        });
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

  const managementSections = [
    { title: "유저 관리", emoji: "👤", key: "유저" },
    { title: "영화 관리", emoji: "🎬", key: "영화" },
    { title: "스토어 관리", emoji: "🏦", key: "스토어" },
    { title: "예매 관리", emoji: "🗕️", key: "예매" },
    { title: "이벤트 관리", emoji: "🎉", key: "이벤트", link: "/event" },
    { title: "공지사항 관리", emoji: "📢", key: "공지", link: "/notice" },
  ];

  const colors = ["#6B46C1", "#805AD5", "#9F7AEA", "#B794F4", "#D6BCFA"];

  const handleCardClick = (section) => {
    if (section.link) {
      router.push(section.link);
    } else {
      setSelectedSection(section.key);
      setSelectedMovie(null);
    }
  };

  const renderList = () => {
    if (selectedSection === "유저") {
      return (
        <div style={gridContainer}>
          {users.map((u, idx) => (
            <div key={idx} style={cardBox}>
              <p style={cardTitle}>{u.name}</p>
              <p>ID: {u.username}</p>
              <p>Email: {u.email}</p>
              <p>Phone: {u.phone}</p>
            </div>
          ))}
        </div>
      );
    }
    if (selectedSection === "스토어") {
  return (
    <div style={gridContainer}>
      {products.map((p, idx) => (
        <div
          key={idx}
          style={{ ...cardBox, cursor: "pointer" }}
          onClick={() => router.push(`/store/detail/${p.id}`)}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${p.imgUrl}`}
            alt={p.title}
            style={productImage}
          />
          <p style={cardTitle}>{p.title}</p>
          <p>{p.subtitle}</p>
          <p>가격: {Number(p.price).toLocaleString()}원</p>
          <p>카테고리: {p.category}</p>
          {p.badge && (
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                fontSize: "12px",
                color: "white",
                backgroundColor: p.badgeColor || "#6B46C1",
                borderRadius: "6px",
              }}
            >
              {p.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
    return <p style={{ color: "#777" }}>데이터가 없습니다.</p>;
  };

  return (
    <>
      <Header headerColor="white" headerBg="white" userInfo={user} />
      <main style={main}>
        <h1 style={title}>👩‍💼 관리자 대시보드</h1>
        <section style={dashboardHeader}>
          <div style={infoBox}><h3>🙍‍♂️ 총 회원</h3><p>{userCount}명</p></div>
          <div style={infoBox}><h3>🎬 등록된 영화</h3><p>{dummyStats.movies}편</p></div>
          <div style={infoBox}><h3>🛍️ 스토어 상품</h3><p>{storeCount}개</p></div>
          <div style={infoBox}><h3>📅 예매 수</h3><p>{dummyStats.reservations}건</p></div>
          <div style={infoBox}><h3>💬 리뷰 수</h3><p>{dummyStats.reviews}개</p></div>
          <div style={infoBox}><h3>🎉 이벤트 수</h3><p>{dummyStats.events}개</p></div>
        </section>
        <section style={dashboardButtons}>
          {managementSections.map((section, index) => (
            <div key={index} style={dashboardButton} onClick={() => handleCardClick(section)}>
              <div style={dashboardButtonDetail}>
                <h3 style={{ color: "#6B46C1" }}>{section.emoji} {section.title}</h3>
                <p style={{ fontSize: "13px", color: "#777" }}>관리 및 확인</p>
              </div>
            </div>
          ))}
        </section>
        {selectedSection && (
          <section style={detailSection}>
            <h2 style={subheading}>🔍 {selectedSection} 목록</h2>
            {renderList()}
          </section>
        )}
        {!selectedSection && (
          <>
            <h2 style={subheading}>📊 영화별 예매 현황</h2>
            <section style={chartWrapper}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={movieStats}>
                  <XAxis dataKey="title" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="reservations" radius={[6, 6, 0, 0]} cursor="pointer">
                    {movieStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>
          </>
        )}
      </main>
      <Footer footerBg="#f5f5f5" footerColor="#333" />
    </>
  );
}

// ✅ 스타일
const main = {
  width: "90%",
  maxWidth: "1200px",
  margin: "20px auto 50px auto",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
};
const title = {
  fontSize: "28px",
  textAlign: "center",
  color: "#222",
  padding: "20px",
  borderBottom: "2px solid #ddd",
};
const dashboardHeader = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "32px",
  marginTop: "10px",
};
const infoBox = {
  backgroundColor: "#fff",
  padding: "18px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};
const dashboardButtons = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  gap: "30px",
  marginTop: "10%",
};
const dashboardButton = {
  borderRadius: "10px",
  border: "1px solid #ddd",
  padding: "20px",
  transition: "all 0.3s ease",
  cursor: "pointer",
  background: "linear-gradient(135deg, #f5f5f5, #fff)",
  boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
};
const dashboardButtonDetail = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};
const subheading = {
  fontSize: "22px",
  fontWeight: "600",
};
const chartWrapper = {
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};
const detailSection = {
  marginTop: "20px",
  padding: "20px",
  border: "1px solid #eee",
  borderRadius: "8px",
  backgroundColor: "#fafafa",
};
const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};
const cardBox = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
};
const cardTitle = {
  fontWeight: "bold",
  fontSize: "16px",
  marginBottom: "6px",
};
const productImage = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "12px",
  border: "1px solid #ccc",
};