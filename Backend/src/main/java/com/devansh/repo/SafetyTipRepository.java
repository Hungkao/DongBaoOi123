package com.devansh.repo;

import com.devansh.model.DisasterZone;
import com.devansh.model.SafetyTip;
import com.devansh.model.enums.DisasterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SafetyTipRepository extends JpaRepository<SafetyTip, Integer> {

    // fetch all tips for a specific zone including global tips for the disaster type
    @Query("SELECT s FROM SafetyTip s " +
            "WHERE s.disasterZone = :zone OR (s.disasterZone IS NULL AND s.disasterType = :disasterType)")
    List<SafetyTip> findForZoneIncludingGlobal(@Param("zone") DisasterZone zone,
                                               @Param("disasterType") DisasterType disasterType);

    List<SafetyTip> findByDisasterZoneId(Integer zoneId);

}
