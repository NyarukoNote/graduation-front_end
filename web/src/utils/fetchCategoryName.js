import axios from "axios";
import categoryData from "./categoryData.json"; // 📂 기존 JSON 데이터 불러오기

const API_KEY = process.env.REACT_APP_API_KEY; // 환경 변수에서 API 키 가져오기

/**
 * JSON에서 카테고리 이름을 가져오고, 없으면 API 요청 후 localStorage에 저장
 * @param {string} cat1 - 대분류 코드
 * @param {string} cat2 - 중분류 코드
 * @param {string} cat3 - 소분류 코드
 * @returns {Promise<string>} 카테고리 이름
 */
export async function getCategoryName(cat1, cat2, cat3) {
  const key = `${cat1}-${cat2}-${cat3}`;

  // ✅ 1️⃣ 먼저 JSON 데이터 확인
  if (categoryData[key]) {
    return categoryData[key]; // 🔹 기존 데이터 반환
  }

  // ✅ 2️⃣ localStorage 확인
  const cachedCategories = JSON.parse(localStorage.getItem("categoryData")) || {};
  if (cachedCategories[key]) {
    return cachedCategories[key];
  }

  // ✅ 3️⃣ JSON과 localStorage에 없으면 API 요청
  const API_URL = `https://apis.data.go.kr/B551011/KorService1/categoryCode1?MobileOS=ETC&MobileApp=apptest&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}&serviceKey=${API_KEY}&_type=json`;

  try {
    const response = await axios.get(API_URL);
    const items = response.data?.response?.body?.items?.item;

    if (!items || items.length === 0) {
      return "알 수 없음"; // ❌ API에서도 찾을 수 없는 경우
    }

    const categoryName = items[0].name; // ✅ 첫 번째 항목의 카테고리 이름 저장

    // ✅ 4️⃣ 새로운 데이터 localStorage에 저장
    cachedCategories[key] = categoryName;
    localStorage.setItem("categoryData", JSON.stringify(cachedCategories));

    return categoryName;
  } catch (error) {
    console.error("❌ 카테고리 가져오기 실패:", error);
    return "알 수 없음";
  }
}
