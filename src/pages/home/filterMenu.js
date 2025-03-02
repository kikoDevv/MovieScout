export function filterMenu() {
	const filterBtn = document.querySelector(".filterBtn");
	const filterMenu = document.querySelector(".filterSection");
	filterBtn.addEventListener("click", () => {
		filterMenu.classList.toggle("active");
		if (filterMenu.classList.contains("active")) {
			console.log("is active");
			filterBtn.textContent = "";
			filterBtn.classList.remove("filterBtn");
			filterBtn.classList.add("filterOpenBtn");
			filterBtn.classList.add("fa-2xl");
			filterBtn.classList.add("fa-solid");
			filterBtn.classList.add("fa-xmark");
		} else {
			filterBtn.textContent = "Filter movies";
			filterBtn.classList.remove(
				"filterOpenBtn",
				"fa-2xl",
				"fa-solid",
				"fa-xmark"
			);
			filterBtn.classList.add("filterBtn");
		}
	});
};
