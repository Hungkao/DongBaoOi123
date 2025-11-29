package com.devansh.response;

import com.devansh.model.enums.DangerLevel;
import com.devansh.model.enums.DisasterType;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record DisasterZoneDto(
        Integer id,
        String name,
        DisasterType disasterType,
        DangerLevel dangerLevel,
        BigDecimal centerLatitude,
        BigDecimal centerLongitude,
        double radius
) {
}
