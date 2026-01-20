try {
    let obj = JSON.parse($response.body);
    let s = parseInt($argument.minutes) * 60;
    if (!isNaN(s) && s > 0 && obj.liveOpscs)
        obj.liveOpscs.forEach(c => {
            if (c.initialTime) c.initialTime = s;
            if (c.initialLevelTimes) c.initialLevelTimes = c.initialLevelTimes.map(() => s);
            if (c.initialSessionTimes) c.initialSessionTimes = c.initialSessionTimes.map(() => s);
        });
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
