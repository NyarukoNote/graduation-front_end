import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './motelpage.css';
import Header from '../../components/header/Header';
import Navbar from "../../components/navbar/Navbar";

const MotelPage = () => {
  const [motels, setMotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [motelsPerPage] = useState(5);

  useEffect(() => {
    const fetchMotelsData = () => {
      // 임시 데이터
      const dummyData = [
        {
          id: 1,
          name: "편안한 휴식 모텔",
          address: "서울시 강남구 123-45",
          rating: 4.5,
          price: 50000,
          image: "/img/example1.jpg"
        },
        {
          id: 2,
          name: "도심 속 안식처",
          address: "서울시 마포구 67-89",
          rating: 4.2,
          price: 45000,
          image: "/img/example2.jpg"
        },
        // ... 더 많은 모텔 데이터 추가 (최소 6개 이상)
      ];
      setMotels(dummyData);
    };

    fetchMotelsData();
  }, []);

  // 현재 페이지의 모텔들
  const indexOfLastMotel = currentPage * motelsPerPage;
  const indexOfFirstMotel = indexOfLastMotel - motelsPerPage;
  const currentMotels = motels.slice(indexOfFirstMotel, indexOfLastMotel);

  // 페이지 변경
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <Header activeItem="stays" />
      <div className="motel-page">
        <h1>모텔 목록</h1>
        <div className="motel-list">
          {currentMotels.map((motel) => (
            <div key={motel.id} className="motel-item">
              <img src={motel.image} alt={motel.name} />
              <Link to={`/motel/${motel.id}`}>
                <h2>{motel.name}</h2>
              </Link>
              <p>{motel.address}</p>
              <p>평점: {motel.rating}/5</p>
              <p>가격: {motel.price.toLocaleString()}원/박</p>
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(motels.length / motelsPerPage) }, (_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotelPage;