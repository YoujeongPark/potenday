package com.bside.potenday.controller;


import com.bside.potenday.model.Category;
import com.bside.potenday.service.CategoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CategoriesController {

    private final CategoriesService categoriesService;

    @GetMapping("/getCategories")
    public List<Category> categoriesteg(){
        List<Category> categories = categoriesService.findAllCategories();
        return categories;
    }

}
