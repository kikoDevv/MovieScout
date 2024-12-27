document.addEventListener("DOMContentLoaded", () => {
    const filterBtn = document.querySelector(".filterBtn");
    const filterMenu = document.querySelector(".filterMenu");

    // Event listener for filter menu toggle
    filterBtn.addEventListener("click", () => {
        if (filterMenu.classList.value === "filterMenu") {
            filterMenu.classList.remove("filterMenu");
            filterBtn.classList.remove("fa-solid");
            filterBtn.classList.remove("fa-xmark");
            filterMenu.classList.add("hidden");
            filterBtn.textContent = "Filter movies";
            console.log("hidden");
        } else {
            console.log("else");
            filterMenu.classList.remove("hidden");
            filterMenu.classList.add("filterMenu");
            filterBtn.textContent = "";
            filterBtn.classList.add("fa-solid");
            filterBtn.classList.add("fa-xmark");
            filterBtn.classList.add("fa-2xl");
        }
    });

    // Codeblock for search bar
    const searchSection = document.querySelector(".searchSection");
    const initialTop = searchSection.offsetTop;

    window.addEventListener("scroll", () => {
        if (window.scrollY >= initialTop + 160) {
            searchSection.style.position = "fixed";
            searchSection.style.top = "30px";
        } else {
            searchSection.style.position = "absolute";
            searchSection.style.top = "45%";
            searchSection.style.minWidth = "40vw";
        }
    });

    // Log the scroll value
    window.addEventListener("scroll", () => {
        console.log("value: " + window.scrollY);
    });
});