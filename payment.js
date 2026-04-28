<!DOCTYPE html>
<html>
<head>
  <title>Payment Demo</title>

  <!-- QR library -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>

<body>

  <h2>Payment System</h2>

  <input id="amount" type="number" placeholder="Enter amount" value="10" />

  <button onclick="pay()">Generate QR</button>

  <p id="status"></p>
  <div id="qrcode"></div>

  <script>
    async function pay() {
      console.log("PAY FUNCTION CALLED");

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
      console.log("API RESPONSE:", data);

      const link =
        data?.data?.payment_link ||
        data?.payment_link;

      if (!link) {
        status.innerText = "No payment link returned";
        return;
      }

      status.innerText = "QR generating...";

      new QRCode(qr, {
        text: link,
        width: 200,
        height: 200
      });
    }
  </script>

</body>
</html>
