# Тестовое задание для Elma 
____

Для запуска проекта требуется ввести "npm run start"

____

### Что было реализовано?
1) Парсер (очень быстрый), что бы превращать html разметку в virtual node 
2) Форма контроля схожая с React (Fake React) для удобного манипулирования нодами
3) Сам сайт, туда входит адаптивная верстка, перетаскивание задач с беклога и прокрутка по неделям, т.е все что было указано в тестовом задании
4) Глобальный стор, построенный на реактивности и отслеживаемый с помощью патерна observer.
5) Все было написано на native js с использованием typescript.

### Что не было реализовано?
1) Не успел оптимизировать глобальный стор и добавить туда batching 
2) Во время drag n dropa не смотря на то что работаю с виртуальным dom-ом, использовал обращение к обычному

#### Пометки
1) С сервера приходят данные о задачах и все их поля с описанием задачи(description) были пустые, поэтому вместо текста задания использовал поле subject
