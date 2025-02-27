package com.bside.potenday.repository;

import com.bside.potenday.model.Slang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SlangRepository extends JpaRepository<Slang, UUID>, JpaSpecificationExecutor<Slang> {

    @Query("SELECT s FROM Slang s WHERE s.category.id = :categoryId")
    List<Slang> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT s FROM Slang s WHERE s.slangName LIKE %:word%")
    List<Slang> findSlangByWord(String word);

    @Query("SELECT s FROM Slang s WHERE (s.category.id = :id) AND (s.slangName LIKE %:slang%) ")
    List<Slang> findSlangs(@Param("id") Long id, @Param("slang") String slang);

}