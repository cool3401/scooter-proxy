const axios = require('axios');
const https = require('https');

module.exports = async (req, res) => {
    // Настройка CORS, чтобы браузер не блокировал запрос (Failed to fetch)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // Предварительная проверка браузером (preflight request)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
        const response = await axios({
            method: 'post',
            url: "https://commandsend.lite.rent/send",
            data: req.body, // Пробрасываем данные (imeis и command)
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from("cmds:9998").toString('base64'),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            httpsAgent: agent
        });
        
        // Возвращаем ответ от сервера самокатов обратно в ваш интерфейс
        res.status(200).send(response.data);
    } catch (error) {
        res.status(200).send(error.response ? error.response.data : error.message);
    }
};
