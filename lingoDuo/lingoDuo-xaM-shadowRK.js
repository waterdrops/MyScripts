try {
    let obj = JSON.parse($response.body);
    if (obj.responses && obj.responses.length >= 2) {
        let userdata = JSON.parse(obj.responses[0].body);
        const timestamp = Math.floor(Date.now() / 1000);
        if (!userdata.shopItems) userdata.shopItems = [];
        userdata.shopItems.push({
            "id": "gold_subscription",
            "purchaseDate": timestamp - 172800,
            "purchasePrice": 0,
            "subscriptionInfo": {
                "expectedExpiration": timestamp + 31536000,
                "productId": "com.duolingo.DuolingoMobile.subscription.Gold.TwelveMonth.24Q2Max.168",
                "renewer": "APPLE",
                "renewing": true,
                "tier": "twelve_month",
                "type": "gold"
            }
        });
        userdata.subscriberLevel = "GOLD";
        if (!userdata.trackingProperties) userdata.trackingProperties = {};
        const props = [
            "has_item_immersive_subscription",
            "has_item_premium_subscription",
            "has_item_live_subscription",
            "has_item_gold_subscription",
            "has_item_max_subscription"
        ];
        props.forEach(p => userdata.trackingProperties[p] = true);
        obj.responses[0].body = JSON.stringify(userdata);
        $done({ body: JSON.stringify(obj) });
    } else $done({});
} catch (e) {
    $done({});
}