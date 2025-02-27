package com.bside.potenday.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
public class Slang {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected UUID id;

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    @CreatedDate
    private Timestamp createdTime;

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    @LastModifiedDate
    private Timestamp modifiedTime;

    @Column(nullable = false, length = 100)
    private String slangName;

    @Column(nullable = false, length = 300)
    private String slangMeaning;

    @Column(length = 300)
    private String slangSubstitutes;

    @Column(length = 300)
    private String slangExample;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    @JsonProperty("categoryId") // get Category ID from Category DB
    public Long getCategoryId() {
        return (category != null) ? category.getId() : null;
    }

}


