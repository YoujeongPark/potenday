package com.bside.potenday.controller;

import com.bside.potenday.model.Slang;
import com.bside.potenday.service.SlangService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SlangController {

    private final SlangService slangservice;

    @GetMapping("/findSlangs")
    public List<Slang> findSlangs(){
        List<Slang> slangs = slangservice.findAllSlangs();
        return slangs;
    }

}
