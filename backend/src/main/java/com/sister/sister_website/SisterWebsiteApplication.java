package com.sister.sister_website;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;

@SpringBootApplication
@EntityScan("com.sister.sister_website.entity") // 💡 強制指定掃描路徑
public class SisterWebsiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(SisterWebsiteApplication.class, args);
	}

}
