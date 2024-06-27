package com.backend.backend.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend.dto.DigimonDto;
import com.backend.backend.service.DigimonDataService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/digimon")
public class DigimonImageController {

    @Autowired
    private DigimonDataService digimonDataService;

    @GetMapping("/image")
    public DigimonDto getDigimonImage(@RequestParam String codigo) {
        return digimonDataService.getDigimonData(codigo);
    }
}