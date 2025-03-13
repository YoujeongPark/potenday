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


    public String getStartChatResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.set("X-NCP-CLOVASTUDIO-REQUEST-ID", REQUEST_ID);
        headers.setContentType(MediaType.APPLICATION_JSON);


        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, String>> messages = new ArrayList<>();


        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "\n" +
                "챗봇 시작 시점의 사용자 간의 대화입니다.\n" +
                "\n" +
                "- 챗봇 최초 시작 시 에이전트의 시작 인사는 다음과 같습니다 \n" +
                " \"안녕하세요! 신조어 트렌드를 따라잡으러 오셨군요? 반갑습니다!  \\n\\n 제가 뭐라고 부르면 될까요?\" 라고만 말한 후 추가적인 문장을 덧붙이지 않습니다.\n" +
                "- 입력 대기\n" +
                "- 대화 턴이 추가되며 사용자의 이름 또는 닉네임을 입력받는다. (예: 지선, 지선이야 등)\n" +
                "- 사용자는 이름 또는 닉네임을 입력한다. 이후 사용자의 이름 또는 닉네임은 ${사용자}로 칭한다.\n" +
                "- ${사용자}가 15자를 초과하는 경우, 에이전트는 다음과 같이 답한다.\n" +
                "- 입력 대기\n" +
                "- 에이전트 : \"앗! 닉네임이 살짝 길어요. 제가 부르기 편하게 조금만 줄여서 입력해 주실 수 있을까요?\"\n" +
                "-${사용자}가 15자 이하인 경우, 다음 단계에 대한 설명을 다음 문장을 순서대로 두 개의 메세지로 나눠서 출력한다.\n" +
                "\"${사용자}님, 요즘 핫한 신조어, 저랑 같이 알아볼까요?\"\n" +
                "\"총 다섯 문제! 준비되셨다면 바로 시작해볼게요!\"");
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
        requestBody.put("temperature", 0.5);
        requestBody.put("repeatPenalty", 5.0);
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

    public String getStartQuizResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();


        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.set("X-NCP-CLOVASTUDIO-REQUEST-ID", REQUEST_ID);
        headers.setContentType(MediaType.APPLICATION_JSON);


        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, String>> messages = new ArrayList<>();


        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "\n" +
                "아래는 AI 언어 모델과 사용자 간의 대화입니다.\n" +
                "\n" +
                "**퀴즈 진행 방식**\n" +
                "- AI는 '신조어 데이터 set'을 기반으로 퀴즈를 출제합니다.\n" +
                "- AI는 **'퀴즈 시작' 이라는 메세지를 받으면 문제를 출제하며 반드시 5문제를 한 번에 출제**합니다.\n" +
                "- AI는 '신조어 데이터 set'에서 문제로 출제할 {신조어}를 랜덤으로 선택하되 **절대 중복으로 선택하지 않고 각기 다른 5개의 신조어를 선택**합니다.\n" +
                "- AI는 해당 {신조어}의 {예문} 내용에서 {신조어} 부분을 ( )로 대체하여 공란으로 표기하는 문제를 만듭니다.\n" +
                "- AI는 각 문제의 선택지를 만들 때 4지선다형으로 만들며, 선택지에는 **반드시 정답이 포함**되어야 하고 나머지 3개는 '신조어 데이터 set'에서 임의로 선택하되 선택지의 단어는 중복이 되면 안됩니다.\n" +
                "- **문제 출제는 반드시 아래 형식을 정확히 따라야 합니다.**\n" +
                "- **반드시 추가 설명이나 기타 메시지 없이 아래 형식에 맞춰 5문제를 출제합니다.\n" +
                "문제 1 : {예문에서 ( ) 처리된 문장}\n" +
                "선택지 : {옵션1}, {옵션2}, {옵션3}, {옵션4}\n" +
                "정답 : {정답 단어}\n" +
                "문제 2 : {예문에서 ( ) 처리된 문장}\n" +
                "선택지 : {옵션1}, {옵션2}, {옵션3}, {옵션4}\n" +
                "정답 : {정답 단어}\n" +
                "문제 3 : {예문에서 ( ) 처리된 문장}\n" +
                "선택지 : {옵션1}, {옵션2}, {옵션3}, {옵션4}\n" +
                "정답 : {정답 단어}\n" +
                "문제 4 : {예문에서 ( ) 처리된 문장}\n" +
                "선택지 : {옵션1}, {옵션2}, {옵션3}, {옵션4}\n" +
                "정답 : {정답 단어}\n" +
                "문제 5 : {예문에서 ( ) 처리된 문장}\n" +
                "선택지 : {옵션1}, {옵션2}, {옵션3}, {옵션4}\n" +
                "정답 : {정답 단어}\n" +
                "\n" +
                "**해설 진행 방식**\n" +
                "- AI는 '신조어 데이터 set'을 기반으로 해설을 제공합니다.\n" +
                "- AI는 해설 요청 메세지를 받으면 해당 신조어의 해설을 제공합니다.\n" +
                "- 해설 요청 메세지의 예시는 아래와 같습니다.\n" +
                "2번 {꾸안꾸} 해설\n" +
                "4번 {혼밥} 해설\n" +
                "- AI는 'N번 {신조어} 해설\n N번 {신조어} 해설\n..' 형태의 메세지를 확인하고 문제번호와 해설이 필요한 신조어를 파악합니다. " +
                "- AI는 '신조어 데이터 set'에서 해당 신조어에 대한 {의미} {예문}을 해설로 제공합니다.\n" +
                "- **해설은 반드시 아래 형식을 정확히 따라야 합니다.**\n" +
                "- **반드시 추가 설명이나 기타 메시지 없이 아래 형식에 맞춰 해설을 제공합니다.**\n" +
                "- **각 항목은 'N번. 신조어: 설명' 형태이며, 반드시 한 줄 띄운 후 다음 항목을 제공합니다.**\n" +
                "2번. 꾸안꾸: 꾸민 듯 안 꾸민 듯 자연스러운 스타일을 뜻하는 말 (“오늘은 꾸안꾸로 입고 왔어.”)\n" +
                "4번. 혼밥: 혼자서 밥을 먹는 것 (“오늘은 혼밥으로 간단히 해결했어.”)" +
                "\n" +
                "**신조어 데이터 set**\n" +
                "{신조어 : 의미 : 예문} 형태로 구성합니다.\n" +
                "{아싸 : 인기 있는 사람 : 나는 대학교에서 아싸야.},\n" +
                "{꿀잼 : 매우 재미있음을 뜻하는 말 : 이번 주말에는 넷플릭스에서 꿀잼 드라마를 봤어.},\n" +
                "{노잼 : 재미가 없음을 뜻하는 말 : 그 영화는 너무 노잼이라서 보다가 잤어.},\n" +
                "{꾸안꾸 : 꾸민 듯 안 꾸민 듯 자연스러운 스타일을 뜻하는 말 : 오늘은 꾸안꾸로 입고 왔어.},\n" +
                "{취존 : 취향을 존중한다는 뜻 : 너의 취미를 취존할게.}\n" +
                "{좋댓구알 : 좋아요 댓글 구독 알림설정의 줄임말 : 유튜브 영상을 볼 때는 꼭 좋댓구알 해주세요.}\n" +
                "{억텐 : 억지 텐션의 줄임말로 기분이 좋지 않음에도 좋은 척을 하는 것을 뜻함 : 오늘 회의에서 걔 완전 억텐이었어.}\n" +
                "{점메추 : 점심 메뉴 추천의 줄임말로 점심 메뉴를 추천해달라는 의미 : 오늘 점심 뭐 먹을까? 점메추 좀 해줘.}\n" +
                "{완내스 : 완전 내 스타일이라는 뜻 : 그 옷 진짜 완내스야.}\n" +
                "{혼밥 : 혼자서 밥을 먹는 것 : 오늘은 혼밥으로 간단히 해결했어.}"
        );
        messages.add(systemMessage);

        // 사용자 메시지 추가
        Map<String, String> userMessageMap = new HashMap<>();
        userMessageMap.put("role", "user");
        userMessageMap.put("content", userMessage);
        messages.add(userMessageMap);

        requestBody.put("messages", messages);
        requestBody.put("topP", 0.6);
        requestBody.put("topK", 0);
        requestBody.put("maxTokens", 300);
        requestBody.put("temperature", 0.2);
        requestBody.put("repeatPenalty", 2.0);
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

    public String getAddQuizResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();


        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.set("X-NCP-CLOVASTUDIO-REQUEST-ID", REQUEST_ID);
        headers.setContentType(MediaType.APPLICATION_JSON);


        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, String>> messages = new ArrayList<>();


        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "\n" +
                "아래는 AI 언어 모델과 사용자 간의 대화입니다.\n" +
                "- AI는 '신조어 데이터 set'을 기반으로 {신조어}를 사용한 상황극을 진행합니다.\n" +
                "\n" +
                "- 추가 학습 옵션\n" +
                "추가 학습 옵션 문의 출력 후 추가 학습 옵션을 출력합니다. \n" +
                "사용자는 아래 두 가지 중 하나를 선택할 수 있습니다.\n" +
                "1. 신조어 상황극 진행하기\n" +
                "- 에이전트가 특정 상황을 제시하면, 사용자는 해당 상황에 적절한 신조어를 사용해 대답합니다.\n" +
                "- 특정 상황에는 신조어를 직접 활용하지 않고 사용자가 신조어를 답변할 수 있는 질문을 유도합니다.\n" +
                "- 신조어는 데이터set에 있는 {신조어}를 활용합니다.  \n" +
                "- 에이전트는 사용자의 답변을 평가하고, 더 자연스러운 표현을 제안할 수 있습니다.\n" +
                "\n" +
                "2. 추가 학습 그만하기 \n" +
                "- 추가 학습을 진행하지 않고 마무리 인사를 출력합니다."
        );
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
        requestBody.put("temperature", 0.5);
        requestBody.put("repeatPenalty", 5.0);
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

