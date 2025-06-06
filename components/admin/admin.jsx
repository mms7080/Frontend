"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../components";
import SkeletonHeader from "../../components/SkeletonHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AdminDashboard({ userData }) {
  const router = useRouter();
  const [user, setUser] = useState(userData);
  const [selectedSection, setSelectedSection] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [movieCount, setMovieCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  //유저 검색창
  const [searchKeyword, setSearchKeyword] = useState("");
  const [confirmedKeyword, setConfirmedKeyword] = useState("");
  //이벤트 검색창
  const [eventSearchKeyword, setEventSearchKeyword] = useState("");
  const [eventConfirmedKeyword, setEventConfirmedKeyword] = useState("");
  //영화 검색창
  const [movieSearchKeyword, setMovieSearchKeyword] = useState("");
  const [movieConfirmedKeyword, setMovieConfirmedKeyword] = useState("");
  //스토어 검색창
  const [storeSearchKeyword, setStoreSearchKeyword] = useState("");
  const [storeConfirmedKeyword, setStoreConfirmedKeyword] = useState("");
  //매출 검색창
  const [paymentSearchKeyword, setPaymentSearchKeyword] = useState("");
  const [paymentConfirmedKeyword, setPaymentConfirmedKeyword] = useState("");
  //예메
  const [reservations, setReservations] = useState([]);
  const [reservationSearchKeyword, setReservationSearchKeyword] = useState("");
  const [reservationConfirmedKeyword, setReservationConfirmedKeyword] =
    useState("");
  //리뷰
  const [reviews, setReviews] = useState([]);
  const [reviewSearchKeyword, setReviewSearchKeyword] = useState("");
  const [reviewConfirmedKeyword, setReviewConfirmedKeyword] = useState("");


  try {
    if (!user) throw new Error();
    if (user.auth !== "ADMIN") {
      alert("접근 권한이 없습니다.");
      router.push("/home");
    }
  } catch {
    alert("로그인 후 이용해주세요.");
    router.push("/signin");
  }

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
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/movie-count`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setMovieCount);
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/event-count`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setEventCount);
    fetch(
      `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/reservation-count`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then(setReservationCount);
    fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/review-count`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((count) => {
        setReviewCount(count);
        // setDummyStats((prev) => ({ ...prev, reviews: count }));
      });
  }, []);

  useEffect(() => {

    setSearchKeyword('');
    setStoreSearchKeyword('');
    setMovieSearchKeyword('');
    setEventSearchKeyword('');
    setReservationSearchKeyword('');
    setPaymentSearchKeyword('');
    setReviewSearchKeyword('');
      
    setConfirmedKeyword('');
    setStoreConfirmedKeyword('');
    setMovieConfirmedKeyword('');
    setEventConfirmedKeyword('');
    setReservationConfirmedKeyword('');
    setPaymentConfirmedKeyword('');
    setReviewConfirmedKeyword('');

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
    if (selectedSection === "영화") {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/movies`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setMovies);
    }
    if (selectedSection === "이벤트") {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/events`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setEvents);
    }
    if (selectedSection === "매출") {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/payments`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setPayments);
    }
    if (selectedSection === "예매") {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/reservations`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setReservations);
      // 유저도 같이 불러오기
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/users`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setUsers);
      //영화
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/movies`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setMovies);
    }

    //리뷰
    if (selectedSection === "리뷰") {
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/reviews`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setReviews);

      // 영화 정보도 같이 불러오기 (리뷰에 영화 제목 쓰려면)
      fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/admin/movies`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setMovies);
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
    { title: "리뷰 관리", key: "리뷰" },
    { title: "매출 관리", key: "매출" },
  ];

// 영화 ID -> 영화 제목으로 변환하는 매핑 객체
const movieMap = useMemo(() => {
  const map = {};
  movies.forEach((m) => {
    map[m.id] = m.title;
  });
  return map;
}, [movies]);

const dynamicMovieStats = useMemo(() => {
  const stats = {};

  // 1. 예매 수 카운트 (0 이상)
  reservations.forEach((r) => {
    stats[r.movieId] = (stats[r.movieId] || 0) + 1;
  });

  // 2. 예매 수가 1건 이상인 영화만 변환
  return Object.entries(stats)
    .filter(([_, count]) => count > 0)
    .map(([movieId, count]) => ({
      title: movieMap[movieId] || movieId,
      reservations: count,
    }));
}, [reservations, movieMap]);




  const userMap = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      map[u.id] = `${u.name} (${u.username})`;
    });
    return map;
  }, [users]);

  const renderList = () => {
    if (selectedSection === "유저") {
      const filteredUsers = users.filter((u) =>
        [u.name, u.username, u.email, u.phone].some((v) =>
          v?.replace(/\s+/g, '').toLowerCase().includes(confirmedKeyword.replace(/\s+/g, '').toLowerCase())
        )
      );

      return (
        <div style={{ marginTop: 30 }}>
          {/* 🔍 검색창 + 버튼 */}
          <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="유저 이름/ID/이메일/전화번호 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  if(searchKeyword.replace(/\s+/g, '')===''){
                    alert('유효한 검색어를 입력해주세요!');
                    return;
                  }
                  setConfirmedKeyword(searchKeyword);
                }
              }}
              style={{
                width: 300,
                padding: "8px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: "#fff", // ✅ 흰 배경
              }}
            />
            <button
              onClick={() => {
                if(searchKeyword.replace(/\s+/g, '')===''){
                  alert('유효한 검색어를 입력해주세요!');
                  return;
                }
                setConfirmedKeyword(searchKeyword);
              }}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: "#6B46C1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              검색
            </button>
          </div>

          {/* 유저 카드 목록 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
              paddingBottom: 40,
            }}
          >
            {filteredUsers.map((u, i) => (
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
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.05)";
                }}
              >
                <h3
                  style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}
                >
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
        </div>
      );
    }

    if (selectedSection === "스토어") {
      const groupedByCategory = products.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});

      // ✅ 카테고리별 상품 필터링
      const filteredGrouped = Object.entries(groupedByCategory).reduce(
        (acc, [category, productList]) => {
          const filtered = productList.filter((p) =>
            [p.title, p.subtitle, p.category].some((v) =>
              v?.replace(/\s+/g, '').toLowerCase().includes(storeConfirmedKeyword.replace(/\s+/g, '').toLowerCase())
            )
          );
          if (filtered.length > 0) acc[category] = filtered;
          return acc;
        },
        {}
      );

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
          {/* 🔍 검색창 + 버튼 */}
          <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="상품명/부제목/카테고리 검색"
              value={storeSearchKeyword}
              onChange={(e) => setStoreSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  if(storeSearchKeyword.replace(/\s+/g, '')===''){
                    alert('유효한 검색어를 입력해주세요!');
                    return;
                  }
                  setStoreConfirmedKeyword(storeSearchKeyword);
                }
              }}
              style={{
                width: 300,
                padding: "8px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
            <button
              onClick={() => {
                if(storeSearchKeyword.replace(/\s+/g, '')===''){
                  alert('유효한 검색어를 입력해주세요!');
                  return;
                }
                setStoreConfirmedKeyword(storeSearchKeyword);
              }}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: "#6B46C1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              검색
            </button>
          </div>

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

          {/* 카테고리별 상품 목록 */}
          {Object.entries(filteredGrouped).map(([category, items]) => (
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
                {items.map((p, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/store/detail/${p.id}`)}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      position: "relative",
                      cursor: "pointer",
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
                        handleDelete(p.id);
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

    if (selectedSection === "영화") {
      const filteredMovies = movies.filter((m) =>
        [m.title, m.releaseDate,m.titleEnglish,m.description,m.genre,m.director,m.cast].some((v) =>
          v?.replace(/\s+/g, '').toLowerCase().includes(movieConfirmedKeyword.replace(/\s+/g, '').toLowerCase())
        )
      );

      const handleDelete = async (id) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movie/${id}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );
          if (res.ok) {
            for (u of users) {
              if (u && u.likemovies.includes(id))
                await fetch(
                  `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/movieLikeToggle/${id}`
                );
            }
            setMovies((prev) => prev.filter((m) => m.id !== id));
          } else {
            alert("삭제에 실패했습니다.");
          }
        } catch {
          alert("삭제 중 오류 발생");
        }
      };

      return (
        <div style={{ marginTop: 30 }}>
          {/* 🔍 검색창 + 버튼 */}
          <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="영화 제목/개봉일 검색"
              value={movieSearchKeyword}
              onChange={(e) => setMovieSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  if(movieSearchKeyword.replace(/\s+/g, '')===''){
                    alert('유효한 검색어를 입력해주세요!');
                    return;
                  }
                  setMovieConfirmedKeyword(movieSearchKeyword);
                }
              }}
              style={{
                width: 300,
                padding: "8px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
            <button
              onClick={() => {
                if(movieSearchKeyword.replace(/\s+/g, '')===''){
                  alert('유효한 검색어를 입력해주세요!');
                  return;
                }
                setMovieConfirmedKeyword(movieSearchKeyword);
              }}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: "#6B46C1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              검색
            </button>
          </div>
          {/* 영화 등록 버튼 */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 20,
            }}
          >
            <button
              onClick={() => router.push("/movie/upload")}
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
              + 영화 등록
            </button>
          </div>

          {/* 영화 카드 목록 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
              paddingBottom: 40,
            }}
          >
            {filteredMovies.map((m, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  background: "#fff",
                  padding: 20,
                  borderRadius: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <img
                  src={
                    m.poster.startsWith("http")
                      ? m.poster
                      : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${m.poster}`
                  }
                  alt={m.title}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 12,
                    marginBottom: 10,
                  }}
                />

                <h3
                  style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}
                >
                  {m.title}
                </h3>
                <p style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
                  평점: {m.score}
                </p>
                <p style={{ fontSize: 13, color: "#888" }}>
                  개봉일: {m.releaseDate}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(m.id);
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
      );
    }

    if (selectedSection === "이벤트") {
      const groupedByCategory = events.reduce((acc, event) => {
        if (!acc[event.category]) acc[event.category] = [];
        acc[event.category].push(event);
        return acc;
      }, {});

      // ✅ 검색된 이벤트만 필터링
      const filteredGrouped = Object.entries(groupedByCategory).reduce(
        (acc, [category, eventList]) => {
          const filtered = eventList.filter((e) =>
            [e.title, e.date, e.category].some((v) =>
              v?.replace(/\s+/g, '').toLowerCase().includes(eventConfirmedKeyword.replace(/\s+/g, '').toLowerCase())
            )
          );
          if (filtered.length > 0) acc[category] = filtered;
          return acc;
        },
        {}
      );

      const handleDelete = async (id) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/event/${id}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );
          if (res.ok) {
            setEvents((prev) => prev.filter((e) => e.id !== id));
          } else {
            alert("삭제에 실패했습니다.");
          }
        } catch {
          alert("삭제 중 오류 발생");
        }
      };

      return (
        <div style={{ marginTop: 40 }}>
          {/* 🔍 검색창 + 버튼 */}
          <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="이벤트 제목/날짜/카테고리 검색"
              value={eventSearchKeyword}
              onChange={(e) => setEventSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  if(eventSearchKeyword.replace(/\s+/g, '')===''){
                    alert('유효한 검색어를 입력해주세요!');
                    return;
                  }
                  setEventConfirmedKeyword(eventSearchKeyword);
                };
              }}
              style={{
                width: 300,
                padding: "8px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
            <button
              onClick={() => {
                if(eventSearchKeyword.replace(/\s+/g, '')===''){
                  alert('유효한 검색어를 입력해주세요!');
                  return;
                }
                setEventConfirmedKeyword(eventSearchKeyword);
              }}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: "#6B46C1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              검색
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 20,
            }}
          >
            <button
              onClick={() => router.push("/event/upload")}
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
              + 이벤트 등록
            </button>
          </div>

          {Object.entries(filteredGrouped).map(([category, items]) => (
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
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#2D3748",
                  }}
                >
                  {category}
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 20,
                }}
              >
                {items.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => router.push(`/event/view/${e.id}`)}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
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
                      src={
                        e.images?.[0]?.startsWith("http")
                          ? e.images[0]
                          : `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}${e.images[0]}`
                      }
                      alt={e.title}
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "12px 16px" }}>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          marginBottom: 6,
                        }}
                      >
                        {e.title}
                      </h3>
                      <p style={{ fontSize: 13, color: "#666" }}>{e.date}</p>
                      <span
                        style={{
                          fontSize: 12,
                          backgroundColor: "#6B46C1",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: 12,
                          marginTop: 4,
                          display: "inline-block",
                        }}
                      >
                        {e.category}
                      </span>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(e.id);
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
 if (selectedSection === "예매") {
  const filteredReservations = reservations.filter((r) =>
    [r.orderId, r.theater, r.region, r.date, r.time].some((v) =>
      v?.replace(/\s+/g, '').toLowerCase().includes(reservationConfirmedKeyword.replace(/\s+/g, '').toLowerCase())
    )
  );

  return (
    <div style={{ marginTop: 40 }}>
      {/* 🔍 검색창 */}
      <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="주문번호/극장/지역/날짜/시간 검색"
          value={reservationSearchKeyword}
          onChange={(e) => setReservationSearchKeyword(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter'){
              if(reservationSearchKeyword.replace(/\s+/g, '')===''){
                alert('유효한 검색어를 입력해주세요!');
                return;
              }
              setReservationConfirmedKeyword(reservationSearchKeyword);
            }
          }}
          style={{
            width: 300,
            padding: "8px 12px",
            fontSize: 14,
            borderRadius: 6,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
        />
        <button
          onClick={() =>{
            if(reservationSearchKeyword.replace(/\s+/g, '')===''){
              alert('유효한 검색어를 입력해주세요!');
              return;
            }
            setReservationConfirmedKeyword(reservationSearchKeyword);
          }
          }
          style={{
            padding: "8px 16px",
            fontSize: 14,
            backgroundColor: "#6B46C1",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          검색
        </button>
      </div>

      {/* 🎟️ 영화별 예매 차트 - 여기로 이동 */}
      <section
        style={{
          background: "white",
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          marginBottom: 30,
        }}
      >
        <h3 style={{ fontSize: 18, marginBottom: 16 }}>
          🎟️ 영화별 예매 현황
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dynamicMovieStats}>
            <XAxis dataKey="title" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="reservations" radius={[4, 4, 0, 0]}>
              {dynamicMovieStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 📋 예매 목록 테이블 */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ fontSize: 18, marginBottom: 16 }}>📋 예매 내역</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th style={thStyle}>주문번호</th>
              <th style={thStyle}>유저</th>
              <th style={thStyle}>영화</th>
              <th style={thStyle}>지역</th>
              <th style={thStyle}>극장</th>
              <th style={thStyle}>날짜</th>
              <th style={thStyle}>시간</th>
              <th style={thStyle}>좌석</th>
              <th style={thStyle}>총액</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((r, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{r.orderId}</td>
                <td style={tdStyle}>{userMap[r.userId] || r.userId}</td>
                <td style={tdStyle}>{movieMap[r.movieId] || r.movieId}</td>
                <td style={tdStyle}>{r.region}</td>
                <td style={tdStyle}>{r.theater}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{r.time}</td>
                <td style={tdStyle}>{r.seats}</td>
                <td style={tdStyle}>
                  {Number(r.totalPrice).toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

    if (selectedSection === "매출") {
      const filteredPayments = payments.filter((p) =>
        [p.orderName, p.userId, p.cardCompany, p.method].some((v) =>
          v?.replace(/\s+/g, '').toLowerCase().includes(paymentConfirmedKeyword.replace(/\s+/g, '').toLowerCase())
        )
      );

      const salesByProduct = filteredPayments.reduce((acc, cur) => {
        acc[cur.orderName] = (acc[cur.orderName] || 0) + cur.amount;
        return acc;
      }, {});

      const chartData = Object.entries(salesByProduct).map(
        ([name, amount]) => ({
          name,
          amount,
        })
      );

      return (
        <div style={{ marginTop: 40 }}>
          {/* 🔍 검색창 + 버튼 */}
          <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="상품명/유저ID/카드사/결제수단 검색"
              value={paymentSearchKeyword}
              onChange={(e) => setPaymentSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  if(paymentSearchKeyword.replace(/\s+/g, '')===''){
                    alert('유효한 검색어를 입력해주세요!');
                    return;
                  }
                  setPaymentConfirmedKeyword(paymentSearchKeyword);
                }
              }}
              style={{
                width: 300,
                padding: "8px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
            <button
              onClick={() => {
                if(paymentSearchKeyword.replace(/\s+/g, '')===''){
                  alert('유효한 검색어를 입력해주세요!');
                  return;
                }
                setPaymentConfirmedKeyword(paymentSearchKeyword);
              }}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: "#6B46C1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              검색
            </button>
          </div>

          {/* 💰 매출 차트 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              marginBottom: 30,
            }}
          >
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>
              💰 상품별 매출 차트
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={colors[idx % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 📋 매출 목록 테이블 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>
              📋 전체 매출 목록
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f1f1" }}>
                  <th style={thStyle}>주문번호</th>
                  <th style={thStyle}>상품명</th>
                  <th style={thStyle}>유저ID</th>
                  <th style={thStyle}>결제금액</th>
                  <th style={thStyle}>결제일</th>
                  <th style={thStyle}>결제수단</th>
                  <th style={thStyle}>카드사</th>
                  <th style={thStyle}>환불</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{p.orderId}</td>
                    <td style={tdStyle}>{p.orderName}</td>
                    <td style={tdStyle}>{p.userId}</td>
                    <td style={tdStyle}>{p.amount.toLocaleString()}원</td>
                    <td style={tdStyle}>
                      {new Date(p.approvedAt).toLocaleString()}
                    </td>
                    <td style={tdStyle}>{p.method}</td>
                    <td style={tdStyle}>{p.cardCompany || "-"}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={async () => {
                          if (confirm("환불 및 취소 처리하시겠습니까?")) {
                            try {
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/api/payments/refund/${p.id}`,
                                {
                                  method: "DELETE",
                                  credentials: "include",
                                }
                              );
                              if (res.ok) {
                                alert("환불 완료");
                                setPayments((prev) =>
                                  prev.filter((item) => item.id !== p.id)
                                );
                              } else {
                                alert("환불 실패");
                              }
                            } catch (e) {
                              alert("에러 발생: " + e.message);
                            }
                          }
                        }}
                        style={{
                          background: "#e53e3e",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 8px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        환불
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (selectedSection === "리뷰") {
      const filteredReviews = reviews.filter((r) => {
        const title = movieMap[r.movieid] || "";
        return [r.author, r.content, title].some((v) =>
          v?.replace(/\s+/g, '').toLowerCase().includes(reviewConfirmedKeyword.replace(/\s+/g, '').toLowerCase())
        );
      });

      return (
        <div style={{ marginTop: 40 }}>
          {/* 검색창 */}
          <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="작성자/내용/영화제목 검색"
              value={reviewSearchKeyword}
              onChange={(e) => setReviewSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  if(reviewSearchKeyword.replace(/\s+/g, '')===''){
                    alert('유효한 검색어를 입력해주세요!');
                    return;
                  }
                  setReviewConfirmedKeyword(reviewSearchKeyword);
                }
              }}
              style={{
                width: 300,
                padding: "8px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
            <button
              onClick={() => {
                if(reviewSearchKeyword.replace(/\s+/g, '')===''){
                  alert('유효한 검색어를 입력해주세요!');
                  return;
                }
                setReviewConfirmedKeyword(reviewSearchKeyword);
              }}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: "#6B46C1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              검색
            </button>
          </div>

          {/* 표 형식 리스트 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>💬 리뷰 목록</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f1f1" }}>
                  <th style={thStyle}>작성자</th>
                  <th style={thStyle}>영화 제목</th>
                  <th style={thStyle}>내용</th>
                  <th style={thStyle}>평점</th>
                  <th style={thStyle}>좋아요</th>
                  <th style={thStyle}>작성일</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((r, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{r.author}</td>
                    <td style={tdStyle}>{movieMap[r.movieid] || "-"}</td>
                    <td style={tdStyle}>{r.content}</td>
                    <td style={tdStyle}>⭐ {r.score}</td>
                    <td style={tdStyle}>{r.likenumber}</td>
                    <td style={tdStyle}>{r.writetime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {loadingUser ? (
        <SkeletonHeader />
      ) : (
        <Header headerColor="black" headerBg="white" userInfo={user} />
      )}
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
            <SummaryCard
              title="총 회원"
              value={`${userCount}명`}
              icon="🙍‍♂️"
              onClick={() => setSelectedSection("유저")}
            />
            <SummaryCard
              title="등록된 영화"
              value={`${movieCount}편`}
              icon="🎬"
              onClick={() => setSelectedSection("영화")}
            />
            <SummaryCard
              title="스토어 상품"
              value={`${storeCount}개`}
              icon="🛒"
              onClick={() => setSelectedSection("스토어")}
            />
            <SummaryCard
              title="예매"
              value={`${reservationCount}건`}
              icon="📅"
              onClick={() => setSelectedSection("예매")}
            />

            <SummaryCard
              title="리뷰"
              value={`${reviewCount}개`}
              icon="💬"
              onClick={() => setSelectedSection("리뷰")}
            />

            <SummaryCard
              title="이벤트"
              value={`${eventCount}개`}
              icon="🎉"
              onClick={() => setSelectedSection("이벤트")}
            />
          </section>


          {renderList()}
        </main>
      </div>
    </div>
  );
}

const SummaryCard = ({ title, value, icon, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "white",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      textAlign: "center",
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.12)";
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
      }
    }}
  >
    <div style={{ fontSize: 24 }}>{icon}</div>
    <h4 style={{ fontSize: 16, margin: "10px 0 4px" }}>{title}</h4>
    <p style={{ fontSize: 18, fontWeight: "bold" }}>{value}</p>
  </div>
);

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #ccc",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #eee",
  fontSize: 14,
};
