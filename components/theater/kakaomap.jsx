"use client"

import { useState, useEffect, useRef } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

const KakaoMap = ({ address }) => {
    const [coordinates, setCoordinates] = useState({lat: 33.450701, lng: 126.570667});
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef(null);
    const [loading, setLoading] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAOMAP_KEY,
        libraries: ["services","clusterer"],
    });

    useEffect(() => {
        if (!loading && window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const { x, y } = result[0];
                    setCoordinates({ lat: parseFloat(y), lng: parseFloat(x) });
                } else {
                    console.error("주소 검색 실패:", address);
                }
            });
        }
    }, [address, loading]);

    // // 지도가 생성된 후 강제로 리사이즈
    // const handleMapCreate = (map) => {
    //     mapRef.current = map;
    //     setMapLoaded(true);
        
    //     // 지도가 완전히 로드된 후 리사이즈 트리거
    //     setTimeout(() => {
    //         if (mapRef.current) {
    //             mapRef.current.relayout();
    //         }
    //     }, 300);
    // };

    // // 컴포넌트가 마운트된 후 한 번 더 리사이즈
    // useEffect(() => {
    //     if (mapLoaded && mapRef.current) {
    //         const timer = setTimeout(() => {
    //             mapRef.current.relayout();
    //         }, 500);
            
    //         return () => clearTimeout(timer);
    //     }
    // }, [mapLoaded]);

    if (loading) {
        return (
            <div style={{ 
                width: "100%", 
                height: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "8px"
            }}>
                지도 로딩 중...
            </div>
        );
    }

    return (
        <div style={{ 
            width: "100%", 
            height: "350px",
            // position: "relative",
            // minHeight: "350px" // 최소 높이 보장
        }}>
            <Map 
                id="map"
                center={coordinates} 
                style={{
                    width: "100%", 
                    height: "100%",
                    // borderRadius: "8px",
                    // minHeight: "350px"
                }} 
                level={3}
                // onCreate={handleMapCreate}
            >
                <MapMarker position={coordinates} />
            </Map>
        </div>
    );
}

export default KakaoMap;