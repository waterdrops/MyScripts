try {
  let obj = JSON.parse($response.body);
  const type = obj.type;
  const skipTypes = ["SIDE_QUEST_RAMP_UP_PRACTICE", "MATCH_PRACTICE"];
  if (type && !skipTypes.includes(type)) {
    if (obj.challenges) obj.challenges = [];
    if (obj.expected_length) obj.expected_length = 0;
  }
  $done({ body: JSON.stringify(obj) });
} catch (e) {
  $done({});
}
