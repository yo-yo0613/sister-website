from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import uuid
import time
import re

app = FastAPI(title="IG Scraper API via RapidAPI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGE_DIR = "static/images"
os.makedirs(IMAGE_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

RAPID_API_KEY = "afc5e7fb6cmsh9528485928081e3p179cb3jsne6ec208cc19c"
RAPID_API_HOST = "instagram-scraper-stable-api.p.rapidapi.com"
API_URL = "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_posts.php"

@app.get("/api/crawl_and_sort/{username}")
async def crawl_and_sort(username: str):
    try:
        payload = {"username_or_url": username}
        headers = {
            "content-type": "application/x-www-form-urlencoded",
            "x-rapidapi-key": RAPID_API_KEY,
            "x-rapidapi-host": RAPID_API_HOST
        }
        response = requests.post(API_URL, data=payload, headers=headers)
        res_data = response.json()
        #print(res_data)

        # --- 除錯診斷點 ---
        print(f"DEBUG: API 回傳鍵值: {res_data.keys()}")
        
        # 自動偵測資料位置
        items = res_data.get("posts") or res_data.get("data", {}).get("items") or []
        
        if not items:
            print("⚠️ 警告：API 回傳了成功狀態，但裡面沒有貼文資料。可能是帳號設為私密或額度限制。")
            # 這裡可以印出 res_data 看看裡面到底是什麼
            print(f"DEBUG 內容: {str(res_data)[:200]}")
        
        # 根據你截圖的 JSON 結構提取
        items = res_data.get("posts", [])
        categorized_data = {"newTaipei": [], "taipei": [], "taichung": [], "other": []}

        for count, item_wrapper in enumerate(items):
            # 有些 API node 在第一層，有些在 wrapper 裡
            item = item_wrapper.get("node", item_wrapper) 
            
            post_id = item.get("code") or item.get("shortcode")
            caption_obj = item.get("caption") or {}
            full_text = caption_obj.get("text", "") if isinstance(caption_obj, dict) else str(caption_obj)
            
            # 💡 萬用圖片搜尋：嘗試所有可能的圖片欄位
            image_url = (
                item.get("display_url") or 
                item.get("image_versions2", {}).get("candidates", [{}])[0].get("url") or
                item.get("image_versions", {}).get("items", [{}])[0].get("url") or
                item.get("thumbnail_src") or
                item.get("display_src")
            )

            # 如果還是抓不到，檢查是不是影片，抓影片的封面圖
            if not image_url and "video_versions" in item:
                image_url = item.get("image_versions", {}).get("items", [{}])[0].get("url")

            print(f"正在處理第 {count+1} 則貼文 [ID: {post_id}] | 圖片抓取: {'✅ 成功' if image_url else '❌ 失敗'}")

            final_image = ""
            if image_url:
                img_filename = f"{uuid.uuid4().hex}.jpg"
                target_path = os.path.join(IMAGE_DIR, img_filename)
                try:
                    img_headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                        "Referer": "https://www.instagram.com/"
                    }
                    img_res = requests.get(image_url, headers=img_headers, timeout=15)
                    if img_res.status_code == 200:
                        with open(target_path, 'wb') as f:
                            f.write(img_res.content)
                        # 使用 localhost 確保 React 讀得到
                        final_image = f"http://localhost:8000/static/images/{img_filename}"
                except Exception as e:
                    print(f"   ∟ 圖片存檔失敗: {e}")
            
            post_item = {
                "id": post_id,
                "title": full_text.split('\n')[0] if full_text else "無標題",
                "image": final_image,
                "date": time.strftime('%Y-%m-%d'),
                "tags": re.findall(r"#(\w+)", full_text)
            }

            # 分類邏輯 (判斷文字或標籤)
            search_str = full_text.lower()
            if "新北" in search_str:
                categorized_data["newTaipei"].append(post_item)
            elif "台北" in search_str:
                categorized_data["taipei"].append(post_item)
            elif "台中" in search_str:
                categorized_data["taichung"].append(post_item)
            else:
                categorized_data["other"].append(post_item)
                
        return {"status": "success", "data": categorized_data}
    except Exception as e:
        print(f"🔥 Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)