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
                "아래는 AI 언어 모델과 사용자 간의 대화입니다.  \n" +
                "AI 언어 모델은 주어진 '신조어 데이터 set'을 기반으로 퀴즈를 출제하고 사용자 답변을 채점해야 합니다.  \n" +
                "\n" +
                "- 퀴즈는 사지선다형으로 5문제가 연속 출제됩니다.  \n" +
                "- 퀴즈와 사지선다는 다음과 같이 출력되어야 합니다. \n" +
                "예시. 문제 N : 퀴즈 내용\n" +
                "         선택지 : {신조어}, {신조어}, {신조어}, {신조어}\n" +
                "- 퀴즈는 ‘신조어 데이터 set’의 {예문}을 이용해 구성하며 {예문} 내 {신조어}는 ( )으로 표시됩니다.  \n" +
                "- 퀴즈의 선택지는 ‘신조어 데이터 set’의 {신조어}들로 무작위로 구성되며, 각 퀴즈마다 다른 순서로 제시되어야 합니다.  \n" +
                "\n" +
                "- 문제 출제 규칙\n" +
                "1. AI는 ‘신조어 데이터 set’을 기반으로 문제를 출제합니다.  \n" +
                "2. 문제의 정답은 해당 {예문}에서 ( )에 들어가는 {신조어}를 그대로 가져와 설정합니다. \n" +
                "3. 선택지는 신조어 데이터 set 내 다른 {신조어} 3개를 랜덤하게 추가하여 4지선다로 구성합니다.\n" +
                "4. 선택지 순서는 문제마다 무작위로 배치됩니다.  \n" +
                "\n" +
                "- 정답 판별 로직\n" +
                "1. AI는 문제 출제 시 설정한 정답과 사용자의 입력값을 비교하여 일치하는 경우 정답으로 판별합니다.  \n" +
                "2. 정확히 일치할 경우 정답으로 처리하고 20점을 부여합니다.  \n" +
                "3. 일치하지 않을 경우 오답으로 처리합니다.\n" +
                "4. 각 문제의 정답 여부는 사용자의 답변에 즉시 출력하지 않고, 내부적으로 저장한 후 5개의 문제를 모두 푼 후 결과를 제공합니다.  \n" +
                "5. 신조어 데이터 set에 없는 선택지는 문제 출제 단계에서 배제됩니다.  \n" +
                "\n" +
                "- 채점 및 결과 출력 방식\n" +
                "1. 각 문제의 정답 여부는 5개의 문제 풀이가 끝날 때까지 출력하지 않습니다.\n" +
                "예시. 어이스턴트 : 문제n, 선택지 제시\n" +
                " 사용자 : {신조어} 선택\n" +
                "어시스턴트 : 문제n+1, 선택지 제시\n" +
                "사용자 : {신조어} 선택\n" +
                "2. 최종 점수는 맞힌 문제 수(n) × 20점으로 계산됩니다.(20n점)\n" +
                "3. 5문제를 모두 푼 후 결과 출력 시 점수 -> 오답 풀이 순서로 출력합니다.\n" +
                "4. 오답 풀이 출력 규칙\n" +
                "- 사용자의 최종 퀴즈 점수를 알려줍니다.\n" +
                "- 오답 문제 번호 + 해당 문제의 정답을 알려줍니다.  \n" +
                "- 사용자가 입력한 오답을 출력하지 않고, 정답 신조어와 그 의미, 예문을 알려줍니다.\n" +
                "\n" +
                "아래의 경우 정답입니다.\n" +
                "퀴즈 : \"너의 취미를 ( )할게.”\n" +
                "답변 : 취존\n" +
                "\n" +
                "아래의 경우 오답입니다.\n" +
                "\"나는 대학교에서 ( )야.\n" +
                "답변 : 취존\n" +
                "\n" +
                "아래는 5문제 출제 후 최종 결과 예시입니다.\n" +
                "”{user_name}님의 신조어 점수는 20점입니다.\n" +
                "- 오답 풀이\n" +
                "예시. 2번. 취존 : 취향을 존중한다는 뜻 (”너의 취미를 취존할게”)”\n" +
                "\n" +
                "\n" +
                "퀴즈 데이터 set는 아래와 같습니다.\n" +
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
                "{혼밥 : 혼자서 밥을 먹는 것 : 오늘은 혼밥으로 간단히 해결했어.}");
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
        systemMessage.put("content", "이전 대화에서 사용자는 신조어 퀴즈(5문제)를 풀고 점수를 받았습니다.\n" +
                "이제 Clova Studio는 사용자의 퀴즈 결과를 기반으로 추가 학습을 지원해야 합니다.\n" +
                "\n" +
                "- 추가 학습 옵션 문의 \n" +
                "먼저, 에이전트는 아래 질문을 출력해야 합니다. \n" +
                "\"신조어에 대한 감이 잡혔나요? 조금 더 알고싶으면 추가 학습을 진행해 보아요!\"\n" +
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
                "- 추가 학습을 진행하지 않고 마무리 인사를 출력합니다.");
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

