document.addEventListener("DOMContentLoaded", () => {


    const btnElement = document.querySelector(".btn")
    const imgElement = document.getElementById("qr-img")
    const boxElement = document.getElementById("img-box")
    const inputElement = document.getElementById("qr-text")
    const errorMessage = document.querySelector(".error")
    const downloadLink = document.getElementById("download-link");
    const spinner = document.getElementById("spinner");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const resetBtn = document.querySelector(".reset")
    const copyBtn = document.querySelector(".btn-copy");

    window.addEventListener("load", () => {
        const loaderWrapper = document.querySelector(".loader-wrapper");
        loaderWrapper.classList.add("hidden"); 
    });

    const generateQRCode = () => {
        const inputText = inputElement.value.trim();
        if (inputText.length > 0) {
            spinner.style.display = "block";
            const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${inputText}`;
            imgElement.onload = () => {
                spinner.style.display = "none";
                boxElement.classList.add("show-img");
            };
            imgElement.src = qrCodeURL;
            errorMessage.style.display = "none";
            inputElement.classList.remove("incorrect");
            resetBtn.style.display = "block"
            downloadLink.href = qrCodeURL;
            downloadLink.style.display = "inline-block";
            copyBtn.style.display = "block"
        } else {
            spinner.style.display = "none";
            imgElement.src = "";
            boxElement.classList.remove("show-img");
            errorMessage.style.display = "block";
            inputElement.classList.add("incorrect");
            downloadLink.style.display = "none"
            resetBtn.style.display = "none"
            copyBtn.style.display = "none"
        }
    };

    btnElement.addEventListener("click", generateQRCode);

    inputElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            generateQRCode();
        }
    });

    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggleBtn.textContent = "Switch to Light Theme";
    }

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        const isDarkTheme = document.body.classList.contains("dark-theme");

        themeToggleBtn.textContent = isDarkTheme
            ? "Switch to Light Theme"
            : "Switch to Dark Theme";

        localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    });

    resetBtn.addEventListener("click", () => {
        inputElement.value = ""
        imgElement.src = "";
        boxElement.classList.remove("show-img");
        document.getElementById("download-link").style.display = "none";
        copyBtn.style.display = "none"
        errorMessage.style.display = "none";
        inputElement.focus();
        setTimeout(() => {
            resetBtn.style.display = "none"
        }, 2000);
    })

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            resetBtn.click(); 
        }
    });

    copyBtn.addEventListener("click", async () => {
        const qrCodeSrc = imgElement.src;

        if (qrCodeSrc) {
            try {
                const response = await fetch(qrCodeSrc);
                const blob = await response.blob(); 
                const clipboardItem = new ClipboardItem({ "image/png": blob });
                await navigator.clipboard.write([clipboardItem]);

                alert("QR Code copied to clipboard!");
            } catch (err) {
                alert("Failed to copy QR Code. Please try again.");
                console.error("Clipboard Error:", err);
            }
        } else {
            alert("No QR Code to copy. Generate one first.");
        }
    });
})