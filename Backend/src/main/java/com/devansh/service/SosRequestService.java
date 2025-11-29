package com.devansh.service;

import com.devansh.model.User;
import com.devansh.model.enums.SosStatus;
import com.devansh.request.CreateSosRequest;
import com.devansh.response.MessageResponse;
import com.devansh.response.SosRequestDto;

import java.util.List;

public interface SosRequestService {

    SosRequestDto createSosRequest(CreateSosRequest createSosRequest, User user);
    SosRequestDto updatePendingSosRequest(CreateSosRequest createSosRequest, Integer sosRequestId, User user);
    List<SosRequestDto> getAllSosRequests(User user);
    MessageResponse deletePendingSosRequest(Integer sosRequestId, User user);

    // admin only
    List<SosRequestDto> getFilteredRequests(SosStatus sosStatus, Integer zoneId);
    SosRequestDto updateSosStatus(Integer sosRequestId, SosStatus status);
}
