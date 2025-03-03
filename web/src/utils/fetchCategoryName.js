import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY; // 환경변수에서 API 키 가져오기

/**
 * 카테고리 코드에 해당하는 명칭을 가져오는 함수
 * @param {string} cat1 - 대분류 코드
 * @param {string} cat2 - 중분류 코드
 * @param {string} cat3 - 소분류 코드
 * @returns {Promise<string>} 카테고리 이름 (실패 시 "알 수 없음")
 */
export async function fetchCategoryName(cat1, cat2, cat3) {
  const API_URL = `https://apis.data.go.kr/B551011/KorService1/categoryCode1?MobileOS=ETC&MobileApp=apptest&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}&serviceKey=${API_KEY}&_type=json`;

  try {
    const response = await axios.get(API_URL);
    const items = response.data.response.body.items.item;

    if (!items || items.length === 0) {
      return "알 수 없음";
    }

    return items[0].name; // 첫 번째 항목의 이름 반환
  } catch (error) {
    console.error("❌ 카테고리 가져오기 실패:", error);
    return "알 수 없음";
  }
}