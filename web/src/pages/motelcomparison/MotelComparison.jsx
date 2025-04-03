import React, { useState, useEffect } from "react";
import axios from "axios"; // axios 추가
import "./motelcomparison.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

const MotelComparison = () => {
  const [motels, setMotels] = useState([]); // 모텔 데이터를 관리하는 상태 추가
  const [selectedMotels, setSelectedMotels] = useState([]);

  // 모텔 데이터를 서버에서 가져오는 useEffect
  useEffect(() => {
    const fetchMotelsData = async () => {
      try {
        const response = await axios.get("http://218.150.183.198:5000/data"); // 서버에서 데이터 받아오기
        if (response.data && Array.isArray(response.data)) {
          setMotels(response.data); // 받은 데이터를 상태에 저장
        } else {
          console.error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMotelsData(); // 데이터 가져오기
  }, []);

  const handleSelect = (motel) => {
    if (selectedMotels.some((m) => m.id === motel.id)) {
      setSelectedMotels(selectedMotels.filter((m) => m.id !== motel.id));
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
          {motels.map((motel) => (
            <div
              key={motel.id}
              className={`motel-card ${
                selectedMotels.some((m) => m.id === motel.id) ? "selected" : ""
              }`}
              onClick={() => handleSelect(motel)}
            >
              <img
                src={
                  motel["이미지"] || `${process.env.PUBLIC_URL}/img/default.png`
                }
                alt={motel["업체명"]}
              />
              <h2>{motel["업체명"]}</h2>
              <p>{motel["주소"]}</p>
              <p>평점: {motel["평점"] || "정보 없음"}/5</p>
              <p>
                가격:{" "}
                {motel["가격"] ? motel["가격"].toLocaleString() : "정보 없음"}원
              </p>
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
                  <th>{selectedMotels[0]["업체명"]}</th>
                  <th>{selectedMotels[1]["업체명"]}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>주소</td>
                  <td>{selectedMotels[0]["주소"]}</td>
                  <td>{selectedMotels[1]["주소"]}</td>
                </tr>
                <tr>
                  <td>평점</td>
                  <td>{selectedMotels[0]["평점"] || "정보 없음"}/5</td>
                  <td>{selectedMotels[1]["평점"] || "정보 없음"}/5</td>
                </tr>
                <tr>
                  <td>가격</td>
                  <td>
                    {selectedMotels[0]["가격"]
                      ? selectedMotels[0]["가격"].toLocaleString()
                      : "정보 없음"}
                    원
                  </td>
                  <td>
                    {selectedMotels[1]["가격"]
                      ? selectedMotels[1]["가격"].toLocaleString()
                      : "정보 없음"}
                    원
                  </td>
                </tr>
                <tr>
                  <td>편의시설</td>
                  <td>
                    {selectedMotels[0]["편의시설"]?.join(", ") || "정보 없음"}
                  </td>
                  <td>
                    {selectedMotels[1]["편의시설"]?.join(", ") || "정보 없음"}
                  </td>
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
