import os
import requests
from pymongo import MongoClient
from bs4 import BeautifulSoup

# MongoDB 연결
ATLAS_URI = "mongodb+srv://paikyo1:qwer1234@stayinfo.p2bcu.mongodb.net/?retryWrites=true&w=majority&appName=stayinfo"
client = MongoClient(ATLAS_URI, ssl=True, tls=True)
db = client['mydatabase']
collection = db['accommodations']

# 서비스 이름을 저장할 필드 이름
service_field_name = "서비스"

# 여기어때에서 서비스 이름 크롤링
def scrape_services(url, motel_name):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return None

        soup = BeautifulSoup(response.text, "html.parser")

        # 서비스 이름들이 포함된 HTML 요소를 찾습니다.
        service_elements = soup.find_all("span", class_="css-1wwwv6t")  # 이 클래스에 해당하는 텍스트 추출
        services = [element.text.strip() for element in service_elements]

        if services:
            return services
        return None
    except Exception as e:
        print(f"서비스 크롤링 실패 ({motel_name}):", e)
        return None

# 모든 모텔 데이터 처리
def crawl_and_update_services():
    try:
        # MongoDB에서 모든 모텔 데이터 가져오기
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

            services = scrape_services(hereo_url, motel_name)

            if services:
                # 크롤링 성공 시, 서비스 이름 업데이트
                collection.update_one({"업체명": motel_name}, {"$set": {service_field_name: services}})
                success_count += 1
            else:
                failed_motels.append(motel_name)

        print(f"성공한 모텔 수: {success_count}")
        if failed_motels:
            print("실패한 모텔:", failed_motels)

    except Exception as e:
        print(f"오류 발생: {e}")

if __name__ == "__main__":
    crawl_and_update_services()
