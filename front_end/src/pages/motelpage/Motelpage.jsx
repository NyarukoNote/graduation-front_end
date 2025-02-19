import React, { useState, useEffect } from 'react';
import './motelpage.css'; 

const MotelPage = () => {
  const [motel, setMotel] = useState(null);

  useEffect(() => {
    const fetchMotelData = () => {
      const dummyData = {
        name: "편안한 휴식 모텔",
        address: "서울시 강남구 123-45",
        rating: 4.5,
        price: 50000,
        amenities: ["무료 Wi-Fi", "주차장", "에어컨", "TV"],
        description: "도심 속 편안한 휴식을 제공하는 모텔입니다. 깨끗하고 안락한 객실과 친절한 서비스로 여러분을 맞이합니다."
      };
      setMotel(dummyData);
    };

    fetchMotelData();
  }, []);

  if (!motel) return <div>로딩 중...</div>;

  return (
    <div className="motel-page">
      <h1>{motel.name}</h1>
      <div className="motel-info">
        <p><strong>주소:</strong> {motel.address}</p>
        <p><strong>평점:</strong> {motel.rating}/5</p>
        <p><strong>가격:</strong> {motel.price.toLocaleString()}원/박</p>
      </div>
      <div className="motel-amenities">
        <h2>편의 시설</h2>
        <ul>
          {motel.amenities.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>
      <div className="motel-description">
        <h2>설명</h2>
        <p>{motel.description}</p>
      </div>
    </div>
  );
};

export default MotelPage;