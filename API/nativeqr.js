export default async function handler(req, res) {
    try {
        const apiUrl = "https://api.example.com/create-payment";

        const payload = {
            amount: 10.00,
            currency: "USD",
            reference: "REF" + Date.now(),
            callback_url: "https://yourdomain.vercel.app/api/callback"
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_API_KEY"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Adjust based on real API response
        res.status(200).json({
            qr: result.qr_code || null,
            link: result.payment_url || null
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
