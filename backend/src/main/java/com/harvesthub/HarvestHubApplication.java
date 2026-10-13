package com.harvesthub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HarvestHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(HarvestHubApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  HarvestHub Smart Agriculture REST API Started   ");
        System.out.println("  URL: http://localhost:8080/                      ");
        System.out.println("==================================================");
    }
}
