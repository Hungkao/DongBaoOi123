package com.devansh.repo;

import com.devansh.model.DisasterZone;
import com.devansh.model.enums.DangerLevel;
import com.devansh.model.enums.DisasterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DisasterZoneRepository extends JpaRepository<DisasterZone, Integer> {
    List<DisasterZone> findByDisasterType(DisasterType disasterType);

    long countByDangerLevel(DangerLevel dangerLevel);

    Long countByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    long countByIsActiveTrueOrIsActiveIsNull();

    @Query("SELECT COUNT(d) FROM DisasterZone d " +
            "WHERE d.createdAt BETWEEN :start AND :end " +
            "AND (d.isActive = true OR d.isActive IS NULL)")
    Long countActiveOrNullCreatedAtBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

}
