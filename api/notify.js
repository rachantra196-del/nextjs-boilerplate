export default async function handler(req, res) {
  console.log("Payment notification:", req.body);
  res.status(200).send("success");
}
