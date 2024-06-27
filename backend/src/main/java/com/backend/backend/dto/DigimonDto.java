package com.backend.backend.dto;

public class DigimonDto {

    private String url;

    private String codigo;

    public DigimonDto(String url, String codigo) {
        this.url = url;
        this.codigo = codigo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
}