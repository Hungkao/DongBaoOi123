package com.devansh.two_factor_auth;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class OtpCacheBean {

    @Value("${otp.cache.expiration.minutes:5}")
    private Integer expirationMinutes;

    @Bean
    public LoadingCache<String, String> loadingCache() {
        return CacheBuilder.newBuilder()
                .expireAfterWrite(expirationMinutes, TimeUnit.MINUTES)
                .build(new CacheLoader<>() {
                    @Override
                    public String load(String key) {
                        return "";
                    }
                });
    }
}
