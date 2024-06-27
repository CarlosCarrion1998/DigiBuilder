package com.backend.backend.repository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.backend.entity.Deck;

import org.springframework.data.repository.CrudRepository;

@RepositoryRestResource
public interface DeckRepository extends CrudRepository<Deck, Long>{

    Deck findByName(String deckName);
    
}
