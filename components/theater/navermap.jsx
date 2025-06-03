"use client"

import { useState, useEffect } from "react";

let mapInstance = null;

// 네이버 지도 스크립트 불러오기
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        // 이미 로드된 스크립트가 있는지 확인
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
};

const NaverMap = ({address}) => {
    
    const [isMapLoaded, setMapLoaded] = useState(false);
    const [isScriptLoaded, setScriptLoaded] = useState(false);
    const [latitude, setLatitude] = useState(37.3595704);
    const [longitude, setLongitude] = useState(127.105399);
    const [error, setError] = useState(null);

    // 주소를 좌표로 변환하는 함수
    const geocodeAddress = (addr) => {
        if (!window.naver || !window.naver.maps) {
            console.error('Naver Maps API not loaded yet');
            return;
        }

        window.naver.maps.Service.geocode({
            query: addr
        }, function(status, response) {
            if (status !== window.naver.maps.Service.Status.OK) {
                console.error('Geocoding failed:', status);
                setError('주소를 찾을 수 없습니다.');
                return;
            }

            const result = response.v2;
            const items = result.addresses;

            if (items.length > 0) {
                // x는 경도(longitude), y는 위도(latitude)
                setLongitude(parseFloat(items[0].x));
                setLatitude(parseFloat(items[0].y));
            }
        });
    };

        // 지도 초기화 함수
    const initMap = () => {
        if (!window.naver || !window.naver.maps) {
            console.error('Naver Maps API not available');
            return;
        }

        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        try {
            const mapOptions = {
                zoomControl: true,
                zoomControlOptions: {
                    style: window.naver.maps.ZoomControlStyle.SMALL,
                    position: window.naver.maps.Position.TOP_RIGHT,
                },
                center: new window.naver.maps.LatLng(latitude, longitude),
                zoom: 16,
            };

            mapInstance = new window.naver.maps.Map('map', mapOptions);

            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(latitude, longitude),
                map: mapInstance
            });

            setMapLoaded(true);
            setError(null);
        } catch (err) {
            console.error('Map initialization failed:', err);
            setError('지도 초기화에 실패했습니다.');
        }
    };

    // 네이버 지도 스크립트 로드
    useEffect(() => {
        const loadNaverMaps = async () => {
            try {
                if (typeof window !== 'undefined' && !window.naver) {
                    const scriptUrl = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVERMAP_KEY}&submodules=geocoder`;
                    await loadScript(scriptUrl);
                }
                setScriptLoaded(true);
            } catch (err) {
                console.error('Failed to load Naver Maps script:', err);
                setError('지도 로드에 실패했습니다.');
            }
        };

        loadNaverMaps();
    }, []);

    // 주소가 변경될 때 geocoding 실행
    useEffect(() => {
        if (isScriptLoaded && address) {
            geocodeAddress(address);
        } else {
            let attempts = 0;
            const maxAttempts = 50; // 최대 50번 시도 (5초)

            const checkInterval = setInterval(() => {
                attempts++;

                if (window.naver && window.naver.maps) {
                    clearInterval(checkInterval);
                    geocodeAddress(address);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.warn('Naver Maps API 로드 타임아웃');
                    setError('지도 로드에 시간이 너무 오래 걸립니다.');
                }
            }, 100);
        }
    }, [address, isScriptLoaded]);

    // 좌표가 변경될 때 지도 초기화
    useEffect(() => {
        if (isScriptLoaded && latitude && longitude) {
            // 지도가 이미 로드되어 있다면 중심점만 변경
            if (mapInstance) {
                const newCenter = new window.naver.maps.LatLng(latitude, longitude);
                mapInstance.setCenter(newCenter);
                
                // 마커도 새 위치로 이동
                const marker = new window.naver.maps.Marker({
                    position: newCenter,
                    map: mapInstance
                });
            } else {
                let attempts = 0;
                const maxAttempts = 50; // 최대 50번 시도 (5초)

                const checkInterval = setInterval(() => {
                    attempts++;

                    if (window.naver && window.naver.maps) {
                        clearInterval(checkInterval);
                        initMap();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        console.warn('Naver Maps API 로드 타임아웃');
                        setError('지도 로드에 시간이 너무 오래 걸립니다.');
                    }
                }, 100);
            }
        }
    }, [latitude, longitude, isScriptLoaded]);

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>에러: {error}</div>;
    }

    if (!isScriptLoaded) {
        return <div style={{ padding: '20px' }}>지도를 로드하는 중...</div>;
    }

    return (
        <>
            <div id="map" style={{ width: '100%', height: '400px' }} />
            {!isMapLoaded && (
                <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '4px'
                }}>
                    지도를 초기화하는 중...
                </div>
            )}
        </>
    );
}

export default NaverMap;