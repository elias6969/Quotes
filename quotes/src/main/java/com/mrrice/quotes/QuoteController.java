package com.mrrice.quotes;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Random;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class QuoteController {

    private static final List<Quote> QUOTES = new ArrayList<>(List.of(
        new Quote("Simplicity is the soul of efficiency.", "Austin Freeman"),
        new Quote("Code is like humor. When you have to explain it, it’s bad.", "Cory House"),
        new Quote("Fix the cause, not the symptom.", "Steve Maguire")
    ));

    @GetMapping("/quote")
    public Quote getRandomQuote() {
        int index = new Random().nextInt(QUOTES.size());
        return QUOTES.get(index);
    }

    public record Quote(String quote, String author) {}

  @PostMapping("/quote")
  public Quote addQuote(@RequestBody Quote newQuote) {
    QUOTES.add(newQuote);
    System.out.println("Added quote: " + newQuote);
    return newQuote;
  }
}
