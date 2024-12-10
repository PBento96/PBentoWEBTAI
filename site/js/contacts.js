import { loadPage } from "./main.js";

export async function goToContacts(contact = false) {
	switch (contact) {
		case "Facebook":
			contactUnavailable(contact);
			break;
		case "Twitter":
			contactUnavailable(contact);
			break;
		case "Instagram":
			contactUnavailable(contact);
			break;
		case "Youtube":
			contactUnavailable(contact);
			break;
		case "Whatsapp":
			contactUnavailable(contact);
			break;
		case "Signal":
			contactUnavailable(contact);
			break;
		case "Telegram":
			contactUnavailable(contact);
			break;
		default:
			loadPage("pages/contact", "contacts");
	}
}

function contactUnavailable(contact) {
	alert(
		`O nosso ${contact} está indisponivel de momento.\nPor favor contacte-nos através do formulário de email ou tente novamente mais tarde.\nObrigado!`
	);
	goToContacts();
}

window.goToContacts = goToContacts;
