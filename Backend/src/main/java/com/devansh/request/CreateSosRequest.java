package com.devansh.request;

import com.devansh.model.enums.DisasterType;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateSosRequest {
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String message;
    private DisasterType disasterType;
}
