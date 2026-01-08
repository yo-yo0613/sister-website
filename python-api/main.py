from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import instaloader
import os
import uuid

app = FastAPI(title="IG Scraper API (Python 3.14)")

# --- 1. 跨域設定 (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. 目錄設定 ---
IMAGE_DIR = "static/images"
SESSION_DIR = "sessions" # 存放登入資訊
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(SESSION_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- 3. Instaloader 初始化與登入 ---
L = instaloader.Instaloader(
    dirname_pattern=IMAGE_DIR, # 讓下載路徑固定
    download_video_thumbnails=False,
    save_metadata=False,
    post_metadata_txt_pattern=""
)

IG_USERNAME = "你的帳號" # 替換為你的 IG 帳號
IG_PASSWORD = "你的密碼" # 替換為你的 IG 密碼

def login_ig():
    session_file = os.path.join(SESSION_DIR, f"session-{IG_USERNAME}")
    try:
        # 嘗試讀取舊有的 Session
        L.load_session_from_file(IG_USERNAME, filename=session_file)
        print("✅ 成功從檔案讀取 Session")
    except FileNotFoundError:
        # 若無檔案則重新登入
        print("🔑 正在嘗試重新登入 Instagram...")
        try:
            L.login(IG_USERNAME, IG_PASSWORD)
            L.save_session_to_file(filename=session_file)
            print("💾 登入成功並已儲存 Session 檔案")
        except Exception as e:
            print(f"❌ 登入失敗: {e}")

# 啟動時執行登入
login_ig()

@app.get("/api/crawl/{username}")
async def crawl_ig(username: str, limit: int = 5):
    try:
        profile = instaloader.Profile.from_username(L.context, username)
        posts_data = []
        
        # 遍歷貼文
        for count, post in enumerate(profile.get_posts()):
            if count >= limit:
                break
            
            # 建立唯一檔名
            img_id = uuid.uuid4().hex
            img_filename = f"{username}_{img_id}.jpg"
            target_path = os.path.join(IMAGE_DIR, img_filename)
            
            # 下載圖片
            # 注意：Instaloader 會下載到一個資料夾，我們手動搬運或直接抓 URL
            # 為了簡單起見，我們直接回傳 IG 原始 URL (如果只是暫時顯示)
            # 或使用 L.download_pic 下載
            L.download_pic(target_path, post.url, post.date_utc)
            
            posts_data.append({
                "post_id": post.shortcode,
                "caption": post.caption,
                "local_image_url": f"http://localhost:8000/static/images/{img_filename}",
                "hashtags": post.hashtags,
                "likes": post.likes,
                "timestamp": post.date_utc.isoformat()
            })
            
        return {"status": "success", "data": posts_data}

    except Exception as e:
        # 如果遇到 401 錯誤，嘗試重新登入一次
        if "401" in str(e):
            login_ig()
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)