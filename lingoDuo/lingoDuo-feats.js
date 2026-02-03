try {
    const obj = JSON.parse($response.body);

    const patched = {
        purchasableFeatures: [
            "CAN_PURCHASE_IAP",
            "CAN_PURCHASE_MAX"
        ],
        subscriptionFeatures: [
            "NO_NETWORK_ADS",
            "UNLIMITED_HEARTS",
            "LEGENDARY_LEVEL",
            "MISTAKES_INBOX",
            "MASTERY_QUIZ",
            "NO_SUPER_PROMOS",
            "LICENSED_SONGS",
            "CHAT_TUTORS",
            "ROLEPLAY_FOR_INTERMEDIATE_LEARNERS",
            "EXPLAIN_MY_ANSWER",
            "VIDEO_CALL_IN_PATH",
            "VIDEO_CALL_IN_PRACTICE_HUB"
        ]
    };

    $done({ body: JSON.stringify(patched) });
} catch (e) {
    $done({});
}
