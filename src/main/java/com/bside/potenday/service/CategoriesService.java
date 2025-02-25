package com.bside.potenday.service;


import com.bside.potenday.model.Category;
import com.bside.potenday.model.Slang;
import com.bside.potenday.repository.CategoriesRepository;
import com.bside.potenday.repository.SlangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriesService {

    final private CategoriesRepository categoriesRepository;

    public List<Category> findAllCategories() {
        return categoriesRepository.findAll();
    }

}
