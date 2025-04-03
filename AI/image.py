import os
import requests
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urljoin
import time

# MongoDB 연결
ATLAS_URI = "mongodb+srv://paikyo1:qwer1234@stayinfo.p2bcu.mongodb.net/?retryWrites=true&w=majority&appName=stayinfo"
client = MongoClient(ATLAS_URI, ssl=True, tls=True)
db = client['mydatabase']
collection = db['accommodations']

# 이미지 저장할 디렉토리
image_dir = "static/images"
if not os.path.exists(image_dir):
    os.makedirs(image_dir)

# Selenium WebDriver 설정
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# 여기어때에서 모든 이미지 크롤링
def scrape_images_from_hereo(url, motel_name):
    try:
        driver.get(url)
        # 페이지 로딩 대기
        time.sleep(5)

        # 모든 img 태그 찾기
        images = driver.find_elements(By.TAG_NAME, "img")

        img_files = []
        for i, img in enumerate(images):
            img_url = img.get_attribute('src')
            if img_url:
                # .jpg 형식만 다운로드
                if not img_url.lower().endswith('.jpg'):
                    continue
                
                # 상대 URL인 경우 절대 URL로 변환
                img_url = urljoin(url, img_url)
                
                # 이미지 파일 이름 설정
                img_filename = f"{motel_name.replace(' ', '_')}_{i+1}.jpg"
                img_path = os.path.join(image_dir, img_filename)

                try:
                    # 이미지 다운로드
                    img_data = requests.get(img_url).content
                    with open(img_path, 'wb') as f:
                        f.write(img_data)
                    print(f"이미지 다운로드 성공: {img_filename}")
                    img_files.append(img_filename)
                except Exception as e:
                    print(f"이미지 다운로드 실패: {e}")
        
        return img_files

    except Exception as e:
        print(f"이미지 크롤링 실패 ({motel_name}):", e)
        return []

# MongoDB에서 모든 모텔 데이터 가져오기
def crawl_and_download_images():
    try:
        # MongoDB에서 모텔 데이터 가져오기
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

            img_files = scrape_images_from_hereo(hereo_url, motel_name)

            if img_files:
                success_count += 1
            else:
                failed_motels.append(motel_name)

        print(f"성공한 모텔 수: {success_count}")
        if failed_motels:
            print("실패한 모텔:", failed_motels)

    except Exception as e:
        print(f"오류 발생: {e}")

# 메인 함수 실행
if __name__ == "__main__":
    crawl_and_download_images()

# 브라우저 종료
driver.quit()