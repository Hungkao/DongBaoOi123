package com.devansh.controller;

import com.devansh.exception.TokenInvalidException;
import com.devansh.exception.UserException;
import com.devansh.model.User;
import com.devansh.model.enums.SosStatus;
import com.devansh.request.CreateSosRequest;
import com.devansh.response.MessageResponse;
import com.devansh.response.SosRequestDto;
import com.devansh.service.SosRequestService;
import com.devansh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SosRequestController {

    private final SosRequestService sosRequestService;
    private final UserService userService;

    @PostMapping("/sos")
    public ResponseEntity<SosRequestDto> createSosRequest(@RequestBody CreateSosRequest createSosRequest,
                                           @RequestHeader("Authorization") String token) throws UserException, TokenInvalidException {
        User user = userService.findByJwtToken(token);
        return new ResponseEntity<>(sosRequestService.createSosRequest(createSosRequest, user), HttpStatus.CREATED);
    }

    @PutMapping("/sos/{sosId}")
    public ResponseEntity<SosRequestDto> updatePendingRequests(@RequestBody CreateSosRequest createSosRequest,
                                                               @PathVariable Integer sosId,
                                                               @RequestHeader("Authorization") String token) throws UserException, TokenInvalidException {
        User user = userService.findByJwtToken(token);
        return new ResponseEntity<>(sosRequestService.updatePendingSosRequest(createSosRequest, sosId, user), HttpStatus.ACCEPTED);
    }

    @GetMapping("/sos")
    public ResponseEntity<List<SosRequestDto>> getSosRequests(@RequestHeader("Authorization") String token) throws UserException, TokenInvalidException {
        User user = userService.findByJwtToken(token);
        return ResponseEntity.ok(sosRequestService.getAllSosRequests(user));
    }

    @DeleteMapping("/sos/{sosId}")
    public ResponseEntity<MessageResponse> deleteSosRequest(@PathVariable Integer sosId,
                                                            @RequestHeader("Authorization") String token) throws UserException, TokenInvalidException {
        User user = userService.findByJwtToken(token);
        return ResponseEntity.ok(sosRequestService.deletePendingSosRequest(sosId, user));
    }

    // admin only

    @GetMapping("/sos/all")
    public ResponseEntity<List<SosRequestDto>> getAllSosRequests(@RequestParam(required = false) SosStatus status,
                                                                 @RequestParam(required = false) Integer zoneId) throws UserException {
        return ResponseEntity.ok(sosRequestService.getFilteredRequests(status, zoneId));
    }

    @PutMapping("/admin/sos/{sosId}/status")
    public ResponseEntity<SosRequestDto> updateSosStatus(@PathVariable Integer sosId, @RequestParam SosStatus status) {
        return ResponseEntity.ok(sosRequestService.updateSosStatus(sosId, status));
    }

}
