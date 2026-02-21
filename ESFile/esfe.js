let body = $response.body;
try {
    let obj = JSON.parse(body);
    obj.result = {
        "id": 1766030472967647234,
        "skuId": "1766030472967647234",
        "itemId": "es_vip",
        "itemName": "ES永久会员",
        "skuType": 1,
        "productName": "es_vip",
        "type": 4,
        "status": 1, 
        "isVip": true,
        "valid": true,
        "expireTime": 4092599349000
    };
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
