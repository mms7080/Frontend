"use client"

import { useState, useEffect } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

const KakaoMap = ({ address }) => {
    const [coordinates, setCoordinates] = useState({lat: 33.450701, lng: 126.570667});
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAOMAP_KEY, // 여기에 실제 앱키를 입력하세요
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

    // 지도 강제 새로고침
    useEffect(() => {
        if (map) {
            setTimeout(() => {
                map.relayout();
            }, 300);
        }
    }, [map, coordinates]);

    if (loading) {
        return <div>지도 로딩 중...</div>;
    }

    return (
        <div style={{ 
            width: "100%", 
            height: "350px", 
            position: "relative",
            overflow: "visible" // 이 부분이 중요!
        }}>
            <Map 
                center={coordinates} 
                style={{
                    width: "100%", 
                    height: "100%",
                    position: "relative", // absolute에서 relative로 변경
                    top: 0,
                    left: 0
                }} 
                level={3}
                onCreate={(mapInstance) => {
                    setMap(mapInstance);
                    // 지도 생성 후 강제 리사이즈
                    setTimeout(() => {
                        mapInstance.relayout();
                    }, 100);
                }}
            >
                <MapMarker position={coordinates} />
            </Map>
        </div>
    );
}

export default KakaoMap;