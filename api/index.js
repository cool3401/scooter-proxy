const https = require('https');
const axios = require('axios');

export default async function handler(req, res) {
    const BEGET_FILE_URL = "https://vash-sait.beget.tech/cmd.txt"; // Укажите ваш адрес
    const TARGET_URL = "https://commandsend.lite.rent/send";

    try {
        // 1. Идем на Beget и забираем команду
        const begetRes = await axios.get(BEGET_FILE_URL);
        const content = begetRes.data.trim();

        if (!content || content === "") {
            return res.status(200).send("Очередь пуста");
        }

        const [imei, command] = content.split("|");

        // 2. Отправляем её на сервер самокатов
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios({
            method: 'post',
            url: TARGET_URL,
            data: `imeis=${imei}&command=${command}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from("cmds:9998").toString('base64')
            },
            httpsAgent: agent
        });

        res.status(200).send("Выполнено: " + response.data);
    } catch (e) {
        res.status(500).send("Ошибка: " + e.message);
    }
}
