const link = data?.data?.payment_link;

console.log("LINK:", link);

if (!link) {
  status.innerText = "No payment link from API";
  return;
}

status.innerText = "QR generating...";

document.getElementById("qrcode").innerHTML = "";

new QRCode(document.getElementById("qrcode"), {
  text: link,
  width: 200,
  height: 200
});
