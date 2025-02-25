import React, { useState } from 'react';
import './motelcomparison.css';
import Header from '../../components/header/Header';
import Navbar from "../../components/navbar/Navbar";

const dummyMotels = [
  {
    id: 1,
    name: "편안한 휴식 모텔",
    address: "서울시 중구 을지로 30",
    rating: 4.5,
    price: 50000,
    amenities: ["무료 Wi-Fi", "주차장", "에어컨"],
    image: "/img/example1.jpg",
  },
  {
    id: 2,
    name: "럭셔리 모텔",
    address: "서울시 강남구 테헤란로 10",
    rating: 4.8,
    price: 80000,
    amenities: ["조식 제공", "수영장", "스파"],
    image: "/img/example2.jpg",
  },
  {
    id: 3,
    name: "가성비 좋은 모텔",
    address: "서울시 마포구 홍대입구 5",
    rating: 4.2,
    price: 40000,
    amenities: ["무료 주차", "에어컨", "넷플릭스"],
    image: "/img/example3.jpg",
  }
];

const MotelComparison = () => {
  const [selectedMotels, setSelectedMotels] = useState([]);

  const handleSelect = (motel) => {
    if (selectedMotels.some(m => m.id === motel.id)) {
      setSelectedMotels(selectedMotels.filter(m => m.id !== motel.id));
    } else if (selectedMotels.length < 2) {
      setSelectedMotels([...selectedMotels, motel]);
    }
  };

  return (
    <div>
    <Navbar />
      <Header activeItem="comparison" />
    <div className="motel-comparison">
      <h1>모텔 비교</h1>
      <div className="motel-list">
        {dummyMotels.map(motel => (
          <div key={motel.id} className={`motel-card ${selectedMotels.some(m => m.id === motel.id) ? 'selected' : ''}`} onClick={() => handleSelect(motel)}>
            <img src={motel.image} alt={motel.name} />
            <h2>{motel.name}</h2>
            <p>{motel.address}</p>
            <p>평점: {motel.rating}/5</p>
            <p>가격: {motel.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      {selectedMotels.length === 2 && (
        <div className="comparison-table">
          <h2>비교 결과</h2>
          <table>
            <thead>
              <tr>
                <th>항목</th>
                <th>{selectedMotels[0].name}</th>
                <th>{selectedMotels[1].name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>주소</td>
                <td>{selectedMotels[0].address}</td>
                <td>{selectedMotels[1].address}</td>
              </tr>
              <tr>
                <td>평점</td>
                <td>{selectedMotels[0].rating}/5</td>
                <td>{selectedMotels[1].rating}/5</td>
              </tr>
              <tr>
                <td>가격</td>
                <td>{selectedMotels[0].price.toLocaleString()}원</td>
                <td>{selectedMotels[1].price.toLocaleString()}원</td>
              </tr>
              <tr>
                <td>편의시설</td>
                <td>{selectedMotels[0].amenities.join(", ")}</td>
                <td>{selectedMotels[1].amenities.join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default MotelComparison;
