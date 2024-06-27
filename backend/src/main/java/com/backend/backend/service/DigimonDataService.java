package com.backend.backend.service;


import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import com.backend.backend.dto.DigimonDto;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

@Service
public class DigimonDataService {
    public DigimonDto getDigimonData(String codigo) {
        String url = "https://digimoncard.io/card-database/?&n=" + codigo +"&desc=" + codigo +"&format=Digimon%20Card%20Game";
        DigimonDto digimonData = null;

        Playwright playwright = Playwright.create();
        Browser browser = playwright.webkit().launch();
        Page page = browser.newPage();
        page.navigate(url);
        page.waitForSelector("#api-area > span > span.card-list-img.text-container-icon.d-block > a > span > img");

        Document webPage = Jsoup.parse(page.content());

        Elements imagenes = webPage.select(".grid-image > img");

        for(Element imagen : imagenes) {
            digimonData = new DigimonDto(imagen.attr("src"), codigo);
        }
        playwright.close();
        return digimonData;
    }
}
