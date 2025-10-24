package com.realState.property_service.module.property.service.specification;

import com.realState.property_service.database.entity.Property;
import com.realState.property_service.database.enums.StateEnum;
import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class PropertySpecification {
    public static Specification<Property> hasStatus(StatusEnum status) {
        return (root, query, cb) -> {
            if (status == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<Property> hasType(TypeEnum type) {
        return (root, query, cb) -> {
            if (type == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("type"), type);
        };
    }

    public static Specification<Property> hasLocationState(StateEnum state) {
        return (root, query, cb) -> {
            if (state == null) {
                return cb.conjunction();
            }
            Join<Object, Object> locationJoin = root.join("location");
            return cb.equal(locationJoin.get("state"), state);
        };
    }

    public static Specification<Property> isApproved() {
        return (root, query, cb) -> cb.equal(root.get("approvalStatus"), "approved");
    }

    public static Specification<Property> combine(
            StatusEnum status,
            TypeEnum type,
            StateEnum state) {
        return Specification.allOf(hasStatus(status))
                .and(hasType(type))
                .and(hasLocationState(state));
    }
}
