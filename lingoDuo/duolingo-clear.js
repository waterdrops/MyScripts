try {
  let obj = JSON.parse($response.body);
  if (obj.challenges) obj.challenges = [];
  if (obj.expected_length) obj.expected_length = 0;
  $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
