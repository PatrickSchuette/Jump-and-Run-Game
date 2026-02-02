const DIALOG = document.getElementById("dialog");

/** show PrivacyPolice in Dialog */
function showPrivacyPolicy() {
    document.getElementById("dialogHeader").textContent = "Privacy Policy";
    document.getElementById("dialogContext").innerHTML = renderPrivacyPolicy();
    DIALOG.showModal();
}

/** show Legal Notice in Dialog */
function showLegalNotice() {
    document.getElementById("dialogHeader").textContent = "Legal Notice";
    document.getElementById("dialogContext").innerHTML = renderLegalNotice();
    DIALOG.showModal();
}

/** close Dialog */
function closeDialog() {
    document.getElementById("dialog").close();
}

/**Event Listener if a click is outside of the dialog */
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
