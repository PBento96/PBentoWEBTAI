import { getFeatured, getNewest, getTopic, getArticle } from "./articles.js";

export async function loadPage(pageHtml = false, content = false) {
	pageHtml = pageHtml || "pages/home";
	try {
		await loadComponent("components/header", "header-div");
		await loadComponent(pageHtml, "content-div");
		await loadComponent("components/footer", "footer-div");
	} catch (error) {
		console.error(`Error loading page ${pageHtml}:`, error);
	}
	try {
		if (pageHtml === "pages/home") {
			await postFeatured();
			await postNewest(5);
		} else if (pageHtml === "pages/topic") {
			if (!content) {
				throw new Error("No content for topic page");
			}
			await postTopic(content);
		}
	} catch (error) {
		console.error(`Error loading content ${content}:`, error);
		loadPage();
	}
}

async function loadComponent(component, elementId) {
	try {
		const response = await fetch(`html/${component}.html`);
		const html = await response.text();
		document.getElementById(elementId).innerHTML = html;
	} catch (error) {
		console.error(`Error loading component: ${component}`, error);
	}
}

async function postFeatured() {
	try {
		await loadComponent("components/featured", "featured-div");
		const featuredArticle = await getFeatured();
		if (featuredArticle) {
			document.getElementById(
				"img"
			).src = `resources/img/articles/${featuredArticle.images[0].src}`;
			document.getElementById("img").alt =
				featuredArticle.images[0].caption;
			document.getElementById("title").innerText = featuredArticle.title;
			document.getElementById("byline").innerText = `By ${
				featuredArticle.author
			} on ${new Date(featuredArticle.date).toLocaleDateString()}`;
			document.getElementById("text").innerText =
				featuredArticle.content.substring(0, 200) + "...";
			document.getElementById(
				"open-article"
			).href = `article.html?id=${featuredArticle.id}`;
		}
	} catch (error) {
		console.error("Error posting featured articles:", error);
	}
}

async function postNewest(count) {
	try {
		const newestArticles = await getNewest(count);
		const newestDiv = document.getElementById("newest-div");
		newestDiv.innerHTML = "";

		for (const article of newestArticles) {
			const response = await fetch(`html/components/list.html`);
			const html = await response.text();
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = html;
			const card = tempDiv.querySelector("#card");
			card.querySelector(
				"#img"
			).src = `resources/img/articles/${article.images[0].src}`;
			card.querySelector("#img").alt = article.images[0].caption;
			card.querySelector("#title").innerText = article.title;
			card.querySelector("#byline").innerText = `By ${
				article.author
			} on ${new Date(article.date).toLocaleDateString()}`;
			card.querySelector(
				"#open-article"
			).href = `article.html?id=${article.id}`;
			newestDiv.appendChild(card);
		}
	} catch (error) {
		console.error("Error posting topic articles:", error);
	}
}

async function postTopic(topic) {
	try {
		const newestArticles = await getTopic(topic);
		const newestDiv = document.getElementById("article-div");
		newestDiv.innerHTML = "";

		for (const article of newestArticles) {
			const response = await fetch(`html/components/list.html`);
			const html = await response.text();
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = html;
			const card = tempDiv.querySelector("#card");
			card.querySelector(
				"#img"
			).src = `resources/img/articles/${article.images[0].src}`;
			card.querySelector("#img").alt = article.images[0].caption;
			card.querySelector("#title").innerText = article.title;
			card.querySelector("#byline").innerText = `By ${
				article.author
			} on ${new Date(article.date).toLocaleDateString()}`;
			card.querySelector(
				"#open-article"
			).href = `article.html?id=${article.id}`;
			newestDiv.appendChild(card);
		}
	} catch (error) {
		console.error("Error posting newest articles:", error);
	}
}

async function postArticle(id) {}

loadPage();

window.loadPage = loadPage;
