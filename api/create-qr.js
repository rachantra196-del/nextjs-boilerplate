const result = await qrRes.json();

// try all possible fields
const qr =
  result.code_url ||
  result.qr_code ||
  result.data?.qr_code ||
  result.data?.code_url ||
  result.result?.code_url;

const deeplink =
  result.deeplink ||
  result.pay_url ||
  result.payment_url ||
  result.data?.deeplink ||
  result.data?.pay_url;

res.status(200).json({
  out_trade_no: orderId,
  qr: qr,
  deeplink: deeplink,
  raw: result
});
