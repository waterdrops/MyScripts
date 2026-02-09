try {
  const raw = $response.body;
  
  // ---------- 0. 熔断 ----------
  const etagIdx = raw.indexOf('"etag"', 0, 500);
  const respIdx = raw.indexOf('"responses"', 0, 100);
  if (respIdx === -1 || etagIdx !== -1) {
    $done({ body: raw });
  }
  
  // ---------- 1. parse 外层 ----------
  const obj = JSON.parse(raw);
  if (!obj.responses || obj.responses.length < 1) {
    $done({ body: raw });
  }
  
  const r0 = obj.responses[0];
  if (r0.headers && 'etag' in r0.headers) {
    $done({ body: raw });
  }
  
  // ---------- 2. parse body ----------
  const parsedBody = JSON.parse(r0.body);  // 100% 字符串
  const userdata = parsedBody;             // 100% 对象
  
  const now = Math.floor(Date.now() / 1000);
  
  // ---------- 3. shopItems upsert ----------
  let shopItems = userdata.shopItems;
  if (!shopItems) shopItems = userdata.shopItems = [];
  
  // subscription upsert 
  const subscriptionInfo = {
    expectedExpiration: now + 31536000,
    productId: "com.duolingo.DuolingoMobile.subscription.Gold.TwelveMonth.24Q2Max.168",
    renewer: "APPLE",
    renewing: true,
    tier: "twelve_month",
    type: "gold"
  };
  
  let found = false;
  for (let i = 0, l = shopItems.length; i < l; i++) {
    const it = shopItems[i];
    if (it && it.id === "gold_subscription") {
      it.itemName = "gold_subscription";
      it.purchasePrice = 0;
      it.purchaseDate = now - 172800;
      it.subscriptionInfo = subscriptionInfo;
      found = true;
      break;
    }
  }
  
  if (!found) {
    shopItems.push({
      id: "gold_subscription",
      purchasePrice: 0,
      purchaseDate: now - 172800,
      subscriptionInfo
    });
  }

  // xp_boost_stackable upsert 
  // 随机选择 2 或 3 作为倍数
  const xpMultiplier = Math.random() < 0.5 ? 2 : 3;
  
  let foundXpBoost = false;
  for (let i = 0, l = shopItems.length; i < l; i++) {
    const it = shopItems[i];
    if (it && it.id === "xp_boost_stackable") {
      it.itemName = "xp_boost_stackable";
      it.purchaseDate = now;
      it.purchasePrice = 0;
      it.expectedExpirationDate = now + 172800;
      it.remainingEffectDurationInSeconds = now + 3600;
      it.xpBoostMultiplier = xpMultiplier;
      foundXpBoost = true;
      break;
    }
  }

  if (!foundXpBoost) {
    shopItems.push({
      id: "xp_boost_stackable",
      itemName: "xp_boost_stackable",
      purchaseDate: now,
      purchasePrice: 0,
      expectedExpirationDate: now + 172800,
      remainingEffectDurationInSeconds: now + 3600,
      xpBoostMultiplier: xpMultiplier
    });
  }

  userdata.subscriberLevel = "GOLD";
  
  // ---------- 4. trackingProperties ----------
  const tp = userdata.trackingProperties;
  tp.has_item_immersive_subscription = true;
  tp.has_item_premium_subscription = true;
  tp.has_item_live_subscription = true;
  tp.has_item_gold_subscription = true;
  tp.has_item_max_subscription = true;
  
  // ---------- 5. 写回 ----------
  r0.body = JSON.stringify(parsedBody);
  $done({ body: JSON.stringify(obj) });
  
} catch (e) {
  $done({ body: $response.body });  // 安全兜底
}
