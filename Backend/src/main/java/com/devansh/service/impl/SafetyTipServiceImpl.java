package com.devansh.service.impl;

import com.devansh.mapper.SafetyTipMapper;
import com.devansh.model.DisasterZone;
import com.devansh.model.SafetyTip;
import com.devansh.repo.DisasterZoneRepository;
import com.devansh.repo.SafetyTipRepository;
import com.devansh.request.CreateSafetyTipRequest;
import com.devansh.response.SafetyTipDto;
import com.devansh.service.SafetyTipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SafetyTipServiceImpl implements SafetyTipService {

    private final SafetyTipRepository tipRepository;
    private final DisasterZoneRepository zoneRepository;
    private final SafetyTipMapper tipMapper;

    @Override
    public SafetyTipDto createSafetyTip(CreateSafetyTipRequest request) {
        SafetyTip tip = new SafetyTip();
        tip.setTitle(request.title());
        tip.setDescription(request.description());
        tip.setDisasterType(request.disasterType());

        if (request.disasterZoneId() != null) {
            DisasterZone zone = zoneRepository.findById(request.disasterZoneId())
                    .orElseThrow(() -> new RuntimeException("DisasterZone not found"));
            tip.setDisasterZone(zone);
        }

        SafetyTip saved = tipRepository.save(tip);
        return tipMapper.toDto(saved);
    }

    @Override
    public SafetyTipDto updateSafetyTip(Integer tipId, CreateSafetyTipRequest request) {
        SafetyTip tip = tipRepository.findById(tipId)
                .orElseThrow(() -> new RuntimeException("SafetyTip not found with id: " + tipId));

        tip.setTitle(request.title());
        tip.setDescription(request.description());
        tip.setDisasterType(request.disasterType());

        if (request.disasterZoneId() != null) {
            DisasterZone zone = zoneRepository.findById(request.disasterZoneId())
                    .orElseThrow(() -> new RuntimeException("DisasterZone not found with id: " + request.disasterZoneId()));
            tip.setDisasterZone(zone);
        } else {
            tip.setDisasterZone(null); // make it global
        }

        return tipMapper.toDto(tipRepository.save(tip));
    }

    @Override
    public void deleteSafetyTip(Integer tipId) {
        tipRepository.deleteById(tipId);
    }

    @Override
    public SafetyTipDto getSafetyTip(Integer tipId) {
        return tipRepository.findById(tipId)
                .map(tipMapper::toDto)
                .orElseThrow(() -> new RuntimeException("SafetyTip not found"));
    }

    @Override
    public List<SafetyTipDto> getTipsForZone(Integer zoneId) {
        DisasterZone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("DisasterZone not found"));
        List<SafetyTip> tips = tipRepository.findForZoneIncludingGlobal(zone, zone.getDisasterType());
        return tips.stream().map(tipMapper::toDto).toList();
    }

}
