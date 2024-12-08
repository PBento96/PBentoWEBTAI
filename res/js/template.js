// res/js/template.js
document.addEventListener("DOMContentLoaded", function () {
	const pageTitle = document.getElementById("page-title");
	const headerDiv = document.getElementById("header-div");
	const contentDiv = document.getElementById("content-div");
	const footerDiv = document.getElementById("footer-div");

	let contentUrl = "pages/home.html";

	window.loadContent = function (url, placeholder, updateTitle = false) {
		fetch(url)
			.then((response) => response.text())
			.then((data) => {
				placeholder.innerHTML = data;
				if (updateTitle) {
					const tempDiv = document.createElement("div");
					tempDiv.innerHTML = data;
					const titleElement = tempDiv.querySelector("[data-title]");
					if (titleElement) {
						const newTitle =
							titleElement.getAttribute("data-title");
						pageTitle.textContent = `${newTitle}`;
					}
				}
			})
			.catch((error) => console.error("Error loading content:", error));
	};

	loadContent("pages/components/header.html", headerDiv);
	loadContent("pages/components/footer.html", footerDiv);

	loadContent(contentUrl, contentDiv, true);

	headerDiv.addEventListener("click", function (event) {
		if (
			event.target.tagName === "BUTTON" &&
			event.target.hasAttribute("data-url")
		) {
			const newUrl = event.target.getAttribute("data-url");
			loadContent(newUrl, contentDiv, true);
		}
	});
});
