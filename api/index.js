export default async function handler(req, res) {
    // 1. Заголовки CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 2. Ответ на проверку браузера
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Тест через браузер
    if (req.method === 'GET') {
        return res.status(200).send("Vercel Proxy v2: OK. Мост готов!");
    }

    // 4. Пересылка команды на сервер самокатов
    try {
        // Получаем тело запроса (imeis и command)
        const body = new URLSearchParams(req.body).toString();

        const response = await fetch("https://commandsend.lite.rent/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from("cmds:9998").toString("base64"),
                "User-Agent": "Mozilla/5.0"
            },
            body: body
        });

        const data = await response.text();
        return res.status(200).send(data);
    } catch (error) {
        return res.status(200).send("Ошибка Vercel: " + error.message);
    }
}
