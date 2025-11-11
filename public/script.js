const form = document.getElementById("inquiryForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector('input[placeholder="Enter full name"]').value.trim();
    const mobile = form.querySelector('input[placeholder="+91 91234 56789"]').value.replace(/\D/g, "");
    const submitBtn = form.querySelector(".submit");

    if (!name || !mobile) {
        alert("Please enter both name and mobile number.");
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        const response = await fetch("/send-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, mobile }),
        });

        const data = await response.json();
        console.log("SMS API response:", data);

        if (data.success) {
            const thankYouModal = new bootstrap.Modal(document.getElementById("thankYouModal"));
            thankYouModal.show();
            form.reset();
        } else {
            alert("Failed to send SMS. Try again later.");
        }
    } catch (error) {
        console.error("Error sending SMS:", error);
        alert("Failed to send SMS. Please try again later.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Inquiry";
    }
});
