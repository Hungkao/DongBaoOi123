package com.devansh.response;

public record DashboardSummary(
        long totalZones,
        long activeDisasters,
        long criticalZones,
        long pendingSos
) {
}
