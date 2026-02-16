var body = $response.body;
var obj = JSON.parse(body);
obj.subscriber.entitlements = {
    "Subscription": {
        "expires_date": "2099-09-09T09:09:09Z", 
        "product_identifier": "com.niko.PocketWidgetsApp.lifetimePlus",
        "purchase_date": "2024-01-01T00:00:00Z"
    }
};
obj.subscriber.subscriptions = {
    "com.niko.PocketWidgetsApp.lifetimePlus": {
        "billing_issues_detected_at": null,
        "expires_date": "2099-09-09T09:09:09Z",
        "is_sandbox": false,
        "original_purchase_date": "2024-01-01T00:00:00Z",
        "period_type": "normal",
        "purchase_date": "2024-01-01T00:00:00Z",
        "store": "app_store",
        "unsubscribe_detected_at": null
    }
};
$done({ JSON.stringify(obj) });
