# 使用 Python 3.14 預覽版映像檔
FROM python:3.14-rc-slim

WORKDIR /app

# 安裝必要的系統套件（處理圖片處理庫可能需要的依賴）
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
RUN mkdir -p static/images

EXPOSE 8000

# 使用 uvicorn 啟動 FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]