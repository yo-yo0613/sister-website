package com.sister.sister_website.repository;

import com.sister.sister_website.entity.InstagramPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstagramRepository extends JpaRepository<InstagramPost, String> {
}