package com.devansh.service;

import com.devansh.request.CreateSafetyTipRequest;
import com.devansh.response.SafetyTipDto;

import java.util.List;

public interface SafetyTipService {

    SafetyTipDto createSafetyTip(CreateSafetyTipRequest request);
    SafetyTipDto updateSafetyTip(Integer tipId, CreateSafetyTipRequest request);
    void deleteSafetyTip(Integer tipId);
    SafetyTipDto getSafetyTip(Integer tipId);
    List<SafetyTipDto> getTipsForZone(Integer zoneId); // returns zone-specific + global tips

}
