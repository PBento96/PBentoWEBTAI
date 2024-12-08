const fs = require("fs");
const path = require("path");

class Article {
	constructor(
		title,
		content,
		author,
		category,
		date,
		featured = false,
		images = [],
	) {
		const articlesDir = "res/data/articles/";
		const files = fs.readdirSync(articlesDir);
		let maxId = 0;

		files.forEach((file) => {
			const fileName = path.basename(file, ".json");
			const id = parseInt(fileName, 10);
			if (!isNaN(id) && id > maxId) {
				maxId = id;
			}
		});

		this.id = maxId + 1;
		this.title = title;
		this.content = content;
		this.author = author;
		this.category = category;
		this.date = date;
		this.featured = featured;
		this.images = images;
		this.url = this.generateUrl();
	}

	generateUrl() {
		const formattedTitle = this.title
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase();
		return `ID=${this.id}-${formattedTitle}`;
	}

	toggleFeatured() {
		this.featured = !this.featured;
		this.saveArticle();
	}

	toJSON() {
		return {
			id: this.id,
			title: this.title,
			content: this.content,
			author: this.author,
			category: this.category,
			date: this.date,
			featured: this.featured,
			url: this.url,
		};
	}

	saveArticle() {
		const fs = require("fs");
		const filePath = `res/data/articles/${this.id}.json`;
		fs.writeFileSync(filePath, JSON.stringify(this.toJSON(), null, "\t"));
	}

	editArticle(newTitle, newContent, newAuthor, newDate, newFeatured = false) {
		this.title = newTitle;
		this.content = newContent;
		this.author = newAuthor;
		this.date = newDate;
		this.featured = newFeatured;
		this.images = newImages;
		this.url = this.generateUrl();
		this.saveArticle();
	}

	deleteArticle() {
		const fs = require("fs");
		const filePath = `res/data/articles/${this.id}.json`;
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		} else {
			console.log(`File ${filePath} not found.`);
		}
	}
}
