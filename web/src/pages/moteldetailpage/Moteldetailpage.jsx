import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import Header from '../../components/header/Header';
import MapComponent from '../../components/map/MapComponent';
import ImageSlider from '../../components/imageslider/ImageSlider'; 
import Review from '../../components/review/Review'; 
import './moteldetailpage.css';


const MotelDetailPage = () => {
  const [motel, setMotel] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMotelData = () => {
      const dummyData = {
        id: id,
        name: "편안한 휴식 모텔",
        address: "서울시 중구 을지로 30",
        latitude: 37.566826,
        longitude: 126.9786567,
        rating: 4.5,
        price: 50000,
        description: "도심 속 편안한 휴식을 제공하는 모텔입니다.",
        amenities: ["무료 Wi-Fi", "주차장", "에어컨"],
        roomTypes: [
          { name: "스탠다드", price: 50000 },
          { name: "디럭스", price: 70000 },
        ],
        images: [
          "/img/example1.jpg",
          "/img/example2.jpg",
          "/img/example3.jpg"
        ],
        reviews: [
          { user: "김철수", rating: 5, comment: "매우 깨끗하고 편안했습니다." },
          { user: "이영희", rating: 4, comment: "위치가 좋고 서비스도 친절해요." }
        ],
        naverPlaceUrl: "https://map.naver.com/v5/search/편안한%20휴식%20모텔",
        yeogiEottaeUrl: "https://www.goodchoice.kr/product/search/2/서울시%20중구%20을지로%2030"
      };
      setMotel(dummyData);
    };

    fetchMotelData();
  }, [id]);

  if (!motel) return <div>로딩 중...</div>;

  return (
    <div>
      <Navbar />
      <Header activeItem="stays" />
      <div className="motel-detail-page">
        <h1>{motel.name}</h1>
        <p className="motel-address">{motel.address}</p>
        <p className="motel-rating">평점: {motel.rating}/5</p>
        <p>가격: {motel.price.toLocaleString()}원/박</p>

        {/* ✅ 이미지 슬라이더 적용 */}
        <div className="motel-images">
          <ImageSlider images={motel.images} />
        </div>

        <div className="motel-description">
          <h2>모텔 소개</h2>
          <p>{motel.description}</p>
        </div>

        <div className="motel-amenities">
          <h2>편의 시설</h2>
          <ul>
            {motel.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>

        <div className="motel-room-types">
          <h2>객실 유형</h2>
          <ul>
            {motel.roomTypes.map((room, index) => (
              <li key={index}>
                {room.name} - {room.price.toLocaleString()}원/박
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ 리뷰 섹션 적용 */}
        <div className="motel-reviews">
          <h2>리뷰</h2>
          {motel.reviews.map((review, index) => (
            <Review key={index} review={review} />
          ))}
        </div>

        <div className="motel-map">
          <h2>위치</h2>
          <MapComponent latitude={motel.latitude} longitude={motel.longitude} />
        </div>

        {/* ✅ 네이버 플레이스 & 여기어때 이동 버튼 */}
        <div className="motel-links">
          <h2>더 많은 정보</h2>
          <button 
          
            className="naver-button" 
            onClick={() => window.open(motel.naverPlaceUrl, "_blank")}
          >
            <img src="/img/naver.png" alt="네이버" /> 네이버 플레이스로 이동
          </button>
          <button 
            className="yeogi-button" 
            onClick={() => window.open(motel.yeogiEottaeUrl, "_blank")}
          >
            <img src="/img/yeogi.png" alt="여기어때" /> 여기어때에서 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotelDetailPage;