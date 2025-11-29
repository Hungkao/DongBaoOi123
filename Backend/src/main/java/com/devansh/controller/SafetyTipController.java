package com.devansh.controller;

import com.devansh.request.CreateSafetyTipRequest;
import com.devansh.response.SafetyTipDto;
import com.devansh.service.SafetyTipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SafetyTipController {

    private final SafetyTipService safetyTipService;

    @PostMapping("/admin/safetyTip")
    public ResponseEntity<SafetyTipDto> createTip(@RequestBody CreateSafetyTipRequest request) {
        return new ResponseEntity<>(safetyTipService.createSafetyTip(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/safetyTip/{tipId}")
    public ResponseEntity<SafetyTipDto> updateTip(@PathVariable Integer tipId,
                                                  @RequestBody CreateSafetyTipRequest request) {
        return ResponseEntity.ok(safetyTipService.updateSafetyTip(tipId, request));
    }

    @DeleteMapping("/admin/safetyTip/{tipId}")
    public ResponseEntity<Void> deleteTip(@PathVariable Integer tipId) {
        safetyTipService.deleteSafetyTip(tipId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/safetyTip/{tipId}")
    public ResponseEntity<SafetyTipDto> getTip(@PathVariable Integer tipId) {
        return ResponseEntity.ok(safetyTipService.getSafetyTip(tipId));
    }

    // fetch all relevant tips for a zone (includes global tips for that disaster type)
    @GetMapping("/safetyTip/zone/{zoneId}")
    public ResponseEntity<List<SafetyTipDto>> getTipsForZone(@PathVariable Integer zoneId) {
        return ResponseEntity.ok(safetyTipService.getTipsForZone(zoneId));
    }


}
