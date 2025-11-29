package com.devansh.mapper;

import com.devansh.model.DisasterZone;
import com.devansh.response.DisasterZoneDto;
import org.springframework.stereotype.Service;

@Service
public class DisasterZoneMapper {

    public DisasterZoneDto toDisasterZoneDto(DisasterZone savedZone) {
        return DisasterZoneDto.builder()
                .id(savedZone.getId())
                .name(savedZone.getName())
                .disasterType(savedZone.getDisasterType())
                .centerLatitude(savedZone.getCenterLatitude())
                .centerLongitude(savedZone.getCenterLongitude())
                .dangerLevel(savedZone.getDangerLevel())
                .radius(savedZone.getRadius())
                .build();
    }
}
