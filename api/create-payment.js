export default async function handler(req, res) {
  try {
    const { amount } = req.body;

    // 1. Get token from KessPay
    const tokenRes = await fetch("https://devwebpayment.kesspay.io/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        grant_type: "password",
        client_id: "5973bd5c-f4bf-4714-ac6c-15007f732534",
        client_secret: "YOUR_CLIENT_SECRET",
        username: "YOUR_USERNAME",
        password: "YOUR_PASSWORD"
      })
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Create payment order
    const orderRes = await fetch("https://devwebpayment.kesspay.io/api/webpay.acquire.createorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        service: "webpay.acquire.createorder",
        sign_type: "MD5",
        seller_code: "CU2510-101504183252854717",
        out_trade_no: "ORDER_" + Date.now(),
        body: "Payment",
        total_amount: Number(amount),
        currency: "USD",
        login_type: "ANONYMOUS",
        expires_in: 6000
      })
    });

    const orderData = await orderRes.json();

    // 3. Return payment link
    res.status(200).json(orderData);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
