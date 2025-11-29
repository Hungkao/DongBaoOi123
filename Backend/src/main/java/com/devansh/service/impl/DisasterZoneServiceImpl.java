package com.devansh.service.impl;

import com.devansh.exception.DisasterZoneException;
import com.devansh.mapper.DisasterZoneMapper;
import com.devansh.model.DisasterZone;
import com.devansh.model.SosRequest;
import com.devansh.model.enums.DisasterType;
import com.devansh.repo.DisasterZoneRepository;
import com.devansh.repo.SosRequestRepository;
import com.devansh.request.CreateDisasterZoneRequest;
import com.devansh.response.DisasterZoneDto;
import com.devansh.service.DisasterZoneService;
import com.devansh.service.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DisasterZoneServiceImpl implements DisasterZoneService {

    private final DisasterZoneRepository disasterZoneRepository;
    private final DisasterZoneMapper disasterZoneMapper;
    private final SosRequestRepository sosRepository;

    @Override
    public Optional<DisasterZone> findMatchingZone(BigDecimal lat, BigDecimal lon, DisasterType disasterType) {
        List<DisasterZone> zones = disasterZoneRepository.findByDisasterType(disasterType);

        return zones.stream()
                .filter(zone -> GeoUtils.isInsideZone(lat, lon, zone))
                .findFirst();
    }

    @Override
    public DisasterZoneDto createDisasterZone(CreateDisasterZoneRequest req) {
        DisasterZone disasterZone = new DisasterZone();
        disasterZone.setName(req.name());
        disasterZone.setDisasterType(req.disasterType());
        disasterZone.setDangerLevel(req.dangerLevel());
        disasterZone.setCenterLatitude(req.centerLatitude());
        disasterZone.setCenterLongitude(req.centerLongitude());
        disasterZone.setRadius(req.radius());

        DisasterZone savedZone = disasterZoneRepository.save(disasterZone);

        return disasterZoneMapper.toDisasterZoneDto(savedZone);
    }

    @Override
    public DisasterZoneDto updateDisasterZone(CreateDisasterZoneRequest req, Integer disasterId) {
        DisasterZone zone = disasterZoneRepository.findById(disasterId)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        // Update zone fields
        zone.setName(req.name());
        zone.setDisasterType(req.disasterType());
        zone.setCenterLatitude(req.centerLatitude());
        zone.setCenterLongitude(req.centerLongitude());
        zone.setRadius(req.radius()); // in kilometers
        zone.setDangerLevel(req.dangerLevel());

        DisasterZone updatedZone = disasterZoneRepository.save(zone);

        // Step 1: fetch all SOS requests for this disaster type (narrow scope)
        List<SosRequest> sosRequests = sosRepository.findByDisasterType(req.disasterType());

        // Step 2: re-attach SOS to this zone if inside new boundary
        for (SosRequest sos : sosRequests) {
            if (GeoUtils.isInsideZone(sos.getLatitude(), sos.getLongitude(), updatedZone)) {
                sos.setDisasterZone(updatedZone);
                sosRepository.save(sos);
            } else if (sos.getDisasterZone() != null
                    && sos.getDisasterZone().getId().equals(updatedZone.getId())) {
                // If SOS was linked before but no longer inside, detach it
                sos.setDisasterZone(null);
                sosRepository.save(sos);
            }
        }

        return disasterZoneMapper.toDisasterZoneDto(updatedZone);
    }

    @Override
    public void deleteDisasterZone(Integer disasterZoneId) {
        findByDisasterZoneId(disasterZoneId);
        disasterZoneRepository.deleteById(disasterZoneId);
    }

    @Override
    public List<DisasterZoneDto> getAllDisasterZones() {
        return disasterZoneRepository.findAll().stream()
                .map(disasterZoneMapper::toDisasterZoneDto)
                .toList();
    }

    @Override
    public DisasterZoneDto getDisasterZone(Integer disasterZoneId) {
        DisasterZone savedZone = findByDisasterZoneId(disasterZoneId);
        return disasterZoneMapper.toDisasterZoneDto(savedZone);
    }

    private DisasterZone findByDisasterZoneId(Integer disasterZoneId) {
        return disasterZoneRepository.findById(disasterZoneId)
                .orElseThrow(() -> new DisasterZoneException("Disaster zone not found with id: " + disasterZoneId));
    }
}
