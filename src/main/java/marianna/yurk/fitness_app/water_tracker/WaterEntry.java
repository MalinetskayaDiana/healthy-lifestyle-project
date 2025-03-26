package marianna.yurk.fitness_app.water_tracker;

import jakarta.persistence.Id;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record WaterEntry(
        @Id Integer id,
        Integer trackerId,
        LocalDateTime time,
        @Positive
        double amountMl // Количество выпитой воды (мл)
) {
}
