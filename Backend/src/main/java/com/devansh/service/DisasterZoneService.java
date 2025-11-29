package com.devansh.service;

import com.devansh.model.DisasterZone;
import com.devansh.model.enums.DisasterType;
import com.devansh.request.CreateDisasterZoneRequest;
import com.devansh.response.DisasterZoneDto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DisasterZoneService {
    Optional<DisasterZone> findMatchingZone(BigDecimal lat, BigDecimal lon, DisasterType disasterType);
    DisasterZoneDto createDisasterZone(CreateDisasterZoneRequest req);
    DisasterZoneDto updateDisasterZone(CreateDisasterZoneRequest req, Integer disasterZoneId);
    void deleteDisasterZone(Integer disasterZoneId);
    List<DisasterZoneDto> getAllDisasterZones();
    DisasterZoneDto getDisasterZone(Integer disasterZoneId);

}
