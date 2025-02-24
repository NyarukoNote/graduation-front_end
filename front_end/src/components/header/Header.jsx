import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCar,
  faTaxi
} from "@fortawesome/free-solid-svg-icons";
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
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </Link>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Car rentals</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faTaxi} />
            <span>Airport taxis</span>
          </div>
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