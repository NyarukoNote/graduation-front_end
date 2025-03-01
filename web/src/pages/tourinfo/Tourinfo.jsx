import React, { useState, useEffect } from "react";
import axios from "axios";

const Tourinfo = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const API_KEY = "9FPZnm0Ph3Zpi7Zv9vdaOR%2Bmwg8GQ5BW1J%2BtPAgEpJdPRaL583suCrFEI45ZgVvYqHqUea8p4tHoXRHzW43BxQ%3D%3D"; // 한국관광공사 API 키 입력

  const fetchData = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${API_KEY}&keyword=${searchQuery}&MobileOS=ETC&MobileApp=AppTest&_type=json`
      );
      setData(response.data.response.body.items.item || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData("서울"); // 기본값으로 서울 관광 정보 가져오기
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      fetchData(query);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">관광 정보 검색</h1>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="지역명을 입력하세요"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded"
        >
          검색
        </button>
      </div>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul>
          {data.length > 0 ? (
            data.map((item) => (
              <li key={item.contentid} className="border-b py-2">
                <h2 className="font-bold">{item.title}</h2>
                <p>{item.addr1}</p>
              </li>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Tourinfo;