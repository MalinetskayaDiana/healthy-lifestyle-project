import React, { useState, useEffect } from "react";
import star from "../src/star.svg";
import moon from "../src/moon.svg";
import "../sleepscreenstyle.css";
import "../../QuestionnaireScreen/questionnairescreenstyle.css";

// Преобразование секунд в формат "HH:MM:SS"
const secondsToHMS = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};

// Преобразование строки "HH:MM:SS" в секунды
const HMSToSeconds = (hms) => {
  const parts = hms.split(":");
  if (parts.length !== 3) return 0;
  const [hrs, mins, secs] = parts.map(Number);
  return hrs * 3600 + mins * 60 + secs;
};

// Форматирование даты для input[type="datetime-local"]
const formatDatetimeLocal = (date) => {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const AddMenu = ({ onClose }) => {
  // Изначально длительность сна берётся из таймера (в секундах) из localStorage
  const initialTimer = parseInt(localStorage.getItem("sleepTimerTimer") || "0", 10);
  const now = new Date();

  // Состояния:
  // sleepEnd – время окончания сна (например, время пробуждения),
  // sleepDurationString – длительность сна в формате "HH:MM:SS",
  // sleepStart – время начала сна (вычисляется как sleepEnd - длительность).
  const [sleepEnd, setSleepEnd] = useState(now);
  const [sleepDurationString, setSleepDurationString] = useState(secondsToHMS(initialTimer));
  const [sleepStart, setSleepStart] = useState(
    new Date(now.getTime() - HMSToSeconds(secondsToHMS(initialTimer)) * 1000)
  );

  // Флаг, определяющий, какое поле было отредактировано последним.
  // Возможные значения: "start", "end", "duration". По умолчанию – "duration".
  const [lastChanged, setLastChanged] = useState("duration");

  // Если изменились время окончания или длительность (lastChanged === "end" или "duration"),
  // пересчитываем время начала сна как: sleepStart = sleepEnd - длительность.
  useEffect(() => {
    if (lastChanged === "end" || lastChanged === "duration") {
      const durationSec = HMSToSeconds(sleepDurationString);
      setSleepStart(new Date(sleepEnd.getTime() - durationSec * 1000));
    }
  }, [sleepEnd, sleepDurationString, lastChanged]);

  // Если изменяется время начала сна (lastChanged === "start"),
  // пересчитываем длительность как разницу между sleepEnd и sleepStart.
  useEffect(() => {
    if (lastChanged === "start") {
      let newDurationSec = Math.floor((sleepEnd.getTime() - sleepStart.getTime()) / 1000);
      if (newDurationSec < 0) newDurationSec = 0;
      setSleepDurationString(secondsToHMS(newDurationSec));
    }
  }, [sleepStart, sleepEnd, lastChanged]);

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) throw new Error("User not authenticated");

            // Преобразование данных в формат для бэкенда
            const sleepData = {
                date: sleepStart.toISOString().split("T")[0], // LocalDate
                bedtime: sleepStart.toLocaleTimeString("en-GB", {hour12: false}), // LocalTime (HH:mm:ss)
                wakeupTime: sleepEnd.toLocaleTimeString("en-GB", {hour12: false}),
                sleepDuration: HMSToSeconds(sleepDurationString) / 3600.0, // в часах (double)
                sleepQuality: 4, // Пример (можно добавить выбор качества сна)
                notes: "" // Опционально
            };

            // Отправка данных
            const response = await fetch("/api/sleep?userId=" + userId, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sleepData),
                credentials: "include"
            });

            if (!response.ok) throw new Error("Ошибка сохранения");
            onClose(); // Закрыть меню после успеха
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось сохранить данные сна");
        }
    };

  return (
    <div className="add-sleep-menu">
        <div className="background-group-sleep">
          <img className="star-icon" src={star} alt="Star" />

          <img className="moon-icon" src={moon} alt="Moon" /> 
        </div>
        

      <div className="add-sleep-menu-container">
        {/* Изображения для звезды и луны */}
           
        <div className="add-sleep-menu-card">

          <div className="button-save" onClick={handleSave}>
            <div className="div-wrapper-save">
              <div className="text-wrapper-22">Сохранить</div>
            </div>
          </div>

          <div className="sleep-data-form">
            <label>
              Время начала Вашего сна:
              <input
                type="datetime-local"
                value={formatDatetimeLocal(sleepStart)}
                onChange={(e) => {
                  const newStart = new Date(e.target.value);
                  setSleepStart(newStart);
                  setLastChanged("start");
                  // Пересчитываем длительность, чтобы она соответствовала разнице между sleepEnd и новым sleepStart.
                  const newDurationSec = Math.floor((sleepEnd.getTime() - newStart.getTime()) / 1000);
                  setSleepDurationString(secondsToHMS(newDurationSec < 0 ? 0 : newDurationSec));
                }}
              />
            </label>

            <label>
              Время окончания Вашего сна:
              <input
                type="datetime-local"
                value={formatDatetimeLocal(sleepEnd)}
                onChange={(e) => {
                  const newEnd = new Date(e.target.value);
                  setSleepEnd(newEnd);
                  setLastChanged("end");
                  // При изменении времени окончания пересчитываем время начала по текущей длительности.
                  const durationSec = HMSToSeconds(sleepDurationString);
                  setSleepStart(new Date(newEnd.getTime() - durationSec * 1000));
                }}
              />
            </label>

            <label>
              Длительность Вашего сна:
              <input
                type="text"
                value={sleepDurationString}
                onChange={(e) => {
                  const newDuration = e.target.value;
                  setSleepDurationString(newDuration);
                  setLastChanged("duration");
                  // При редактировании длительности пересчитываем время начала сна.
                  const durationSec = HMSToSeconds(newDuration);
                  setSleepStart(new Date(sleepEnd.getTime() - durationSec * 1000));
                }}
                placeholder="HH:MM:SS"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
