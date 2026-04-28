async function pay() {
  const amount = document.getElementById("amount").value;
  const status = document.getElementById("status");
  const qr = document.getElementById("qrcode");

  status.innerText = "Creating payment...";
  qr.innerHTML = "";

  const res = await fetch("/api/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();
  console.log("FULL API:", data);

  // 🔥 SAFE EXTRACTION (important)
  const link =
    data?.data?.payment_link ||
    data?.payment_link ||
    null;

  console.log("PAYMENT LINK:", link);

  if (!link) {
    status.innerText = "❌ No payment link from API";
    return;
  }

  status.innerText = "QR generating...";

  qr.innerHTML = "";

  setTimeout(() => {
    new QRCode(qr, {
      text: link,
      width: 200,
      height: 200
    });
  }, 100);
}
