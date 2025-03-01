import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./motelpage.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

const MotelPage = () => {
  const [motels, setMotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // `react-paginate`는 0부터 시작
  const motelsPerPage = 5; // 한 페이지에 표시할 모텔 수

  useEffect(() => {
    const fetchMotelsData = () => {
      const dummyData = [
        {
          id: 1,
          name: "편안한 휴식 모텔",
          address: "서울시 강남구 123-45",
          rating: 4.5,
          price: 50000,
          image: "/img/example1.jpg",
        },
        {
          id: 2,
          name: "도심 속 안식처",
          address: "서울시 마포구 67-89",
          rating: 4.2,
          price: 45000,
          image: "/img/example2.jpg",
        },
        {
          id: 3,
          name: "럭셔리 모텔",
          address: "서울시 서초구 77-12",
          rating: 4.8,
          price: 70000,
          image: "/img/example3.jpg",
        },
        {
          id: 4,
          name: "힐링 스테이",
          address: "서울시 종로구 101-55",
          rating: 4.6,
          price: 55000,
          image: "/img/example4.jpg",
        },
        {
          id: 5,
          name: "모던 호텔",
          address: "서울시 용산구 88-32",
          rating: 4.3,
          price: 60000,
          image: "/img/example5.jpg",
        },
        {
          id: 6,
          name: "스위트 모텔",
          address: "서울시 동대문구 33-66",
          rating: 4.7,
          price: 52000,
          image: "/img/example6.jpg",
        },
      ];
      setMotels(dummyData);
    };

    fetchMotelsData();
  }, []);

  // 현재 페이지의 모텔 데이터 계산
  const offset = currentPage * motelsPerPage;
  const currentMotels = motels.slice(offset, offset + motelsPerPage);

  // 페이지 변경 처리
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

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

        {/* ReactPaginate 적용 */}
        <ReactPaginate
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          pageCount={Math.ceil(motels.length / motelsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default MotelPage;
