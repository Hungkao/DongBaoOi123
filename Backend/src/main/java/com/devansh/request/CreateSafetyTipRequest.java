package com.devansh.request;

import com.devansh.model.enums.DisasterType;

public record CreateSafetyTipRequest(
        String title,
        String description,
        DisasterType disasterType,
        Integer disasterZoneId // optional, null if global tip
) {
}
