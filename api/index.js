const https = require('https');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'GET') return res.status(200).send("Proxy Online");

    let bodyData = "";
    if (req.body && typeof req.body === 'object') {
        bodyData = Object.keys(req.body).map(k => k + '=' + encodeURIComponent(req.body[k])).join('&');
    } else {
        bodyData = req.body || "";
    }

    const options = {
        hostname: 'commandsend.lite.rent',
        port: 443,
        path: '/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from("cmds:9998").toString('base64'),
            'Content-Length': Buffer.byteLength(bodyData)
        },
        rejectUnauthorized: false
    };

    const proxyReq = https.request(options, (proxyRes) => {
        let result = '';
        proxyRes.on('data', d => { result += d; });
        proxyRes.on('end', () => res.status(200).send(result || "ok"));
    });

    proxyReq.on('error', e => res.status(200).send("Error: " + e.message));
    proxyReq.write(bodyData);
    proxyReq.end();
};
