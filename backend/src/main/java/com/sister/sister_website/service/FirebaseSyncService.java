package com.sister.sister_website.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.sister.sister_website.entity.Ad;
import com.sister.sister_website.entity.Post;
import com.sister.sister_website.repository.AdRepository;
import com.sister.sister_website.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FirebaseSyncService {

    @Autowired
    private Firestore firestore;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private AdRepository adRepository; // 💡 注入新的 Repository

    public String syncPostsFromFirebase() {
        try {
            // 💡 A. 從 Firebase 抓取資料
            ApiFuture<QuerySnapshot> query = firestore.collection("posts").get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();

            int count = 0;
            for (QueryDocumentSnapshot doc : documents) {
                Post post = new Post();
                
                // 💡 B. 欄位映射：請確認與妳 Firebase 截圖中的欄位一致
                post.setId(doc.getId());
                post.setTitle(doc.getString("title"));
                post.setCategory(doc.getString("category"));
                
                // 處理 boolean 安全性
                Boolean adActive = doc.getBoolean("adActive");
                post.setAdActive(adActive != null ? adActive : false);
                
                // 處理數字轉型
                Long views = doc.getLong("views");
                post.setViews(views != null ? views.intValue() : 0);

                // 💡 C. 重點：這裡暫時直接轉 String，避開 ObjectMapper 衝突
                Object contentObj = doc.get("content");
                post.setContent(contentObj != null ? contentObj.toString() : "");

                // 處理時間戳記
                com.google.cloud.Timestamp firebaseTime = doc.getTimestamp("createdAt");
                if (firebaseTime != null) {
                    post.setCreatedAt(firebaseTime.toSqlTimestamp().toLocalDateTime());
                } else {
                    post.setCreatedAt(LocalDateTime.now());
                }

                // 💡 D. 寫入 PostgreSQL
                postRepository.save(post);
                count++;
            }
            return "同步成功！共同步 " + count + " 篇到 PostgreSQL。";
        } catch (Exception e) {
            // 💡 在 Terminal 印出詳細錯誤
            e.printStackTrace();
            return "同步失敗：" + e.getMessage();
        }
    }

    public String syncAdsFromFirebase() {
        try {
            // 從 Firebase 的 "ads" 集合抓取資料
            ApiFuture<QuerySnapshot> query = firestore.collection("ads").get();
            List<QueryDocumentSnapshot> documents = query.get().getDocuments();

            int count = 0;
            for (QueryDocumentSnapshot doc : documents) {
                Ad ad = new Ad();
                ad.setId(doc.getId());
                ad.setTitle(doc.getString("title"));
                ad.setLink(doc.getString("link"));
                ad.setImageUrl(doc.getString("imageUrl"));
                ad.setPosition(doc.getString("position"));
                
                Boolean isActive = doc.getBoolean("isActive");
                ad.setIsActive(isActive != null ? isActive : false);
                
                // 處理點擊數，若 Firebase 沒這欄位則預設 0
                Long clicks = doc.getLong("clicks");
                ad.setClicks(clicks != null ? clicks.intValue() : 0);

                adRepository.save(ad);
                count++;
            }
            return "廣告同步成功！共搬移 " + count + " 筆。";
        } catch (Exception e) {
            e.printStackTrace();
            return "廣告同步失敗：" + e.getMessage();
        }
    }
}