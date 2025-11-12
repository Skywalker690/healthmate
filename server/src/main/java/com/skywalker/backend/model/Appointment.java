package com.skywalker.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.skywalker.backend.domain.STATUS;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Appointment DateTime is required")
    @Future(message = "Appointment must be in the future")
    private LocalDateTime appointmentDateTime;

    @Enumerated(EnumType.STRING)
    private STATUS status = STATUS.SCHEDULED;

    private String notes = "No notes";

    @Column(nullable = false,unique = true)
    private String appointmentCode;

    //TimeStamps
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Many appointments -> One doctor
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnore
    private Doctor doctor;

    // Many appointments -> One patient
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;

    // One appointment -> One time slot (optional, for new slot-based bookings)
    @OneToOne
    @JoinColumn(name = "time_slot_id")
    @JsonIgnore
    private TimeSlot timeSlot;
}
