async function loadArticles() {
	try {
		const response = await fetch("resources/data/articles.json");
		const articles = await response.json();
		return articles;
	} catch (error) {
		console.error("Error loading articles:", error);
		return [];
	}
}

export async function getFeatured() {
	try {
		const articles = await loadArticles();
		if (articles.length === 0) throw new Error("No articles found");
		const featured = articles.filter((article) => article.featured);
		if (featured.length > 0) {
			return featured.reduce((newest, article) =>
				new Date(article.date) > new Date(newest.date)
					? article
					: newest
			);
		}

		return articles.reduce((newest, article) =>
			new Date(article.date) > new Date(newest.date) ? article : newest
		);
	} catch (error) {
		console.error("Error loading featured articles:", error);
	}
}

export async function getNewest(count) {
	try {
		const articles = await loadArticles();
		if (articles.length === 0) throw new Error("No articles found");

		return articles
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, count);
	} catch (error) {
		console.error("Error loading newest articles:", error);
		return [];
	}
}

export async function getTopic(topic) {
	try {
		const articles = await loadArticles();
		if (articles.length === 0) throw new Error("No articles found");

		return articles
			.filter((article) => article.category === topic)
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	} catch (error) {
		console.error(`Error loading articles for topic "${topic}":`, error);
		return [];
	}
}

export async function getArticle(id) {
	try {
		const articles = await loadArticles();
		if (articles.length === 0) throw new Error("No articles found");

		const article = articles.find((article) => article.id === id);
		if (!article) throw new Error(`Article with id "${id}" not found`);

		return article;
	} catch (error) {
		console.error(`Error loading article with id "${id}":`, error);
		return null;
	}
}
