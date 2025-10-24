package com.realState.property_service.database.repository;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;
import org.springframework.lang.NonNullApi;
import org.springframework.stereotype.Repository;

import com.realState.property_service.database.entity.Property;
import com.realState.property_service.database.enums.ApprovalStatusEnum;;;;;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID>, JpaSpecificationExecutor<Property> {
    // @Query("SELECT p FROM Property p WHERE p.owner_id = :owner_id")
    // List<Property> findAllByOwnerId(@Param("owner_id") UUID owner_id);

    List<Property> findByOwnerId(UUID ownerId);

    // Find by approval status
    List<Property> findByApprovalStatus(ApprovalStatusEnum approvalStatus);

    // Find All Approved properties
    Page<Property> findByApprovalStatus(ApprovalStatusEnum status, Pageable pageable);

    // Find All Properties
    @NonNull
    Page<Property> findAll(@NonNull Pageable pageable);
}
