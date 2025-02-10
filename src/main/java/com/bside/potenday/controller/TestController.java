package com.bside.potenday.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Hello World";
    }

    @GetMapping("/name")
    public String blogGet(@RequestParam String name, @RequestParam String id){
        return name + "-" + id;
    }

    @GetMapping("/currentDate")
	public String hello() {
		return "안녕하세요. 현재 서버시간은 " + new Date() + "입니다. \n";
	}

}
