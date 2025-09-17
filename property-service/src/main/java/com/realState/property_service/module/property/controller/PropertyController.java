package com.realState.property_service.module.property.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class PropertyController {

    @GetMapping("/create")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    
}

