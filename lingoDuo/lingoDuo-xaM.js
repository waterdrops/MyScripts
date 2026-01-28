try {
    let obj = JSON.parse($response.body);
    if (!obj.responses || obj.responses.length < 1) {
        // skip
    } else if (obj.responses[0].headers && 'etag' in obj.responses[0].headers) {
        // skip
    } else {
        const now = Math.floor(Date.now() / 1000);
        const r0 = obj.responses[0];
        const originalBody = r0.body;
        const parsedBody = typeof originalBody === 'string' ? JSON.parse(originalBody) : originalBody;

        // Duolingo batch body sometimes is an array with the actual user object at index 0
        const userdata = Array.isArray(parsedBody) ? (parsedBody[0] || {}) : parsedBody;
        if (!userdata.shopItems) userdata.shopItems = [];

        // upsert instead of always pushing duplicates
        const gold = {
            id: 'gold_subscription',
            itemName: 'gold_subscription',
            purchaseDate: now - 172800,
            purchasePrice: 0,
            subscriptionInfo: {
                expectedExpiration: now + 31536000,
                productId: "com.duolingo.DuolingoMobile.subscription.Gold.TwelveMonth.24Q2Max.168",
                renewer: 'APPLE',
                renewing: true,
                tier: 'twelve_month',
                type: 'gold'
            }
        };
        const idx = userdata.shopItems.findIndex(it => it && it.id === 'gold_subscription');
        if (idx >= 0) {
            // 保留旧字段（例如 purchaseId/quantity 等），并强制写入/覆盖我们关心的字段
            userdata.shopItems[idx] = { ...(userdata.shopItems[idx] || {}), ...gold };
        } else {
            userdata.shopItems.push(gold);
        }

        userdata.subscriberLevel = 'GOLD';
        if (!userdata.trackingProperties) userdata.trackingProperties = {};
        userdata.trackingProperties.has_item_immersive_subscription = true;
        userdata.trackingProperties.has_item_premium_subscription = true;
        userdata.trackingProperties.has_item_live_subscription = true;
        userdata.trackingProperties.has_item_gold_subscription = true;
        userdata.trackingProperties.has_item_max_subscription = true;

        // write back preserving original shape
        if (Array.isArray(parsedBody)) parsedBody[0] = userdata;
        r0.body = typeof originalBody === 'string' ? JSON.stringify(parsedBody) : parsedBody;
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
