// api_proxy.js — 代理转发

const targetUrl = decodeURIComponent($request.url.match(/target=([^&]*)/)?.[1] || "");

if (!targetUrl) {
    $done({ response: { status: 400, headers: { "Content-Type": "application/json" }, body: '{"error":"missing target"}' } });
} else {
    $httpClient.get({ url: targetUrl }, function (err, resp, data) {
        // ⚠️ 不能透传 resp.headers：$httpClient 自动解压 gzip 但保留
        //    Content-Encoding:gzip 头，浏览器二次解压会失败。
        //    只取 Content-Type，其余重新构造。
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
