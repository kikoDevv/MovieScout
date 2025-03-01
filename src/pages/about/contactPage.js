onSubmitBackToHome();
//--------functions----------------
function onSubmitBackToHome() {
	const submitBtn = document.querySelector(".submit-btn");
	submitBtn.addEventListener("click", () => {
		window.location.href = "/MovieScout/index.html";
	});
}
