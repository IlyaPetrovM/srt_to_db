# SRT to DB Service

Сервис для загрузки субтитров из SRT файлов в БД MariaDB (таблица `marks`).

## Запуск

```bash
docker-compose up -d
```

Сервис будет доступен на `http://localhost:3333`

## API

**POST /upload**
- `fileId` (form data): ID файла в таблице `files`
- `srtFile` (file): SRT файл

Ответ: `{"success": true, "count": 3}`

## Структура SRT

```
1
00:00:01,000 --> 00:00:03,000
Text of subtitle

2
00:00:05,000 --> 00:00:07,000
Another subtitle
```

## База данных

- Хост: `mediarch-serviceMariadb-1` (в Docker сети)
- БД: `mediarch`
- Таблица: `marks`
  - `file_id`: ID медиафайла
  - `time_msec`: время начала в миллисекундах
  - `start_time`: время начала (hh:mm:ss)
  - `recognition0`: текст субтитра
