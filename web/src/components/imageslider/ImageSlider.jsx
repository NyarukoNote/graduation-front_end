import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./imageslider.css"; // CSS 파일을 따로 관리

const CustomPrevArrow = ({ onClick }) => (
  <button className="custom-arrow custom-prev" onClick={onClick}>
    ◀
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="custom-arrow custom-next" onClick={onClick}>
    ▶
  </button>
);

const ImageSlider = ({ images }) => {
  const settings = {
    dots: true, // ✅ 하단 점 네비게이션 표시
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    adaptiveHeight: false, // ✅ 슬라이더 높이 변경 방지
    draggable: false, // ✅ 스크롤로 넘기기 방지 (버튼으로만 이동)
    appendDots: dots => <div className="custom-dots-container">{dots}</div> // ✅ 점 네비게이션을 이미지 아래 배치
  };

  return (
    <div className="motel-slider">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slide-item">
            <img src={image} alt={`Motel Image ${index + 1}`} className="slide-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
