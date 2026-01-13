import requests

# 根據你最後一張截圖，這是正確的 URL
url = "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_posts.php"

# 根據截圖 Body 標籤，參數名稱是 "username_or_url"
payload = {
    "username_or_url": "xun.g_foodie"
}

headers = {
    "content-type": "application/x-www-form-urlencoded",
    "x-rapidapi-key": "afc5e7fb6cmsh9528485928081e3p179cb3jsne6ec208cc19c",
    "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com"
}

try:
    print(f"🚀 正在向 {url} 發送 POST 請求...")
    response = requests.post(url, data=payload, headers=headers)
    
    print(f"狀態碼: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ 成功連線！回傳資料結構如下：")
        # 印出前 1000 個字元供分析
        print(str(data)[:1000]) 
    else:
        print(f"❌ 請求失敗：{response.text}")

except Exception as e:
    print(f"💥 發生異常: {e}")