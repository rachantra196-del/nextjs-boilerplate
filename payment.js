async function pay() {
  const amount = document.getElementById("amount").value;
  const status = document.getElementById("status");
  const qr = document.getElementById("qrcode");

  status.innerText = "Creating payment...";
  qr.innerHTML = "";

  const res = await fetch("/api/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();
  console.log(data);

  const link =
    data?.data?.payment_link ||
    data?.payment_link;

  if (!link) {
    status.innerText = "No payment link returned";
    return;
  }

  status.innerText = "Scan QR to pay";

  new QRCode(qr, {
    text: link,
    width: 200,
    height: 200
  });
}
