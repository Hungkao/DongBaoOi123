package com.devansh.mapper;

import com.devansh.model.SafetyTip;
import com.devansh.response.DisasterZoneDto;
import com.devansh.response.SafetyTipDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SafetyTipMapper {

    private final DisasterZoneMapper disasterZoneMapper;

    public SafetyTipDto toDto(SafetyTip saved) {
        DisasterZoneDto disasterZoneDto = null;

        if (saved.getDisasterZone() != null) {
            disasterZoneDto = disasterZoneMapper.toDisasterZoneDto(saved.getDisasterZone());
        }
        SafetyTipDto safetyTipDto =  SafetyTipDto.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .disasterType(saved.getDisasterType())
                .description(saved.getDescription())
                .disasterZoneDto(disasterZoneDto)
                .build();
        return safetyTipDto;
    }
}
