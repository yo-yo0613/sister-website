package com.sister.sister_website.controller;

import com.sister.sister_website.entity.Post;
import com.sister.sister_website.repository.PostRepository;
import com.sister.sister_website.service.FirebaseSyncService;
import com.sister.sister_website.service.InstagramCrawlerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FirebaseSyncService firebaseSyncService; // 💡 注入同步服務

    @GetMapping("/test-db")
    public String testDb() {
        long count = postRepository.count();
        return "✨ 資料庫連線成功！目前 PostgreSQL 文章總數為: " + count;
    }

    // 💡 新增同步接口
    @GetMapping("/sync-firebase")
    public String syncFirebase() {
        return firebaseSyncService.syncPostsFromFirebase();
    }
    
    @GetMapping("/sync-ads")
    public String syncAds() {
        return firebaseSyncService.syncAdsFromFirebase();
    }

    @Autowired
    private InstagramCrawlerService instagramCrawlerService;

    @GetMapping("/crawl-ig")
    public String startCrawl() {
        instagramCrawlerService.crawlSisterInstagram();
        return "爬蟲任務已啟動，請查看日誌或資料庫。";
    }
    
}