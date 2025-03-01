import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./tourinfo.css"; 
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

const Tourinfo = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [currentSearch, setCurrentSearch] = useState("서울"); // ✅ 현재 검색어 저장
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); 
  const itemsPerPage = 6; 
  const API_KEY = "9FPZnm0Ph3Zpi7Zv9vdaOR%2Bmwg8GQ5BW1J%2BtPAgEpJdPRaL583suCrFEI45ZgVvYqHqUea8p4tHoXRHzW43BxQ%3D%3D"; 

  const fetchData = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${API_KEY}&keyword=${searchQuery}&MobileOS=ETC&MobileApp=AppTest&_type=json`
      );
      
      console.log("🔍 API 응답 데이터:", response.data); // ✅ 콘솔에 데이터 출력
      setData(response.data.response.body.items.item || []);
      setCurrentSearch(searchQuery); // ✅ 현재 검색어 업데이트
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData("서울");
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      fetchData(query);
      setCurrentPage(0);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = data.slice(offset, offset + itemsPerPage);

  return (
    <div>
      <Navbar />
      <Header activeItem="tour" />
      <div className="container">
        <h1>관광 정보 검색</h1>
        <div className="input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="지역명을 입력하세요"
          />
          <button onClick={handleSearch}>검색</button>
        </div>

        {/* ✅ 현재 검색 중인 키워드 표시 */}
        <p className="current-search">🔎 현재 검색: <strong>{currentSearch}</strong></p>

        {loading ? (
          <p className="loading">로딩 중...</p>
        ) : (
          <>
            <div className="catalog">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div key={item.contentid} className="catalog-item">
                    <img
                      src={item.firstimage ? item.firstimage : "/img/default.png"}
                      alt={item.title}
                      className="catalog-image"
                    />
                    <h2>{item.title}</h2>
                    <p className="category">{item.cat3}</p>
                  </div>
                ))
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </div>

            <ReactPaginate
              previousLabel={"이전"}
              nextLabel={"다음"}
              breakLabel={"..."}
              pageCount={Math.ceil(data.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Tourinfo;
