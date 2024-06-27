package com.backend.backend.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    // @NotBlank(message = "Name is mandatory")
    @Column(name = "username", unique = true, nullable = false)
    private String username;

    // @NotBlank(message = "Email is mandatory")
    // @Email
    // private String email;
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "image")
    private String image;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "user")
    private List<Deck> decks;

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        decks = new ArrayList<Deck>();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + username +  "]";
    }

    public List<Deck> getDecks() {
        return decks;
    }

    public void setDecks(List<Deck> decks) {
        this.decks = decks;
    }
    public void addDeck(Deck deck) {
        decks.add(deck);
        deck.setUser(this);
    }

}