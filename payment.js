async function pay() {
  const amount = document.getElementById("amount").value;
  const status = document.getElementById("status");
  const qr = document.getElementById("qrcode");

  status.innerText = "Calling API...";
  qr.innerHTML = "";

  const res = await fetch("/api/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  // 🔥 FORCE SHOW EVERYTHING
  console.log("RAW API RESPONSE:", data);

  alert(JSON.stringify(data, null, 2));

  status.innerText = "Check popup for API response";
}
