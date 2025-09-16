package com.realState.property_service.database.entity;

import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "property")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private TypeEnum type;

    @Column(nullable = false)
    private StatusEnum status;
    
}