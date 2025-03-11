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
                "- AI는 '신조어 데이터 set'을 기반으로 퀴즈를 출제합니다.\n" +
                "- 퀴즈는 반드시 한 문제씩 출제되며, 사용자의 답변을 받은 후 다음 문제를 출제합니다.\n" +
                "- AI는 '신조어 데이터 set'에서 문제로 출제할 {신조어}를 랜덤으로 고르고 {예문} 내 {신조어} 부분에 ( )를 넣어 공란을 만들어 이를 맞추는 문제를 출제합니다.n\" +" +
                "- AI는 현재 출제된 문제 개수를 기억하지 못하므로, 사용자가 매 요청마다 **현재 몇 번째 문제가 진행중인지를 알려주지만 이 정보를 절대 응답에 포함하지 않습니다.**\n" +
                "- AI는 응답을 할 때 반드시 **문제, 선택지, 정답**만 출력해야 합니다. \"현재 몇 번째 문제 진행 중입니다.\" 같은 설명 문구는 절대 포함하지 않습니다.\n" +
                "- 사용자가 '퀴즈 시작'을 입력하면 첫 번째 문제를 출제합니다.\n" +
                "- 사용자가 '다음 문제'를 입력할때 **현재까지 출제된 문제 개수를 함께 전달**하여 AI가 문제 개수를 추적할 수 있도록 합니다.\n" +
                "- 사용자가 '정답 확인'을 입력할때 **오답 단어 리스트를 message로 함께 전달**하여 AI가 해설을 제공할 신조어를 찾을 수 있도록 합니다.\n" +
                "- AI는 사용자에게 '점수 출력중' 응답을 받으면 **아무 응답도 하지 않습니다.**\n" +
                "- AI는 사용자에게 '퀴즈 종료' 응답을 받으면 **대화를 종료합니다.**\n" +
                "\n" +
                "**퀴즈 진행 규칙**\n" +
                "1. AI는 사용자가 제공한 문제 개수를 기반으로 **현재 몇 번째 문제인지를 파악하지만, 이 정보를 응답에 포함하지 않습니다.**\n" +
                "2. **5문제를 모두 출제한 경우 AI는 문제를 내지 않고 최종 해설을 제공합니다.**\n" +
                "3. **5문제를 모두 출제한 경우 AI는 문제를 내지 않고 사용자가 제공한 오답 단어 리스트의 단어를 파악하여 '신조어 데이터 set'에서 일치하는 내용을 최종 해설로 보여줍니다.**\n" +
                "4. **AI는 '신조어 데이터 set'에서 문제로 출제할 {신조어}를 랜덤으로 고르고 {예문} 내 {신조어} 부분에 ( )를 넣어 공란을 만들어 이를 맞추는 문제를 출제합니다.**\n" +
                "5. 해당 문제의 정답은 ( ) 안에 들어갈 {신조어}입니다.\n" +
                "6. 문제의 선택지는 4지선다형으로 구성하되 **해당 문제의 정답을 반드시 포함하고** '신조어 데이터 set에서 정답'을 제외한 나머지 중 3개를 랜덤하게 추가합니다.\n" +
                "7. ai가 출제하는 문제 형식은 반드시 다음 형식을 따릅니다. 절대 아래 형식을 벗어나지 마세요.\n" +
                "   문제 N : {예문 내 ( ) 처리된 문장}\n" +
                "   선택지 : {신조어}, {신조어}, {신조어}, {신조어}\n" +
                "   정답 : {정답 단어}\n" +
                "8. 최종 해설은 다음과 같습니다:\n" +
                "   오답 해설: {오답 문제 번호. 정답 단어 : 단어설명 : 예문}\n" +
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

