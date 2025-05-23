package marianna.yurk.fitness_app.activity_tracker;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Version;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record ActivityTracker(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id,
    @NotEmpty
    String activityType,
    @Positive
    int duration, // в минутах
    @Positive
    int caloriesBurned,
    LocalDateTime activityTimestamp,
    Long userId
)
    {}