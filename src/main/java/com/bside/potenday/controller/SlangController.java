package com.bside.potenday.controller;

import com.bside.potenday.model.Slang;
import com.bside.potenday.service.SlangService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SlangController {

    private final SlangService slangservice;

    @GetMapping("/findSlangs")
    @ResponseBody
    public List<Slang> findSlangs() {
        return slangservice.findAllSlangs();
    }

    @GetMapping("/findSlangsByCategoryAndID")
    @ResponseBody
    public List<Slang> findSlangsByCategory(@RequestParam(required = false) Long id, @RequestParam(required = false) String slang) {
        return slangservice.findSlangs(id, slang);
    }

    @GetMapping("/findSlangsByCategory")
    @ResponseBody
    public List<Slang> findSlangsByCategory(@RequestParam Long id) {
        return slangservice.findSlangsByCategoryId(id);
    }

    @GetMapping("/findSlangsByWord")
    @ResponseBody
    public List<Slang> findSlangsByCategory(@RequestParam String slang) {
        return slangservice.findSlangByWord(slang);
    }



}
