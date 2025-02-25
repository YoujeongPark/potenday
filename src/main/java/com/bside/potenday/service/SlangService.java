package com.bside.potenday.service;


import com.bside.potenday.model.Slang;
import com.bside.potenday.repository.SlangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlangService {

    final private SlangRepository slangRepository;

    public List<Slang> findAllSlangs(){
        return slangRepository.findAll();
    }

    public List<Slang> findSlangsByCategoryId(Long categoryId) {
        return slangRepository.findByCategoryId(categoryId);
    }

}
