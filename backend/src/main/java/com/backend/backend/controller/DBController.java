// package com.backend.backend.controller;

// import org.jsoup.Jsoup;
// import org.jsoup.nodes.Document;
// import org.jsoup.nodes.Element;
// import org.jsoup.select.Elements;
// import org.springframework.data.domain.Limit;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.backend.backend.repository.PersonajeRepository;
// import com.backend.backend.repository.PreguntasRepository;
// import com.backend.backend.repository.RankingRepository;
// import com.backend.backend.repository.RespuestaRepository;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestParam;

// import java.io.IOException;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.LinkedHashMap;
// import java.util.List;
// import java.util.Optional;
// import java.util.regex.Matcher;
// import java.util.regex.Pattern;

// import javax.swing.RowFilter.Entry;

// import com.backend.backend.entity.Ranking;
// import com.backend.backend.entity.Respuesta;
// import com.backend.backend.entity.Personaje;
// import com.backend.backend.entity.Preguntas;

// @CrossOrigin(origins = "http://localhost:4200")
// @RestController
// @RequestMapping("/data")
// public class DBController {

//     private final RankingRepository rankingRepository;
//     private final PreguntasRepository preguntaRepository;
//     private final RespuestaRepository respuestaRepository;
//     private final PersonajeRepository personajeRepository;

//     public DBController(RankingRepository rankingRepository,
//             PreguntasRepository preguntaRepository,
//             RespuestaRepository respuestaRepository,
//             PersonajeRepository personajeRepository) {
//         this.rankingRepository = rankingRepository;
//         this.preguntaRepository = preguntaRepository;
//         this.respuestaRepository = respuestaRepository;
//         this.personajeRepository = personajeRepository;
//     }

//     @GetMapping("/GetTopRanking")
//     public ResponseEntity<List<Ranking>> getTopRanking() {
//         List<Ranking> ranking = rankingRepository.findByOrderByPuntuacionDesc(Limit.of(10));
//         if (ranking.isEmpty()) {
//             return ResponseEntity.noContent().build();
//         } else {
//             return ResponseEntity.ok().body(ranking);
//         }
//     }

//     @GetMapping("/GetTopRankingInit")
//     public ResponseEntity<List<Ranking>> getTopRankingInit() {
//         List<Ranking> ranking = rankingRepository.findByOrderByPuntuacionDesc(Limit.of(3));
//         if (ranking.isEmpty()) {
//             return ResponseEntity.noContent().build();
//         } else {
//             return ResponseEntity.ok().body(ranking);
//         }
//     }

//     @PostMapping("/AddPregunta")
//     public ResponseEntity<Preguntas> addPregunta(@RequestBody Preguntas pregunta) {

//         Personaje personaje = personajeRepository.findByCode(pregunta.getPersonaje().getCode());

//         if (personaje == null)
//             personaje = personajeRepository
//                     .save(new Personaje(pregunta.getPersonaje().getCode(), pregunta.getPersonaje().getName()));

//         pregunta.setPersonaje(personaje);

//         Preguntas newPregunta = preguntaRepository.save(pregunta);

//         return ResponseEntity.ok().body(newPregunta);
//     }

//     @GetMapping("/GetPreguntas")
//     public ResponseEntity<List<Preguntas>> getPreguntas() {
//         List<Preguntas> preguntas = preguntaRepository.findAllByOrderByIdAsc();
//         if (preguntas.isEmpty()) {
//             return ResponseEntity.noContent().build();
//         } else {
//             return ResponseEntity.ok().body(preguntas);
//         }
//     }

//     @DeleteMapping("/DeletePregunta&id={id}")
//     public ResponseEntity<Boolean> deletePregunta(@PathVariable long id) {

//         Preguntas pregunta = preguntaRepository.findById(id).get();

//         if (pregunta == null)
//             return ResponseEntity.notFound().build();

//         Personaje personaje = personajeRepository.findByCode(pregunta.getPersonaje().getCode());

//         personaje.getPregunta().remove(pregunta);

//         personajeRepository.save(personaje);

//         preguntaRepository.delete(pregunta);

//         return ResponseEntity.ok().body(true);

//     }

//     @PutMapping("/UpdatePregunta")
//     public ResponseEntity<Preguntas> updatePregunta(@RequestBody Preguntas pregunta) {

//         Personaje personaje = personajeRepository.findByCode(pregunta.getPersonaje().getCode());

//         if (personaje == null)
//             personaje = personajeRepository
//                     .save(new Personaje(pregunta.getPersonaje().getCode(), pregunta.getPersonaje().getName()));

//         pregunta.setPersonaje(personaje);

//         Preguntas newPregunta = preguntaRepository.save(pregunta);

//         if (newPregunta == null)
//             return ResponseEntity.noContent().build();
//         else
//             return ResponseEntity.ok().body(newPregunta);
//     }

//     @PostMapping("/AddPuntuacion")
//     public ResponseEntity<Ranking> addPuntuacion(@RequestBody Ranking puntuacion) {

//         Ranking newPuntuacion = rankingRepository.save(puntuacion);

//         if (newPuntuacion == null)
//             return ResponseEntity.noContent().build();
//         else
//             return ResponseEntity.ok().body(newPuntuacion);
//     }

//     @GetMapping("/GetPersonajes")
//     public ResponseEntity<List<Personaje>> getPersonajes() {
//         List<Personaje> personajes = personajeRepository.findAll();
//         if (personajes.isEmpty()) {
//             return ResponseEntity.noContent().build();
//         } else {
//             return ResponseEntity.ok().body(personajes);
//         }
//     }

//     @GetMapping("/scrapping")
//     public HashMap<String, ArrayList<String>> getScrapping() {
//         HashMap<String, ArrayList<String>> temporadas = new LinkedHashMap<>();

//         try {
//             Document webPage = Jsoup.connect("https://en.wikipedia.org/wiki/List_of_Rick_and_Morty_episodes").get();
//             Elements tables = webPage.select("table.wikiepisodetable"); 

//             int numTemporada = 1;
//             String regex = "\"([^\"]*)\"";

//             for (Element table : tables) {

//                 Elements rows = table.select("tr");
//                 if (rows.size() > 1) {
//                     String tableText = table.text();

//                     Pattern pattern = Pattern.compile(regex);
//                     Matcher matcher = pattern.matcher(tableText);

//                     ArrayList<String> episodes = new ArrayList<>();

//                     while (matcher.find()) {
//                         String episodeInfo = matcher.group(1); 
//                         episodes.add(episodeInfo);
//                     }

//                     temporadas.put("Temporada " + numTemporada++, episodes);
//                     if(numTemporada > 7)
//                         break;
//                 }
//             }

//         } catch (IOException e) {
//             e.printStackTrace(); // Manejo básico de errores, se puede mejorar según el contexto
//         }

//         return temporadas;
//     }

// }
