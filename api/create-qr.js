const tokenText = await tokenRes.text();
console.log("TOKEN RAW:", tokenText);

let tokenData;
try {
  tokenData = JSON.parse(tokenText);
} catch (e) {
  return res.status(500).json({
    error: "Token API not JSON",
    raw: tokenText
  });
}
