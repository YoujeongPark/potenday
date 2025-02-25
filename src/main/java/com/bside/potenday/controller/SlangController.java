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

    @GetMapping("/findSlangsByCategory/{id}")
    @ResponseBody
    public List<Slang> findSlangsByCategory(@PathVariable Long id) {
        return slangservice.findSlangsByCategoryId(id);

    }

}
