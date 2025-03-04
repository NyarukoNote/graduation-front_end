import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import "./tourinfo.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { getCategoryName } from "../../utils/fetchCategoryName"; // ✅ 수정된 함수 사용

const Tourinfo = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [currentSearch, setCurrentSearch] = useState("서울");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryNames, setCategoryNames] = useState({}); // ✅ 분류 저장
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_API_KEY;

  /** 🟢 관광지 정보 가져오기 */
  const fetchData = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${API_KEY}&keyword=${searchQuery}&MobileOS=ETC&MobileApp=AppTest&_type=json&numOfRows=1000`
      );
      setData(response.data.response.body.items.item || []);
      setCurrentSearch(searchQuery);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData("서울"); // ✅ 기본값: 서울
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      setCurrentSearch(query);
      fetchData(query);
      setCurrentPage(0);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = data.slice(offset, offset + itemsPerPage);

  /** 🟢 현재 페이지 아이템의 분류명 가져오기 */
  useEffect(() => {
    const fetchCategoryNamesForCurrentPage = async () => {
      const newCategoryNames = { ...categoryNames };

      // ✅ 현재 페이지에서 분류명이 없는 아이템만 조회
      const itemsToFetch = currentItems.filter(
        (item) => item.cat1 && item.cat2 && item.cat3 && !newCategoryNames[item.contentid]
      );

      if (itemsToFetch.length === 0) return; // ✅ 이미 모든 분류가 존재하면 API 요청하지 않음

      const fetchPromises = itemsToFetch.map(async (item) => {
        const name = await getCategoryName(item.cat1, item.cat2, item.cat3); // ✅ JSON 기반 조회
        newCategoryNames[item.contentid] = name;
      });

      await Promise.all(fetchPromises);
      setCategoryNames(newCategoryNames);
    };

    if (currentItems.length > 0) {
      fetchCategoryNamesForCurrentPage();
    }
  }, [currentItems]);

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

        <p className="current-search">🔎 현재 검색: <strong>{currentSearch}</strong></p>

        {loading ? (
          <p className="loading">로딩 중...</p>
        ) : (
          <>
            <div className="catalog">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div
                    key={item.contentid}
                    className="catalog-item"
                    onClick={() => navigate(`/tour/${item.contentid}`)}
                  >
                    <img
                      src={item.firstimage ? item.firstimage : "/img/default.png"}
                      alt={item.title}
                      className="catalog-image"
                    />
                    <h2>{item.title}</h2>
                    <p className="category">
                      {categoryNames[item.contentid] || "불러오는 중..."}
                    </p>
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
