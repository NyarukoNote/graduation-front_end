import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import ImageSlider from "../../components/imageslider/ImageSlider"; 
import "./tourdetail.css";
import { fetchCategoryName } from "../../utils/fetchCategoryName";

const TourDetail = () => {
  const { contentid } = useParams(); // URL에서 contentid 가져오기
  const [detail, setDetail] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("알 수 없음");
  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchDetailData = async () => {
      setLoading(true);
      try {
        // ✅ 상세 정보 가져오기
        const detailResponse = await axios.get(
          `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${API_KEY}&contentId=${contentid}&MobileOS=ETC&MobileApp=AppTest&_type=json&defaultYN=Y&overviewYN=Y&catcodeYN=Y&addrinfoYN=Y&firstImageYN=Y`
        );
        setDetail(detailResponse.data.response.body.items.item[0]);

        // ✅ 이미지 리스트 가져오기
        const imageResponse = await axios.get(
          `https://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=${API_KEY}&contentId=${contentid}&MobileOS=ETC&MobileApp=AppTest&_type=json&imageYN=Y&subImageYN=Y`
        );
        const imageItems = imageResponse.data.response.body.items.item || [];
        setImages(imageItems.map((img) => img.originimgurl));
      } catch (error) {
        console.error("❌ 데이터 가져오기 실패:", error);
      }
      setLoading(false);
    };

    fetchDetailData();
  }, [contentid]);

  useEffect(() => {
    const getCategory = async () => {
      if (detail?.cat1 && detail?.cat2 && detail?.cat3) {
        const name = await fetchCategoryName(detail.cat1, detail.cat2, detail.cat3);
        setCategoryName(name);
      }
    };
  
    getCategory();
  }, [detail?.cat1, detail?.cat2, detail?.cat3]);

  if (loading) return <p>로딩 중...</p>;
  if (!detail) return <p>데이터를 불러오지 못했습니다.</p>;

  return (
    <div>
      <Navbar />
      <Header activeItem="tour" />
      <div className="detail-container">
        {/* ✅ 뒤로 가기 버튼 추가 */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 뒤로 가기
        </button>

        <h1>{detail.title}</h1>
        
        {/* ✅ 이미지 슬라이더 */}
        {images.length > 0 ? (
          <ImageSlider images={images} />
        ) : (
          <img
            src={detail.firstimage ? detail.firstimage : "/img/default.png"}
            alt={detail.title}
            className="detail-image"
          />
        )}

        <p className="category">📌 분류: {categoryName}</p>
        <p className="address">📍 주소: {detail.addr1}</p>
        <p className="description">{detail.overview}</p>
      </div>
    </div>
  );
};

export default TourDetail;
