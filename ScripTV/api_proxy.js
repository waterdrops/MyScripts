// 文件名: api_proxy.js
const url = $request.url;
const method = $request.method;

// 1. 处理 OPTIONS 预检请求（浏览器跨域机制必备）
if (method.toUpperCase() === "OPTIONS") {
    $done({
        response: {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "86400"
            }
        }
    });
} else {
    // 2. 从当前 URL 提取真实的采集源地址
    // 前端请求示例: https://www.scrip.tv/api/?target=https%3A%2F%2Fapi.maccms.com%2Fapi.php
    const match = url.match(/target=([^&]*)/);

    if (!match || !match[1]) {
        $done({
            response: {
                status: 400,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" 
                },
                body: JSON.stringify({ error: "缺少 target 参数" })
            }
        });
    } else {
        const targetUrl = decodeURIComponent(match[1]);

        // 3. 构造转发请求
        const requestOptions = {
            url: targetUrl,
            method: method,
            headers: {
                // 伪装常规浏览器，防止部分 CMS 接口拦截
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        };

        // 如果是 POST 请求，原样透传 Body 和 Content-Type
        if ($request.body) {
            requestOptions.body = $request.body;
            const reqContentType = $request.headers['Content-Type'] || $request.headers['content-type'];
            if (reqContentType) {
                requestOptions.headers['Content-Type'] = reqContentType;
            }
        }

        // 4. 发起真实网络请求
        $httpClient[method.toLowerCase()](requestOptions, function(error, resp, data) {
            if (error) {
                $done({
                    response: {
                        status: 502,
                        headers: { 
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*" 
                        },
                        body: JSON.stringify({ error: "网关转发失败", details: String(error) })
                    }
                });
            } else {
                // 5. 拿到源站响应，强行注入 CORS 头后返回给前端
                const headers = resp.headers || {};
                
                // 抹除目标服务器可能存在的严苛 CORS 限制，统一放行
                headers["Access-Control-Allow-Origin"] = "*";
                headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";

                $done({
                    response: {
                        status: resp.status || 200,
                        headers: headers,
                        body: data
                    }
                });
            }
        });
    }
}