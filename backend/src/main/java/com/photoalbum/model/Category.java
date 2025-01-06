package com.photoalbum.model;

import lombok.Data;

import javax.persistence.*;

import javax.validation.constraints.NotEmpty;

@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Category name cannot be empty")
    private String name;
}
