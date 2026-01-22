try {
    let obj = JSON.parse($response.body);
    const pools = [
        'challenges',
        'adaptiveChallenges',
        'adaptiveInterleavedChallenges',
        'mistakesReplacementChallenges'
    ];
    let isModified = false;
    pools.forEach(pool => {
        if (obj[pool] && Array.isArray(obj[pool])) {
            obj[pool] = [];
            isModified = true;
        }
    });
    if (isModified && obj.trackingProperties) {
        let tp = obj.trackingProperties;
        Object.keys(tp).forEach(key => {
            if (key.startsWith('num_challenges_') || 
                key.startsWith('num_adaptive_') || 
                key === 'expected_length' ||
                key === 'sentences_count' ||
                key === 'distinct_sentences_count') tp[key] = 0;
        });
        tp.expected_length = 0;
        tp.num_challenges_gt = 0;
        tp.num_challenges_generated = 0;
    }
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
