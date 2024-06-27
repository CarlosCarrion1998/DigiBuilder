package com.backend.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.backend.entity.DeckCard;

@RepositoryRestResource
public interface DeckCardRepository extends CrudRepository<DeckCard, Long> {
}
