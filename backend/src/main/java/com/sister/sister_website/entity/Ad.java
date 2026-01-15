package com.sister.sister_website.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ads")
public class Ad {

    @Id
    private String id; // 對應 Firebase Document ID

    private String title;
    private String link;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    private String position; // 例如: index_middle, post_middle, sidebar

    @Column(name = "is_active")
    private Boolean isActive;

    private Integer clicks = 0; // 預設點擊數為 0

    public Ad() {}

    // --- Getters and Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Integer getClicks() { return clicks; }
    public void setClicks(Integer clicks) { this.clicks = clicks; }
}