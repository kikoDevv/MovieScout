export function searchModal(){
    const searchSection = document.querySelector(".searchSection");
    const searchModal = document.createElement("div");

    searchModal.classList.add("search-modal");
    searchSection.appendChild(searchModal);
}