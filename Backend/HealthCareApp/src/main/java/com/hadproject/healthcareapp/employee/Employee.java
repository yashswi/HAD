package com.hadproject.healthcareapp.employee;

import com.hadproject.healthcareapp.department.Department;
import com.hadproject.healthcareapp.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "title", length = 100)
    private String title;

    @Column(name = "photograph_path", length = 255)
    private String photographPath;

    @Column(name = "first_name", length = 255)
    private String first_name;

    @Column(name = "last_name", length = 255)
    private String last_name;

    @Column(name = "email", length = 255)
    private String email;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id") // This is the foreign key column in the employee table
    private User user;

//    @Column(name = "department")
//    private int department

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "department_id")
    private Department department;

    public Employee(String title, String photographPath, User user) {
        this.title = title;
        this.photographPath = photographPath;
        this.user = user;

    }
}
