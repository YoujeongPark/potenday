package com.bside.potenday.service;


import com.bside.potenday.model.Slang;
import com.bside.potenday.repository.SlangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlangService {

    final private SlangRepository slangRepository;

    public List<Slang> findAllSlangs() {
        return slangRepository.findAll();
    }

    public List<Slang> findSlangs(Long id, String slang) {
        if (id == null) {
            return slangRepository.findSlangByWord(slang);
        } else if (slang == null) {
            return slangRepository.findByCategoryId(id);
        } else {
            return slangRepository.findSlangs(id, slang);
        }
    }

    public List<Slang> findSlangsByCategoryId(Long categoryId) {
        return slangRepository.findByCategoryId(categoryId);
    }


    public List<Slang> findSlangByWord(String word) {
        if (word == null || word.trim().isEmpty()) {
            return Collections.emptyList();
        }

        return slangRepository.findSlangByWord(word);
    }

}
