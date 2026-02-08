export async function verifyRecaptcha(token: string) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        console.error("RECAPTCHA_SECRET_KEY is not defined");
        return { success: false, error: "reCAPTCHA configuration error" };
    }

    try {
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
            {
                method: "POST",
            }
        );

        const data = await response.json();

        // data format: {
        //   "success": true|false,
        //   "challenge_ts": ts,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
        //   "hostname": string,  // the hostname of the site where the reCAPTCHA was solved
        //   "error-codes": [...] // optional
        //   "score": number,     // the score for this request (0.0 - 1.0)
        //   "action": string     // the action name for this request (important to verify)
        // }

        if (data.success && data.score >= 0.5) {
            return { success: true, score: data.score };
        } else {
            console.warn("reCAPTCHA verification failed:", data);
            return { success: false, error: "reCAPTCHA verification failed" };
        }
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        return { success: false, error: "Error verifying reCAPTCHA" };
    }
}
