const DIALOG = document.getElementById("dialog");

function showPrivacyPolicy() {
    document.getElementById("dialogHeader").textContent = "Privacy Policy";
    document.getElementById("dialogContext").innerHTML = renderPrivacyPolicy();
    DIALOG.showModal();
}

function showLegalNotice() {
    document.getElementById("dialogHeader").textContent = "Legal Notice";
    document.getElementById("dialogContext").innerHTML = renderLegalNotice();
    DIALOG.showModal();
}

function closeDialog() {
    document.getElementById("dialog").close();
}

DIALOG.addEventListener("click", (event) => {
    const rect = DIALOG.getBoundingClientRect();

    const clickedInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

    if (!clickedInside) {
        DIALOG.close();
    }
});
