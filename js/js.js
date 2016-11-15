/**
 * Created by rrieunier on 14/11/2016.
 */

function telecharger(data) {
	$.get("../html/index.html", telechargerW3C(data));
	$.get("../html/index.html", telechargerWPT(data));
}

/*
 Méthode permettant d'afficher les données reçues par
 w3.validator.org
 */
function telechargerW3C(url) {
	$.getJSON("https://validator.w3.org/nu/?doc=https%3A%2F%2Fwww.facebook.com%2F&out=json", function (data) {
		var items = [];
		console.debug(data.messages);
		$.each(data.messages, function (key, val) {
			items.push(val);
		});
		console.debug(items);

		// $("<ul/>", {
		// 	"class": "my-new-list",
		// 	html:    items.join("")
		// }).appendTo("body");

		var tableau = document.createElement("table");
		tableau.className = "table table-hover";
		document.body.appendChild(tableau); // on
		// crée un tableau qu'on met dans le body
		$.each(items, function (key, val) {
			var ligne = document.createElement("tr");
			document.body.tableau.appendChild(ligne); // on
			// crée une ligne qu'on ajoute au tableau
			var t = document.createElement("td");
			if (val.subType)
				t.append(val.subType);
			else
				t.append(val.type);
			document.body.tableau.ligne.appendChild(t); // on
			// ajoute à la ligne une colonne contenant le
			// type d'avertissement
			var m = document.createElement("td");
			m.append(val.message);
			document.body.tableau.ligne.appendChild(m); // on
			// ajoute à la ligne une colonne contenant le
			// message associé à l'avertissement

		})
	});
}

function telechargerWPT() {

}