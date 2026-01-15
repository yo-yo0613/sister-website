package com.sister.sister_website.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sister.sister_website.entity.InstagramPost;
import com.sister.sister_website.repository.InstagramRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class InstagramCrawlerService {

    @Autowired
    private InstagramRepository instagramRepository;

    // 移除原本的 @Autowired ObjectMapper
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 每 6 小時自動執行一次
    @Scheduled(fixedRate = 21600000)
    public void crawlSisterInstagram() {
        String targetUrl = "https://www.instagram.com/xun.g_foodie/"; 
        System.out.println("🚀 開始爬取 Instagram: " + targetUrl);

        try {
            Document doc = Jsoup.connect(targetUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .get();

            String html = doc.html();
            
            // 💡 修改點：不論爬蟲結果如何，都存入一筆「測試資料」驗證連線
            System.out.println("⚠️ 正在存入一筆測試資料驗證資料庫...");
            InstagramPost testPost = new InstagramPost();
            testPost.setId("TEST_" + System.currentTimeMillis());
            testPost.setImageUrl("https://images.unsplash.com/photo-1518770660439-4636190af475");
            testPost.setCaption("連線測試：資料庫存取正常！");
            testPost.setCreatedAt(LocalDateTime.now());
            
            instagramRepository.save(testPost); // 💡 執行存檔
            System.out.println("✅ 測試資料已送往資料庫！");

            if (html.contains("display_url")) {
                System.out.println("✅ 偵測到真實貼文區塊...");
                // 真實解析邏輯...
            } else {
                System.err.println("❌ IG 暫時阻擋真實抓取，僅存入測試資料。");
            }
            
        } catch (Exception e) {
            System.err.println("❌ 發生異常: " + e.getMessage());
        }
    }
}