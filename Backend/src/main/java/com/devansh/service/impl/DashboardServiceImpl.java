package com.devansh.service.impl;

import com.devansh.mapper.SosRequestMapper;
import com.devansh.model.SosRequest;
import com.devansh.model.enums.DangerLevel;
import com.devansh.model.enums.DisasterType;
import com.devansh.model.enums.SosStatus;
import com.devansh.repo.DisasterZoneRepository;
import com.devansh.repo.SosRequestRepository;
import com.devansh.response.DashboardSummary;
import com.devansh.response.SosRequestDto;
import com.devansh.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DisasterZoneRepository disasterZoneRepository;
    private final SosRequestRepository sosRequestRepository;
    private final SosRequestMapper sosRequestMapper;

    @Override
    public DashboardSummary getDashboardSummary() {
        long totalZones = DisasterType.values().length;
        long activeDisasters = disasterZoneRepository.countByIsActiveTrueOrIsActiveIsNull();
        long criticalZones = disasterZoneRepository.countByDangerLevel(DangerLevel.HIGH);
        long pendingSosRequests = sosRequestRepository.countByStatus(SosStatus.PENDING);

        return new DashboardSummary(
                totalZones,
                activeDisasters,
                criticalZones,
                pendingSosRequests
        );
    }

    @Override
    public List<SosRequestDto> getRecentSosRequests() {
        List<SosRequest> sosRequests = sosRequestRepository
                .findTop11ByOrderByCreatedAtDesc();
        return sosRequests.stream()
                .map(sosRequestMapper::requestToSosRequestDto)
                .toList();
    }

    @Override
    public Map<String, Object> getDisasterSosStats(int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        // Prepare lists to send
        List<String> dates = new ArrayList<>();
        List<Long> activeDisasters = new ArrayList<>();
        List<Long> sosCounts = new ArrayList<>();

        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            dates.add(date.toString());

            // counting sos created on that date
            Long sosCount = sosRequestRepository.countByCreatedAtBetween(
                    date.atStartOfDay(),
                    date.plusDays(1).atStartOfDay()
            );
            sosCounts.add(sosCount);

            // count zones created/active that day
            Long disasterCount = disasterZoneRepository.countActiveOrNullCreatedAtBetween(
                    date.atStartOfDay(),
                    date.plusDays(1).atStartOfDay()
            );
            activeDisasters.add(disasterCount);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("dates", dates);
        result.put("activeDisasters", activeDisasters);
        result.put("sosCounts", sosCounts);

        return result;
    }
}
















