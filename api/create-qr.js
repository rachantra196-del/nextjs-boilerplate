const tokenRes = await fetch(`${process.env.BASE_URL}/token`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    grant_type: "password",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  })
});

const tokenText = await tokenRes.text();
console.log("TOKEN RESPONSE:", tokenText);
