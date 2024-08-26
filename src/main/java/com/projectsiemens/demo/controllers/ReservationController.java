package com.projectsiemens.demo.controllers;

import com.projectsiemens.demo.models.Reservation;
import com.projectsiemens.demo.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:63342")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public Reservation getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }

    @GetMapping("/user/{userId}")
    @CrossOrigin(origins = "http://localhost:63342")
    public List<Reservation> getReservationsByUserId(@PathVariable String userId) {
        return reservationService.getReservationsByUserId(userId);
    }


    @PostMapping
    public Reservation saveReservation(@RequestBody Reservation reservation) {
        return reservationService.saveReservation(reservation);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        Reservation reservation = reservationService.getReservationById(id);
        if (reservation != null) {
            Date checkInDate = reservation.getCheckInDate();
            Date now = new Date();
            long differenceInMilliseconds = checkInDate.getTime() - now.getTime();
            long differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
            if (differenceInHours >= 2) {
                reservationService.deleteReservation(id);
            } else {
                throw new IllegalStateException("Cannot cancel reservation within 2 hours of check-in.");
            }
        }
    }
}

