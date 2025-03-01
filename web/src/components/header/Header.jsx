import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "./header.css";

const Header = ({ activeItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/hotels", { state: { searchTerm, searchType } });
  };

  return (
    <div className="header">
      <div className="headerContainer">
        <div className="headerList">
          <Link to="/motel" className={`headerListItem ${activeItem === 'stays' ? 'active' : ''}`}>
            <img src={"/icon/icon_list.svg"} className="icon"  />
            <span>모텔 목록</span>
          </Link>
          <Link to="/motelcomparison" className={`headerListItem ${activeItem === 'comparison' ? 'active' : ''}`}>
            <img src={"/icon/icon_scale.svg"} className="icon"  />
            <span>모텔 비교</span>
          </Link>
          <Link to="/aichatbot" className={`headerListItem ${activeItem === 'AI' ? 'active' : ''}`}>
            <img src={"/icon/icon_AI.svg"} className="icon"  />
            <span>Ai 챗봇</span>
          </Link>
          <Link to="/tourinfo" className={`headerListItem ${activeItem === 'tour' ? 'active' : ''}`}>
            <img src={"/icon/icon_tour.svg"} className="icon"  />
            <span>관광 정보</span>
          </Link>
        </div>
        <div className="headerSearch">
          <div className="headerSearchItem">
            <input
              type="text"
              placeholder="검색하세요"
              className="headerSearchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="headerSearchItem">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="headerSearchSelect"
            >
              <option value="name">이름</option>
              <option value="address">주소</option>
            </select>
          </div>
          <div className="headerSearchItem">
            <button className="headerBtn" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;