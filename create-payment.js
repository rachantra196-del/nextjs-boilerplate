export default function handler(req, res) {
  const { amount } = req.body || {};

  res.status(200).json({
    success: true,
    data: {
      payment_link: "https://https://dev-kess-portal-merchant.kesspay.io//pay?amount=" + (amount || 10)
    }
  });
}
