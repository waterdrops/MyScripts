try {
    let obj = JSON.parse($response.body);
    const pools = [
        'challenges',
        'adaptiveChallenges',
        'adaptiveInterleavedChallenges',
        'mistakesReplacementChallenges'
    ];
    pools.forEach(pool => {
        if (obj[pool] && obj[pool].length > 0) obj[pool] = [];
    });
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
