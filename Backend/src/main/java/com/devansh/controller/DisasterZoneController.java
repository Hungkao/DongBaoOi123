package com.devansh.controller;

import com.devansh.request.CreateDisasterZoneRequest;
import com.devansh.response.DisasterZoneDto;
import com.devansh.service.DisasterZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DisasterZoneController {

    private final DisasterZoneService disasterZoneService;

    @PostMapping("/admin/zones")
    public ResponseEntity<DisasterZoneDto> createDisasterZone(@RequestBody CreateDisasterZoneRequest createDisasterZoneRequest) throws Exception {
        return new ResponseEntity<>(disasterZoneService.createDisasterZone(createDisasterZoneRequest), HttpStatus.CREATED);
    }

    @PutMapping("/admin/zones/{zoneId}")
    public ResponseEntity<DisasterZoneDto> updateDisasterZone(@RequestBody CreateDisasterZoneRequest createDisasterZoneRequest,
                                                              @PathVariable Integer zoneId) throws Exception {
        return ResponseEntity.ok(disasterZoneService.updateDisasterZone(createDisasterZoneRequest, zoneId));
    }

    @GetMapping("/zones")
    public ResponseEntity<List<DisasterZoneDto>> getAllDisasterZones() throws Exception {
        return ResponseEntity.ok(disasterZoneService.getAllDisasterZones());
    }

    @GetMapping("/zones/{zoneId}")
    public ResponseEntity<DisasterZoneDto> getDisasterZone(@PathVariable Integer zoneId) throws Exception {
        return ResponseEntity.ok(disasterZoneService.getDisasterZone(zoneId));
    }

    @DeleteMapping("/admin/zones/{zoneId}")
    public ResponseEntity<Void> deleteDisasterZone(@PathVariable Integer zoneId) throws Exception {
        disasterZoneService.deleteDisasterZone(zoneId);
        return ResponseEntity.noContent().build();
    }
}
