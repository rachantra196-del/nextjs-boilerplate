
export default async function handler(req, res) {
    const payment = req.body;

    if (payment.status === "success") {
        console.log("PAID:", payment.reference);
    } else {
        console.log("FAILED:", payment.reference);
    }

    res.status(200).send("OK");
}
