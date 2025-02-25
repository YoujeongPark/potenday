package com.bside.potenday.service;

import org.springframework.stereotype.Service;

@Service
public interface ClovaService {
    String createDesignPersona(String message);
    String createDiscoverPersonaReaction(String message);
    String createDiscoverPersonaSummary(String message);
    String createDiscoverPersonaKeywords(String message);
}