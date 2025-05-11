import React, {useEffect, useState} from "react";
import line89 from "./src/line-89.svg";
import maskGroup2 from "./src/mask-group-2.svg";
import "./activityscreenstyle.css";
import union from "./src/union.svg";
import vector from "./src/vector.svg";
import { AddActivityMenu } from "./components/AddActivityMenu/addactivitymenu";
import ActivityRecord from "./components/ActivityRecord/activityrecord";

import { useNavigate } from "react-router-dom";

export const ActivityScreen = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const userId = localStorage.getItem("userId");
    const [totalDuration, setTotalDuration] = useState(0);

  const loadActivities = async () => {
    try {
      const reportResponse = await fetch(`/report/today?userId=${userId}`);
      const report = await reportResponse.json();
      setTotalDuration(report.activityDurationMinutes || 0);

      // Загрузка списка активностей
      const response = await fetch(`/api/activity/user/${userId}`);

      if (!response.ok) throw new Error("Ошибка загрузки данных");

      const data = await response.json();
      const today = new Date().toISOString().split('T')[0];

      const formattedData = data
          .filter(activity =>
              new Date(activity.activityTimestamp).toISOString().split('T')[0] === today
          )
          .map(activity => ({
            id: activity.id,
            label: activity.activityType,
            volume: `${activity.caloriesBurned} ккал`,
            grams: `${activity.duration} мин`,
            time: new Date(activity.activityTimestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          }));

      setRecords(formattedData);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  // При нажатии на кнопку открываем меню
  const handleActivityClick = () => {
    setShowAddMenu(true);
  };

  const handleActivityAdd = async () => {
    await loadActivities();
    setShowAddMenu(false);
  };

    const handleClick = () => {
      navigate('/main');
    };

  return (
    <div className="activityscreen">
      <div className="div">
        <div className="union">
          <img className="union-2" alt="Union" src={union} />

          <div className="text-wrapper">Сегодня</div> 
          

          <div className="ellipse" />

          <img className="line" alt="Line" src={line89} />


          <div className="text-wrapper-2">Активность</div>

          <div className="div-2">
            <div className="text-wrapper-3">Назад</div>

            <img className="vector" alt="Vector" src={vector} onClick={handleClick}/>
          </div>

          <div className="overlap-wrapper">
            <div className="overlap">
              <img className="mask-group-2" alt="Mask group" src={maskGroup2} />
            </div>
          </div>

          <div className="text-wrapper-4">{totalDuration} мин</div>
        </div>

        {/* Контейнер для списка записей с скроллом */}
          <div className="activity-records-container">
              {records.map((record) => (
                <ActivityRecord
                  key={record.id}
                  volume={record.volume}
                  label={record.label}
                  grams= {record.grams}
                  time={record.time}
                />
              ))}
            </div>
        {/*
        <div className="text-wrapper-5">150 ккал</div>

        <p className="element">
          <span className="span">
            Активность
            <br />
          </span>

          <span className="text-wrapper-6">10 мин</span>
        </p>

        <img className="line-2" alt="Line" src={line100} />

        <img className="vector-2" alt="Vector" src={vector6} />
        */}
        

        <div className="overlap-group-wrapper">
          <div className="div-wrapper" onClick={handleActivityClick}>
            <div className="text-wrapper-7">+ Активность</div>
          </div>
        </div>


      </div>

      {showAddMenu && (
          <div className="add-activity-menu-container">
            <AddActivityMenu
                onClose={() => setShowAddMenu(false)}
                onSuccess={handleActivityAdd}
            />
          </div>
      )}
    </div>
  );
};
