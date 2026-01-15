package com.sister.sister_website.repository;

import com.sister.sister_website.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
    // 繼承 JpaRepository 後，妳就自動擁有 CRUD（增刪查改）功能了！
}