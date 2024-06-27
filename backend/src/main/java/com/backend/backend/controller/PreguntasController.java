/*package com.backend.backend.controller;

import com.backend.backend.service.PreguntaService;
import com.backend.backend.entity.Preguntas;
import com.backend.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/preguntas")
public class PreguntasController {

    private final PreguntaService preguntaService;

    @Autowired
    public PreguntasController(PreguntaService pregunta) {
        this.preguntaService = pregunta;
    }

    @PostMapping("/users")
    public Preguntas createPregunta(@RequestBody Preguntas preguntita) {
        return this.preguntaService.createPregunta(preguntita);
    }
}*/
