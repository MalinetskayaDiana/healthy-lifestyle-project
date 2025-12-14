import React, {useEffect, useState} from "react";
import line100 from "./src/line-100.svg";
import maskGroup2 from "./src/mask-group-2.svg";
import maskGroup from "./src/mask-group.svg";
import "./foodscreenstyle.css";
import vector5 from "./src/vector-5.svg";
import vector from "./src/vector.svg";
import { AddFoodMenu } from "./components/AddFoodMenu/addfoodmenu";
import FoodRecord from "./components/FoodRecord/foodrecord";

import { useNavigate } from "react-router-dom";

export const FoodScreen = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [editingFood, setEditingFood] = useState(null);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [totalCalories, setTotalCalories] = useState(0);
    const userId = localStorage.getItem("userId");

    const loadFoodData = async () => {
        try {
            const reportResponse = await fetch(`/report/today?userId=${userId}`);

            if (!reportResponse.ok) {
                const errorText = await reportResponse.text();
                throw new Error(`HTTP error! status: ${reportResponse.status}. Response: ${errorText}`);
            }
            const report = await reportResponse.json();
            setTotalCalories(report.totalCalories || 0);

            const response = await fetch(`/api/food/user/${userId}/today`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
            }

            const data = await response.json();

            const formattedData = data.flatMap(tracker =>
                tracker.entries.map(entry => ({
                    id: entry.id,
                    trackerId: tracker.id,
                    label: entry.foodName,
                    volume: `${entry.calories} ккал`,
                    grams: `${entry.proteins} г белков`,
                    foodName: entry.foodName,
                    calories: entry.calories,
                    proteins: entry.proteins,
                    fats: entry.fats,
                    carbs: entry.carbs,
                    fiber: entry.fiber,
                    sugar: entry.sugar,
                    time: entry.time,
                    date: tracker.date,
                    rawName: entry.foodName,
                    rawCalories: entry.calories,
                    rawProteins: entry.proteins,
                    rawFats: entry.fats,
                    rawCarbs: entry.carbs,
                    rawFiber: entry.fiber,
                    rawSugar: entry.sugar,
                    rawTime: entry.time,
                    rawDate: tracker.date
                }))
            );

            setRecords(formattedData);
        } catch (err) {
            console.error("Ошибка загрузки:", err);
        }
    };

    useEffect(() => {
        loadFoodData();
    }, []);

    // Открытие меню для добавления
    const handleAddClick = () => {
        setEditingFood(null);
        setShowAddMenu(true);
    };

    // Открытие меню для редактирования
    const handleEditClick = (record) => {
        setEditingFood(record);
        setShowAddMenu(true);
    };

    // Callback после успешного сохранения/обновления/удаления
    const handleFoodSave = async () => {
        await loadFoodData();
        setShowAddMenu(false);
        setEditingFood(null);
    };

    const handleCloseMenu = () => {
        setShowAddMenu(false);
        setEditingFood(null);
    };

    const handleClick = () => {
        navigate('/main');
    };

    return (
        <div className="foodscreen">
            <div className="group">
                <div className="overlap-group-2">
                    <img className="mask-group" alt="Mask group" src={maskGroup2} />

                    <img className="img" alt="Mask group" src={maskGroup} />
                </div>
            </div>
            <div className="div">
                <div className="overlap">
                    <div className="overlap-group">


                        <div className="text-wrapper">Питание</div>

                        <div className="text-wrapper-2">Сегодня</div>

                        <div className="div-2">
                            <div className="text-wrapper-3">Назад</div>

                            <img className="vector" alt="Vector" src={vector} onClick={handleClick}/>
                        </div>

                        <div className="text-wrapper-4">{totalCalories} ККал</div>
                    </div>

                    {/* Контейнер для списка записей с скроллом */}
                    <div className="food-records-container">
                        {records.map((record) => (
                            <FoodRecord
                                key={record.id}
                                volume={record.volume}
                                label={record.label}
                                grams={record.grams}
                                onClick={() => handleEditClick(record)}
                            />
                        ))}
                    </div>

                </div>



                <div className="overlap-wrapper">
                    <div className="div-wrapper" onClick={handleAddClick}>
                        <div className="text-wrapper-7">+ Еда</div>
                    </div>
                </div>
            </div>
            {showAddMenu && (
                <div className="add-food-menu-container">
                    <AddFoodMenu
                        onClose={handleCloseMenu}
                        onSuccess={handleFoodSave}
                        foodToEdit={editingFood}
                        trackerId={editingFood?.trackerId}
                    />
                </div>
            )}
        </div>
    );
};