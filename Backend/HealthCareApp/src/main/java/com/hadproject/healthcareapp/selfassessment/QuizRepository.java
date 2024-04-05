package com.hadproject.healthcareapp.selfassessment;

import com.hadproject.healthcareapp.qans.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface QuizRepository extends JpaRepository<QuizQuestion, Integer> {

}
