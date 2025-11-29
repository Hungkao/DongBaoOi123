package com.devansh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FoodLoopApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodLoopApplication.class, args);
	}

}
