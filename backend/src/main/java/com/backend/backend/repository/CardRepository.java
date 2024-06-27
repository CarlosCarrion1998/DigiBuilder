package com.backend.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.backend.entity.Card;

@RepositoryRestResource
public interface CardRepository extends CrudRepository<Card, Long> {

    Card findByCode(String cardCode);
}
