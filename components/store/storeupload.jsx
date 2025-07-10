"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "..";
import Modal, { useModal } from '../movie/modal';

export default function StoreUploadPage({userData}) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [badge, setBadge] = useState("");
  const [badgeColor, setBadgeColor] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [user, setUser] = useState(userData);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();
  const router = useRouter();

  useEffect(()=>{
  try {
    if (!user) throw new Error();
    // 🔐 관리자 체크
    if (user.auth !== "ADMIN") {
      openModal("접근 권한이 없습니다.", ()=>{router.push("/store");}, ()=>{router.push("/store");});
      return;
    }
  } catch {
    openModal("로그인이 필요합니다.", ()=>{router.push("/signin");}, ()=>{router.push("/signin");});
  }
  },[userData]);

  const handleSubmit = async () => {
    if (!category) {
      openModal("카테고리를 선택해주세요.");
      return;
    }

    if (!imageFile) {
      openModal("이미지를 선택해주세요.");
      return;
    }

    const form = new FormData();
    form.append("category", category);
    form.append("title", title);
    form.append("subtitle", subtitle);
    form.append("price", price);
    form.append("originalPrice", originalPrice);
    form.append("badge", badge);
    form.append("badgeColor", badgeColor);
    form.append("image", imageFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/store/upload`,
        {
          method: "POST",
          credentials: "include",
          body: form,
        }
      );
      if (!res.ok) throw new Error("업로드 실패");
      openModal("상품이 성공적으로 등록되었습니다!", ()=>{router.push("/store");}, ()=>{router.push("/store");});
    } catch (e) {
      openModal("에러 발생: " + e.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if(!user || user?.auth !== "ADMIN")return <>
    <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
    {isModalOpen && (<Modal
    isModalOpen={isModalOpen}
    isModalVisible={isModalVisible}
    closeModal={closeModal}
    onConfirm={onConfirm}
    onCancel={onCancel}
    content={modalContent}/>)}
  </>;

  return (
    <>
      <Header headerColor="black" headerBg="#f5f5f5" userInfo={user} />
      <div
        style={{
          maxWidth: "700px",
          margin: "50px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#6B46C1",
            marginBottom: "30px",
            fontSize: "24px",
          }}
        >
          🛍️ 스토어 상품 등록
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label>카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="">카테고리 선택</option>
              <option value="티켓">티켓</option>
              <option value="팝콘/음료/콤보">팝콘/음료/콤보</option>
              <option value="포인트몰">포인트몰</option>
            </select>
          </div>

          <div>
            <label>상품명</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 영화관 관람권"
              style={inputStyle}
            />
          </div>

          <div>
            <label>부제목</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="예: 2D 일반관 관람 가능"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>판매가격</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="예: 14000"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>원가</label>
              <input
                type="text"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="예: 16000"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>배지</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="예: NEW, 추천"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>배지 색상</label>
              <input
                type="text"
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value)}
                placeholder="예: #FF5733 or black 등등"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label>상품 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={inputStyle}
            />
            {previewUrl && (
              <>
                <img
                  src={previewUrl}
                  alt="미리보기"
                  style={{
                    marginTop: "10px",
                    maxWidth: "100%",
                    borderRadius: "8px",
                  }}
                  loading='lazy'
                />
                <p style={{ fontSize: "13px", color: "#666" }}>
                  ※ 업로드될 이미지 미리보기입니다.
                </p>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={handleSubmit}
              style={{ ...buttonStyle, ...submitButton }}
            >
              상품 등록
            </button>
            <button
              onClick={() => router.push("/store")}
              style={{ ...buttonStyle, ...cancelButton }}
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  marginTop: "6px",
  boxSizing: "border-box",
};

const buttonStyle = {
  flex: 1,
  padding: "12px",
  borderRadius: "6px",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
};

const submitButton = {
  backgroundColor: "#6B46C1",
  color: "#fff",
  border: "none",
  hover: {
    backgroundColor: "#553C9A",
  },
};

const cancelButton = {
  backgroundColor: "#f5f5f5",
  color: "#333",
  border: "1px solid #ccc",
  hover: {
    backgroundColor: "#e1e1e1",
  },
};
