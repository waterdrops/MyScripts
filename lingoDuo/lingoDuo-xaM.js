try {
  const raw = $response.body;
  
  // ---------- 0. short circuit ----------
  const etagIdx = raw.indexOf('"etag"', 0, 500);
  const respIdx = raw.indexOf('"responses"', 0, 100);
  if (respIdx === -1 || etagIdx !== -1) {
    $done({ body: raw });
  }
  
  // ---------- 1. parse outer layer ----------
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

  let goldItem = null;
  let xpItem = null;

  for (let i = 0, l = shopItems.length; i < l; i++) {
    const it = shopItems[i];
    if (!it || !it.id) continue;

    if (it.id === 'gold_subscription') {
      goldItem = it;
      if (xpItem) break;
    } else if (it.id === 'xp_boost_stackable') {
      xpItem = it;
      if (goldItem) break;
    }
  }

  // ---------- 3. upsert gold_subscription ----------
  const subInfo = {
    expectedExpiration: now + 31536000,
    productId:
      'com.duolingo.DuolingoMobile.subscription.Gold.TwelveMonth.24Q2Max.168',
    renewer: 'APPLE',
    renewing: true,
    tier: 'twelve_month',
    type: 'gold',
  };

  if (goldItem) {
    goldItem.itemName = 'gold_subscription';
    goldItem.purchasePrice = 0;
    goldItem.purchaseDate = now - 172800;
    goldItem.subscriptionInfo = subInfo;
  } else {
    shopItems.push({
      id: 'gold_subscription',
      itemName: 'gold_subscription',
      purchasePrice: 0,
      purchaseDate: now - 172800,
      subscriptionInfo: subInfo,
    });
  }

  // ---------- 4. upsert xp_boost_stackable ----------
  // bit operation, choose 2 or 3 as the multiplier randomly
  const xpMultiplier = (now & 1) === 0 ? 2 : 3;
  const xpExpire = now + 3000;

  if (xpItem) {
    xpItem.itemName = 'xp_boost_stackable';
    xpItem.purchaseDate = now;
    xpItem.purchasePrice = 0;
    xpItem.expectedExpirationDate = xpExpire;
    xpItem.xpBoostMultiplier = xpMultiplier;
  } else {
    shopItems.push({
      id: 'xp_boost_stackable',
      itemName: 'xp_boost_stackable',
      purchaseDate: now,
      purchasePrice: 0,
      expectedExpirationDate: xpExpire,
      xpBoostMultiplier: xpMultiplier,
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
  
  // ---------- 5. write back ----------
  r0.body = JSON.stringify(parsedBody);
  $done({ body: JSON.stringify(obj) });
  
} catch (e) {
  $done({});  // fallback to original body
}
