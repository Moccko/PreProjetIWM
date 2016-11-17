/**
 * Created by rrieunier on 14/11/2016.
 */

/**
 * Méthode encodant correctement l'URL et appelant les autres méthodes de téléchargement des données
 */
function telecharger() {
	var url = $(".form-control").val();
	url = encodeURI(url);
	telechargerWPT(url);
	telechargerW3C(url);
}


/**
 * méthode future que j'implémenterai peut-être plus tard pour formater correctement l'URL passée (ex: facebook.com
 * --> https://www.facebook.com/ )
 * @param str
 * @returns {str}
 */
// function isURL(str) { // base trouvée sur StackOverFlow : sert à formater une URL (https:// + www + domaine)
// 	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
// 		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
// 		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
// 		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
// 		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
// 		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
// 	return pattern.test(str);
// }


/**
 * Méthode permettant d'afficher les données reçues par w3.validator.org
 * @param url : adresse entrée
 */
function telechargerWPT(url) {
	var items = []; // crée un tableau contenant les données résultantes
	var APIKey = "A.a34749d67ebe591881ecce7fba51dc0e";
	APIKey = "A.048cb1f5377a481447a5336a0ca5e9c6"; // j'ai 2 clés d'API car j'ai eu des problèmes de tests
	var format = "json";
	var adresse = "http://www.webpagetest.org/runtest.php?url=" + url + "&k=" + APIKey + "&f=" + format;
	// http://www.webpagetest.org/runtest.php?url=https%3A%2F%2Fwww.twitter.com%2F&k=A.a34749d67ebe591881ecce7fba51dc0e&f=json
	// pour les tests dans le navigateur
	$.getJSON(adresse, function (data) { //on récupère les données au format JSON, ce JSON contient lui-même un lien
		// vers le fichier JSON qui lui contient les données intéressantes
		console.debug(data);
		console.log(data.data.jsonUrl);
		$.getJSON(data.data.jsonUrl, function (data) {
			// console.log(data.jsonURL);
			console.debug(data);
			items.push(data.runs.firstView.loadTime);
			items.push(data.visualComplete);
			items.push(data.fullyLoaded);
			items.push(data.SpeedIndex);
		});
	})
}

/**
 * Méthode permettant d'afficher les données reçues par w3.validator.org
 * @param url : adresse entrée
 */
function telechargerW3C(url) {
	$("tbody").html('<td></td><td><img src="../images/ajax-loader.gif"></td>'); // on affiche une image de chargement
																				// pour le style

	$.getJSON("https://validator.w3.org/nu/?doc=" + url + "&out=json", function (data) { // on récupère les données
		// dans un fichier JSON
		var items = [];
		$.each(data.messages, function (key, val) { // qu'on place dans un tableau
			items.push(val);
		});

		$('tbody').empty(); // on réinitialise le tableau des résultats pour ne garder que les résultats de l'analyse
							// courante et retirer l'image d'animation

		$.each(items, function (key, val) { // on place les données dans un tableau HTML avec des classes Bootstrap
			var ligne = document.createElement("tr");
			$("tbody").append(ligne); // on crée une ligne <tr>
			var t = document.createElement("td");
			if (val.subType) {
				if (val.subType === "warning")
					ligne.className = 'warning';
				t.append(val.subType);
			}
			else {
				if (val.type === "error") // qu'on stylise avec une classe de Bootstrap
					ligne.className = 'danger';
				t.append(val.type);
			}
			ligne.appendChild(t); // on ajoute à la ligne une colonne contenant le type d'avertissement
			var m = document.createElement("td");
			m.append(val.message);
			ligne.appendChild(m);
			$("#w3c").append(ligne); // on ajoute la ligne au tableau HTML dédié aux résultats de W3C
		})
	});
}