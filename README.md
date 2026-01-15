# Sister Website

一個現代化的旅行資訊網站，提供台灣各大城市的旅遊指南、管理員內容管理系統。

## ✨ 功能特點

- 🏙️ **城市指南**：台北、新北、台中等地點的詳細旅遊資訊
- 📝 **內容管理**：管理員面板支持文章編輯和發布
- 🖼️ **相簿管理**：圖片上傳和管理功能
- 📱 **響應式設計**：支援桌面和移動設備
- 🔐 **用戶認證**：基於 Firebase 的身份驗證
- 🌐 **多語言支持**：繁體中文介面
- ⚡ **高性能**：使用現代前端技術棧

## 🛠 技術棧

### 前端 (sister-website/)
- **框架**: React 18 + TypeScript
- **建構工具**: Vite
- **樣式**: Tailwind CSS + PostCSS
- **動畫**: Framer Motion
- **路由**: React Router 6
- **狀態管理**: React Hooks
- **部署**: Firebase Hosting

### 後端 (backend/)
- **框架**: Spring Boot 3
- **語言**: Java 17
- **數據庫**: PostgreSQL / Firebase Firestore
- **認證**: Firebase Authentication
- **容器化**: Docker

### Python API (python-api/)
- **框架**: Flask / FastAPI
- **功能**: 數據處理和外部 API 整合

### 基礎設施
- **容器化**: Docker & Docker Compose
- **編排**: Kubernetes
- **CI/CD**: GitHub Actions (計劃中)

## 📁 項目結構

```
Sister-website/
├── backend/                 # Spring Boot 後端
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── docker-compose.yml
├── python-api/              # Python API 服務
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── test_api.py
├── sister-website/          # React 前端
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── k8s/                     # Kubernetes 配置
│   ├── backend-deployment.yaml
│   └── sister-all-in-one.yaml
├── static/                  # 靜態資源
└── sessions/                # 會話數據
```

## 🚀 快速開始

### 環境需求

- Node.js 18+
- Java 17+
- Python 3.8+
- Docker & Docker Compose
- kubectl (用於 Kubernetes 部署)

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd Sister-website
   ```

2. **前端設置**
   ```bash
   cd sister-website
   npm install
   npm run dev
   ```

3. **後端設置**
   ```bash
   cd ../backend
   # 配置 application.properties 中的數據庫連接
   ./mvnw spring-boot:run
   ```

4. **Python API 設置**
   ```bash
   cd ../python-api
   pip install -r requirements.txt
   python main.py
   ```

### 使用 Docker 運行

```bash
# 啟動所有服務
docker-compose up -d

# 查看服務狀態
docker-compose ps
```

## 🔧 配置

### Firebase 配置

1. 在 Firebase Console 創建專案
2. 啟用 Authentication 和 Firestore
3. 下載服務帳戶金鑰並放置在 `backend/src/main/resources/serviceAccountKey.json`
4. 更新前端的 Firebase 配置 (`sister-website/src/firebase.ts`)

### 環境變數

創建 `.env` 文件在各個服務目錄中：

**後端 (.env)**
```
SPRING_PROFILES_ACTIVE=dev
DATABASE_URL=jdbc:postgresql://localhost:5432/sister_db
FIREBASE_PROJECT_ID=your-project-id
```

**前端 (.env)**
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

## 📦 部署

### 本地開發
```bash
# 前端
cd sister-website && npm run build

# 後端
cd backend && ./mvnw clean package

# 部署到 Kubernetes
kubectl apply -f k8s/
```

### 生產環境

專案支援一鍵部署到 Kubernetes：

```bash
kubectl apply -f k8s/sister-all-in-one.yaml
```

## 🤝 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 此專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 許可證

此專案採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 📞 聯絡資訊

如有問題或建議，請透過以下方式聯絡：

- 電子郵件: chengyouli37@gmail.com
- 專案議題: [GitHub Issues](https://github.com/your-username/Sister-website/issues)

---

**注意**: 此專案仍在開發中，歡迎提供反饋和貢獻！