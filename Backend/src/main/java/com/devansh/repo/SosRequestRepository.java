package com.devansh.repo;

import com.devansh.model.SosRequest;
import com.devansh.model.enums.DisasterType;
import com.devansh.model.enums.SosStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SosRequestRepository extends JpaRepository<SosRequest, Integer> {
    List<SosRequest> findByUserId(Integer id);

    List<SosRequest> findByDisasterZoneIdAndStatus(Integer zoneId, SosStatus status);

    List<SosRequest> findByDisasterZoneId(Integer zoneId);

    List<SosRequest> findByStatus(SosStatus status);

    List<SosRequest> findByDisasterType(DisasterType disasterType);

    long countByStatus(SosStatus status);

    List<SosRequest> findTop11ByOrderByCreatedAtDesc();

    Long countByCreatedAtBetween(LocalDateTime localDateTime, LocalDateTime localDateTime1);
}
