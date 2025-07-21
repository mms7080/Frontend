"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal, { useModal } from "../../../../components/movie/modal";

export default function MoviePaymentFailPage() {
  const router = useRouter();
  const [realaccess,setRealAccess]=useState(sessionStorage.getItem('movieps')==='true');
  const redirected = useRef(false);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();
  document.title = "결제 - FILMORA";
  useEffect(() => {
    if (!redirected.current) {
      const fetchUser = async () => {
        try {
          const allowed = sessionStorage.getItem('movieps');
          if (allowed !== 'true') {
            openModal("잘못된 접근입니다.", ()=>{router.push('/booking');}, ()=>{router.push('/booking');}); // 허용되지 않으면 예매 페이지로
          }
          sessionStorage.removeItem('movieps');
        } catch (e) {
          console.log(e);
        }
      };

      fetchUser();
      redirected.current = true;
    }
  }, []);

  if(!realaccess){
    return (
    <>
      {isModalOpen && (
        <Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}
        />
      )}
    </>
    );
  }

  return (
    <>

      <div style={{ padding: "60px", textAlign: "center" }}>
        <h1>❌ 예매 실패</h1>
        <p style={{ marginTop: "20px", color: "#888" }}>
          영화 예매 결제에 실패했습니다. 다시 시도해 주세요.
        </p>
        <Link href="/booking">
          <button
            style={{
              marginTop: "40px",
              padding: "12px 24px",
              backgroundColor: "#6b46c1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            예매 페이지로
          </button>
        </Link>
      </div>
      {isModalOpen && (
        <Modal
        isModalOpen={isModalOpen}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={modalContent}
        />
      )}
    </>
  );
}
