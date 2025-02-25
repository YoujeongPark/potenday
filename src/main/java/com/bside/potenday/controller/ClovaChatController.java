package com.bside.potenday.controller;

import com.bside.potenday.service.ClovaChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ClovaChatController {

    private final ClovaChatService clovaChatService;

    public ClovaChatController(ClovaChatService clovaChatService) {
        this.clovaChatService = clovaChatService;
    }

    @PostMapping("/send")
    public String chat(@RequestBody String userMessage) {
        return clovaChatService.getChatResponse(userMessage);
    }
}