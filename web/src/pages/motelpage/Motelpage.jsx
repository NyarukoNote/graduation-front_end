import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import "./motelpage.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

const MotelPage = () => {
  const [motels, setMotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [currentPage, setCurrentPage] = useState(0);
  const motelsPerPage = 5;

  const fetchMotelsData = () => {
    axios
      .get(
        /*"http://218.150.183.198:5000/data?fields=업체명,주소"*/ "http://127.0.0.1:5000/data?fields=업체명,주소"
      ) // ✅ 필요한 필드만 요청
      .then((response) => {
        console.log("Fetched Data:", response.data);
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Invalid data format:", response.data);
          return;
        }
        setMotels(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(fetchMotelsData, []);

  // 검색어로 모텔 목록 필터링
  const filteredMotels = motels.filter((motel) => {
    const name = motel["업체명"]?.toLowerCase() || "";
    const address = motel["주소"]?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      address.includes(searchTerm.toLowerCase())
    );
  });

  // 현재 페이지의 모텔 데이터 계산
  const offset = currentPage * motelsPerPage;
  const currentMotels = filteredMotels.slice(offset, offset + motelsPerPage);

  // 페이지 변경 처리
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // 검색어 입력 처리
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <Header activeItem="stays" />
      <div className="motel-page">
        <h1>모텔 목록</h1>

        {/* 검색 입력 필드 */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="이름 또는 주소로 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="motel-list">
          {currentMotels.map((motel, index) => {
            const formattedName = motel["업체명"].replace(/ /g, "_");

            return (
              <Link
                to={`/motel/${encodeURIComponent(motel["업체명"])}`}
                key={motel["업체명"]}
              >
                <div key={index} className="motel-item">
                  <img
                    src={
                      /*`http://218.150.183.198:5000*/ `http://127.0.0.1:5000/image/${encodeURIComponent(
                        formattedName
                      )}_1.jpg`
                    }
                    alt={motel["업체명"]}
                    referrerPolicy="no-referrer"
                  />
                  <h2>{motel["업체명"]}</h2>
                  <p>{motel["주소"]}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ReactPaginate 적용 */}
        <ReactPaginate
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredMotels.length / motelsPerPage)}
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
