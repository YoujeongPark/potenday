package com.bside.potenday.repository;

import com.bside.potenday.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface CategoriesRepository extends JpaRepository<Category, UUID>, JpaSpecificationExecutor<Category> {

}