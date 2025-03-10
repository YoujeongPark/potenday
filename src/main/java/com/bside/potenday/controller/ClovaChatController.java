package com.bside.potenday.controller;

import com.bside.potenday.service.ClovaChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/clova")
public class ClovaChatController {

    private final ClovaChatService clovaChatService;

    public ClovaChatController(ClovaChatService clovaChatService) {
        this.clovaChatService = clovaChatService;
    }

    @PostMapping("/startChat")
    public String startChat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        return clovaChatService.getStartChatResponse(userMessage);
    }

    @PostMapping("/startQuiz")
    public String startQuiz(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        return clovaChatService.getStartQuizResponse(userMessage);
    }

    @PostMapping("/addQuiz")
    public String addQuiz(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        return clovaChatService.getAddQuizResponse(userMessage);
    }
}

