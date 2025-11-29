package com.devansh.mapper;

import com.devansh.model.SosRequest;
import com.devansh.response.DisasterZoneDto;
import com.devansh.response.SosRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SosRequestMapper {

    private final DisasterZoneMapper disasterZoneMapper;

    public SosRequestDto requestToSosRequestDto(SosRequest sosRequest) {
        DisasterZoneDto disasterZoneDto = null;

        if (sosRequest.getDisasterZone() != null) {
            disasterZoneDto = disasterZoneMapper.toDisasterZoneDto(sosRequest.getDisasterZone());
        }

        return SosRequestDto
                .builder()
                .id(sosRequest.getId())
                .user_id(sosRequest.getUser().getId())
                .sosStatus(sosRequest.getStatus())
                .createdAt(sosRequest.getCreatedAt())
                .updatedAt(sosRequest.getUpdatedAt())
                .latitude(sosRequest.getLatitude())
                .longitude(sosRequest.getLongitude())
                .message(sosRequest.getMessage())
                .disasterZoneDto(disasterZoneDto)
                .build();
    }

}
