// Add JavaScript code to make the hero section more engaging
// For example, we can add a button that scrolls to the top of the page
const scrollTopButton = document.createElement("button");
scrollTopButton.textContent = "Scroll to top";
document.body.appendChild(scrollTopButton);

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});