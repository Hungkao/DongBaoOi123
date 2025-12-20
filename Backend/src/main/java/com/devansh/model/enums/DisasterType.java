package com.devansh.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DisasterType {
    FLOOD("LŨ LỤT"),
    EARTHQUAKE("ĐỘNG ĐẤT"),
    LANDSLIDE("SẠT LỞ ĐẤT"),
    TORNADO("BÃO/SIÊU BÃO"),
    SINKHOLE("HỐ SỤT ĐẤT"),
    TSUNAMI("TRIỀU CƯỜNG"),
    WILDFIRE("CHÁY RỪNG"),
    BLIZZARD("MƯA ĐÁ"),
    HOUSE_FIRE("CHÁY NHÀ"),
    UNKNOWN("KHÔNG XÁC ĐỊNH");

    private final String vietnameseName;

    DisasterType(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    @JsonValue
    public String getVietnameseName() {
        return vietnameseName;
    }

    @JsonCreator
    public static DisasterType fromValue(String text) {
        if (text == null) return null;
        for (DisasterType type : DisasterType.values()) {
            if (type.name().equalsIgnoreCase(text) || type.vietnameseName.equalsIgnoreCase(text)) {
                return type;
            }
        }
        return UNKNOWN;
    }
}