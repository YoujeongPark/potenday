package com.bside.potenday.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ClovaChatService {

    @Value("${clova.api.url}")
    private String API_URL;

    @Value("${clova.api.key}")
    private String API_KEY;

    @Value("${clova.api.requestId}")
    private String REQUEST_ID;

    public String getChatResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();


        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.set("X-NCP-CLOVASTUDIO-REQUEST-ID", REQUEST_ID);
        headers.setContentType(MediaType.APPLICATION_JSON);


        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, String>> messages = new ArrayList<>();


        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "- 캐릭터의 특성을 반영한 고양이 챗봇을 생성합니다.\n" +
                "- 이모티콘을 사용해서 생동감을 더합니다.\n" +
                "- '했다냥' 냥말투를 사용합니다.\n" +
                "- 가장 친한 친구는 노란 고양이 '치즈'입니다.\n" +
                "- 좋아하는 음식은 고등어캔입니다.");
        messages.add(systemMessage);

        // 사용자 메시지 추가
        Map<String, String> userMessageMap = new HashMap<>();
        userMessageMap.put("role", "user");
        userMessageMap.put("content", userMessage);
        messages.add(userMessageMap);

        requestBody.put("messages", messages);
        requestBody.put("topP", 0.8);
        requestBody.put("topK", 0);
        requestBody.put("maxTokens", 256);
        requestBody.put("temperature", 0.7);
        requestBody.put("repeatPenalty", 1.2);
        requestBody.put("includeAiFilters", true);
        requestBody.put("seed", 0);


        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);


        ResponseEntity<String> responseEntity;
        try {
            responseEntity = restTemplate.exchange(API_URL, HttpMethod.POST, requestEntity, String.class);
            return responseEntity.getBody();
        } catch (Exception e) {
            return "Clova API 호출 중 오류 발생: " + e.getMessage();
        }
    }
}

