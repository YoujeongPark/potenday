package com.bside.potenday.service;


import com.bside.potenday.model.Slang;
import com.bside.potenday.repository.SlangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SlangService {

    @Autowired
    private SlangRepository slangRepository;

    public List<Slang> findAllSlangs(){
        return slangRepository.findAll();
    }

}
