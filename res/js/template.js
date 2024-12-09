document.addEventListener("DOMContentLoaded", function () {
	const pageTitle = document.getElementById("page-title");
	const headerDiv = document.getElementById("header-div");
	const contentDiv = document.getElementById("content-div");
	const footerDiv = document.getElementById("footer-div");

	async function loadContent(path, placeholder, updateTitle = false) {
		const actualPath = path === "" || path === "home" ? "" : path;
		const url = `pages/${actualPath || "home"}.html`;
		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Page not found");
				}
				return response.text();
			})
			.then((data) => {
				if (!data.trim()) {
					throw new Error("Empty content");
				}
				placeholder.innerHTML = data;
				if (updateTitle) {
					const tempDiv = document.createElement("div");
					tempDiv.innerHTML = data;
					const titleElement = tempDiv.querySelector("[data-title]");
					if (titleElement) {
						const newTitle =
							titleElement.getAttribute("data-title");
						pageTitle.textContent = newTitle;
						document.title = newTitle;
						history.pushState(
							{ path },
							newTitle,
							path ? `/${path}` : "/"
						);
					}
					updateActiveButton(actualPath);
				}
			})
			.catch((error) => {
				console.error("Error loading content:", error);
				loadContent("", placeholder, true);
			});
		if (placeholder === contentDiv) {
			loadFeaturedArticle();
			loadRecentArticles();
		}
	}

	function updateActiveButton(path) {
		const navButtons = headerDiv.querySelectorAll(".nav button");
		navButtons.forEach((button) => {
			if (
				button.getAttribute("data-url") === path ||
				(path === "" && button.getAttribute("data-url") === "home")
			) {
				button.classList.add("active");
			} else {
				button.classList.remove("active");
			}
		});
	}

	function filterArticlesByCategory(category) {
		fetch("res/data/articles.json")
			.then((response) => response.json())
			.then((articles) => {
				const filteredArticles = articles.filter(
					(article) => article.category.toLowerCase() === category
				);
				const categoryCard = document.getElementById("category-card");
				const contentDiv = document.querySelector(".content");
				contentDiv.innerHTML = "";

				filteredArticles.forEach((article) => {
					const articleImage =
						article.images.find((image) => image.featured) ||
						article.images[0];

					const newCard = categoryCard.cloneNode(true);
					newCard.querySelector(
						"#category-img"
					).src = `res/img/articles/${articleImage.src}`;
					newCard.querySelector("#category-img").alt =
						articleImage.caption;
					newCard.querySelector("#category-title").textContent =
						article.title;
					newCard.querySelector("#category-byline").textContent =
						article.author;
					newCard.querySelector("#category-text").textContent =
						article.content.substring(0, 100) + "...";

					contentDiv.appendChild(newCard);
				});
			})
			.catch((error) => console.error("Error loading articles:", error));
	}

	window.addEventListener("popstate", function (event) {
		if (event.state && event.state.path !== undefined) {
			loadContent(event.state.path, contentDiv, true);
		} else {
			const currentPath = location.pathname.slice(1) || "";
			loadContent(currentPath, contentDiv, true);
		}
	});

	loadContent("components/header", headerDiv);
	loadContent("components/footer", footerDiv);

	const initialPath = location.pathname.slice(1) || "";
	loadContent(initialPath, contentDiv, true);

	headerDiv.addEventListener("click", function (event) {
		if (
			event.target.tagName === "BUTTON" &&
			event.target.hasAttribute("data-url")
		) {
			event.preventDefault();
			const newPath = event.target.getAttribute("data-url");
			if (
				newPath === "categories/cinema" ||
				newPath === "categories/tv" ||
				newPath === "categories/music"
			) {
				loadContent("categories", contentDiv, true).then(() => {
					const category = newPath.split("/")[1];
					filterArticlesByCategory(category);
				});
			} else {
				loadContent(newPath, contentDiv, true);
			}
		}
	});

	footerDiv.addEventListener("click", function (event) {
		if (event.target.closest(".footer-link")) {
			event.preventDefault();
			loadContent("contact", contentDiv, true);
		}
	});

	function loadFeaturedArticle() {
		fetch("res/data/articles.json")
			.then((response) => response.json())
			.then((articles) => {
				articles.sort((a, b) => new Date(b.date) - new Date(a.date));
				const featuredArticle = articles.find(
					(article) => article.featured
				);
				if (featuredArticle) {
					const featuredImage =
						featuredArticle.images.find(
							(image) => image.featured
						) || featuredArticle.images[0];
					document.getElementById(
						"featured-img"
					).src = `res/img/articles/${featuredImage.src}`;
					document.getElementById("featured-img").alt =
						featuredImage.caption;
					document.getElementById("featured-byline").textContent =
						featuredArticle.author;
					document.getElementById("featured-title").textContent =
						featuredArticle.title;

					const maxChars = 800;
					let content = featuredArticle.content
						.replace(/\n/g, "<br>")
						.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
					if (content.length > maxChars) {
						const truncatedContent = content.substring(0, maxChars);
						const lastSpaceIndex =
							truncatedContent.lastIndexOf(" ");
						content =
							truncatedContent.substring(0, lastSpaceIndex) +
							" (...)";
					}
					document.getElementById("featured-text").innerHTML =
						content;
				}
			})
			.catch((error) =>
				console.error("Error loading featured article:", error)
			);
	}

	function loadRecentArticles() {
		fetch("res/data/articles.json")
			.then((response) => response.json())
			.then((articles) => {
				articles.sort((a, b) => new Date(b.date) - new Date(a.date));
				const recentArticles = articles.slice(0, 5);
				const recentCard = document.getElementById("recent-card");

				recentArticles.forEach((article, index) => {
					const recentImg = recentCard.querySelector(`#recent-img`);
					const recentTitle =
						recentCard.querySelector(`#recent-title`);
					const recentByline =
						recentCard.querySelector(`#recent-byline`);

					const articleImage =
						article.images.find((image) => image.featured) ||
						article.images[0];

					recentImg.src = `res/img/articles/${articleImage.src}`;
					recentImg.alt = articleImage.caption;
					recentTitle.textContent = article.title;
					recentByline.textContent = article.author;

					if (index < recentArticles.length - 1) {
						const newCard = recentCard.cloneNode(true);
						recentCard.parentNode.appendChild(newCard);
					}
				});
			})
			.catch((error) =>
				console.error("Error loading recent articles:", error)
			);
	}
});
