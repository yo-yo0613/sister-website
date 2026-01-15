# 💡 改用更穩定的 JDK 21，並使用 full OS 基礎 (debian/ubuntu) 以避免底層庫衝突
FROM eclipse-temurin:21-jdk

WORKDIR /app

# 複製 jar 檔
COPY target/*.jar app.jar

# 複製 Firebase 金鑰
COPY src/main/resources/serviceAccountKey.json serviceAccountKey.json

# 增加啟動參數以避開不必要的 Native 檢查
ENTRYPOINT ["java", "-Djdk.nativeProxy=false", "-jar", "app.jar"]