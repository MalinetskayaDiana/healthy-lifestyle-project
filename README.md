# Курсовой проект: Интеллектуальный ассистент по ЗОЖ 

## Описание проекта
Приложение для отслеживания показателей здоровья, включая питание, физическую активность, сон и потребление воды. Позволяет пользователям вести дневник активности, анализировать статистику и получать персональные рекомендации.

## Основной функционал
- 📊 **Трекинг питания**: Добавление приемов пищи с детализацией КБЖУ
- 💧 **Учет воды**: Контроль ежедневного потребления жидкости
- 🏃 **Активность**: Запись тренировок и ежедневной активности
- 🛌 **Сон**: Мониторинг продолжительности и качества сна
- 📈 **Статистика**: Визуализация данных за неделю/месяц
- 🔐 **Аутентификация**: Регистрация, вход, восстановление пароля

## Технологии
### Frontend
- React + React Router
- Axios/Fetch для API-запросов
- CSS-модули для стилизации
- Библиотеки для графиков (настраиваемые SVG-элементы)

### Backend
- Java 17 + Spring Boot
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL/H2 (в зависимости от конфигурации)
- Lombok для сокращения boilerplate-кода

## Установка и запуск
1. Клонировать репозиторий:
    ```sh
    https://github.com/MalinetskayaDiana/healthy-lifestyle-project.git
    ```
2. Backend (требуется Maven и Java 17):
    ```
    cd backend
    mvn spring-boot:run
    ```
3. Frontend:
    ```
    cd frontend
    npm install
    npm start
    ```

## Конфигурация
1. Создать файл ```application.properties``` в backend/src/main/resources:
    ```
    spring.datasource.url=jdbc:postgresql://localhost:5432/fitness
    spring.datasource.username=postgres
    spring.datasource.password=postgres
    spring.jpa.hibernate.ddl-auto=update
    jwt.secret=your-secret-key
    ```
2. Настроить CORS в ```SecurityConfig.java```:
    ```
    @Bean
    public CorsConfigurationSource corsConfigurationSource()    {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        // ... остальные настройки
    }
    ```

## API Endpoints

| Метод | Путь | Описание |
| ----------- | ----------- | ----------- |
| POST    | /api/v1/registration    | Регистрация    |
| POST    | /login    | Авторизация   |
| POST    | /api/food?userId=${userId}    | Добавление пищи    |
| POST    | /api/water?userId=${userId}    | Добавление воды    |
| POST    | /api/sleep?userId=${userId}    | Добавление сна    |
| POST    | /api/activity?userId=${userId}    | Добавление активности    |
| GET    | /api/stats/weekly    | Статистика за неделю    |
| POST    | /api/chat    | Чат    |
| POST    | /api/password/forgot    | Запрос сброса пароля    |


## Автор

* GitHub: [@marrianna.yurk](https://github.com/Mariannnnaaaaa)


## 📝 Лицензия
MIT License. Подробнее см. в файле [LICENSE](https://opensource.org/license/mit/).
