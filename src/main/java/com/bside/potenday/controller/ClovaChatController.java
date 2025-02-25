package com.bside.potenday.controller;

import com.bside.potenday.service.ClovaChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ClovaChatController {

    private final ClovaChatService clovaChatService;

    public ClovaChatController(ClovaChatService clovaChatService) {
        this.clovaChatService = clovaChatService;
    }

    @PostMapping("/send")
    public String chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        return clovaChatService.getChatResponse(userMessage);
    }
}

