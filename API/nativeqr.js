export default async function handler(req, res) {
    try {
        const response = await fetch("https://api.example.com/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_API_KEY"
            },
            body: JSON.stringify({
                amount: 10,
                reference: "REF" + Date.now()
            })
        });

        const text = await response.text(); // 👈 raw response
        console.log("API RESPONSE:", text);

        res.status(200).json({ debug: text });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
