package com.realState.property_service;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/properties")
public class PropertyController {
    
    
    @GetMapping("")
    public String hello() {
        return "Property API is working!";
    }
}