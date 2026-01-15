package com.sister.sister_website.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    private String id; // 對應 Firebase Document ID

    private String title;
    private String category;
    
    @Column(name = "ad_active")
    private Boolean adActive; // 廣告開關狀態

    private Integer views;

    // 儲存 EditorJS 的內容，暫時用 TEXT 避開複雜映射
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // JPA 必要的無參數建構子
    public Post() {}

    // --- Getters and Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getAdActive() { return adActive; }
    public void setAdActive(Boolean adActive) { this.adActive = adActive; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}