const targetUrl = decodeURIComponent($request.url.match(/target=([^&]*)/)?.[1] || "");

if (!targetUrl) {
    $done({ 
        response: { 
            status: 400, 
            headers: { "Content-Type": "application/json" }, 
            body: { error: "missing target" }
        }
    });
} else {
    $httpClient.get({ url: targetUrl }, function (err, resp, data) {
        const ct = !err && resp.headers
            ? (resp.headers["Content-Type"] || resp.headers["content-type"] || "application/octet-stream")
            : "application/json";
        $done({
            response: { 
                status: err ? 502 : (resp.status || 200),
                headers: {
                    "Content-Type": ct,
                    "Access-Control-Allow-Origin": "*"
                },
                body: err ? JSON.stringify({ error: String(err) }) : data
            }
        });
    });
}
