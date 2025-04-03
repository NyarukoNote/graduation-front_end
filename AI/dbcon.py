import requests
from pymongo import MongoClient
from bs4 import BeautifulSoup

# MongoDB 연결
ATLAS_URI = "mongodb+srv://paikyo1:qwer1234@stayinfo.p2bcu.mongodb.net/?retryWrites=true&w=majority&appName=stayinfo"
client = MongoClient(ATLAS_URI, ssl=True, tls=True)
db = client['mydatabase']
collection = db['accommodations']

# 여기어때에서 서비스 이름 크롤링
def scrape_services(url, motel_name):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return None

        soup = BeautifulSoup(response.text, "html.parser")

        # 서비스 이름이 포함된 <span> 태그 찾기
        service_elements = soup.find_all("span", {"class": "css-1wwwv6t"})
        services = [element.text.strip() for element in service_elements]

        return services if services else None
    except Exception as e:
        print(f"서비스 크롤링 실패 ({motel_name}):", e)
        return None

# 숙소 이용정보 크롤링 (h2 -> 카테고리 이름, ul > li -> 내용)
def scrape_accommodation_info(url, motel_name):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return None

        soup = BeautifulSoup(response.text, "html.parser")

        # 숙소 이용정보 크롤링: h2 -> 카테고리 이름, ul > li -> 내용
        info = []

        # h2 태그를 찾아서 각 카테고리 제목을 가져오고, 그 아래의 ul > li를 내용으로 추출
        sections = soup.find_all("section", {"class": "gc-paragraph"})

        for section in sections:
            h2 = section.find("h2", {"class": "css-11xa1an"})
            if h2:
                category = h2.text.strip()
                content = []
                li_elements = section.find_all("li", {"class": "css-1hit1zp"})
                for li in li_elements:
                    p = li.find("p")
                    if p:
                        content.append(p.text.strip())
                
                if category and content:
                    info.append({"카테고리": category, "내용": content})

        return info if info else None

    except Exception as e:
        print(f"숙소 이용정보 크롤링 실패 ({motel_name}):", e)
        return None

# 크롤링 및 업데이트 함수
def crawl_and_update_motel_services():
    try:
        motels = list(collection.find({"여기어때": {"$exists": True}}))  # 여기어때 링크가 있는 모텔만

        if not motels:
            print("크롤링할 모텔이 없습니다.")
            return

        success_count = 0
        failed_motels = []

        for motel in motels:
            motel_name = motel["업체명"]
            hereo_url = motel["여기어때"]
            print(f"크롤링 중: {motel_name}")

            # 서비스 크롤링
            services = scrape_services(hereo_url, motel_name)

            # 숙소 이용정보 크롤링
            accommodation_info = scrape_accommodation_info(hereo_url, motel_name)

            if services and accommodation_info:
                collection.update_one(
                    {"업체명": motel_name},
                    {"$set": {"서비스": services, "숙소이용정보": accommodation_info}}
                )
                success_count += 1
            else:
                failed_motels.append(motel_name)

        print(f"성공한 모텔 수: {success_count}")
        if failed_motels:
            print("실패한 모텔:", failed_motels)

    except Exception as e:
        print(f"오류 발생: {e}")

if __name__ == "__main__":
    crawl_and_update_motel_services()
