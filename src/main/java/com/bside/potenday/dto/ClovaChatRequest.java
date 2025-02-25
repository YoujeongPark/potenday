package com.bside.potenday.dto;

import lombok.Data;
import java.util.List;

@Data
public class ClovaChatRequest {
    private List<Message> messages;
    private double topP = 0.8;
    private int topK = 0;
    private int maxTokens = 256;
    private double temperature = 0.7;
    private double repeatPenalty = 1.2;
    private boolean includeAiFilters = true;
    private int seed = 0;

    @Data
    public static class Message {
        private String role;
        private String content;

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }
}

