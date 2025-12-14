import React, { useState, useEffect } from "react";
import bubble from "../../src/bubble.svg";
import bubble2 from "../../src/bubble2.svg";
import bubble3 from "../../src/bubble3.svg";
import bubble4 from "../../src/bubble4.svg";
import "../../waterscreenstyle.css";

export const AddWaterMenu = ({ onClose, onSuccess, waterToEdit }) => {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [amountMl, setAmountMl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [trackerId, setTrackerId] = useState(null);
  const [entryId, setEntryId] = useState(null);

  useEffect(() => {
    if (waterToEdit) {
      setIsEditMode(true);
      setDate(waterToEdit.date || today);
      setAmountMl(waterToEdit.amountMl?.toString() || "");
      setTrackerId(waterToEdit.trackerId || null);
      setEntryId(waterToEdit.id || null);
    } else {
      setIsEditMode(false);
      setDate(today);
      setAmountMl("");
      setTrackerId(null);
      setEntryId(null);
    }
  }, [waterToEdit, today]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !amountMl || parseFloat(amountMl) <= 0) {
      alert("Пожалуйста, заполните все поля корректно. Количество воды должно быть больше 0.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Пользователь не авторизован");

      const now = new Date();
      const fullDateTime = new Date(`${date}T${now.toTimeString().slice(0, 8)}`);

      const entry = {
        time: fullDateTime.toISOString(),
        amountMl: parseFloat(amountMl)
      };

      if (isEditMode && trackerId) {
        const trackerResponse = await fetch(`/api/water/${trackerId}`);
        if (!trackerResponse.ok) throw new Error("Не удалось загрузить трекер");

        const existingTracker = await trackerResponse.json();

        const updatedEntries = existingTracker.entries.map(e =>
            e.id === entryId ? { ...e, ...entry } : e
        );

        if (!updatedEntries.find(e => e.id === entryId)) {
          updatedEntries.push({ ...entry, id: entryId });
        }

        const updatedTracker = {
          date: existingTracker.date,
          goalMl: existingTracker.goalMl,
          entries: updatedEntries
        };

        const response = await fetch(`/api/water/${trackerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTracker),
          credentials: "include"
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ошибка обновления: ${response.status} - ${errorText}`);
        }
      } else {
        const waterData = {
          date: date,
          goalMl: 2000,
          entries: [entry]
        };

        const response = await fetch(`/api/water?userId=${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(waterData),
          credentials: "include"
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ошибка сохранения: ${response.status} - ${errorText}`);
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error("Ошибка:", err);
      alert(`Не удалось сохранить запись о воде: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!trackerId || !entryId) {
      alert("Невозможно удалить запись: недостаточно данных");
      return;
    }

    if (!window.confirm("Вы уверены, что хотите удалить эту запись о воде?")) {
      return;
    }

    try {
      const trackerResponse = await fetch(`/api/water/${trackerId}`);
      if (!trackerResponse.ok) throw new Error("Не удалось загрузить трекер");

      const existingTracker = await trackerResponse.json();

      const updatedEntries = existingTracker.entries.filter(e => e.id !== entryId);

      if (updatedEntries.length === 0) {
        const deleteResponse = await fetch(`/api/water/${trackerId}`, {
          method: "DELETE",
          credentials: "include"
        });

        if (!deleteResponse.ok) {
          throw new Error("Ошибка удаления трекера");
        }
      } else {
        const updatedTracker = {
          date: existingTracker.date,
          goalMl: existingTracker.goalMl,
          entries: updatedEntries
        };

        const updateResponse = await fetch(`/api/water/${trackerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTracker),
          credentials: "include"
        });

        if (!updateResponse.ok) {
          throw new Error("Ошибка обновления трекера");
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error("Ошибка:", err);
      alert(`Не удалось удалить запись о воде: ${err.message}`);
    }
  };

  return (
      <div className="add-water-menu">
        <div className="add-water-menu-cards-container">
          <img className="bubble" src={bubble} alt="Пузырь" />
          <img className="bubble2" src={bubble2} alt="Пузырь" />
          <img className="bubble3" src={bubble3} alt="Пузырь" />
          <img className="bubble4" src={bubble4} alt="Пузырь" />
          <img className="bubble5" src={bubble2} alt="Пузырь" />
          <img className="bubble6" src={bubble3} alt="Пузырь" />

          <div className="add-water-menu-cards">
            <form className="water-data-form" onSubmit={handleSubmit}>
              <div className="input-group date-group">
                <label htmlFor="date-input" className="input-label">
                  Дата приема <br />
                </label>
                <input
                    type="date"
                    id="date-input"
                    className="input-field"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    disabled={isEditMode}
                />
              </div>

              <div className="input-group water-group">
                <label htmlFor="water-input" className="input-label">
                  Количество выпитой воды
                </label>
                <div className="input-with-unit">
                  <input
                      type="number"
                      id="water-input"
                      placeholder="мл"
                      className="input-field"
                      value={amountMl}
                      onChange={(e) => setAmountMl(e.target.value)}
                      min="1"
                      step="1"
                      required
                  />
                  <span className="unit-label">мл</span>
                </div>
              </div>

              <div className="form-actions-row">
                <button
                    type="button"
                    className="button-cancel"
                    onClick={onClose}
                >
                  Отмена
                </button>
                {isEditMode && (
                    <button
                        type="button"
                        className="button-delete"
                        onClick={handleDelete}
                    >
                      Удалить
                    </button>
                )}
                <button
                    type="submit"
                    className="button-save"
                >
                  {isEditMode ? "Обновить" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};