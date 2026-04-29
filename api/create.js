import axios from "axios";
import crypto from "crypto";

function sign(params, secret) {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join("&");

  return crypto.createHash("md5").update(sorted + secret).digest("hex");
}

async function getToken() {
  const res = await axios.post(process.env.TOKEN_URL, {
    grant_type: "password",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  });

  return res.data.access_token;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const token = await getToken();
    const orderId = Date.now().toString();

    const payload = {
      service: "webpay.acquire.nativePay",
      sign_type: "MD5",
      seller_code: process.env.SELLER_CODE,
      out_trade_no: orderId,
      body: "Testing Payment",
      total_amount: body.amount,
      currency: "USD",
      notify_url: process.env.NOTIFY_URL,
      service_code: "ABAAKHPP"
    };

    payload.sign = sign(payload, process.env.SECRET_KEY);

    const response = await axios.post(
      process.env.GATEWAY_URL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return Response.json({
      orderId,
      qr:
        response.data.code_url ||
        response.data.qr_code ||
        response.data.qr
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    return Response.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
