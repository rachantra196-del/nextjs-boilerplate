export default function handler(req, res) {
  const { amount } = req.body || {};

  res.status(200).json({
    success: true,
    data: {
      payment_link: "https://example.com/pay?amount=" + (amount || 10)
    }
  });
}
