package com.projectsiemens.demo.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Date;

@Entity
@Data
@CrossOrigin
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long hotelId;
    private String roomType;
    private Date checkInDate;
    private Date checkOutDate;
    private String userId;
    private Date createdAt = new Date();

    // Getters and Setters
}
