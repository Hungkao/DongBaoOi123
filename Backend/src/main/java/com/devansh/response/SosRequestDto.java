package com.devansh.response;

import com.devansh.model.enums.SosStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record SosRequestDto(
        Integer id,
        Integer user_id,
        String message,
        BigDecimal latitude,
        BigDecimal longitude,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        SosStatus sosStatus,
        DisasterZoneDto disasterZoneDto
) {

}
