package com.devansh.response;

import com.devansh.model.enums.DisasterType;
import lombok.Builder;

@Builder
public record SafetyTipDto(
        Integer id,
        String title,
        String description,
        DisasterType disasterType,
        DisasterZoneDto disasterZoneDto // null if global tip
) {
}
