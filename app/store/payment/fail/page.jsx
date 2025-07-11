"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "../../../../components"; 
import Modal, { useModal } from "../../../../components/movie/modal";

export default function StorePaymentFailPage() {
  const [realaccess,setRealAccess]=useState(sessionStorage.getItem('storeps')==='true');
  const [realaccess2,setRealAccess2]=useState(sessionStorage.getItem('cartps')==='true');
  const redirected = useRef(false);
  const {isModalOpen, isModalVisible, openModal, closeModal, modalContent, onConfirm, onCancel} = useModal();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!redirected.current) {
      document.title = "결제 - FILMORA";
      // 로그인된 유저 정보 불러오기
      const fetchUser = async () => {
        try {
          const allowed = sessionStorage.getItem('storeps');
          const allowed2 = sessionStorage.getItem('cartps');
          if (allowed !== 'true' && allowed2 !== 'true') {
            openModal("잘못된 접근입니다.", ()=>{router.push('/store');}, ()=>{router.push('/store');}); // 허용되지 않으면 스토어 페이지로
          }
          sessionStorage.removeItem('storeps');
          sessionStorage.removeItem('cartps');
          const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`, {
            credentials: "include",
          });
          const data = await res.json();
          setUser(data);
        } catch (e) {
          setUser(null);
        }
      };

      fetchUser();
      redirected.current = true;
    }
  }, []);

  if(!realaccess && !realaccess2){
    return (
    <>
      <Header headerColor="white" headerBg="#1a1a1a" userInfo={user} />
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
      <Header headerColor="black" headerBg="white" userInfo={user} />

      <div style={{ padding: "60px", textAlign: "center" }}>
        <h1>❌ 결제 실패</h1>
        <p style={{ marginTop: "20px", color: "#888" }}>
          스토어 결제가 정상적으로 처리되지 않았습니다.<br />다시 시도해 주세요.
        </p>
        <Link href="/store">
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
            스토어로 돌아가기
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
