package com.bside.potenday.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class SlangDTO {
    private UUID id;
    private String createdTime;
    private String modifedTime;
    private String slangName;
    private String slangMeaning ;
    private String slangSubstitutes ;
    private String categoryId;

}
