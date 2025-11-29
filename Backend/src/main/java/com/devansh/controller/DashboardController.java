package com.devansh.controller;

import com.devansh.response.DashboardSummary;
import com.devansh.response.SosRequestDto;
import com.devansh.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getDashboardSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }

    @GetMapping("/recent-sos")
    public ResponseEntity<List<SosRequestDto>> getRecentSos() {
        return ResponseEntity.ok(dashboardService.getRecentSosRequests());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestParam(defaultValue = "7") int days
    ) {
        return ResponseEntity.ok(dashboardService.getDisasterSosStats(days));
    }

}
