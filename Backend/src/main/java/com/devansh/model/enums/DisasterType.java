package com.devansh.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DisasterType {
    // Mapping: EnumBackend("Tên Tiếng Việt từ FE")
    FLOOD("LŨ LỤT"),
    EARTHQUAKE("ĐỘNG ĐẤT"),
    LANDSLIDE("SẠT LỞ ĐẤT"),
    TORNADO("BÃO/SIÊU BÃO"),
    SINKHOLE("HỐ SỤT ĐẤT"),
    TSUNAMI("TRIỀU CƯỜNG"), // Map tạm Triều cường vào Tsunami
    WILDFIRE("CHÁY RỪNG"),
    BLIZZARD("MƯA ĐÁ"),     // Map tạm Mưa đá vào Blizzard

    // Thêm loại mới để khớp với FE (Frontend có CHÁY NHÀ)
    HOUSE_FIRE("CHÁY NHÀ"),

    UNKNOWN("KHÔNG XÁC ĐỊNH");

    private final String vietnameseName;

    DisasterType(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    // (Tùy chọn) @JsonValue để khi Backend trả dữ liệu về cũng là tiếng Việt
    // @JsonValue
    public String getVietnameseName() {
        return vietnameseName;
    }

    // Hàm quan trọng: Dịch chuỗi JSON gửi lên thành Enum
    @JsonCreator
    public static DisasterType fromValue(String text) {
        if (text == null) return null;

        for (DisasterType type : DisasterType.values()) {
            // So sánh chấp nhận cả tiếng Anh (FLOOD) hoặc tiếng Việt (LŨ LỤT)
            // Dùng equalsIgnoreCase để không phân biệt hoa thường
            if (type.name().equalsIgnoreCase(text) || type.vietnameseName.equalsIgnoreCase(text)) {
                return type;
            }
        }

        // Nếu không tìm thấy, trả về UNKNOWN hoặc ném lỗi
        // Lưu ý: "L? L?T" trong log có thể do lỗi hiển thị console,
        // nhưng nếu text thực sự bị lỗi font, code này sẽ trả về UNKNOWN an toàn hơn.
        return UNKNOWN;
    }
}