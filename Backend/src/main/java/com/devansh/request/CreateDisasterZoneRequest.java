package com.devansh.request;

import com.devansh.model.enums.DangerLevel;
import com.devansh.model.enums.DisasterType;

import java.math.BigDecimal;

public record CreateDisasterZoneRequest(
        String name,
        DisasterType disasterType,
        DangerLevel dangerLevel,
        BigDecimal centerLatitude,
        BigDecimal centerLongitude,
        double radius
) {
}
