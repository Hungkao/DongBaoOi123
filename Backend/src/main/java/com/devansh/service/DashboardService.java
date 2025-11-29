package com.devansh.service;

import com.devansh.response.DashboardSummary;
import com.devansh.response.SosRequestDto;

import java.util.List;
import java.util.Map;

public interface DashboardService {
    DashboardSummary getDashboardSummary();
    List<SosRequestDto> getRecentSosRequests();
    Map<String, Object> getDisasterSosStats(int days);

}
