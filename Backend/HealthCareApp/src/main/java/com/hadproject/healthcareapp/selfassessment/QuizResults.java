package com.hadproject.healthcareapp.selfassessment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hadproject.healthcareapp.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "QuizResults")
public class QuizResults {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "uid")
    private User u_id;

    @Column(nullable = false)
    private String Remark;

    @JsonIgnore
    @Column(nullable = false)
    private int points;

    @JsonIgnore
    @Column(nullable = false)
    private String date;



    @JsonIgnore
    @Column(nullable = false)
    private String selectedOptions;
}
