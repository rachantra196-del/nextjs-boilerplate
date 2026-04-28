async function pay() {
  console.log("BUTTON CLICKED");

  const amount = document.getElementById("amount").value;

  const res = await fetch("/api/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  console.log("API RESPONSE:", data);

  alert("Check console (F12)");
}
