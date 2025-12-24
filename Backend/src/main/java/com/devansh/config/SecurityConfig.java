package com.devansh.config;

import com.devansh.model.enums.Role;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Cần import thêm dòng này
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;
    private final CustomCorsConfiguration corsConfiguration;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          AuthenticationProvider authenticationProvider,
                          LogoutHandler logoutHandler,
                          CustomCorsConfiguration corsConfiguration) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
        this.logoutHandler = logoutHandler;
        this.corsConfiguration = corsConfiguration;
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {

        http
                // 1. Tắt CSRF vì bạn đang sử dụng API Stateless (JWT)
                .csrf(CsrfConfigurer::disable)
                
                // 2. Kích hoạt CORS ngay từ đầu để nó sử dụng bean corsConfiguration đã tiêm vào
                .cors(c -> c.configurationSource(corsConfiguration))
                
                .authorizeHttpRequests(
                        authorize -> authorize
                                // 3. QUAN TRỌNG: Cho phép tất cả các yêu cầu OPTIONS (Preflight) từ trình duyệt
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                
                                // 4. Cho phép các API công khai phục vụ đăng ký/đăng nhập
                                .requestMatchers("/auth/**").permitAll()

                                .requestMatchers("/admin/**").hasRole(Role.ADMIN.name())

                                .anyRequest()
                                .authenticated()

                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(httpSecurityLogoutConfigurer ->
                        httpSecurityLogoutConfigurer.logoutUrl("/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler((request, response, authentication) ->
                                        SecurityContextHolder.clearContext()
                                ));

        return http.build();
    }
}