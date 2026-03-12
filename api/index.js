const axios = require('axios');
const https = require('https');

module.exports = async (req, res) => {
  // Игнорируем проблемы с SSL сертификатом (решает ошибку 526)
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const targetUrl = "https://commandsend.lite.rent/send";

  try {
    const response = await axios({
      method: 'post',
      url: targetUrl,
      data: req.body, 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from("cmds:9998").toString('base64'),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      httpsAgent: agent
    });

    res.status(200).send(response.data);
  } catch (error) {
    // Пробрасываем ответ сервера, даже если там ошибка
    res.status(200).send(error.response ? error.response.data : error.message);
  }
};
