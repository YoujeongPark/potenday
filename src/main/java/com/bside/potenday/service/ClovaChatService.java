package com.bside.potenday.service;
import com.bside.potenday.dto.ClovaChatRequest;
import com.bside.potenday.dto.ClovaChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.List;

@Service
public class ClovaChatService {

    @Value("${clova.api.url}")
    private String clovaApiUrl;

    @Value("${clova.api.key}")
    private String clovaApiKey;

    @Value("${clova.api.requestId}")
    private String clovaApiRequestId;


    public String getChatResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + clovaApiKey);
        headers.set("X-NCP-CLOVASTUDIO-REQUEST-ID", clovaApiRequestId);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 요청 메시지 생성
        List<ClovaChatRequest.Message> messages = Arrays.asList(
                new ClovaChatRequest.Message("system", "- 캐릭터의 특성을 반영한 고양이 챗봇을 생성합니다.\n- 이모티콘을 사용해서 생동감을 더합니다.\n- '했다냥' 냥말투를 사용합니다.\n- 가장 친한 친구는 노란 고양이 '치즈'입니다.\n- 좋아하는 음식은 고등어캔입니다."),
                new ClovaChatRequest.Message("user", userMessage)
        );

        ClovaChatRequest requestBody = new ClovaChatRequest();
        requestBody.setMessages(messages);

        HttpEntity<ClovaChatRequest> requestEntity = new HttpEntity<>(requestBody, headers);

        // API 호출
        ResponseEntity<ClovaChatResponse> responseEntity = restTemplate.exchange(
                clovaApiUrl, HttpMethod.POST, requestEntity, ClovaChatResponse.class);

        return responseEntity.getBody().getContent();
    }
}
