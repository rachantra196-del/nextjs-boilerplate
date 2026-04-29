const result = await qrRes.json();

const qr =
  result.code_url ||
  result.qr_code ||
  result.data?.code_url ||
  result.data?.qr_code ||
  result.result?.code_url;

res.status(200).json({
  out_trade_no: orderId,
  qr: qr,
  raw: result
});
