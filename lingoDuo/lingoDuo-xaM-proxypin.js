async function onRequest(context, request) {
  return request;
}

async function onResponse(context, request, response) {
  try {
    const obj = JSON.parse(response.body);
    if (!obj.responses) return response;
    if (obj.responses.length < 2 || 'etag' in obj.responses[0].headers) {
      console.log('不是目标数据，跳过处理');
      return response;
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    const userdata = JSON.parse(obj.responses[0].body);
    userdata.shopItems.push({
      id: 'gold_subscription',
      purchaseDate: timestamp - 172800,
      purchasePrice: 0,
      subscriptionInfo: {
        expectedExpiration: timestamp + 31536000,
        productId: "com.duolingo.DuolingoMobile.subscription.Gold.TwelveMonth.24Q2Max.168",
        renewer: 'APPLE',
        renewing: true,
        tier: 'twelve_month',
        type: 'gold'
      }
    });

    userdata.subscriberLevel = 'GOLD';
    userdata.trackingProperties.has_item_immersive_subscription = true;
    userdata.trackingProperties.has_item_premium_subscription = true;
    userdata.trackingProperties.has_item_live_subscription = true;
    userdata.trackingProperties.has_item_gold_subscription = true;
    userdata.trackingProperties.has_item_max_subscription = true;
    obj.responses[0].body = JSON.stringify(userdata);
    const finalBody = JSON.stringify(obj);
    response.body = finalBody;
    response.headers["content-length"] = finalBody.length.toString();
    console.log('Super Duolingo 开启成功！');
  } catch (e) {
    console.error("处理响应失败", e);
  }
  return response;
}