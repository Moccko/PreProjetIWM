/**
 * Created by Roman Rieunier on 14/11/2016.
 */

/**
 * Méthode permettant d'insérer des balises <code></code> dans un string avec comme séparateurs “ et ”
 * @param str : string
 * @returns str : string
 */
function insererBalisesCode(str) {
	str = str.replace(/“/g, "<code>");
	str = str.replace(/”/g, "</code>");
	return str;
}

/**
 * Méthode permettant de séparer un string en un tableau de 3 string afin de mettre des balises <mark></mark> autour
 * du 2ème string (le code erroné dans W3C)
 * @param str : string
 * @returns extraits : Array[string]
 */
function surlignage(str) {

	var tab = str.split("");	// je crée un tableau de caractères pour manipuler plus facilement str
	var extraits = [];			// le tableau contenant les string
	extraits.push(tab.splice(0, 10).join(''));	// le surlignage commence à partir du 10ème caractère
	var place = tab.length - 6;					// le surlignage s'arrête 6 caractères avant la fin
	extraits.push(tab.splice(0, place).join(''));
	extraits.push(tab.join(''));
	return extraits;
}

/**
 * méthode pour formater correctement l'URL passée (ex: facebook.com --> https://www.facebook.com/ )
 * @param str : string
 * @returns str : string
 */
function formatURL(str) {

	var www = new RegExp('^www\\.');			// commence par www.
	var https = new RegExp('^https?:\\/\\/');	// commence par http:// ou https://
	var slash = new RegExp('\\/\\$');			// finit par /
	if (!https.test(str)) {						// on ajuste pour que l'URL commence par https://www.
		if (!www.test(str))
			str = 'www.' + str;
		str = "https://" + str;
	}
	if (!slash.test(str))						// on ajoute un / à la fin de l'URL
		str += '/';
	return str;
}

/**
 * Méthode encodant correctement l'URL et appelant les autres méthodes de téléchargement des données
 */
function telecharger() {

	$("tbody").html('<td></td><td><img src="../images/ajax-loader.gif"></td>'); // on affiche une image de chargement
																				// pour le style
	var url = $("input").val();
	url = formatURL(url);	// on formate l'URL
	url = encodeURI(url);	// on l'encode au format HTML (ex. / => %2F)
	telechargerW3C(url);
	telechargerWPT(url);
}


/**
 * Méthode permettant d'afficher les données reçues par webpagetest.org
 * @param url : string
 */
function telechargerWPT(url) {

	var wpt = "http://www.webpagetest.org/runtest.php?url=";
	var APIKey = "A.a34749d67ebe591881ecce7fba51dc0e";
//	APIKey = "A.048cb1f5377a481447a5336a0ca5e9c6";
//	APIKey = "A.910d116aae1bec685075212f6567b732";
	var format = "json";
	var adresse = wpt + url + "&k=" + APIKey + "&f=" + format;

	$.getJSON(adresse, function (original) {	//on récupère les données au format JSON, ce JSON contient lui-même un
		// lien vers le fichier JSON qui lui contient les données intéressantes

		// impossible de faire fonctionner correctement la fonction : obligé de passer par un test déjà effectué
		// sinon le test est toujours en attente et ne donne pas les résultats demandés
		var urlPredefinie = "http://www.webpagetest.org/jsonResult.php?test=161119_1R_HT6";

		$.getJSON(/*original.data.jsonUrl*/ urlPredefinie, function (result) {

			var loadTime = result.data.average.firstView.loadTime;
			var visComplete = result.data.average.firstView.visualComplete;
			var fullLoaded = result.data.average.firstView.fullyLoaded;
			var speedIndex = result.data.average.firstView.SpeedIndex;

			$('#wpt').empty(); // on vide le tableau des résultats pour ne garder que les résultats de l'analyse
							   // courante et retirer l'image d'animation

			var lt = document.createElement('tr');
			lt.innerHTML = '<th>Load time</th><td>' + loadTime + '</td>';
			var vc = document.createElement('tr');
			vc.innerHTML = '<th>Visually complete</th><td>' + visComplete + '</td>';
			var fl = document.createElement('tr');
			fl.innerHTML = '<th>Fully loaded</th><td>' + fullLoaded + '</td>';
			var si = document.createElement('tr');
			si.innerHTML = '<th>Speed index</th><td>' + speedIndex + '</td>';
			document.getElementById('wpt').appendChild(lt);
			document.getElementById('wpt').appendChild(vc);
			document.getElementById('wpt').appendChild(fl);
			document.getElementById('wpt').appendChild(si);// $('#wpt').append(lt, vc, fl, si);
		});
	});
}

/**
 * Méthode permettant d'afficher les données reçues par w3.validator.org
 * @param url : string
 */
function telechargerW3C(url) {

	$.getJSON('https://validator.w3.org/nu/?doc=' + url + '&out=json', function (data) { // on récupère les données
		// dans un fichier JSON
		var messages = [];
		$.each(data.messages, function (key, val) { // qu'on place dans un tableau
			messages.push(val);
		});

		$('#w3c').empty(); // on vide le tableau des résultats pour ne garder que les résultats de l'analyse
		// courante et retirer l'image d'animation

		$.each(messages, function (key, val) { // on place les données dans un tableau HTML avec des classes Bootstrap
			var ligne;
			ligne = document.createElement('tr');
			$('tbody').append(ligne);					// on crée une ligne <tr>
			var colonne = document.createElement('th');	// on écrit la catégorie de l'erreur dans un header

			var intitule;
			switch (val.type) {	// on stylise la ligne avec Bootstrap
				case 'error':
					ligne.className = 'danger';
					intitule = 'ERROR';
					if (val.subType)
						intitule = val.subType.toUpperCase();
					colonne.innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span> ' + intitule;
					break;
				case 'info':
					ligne.className = 'warning';
					intitule = val.subType.toUpperCase();
					colonne.innerHTML = '<span class="glyphicon glyphicon-exclamation-sign"></span> ' + intitule;
					break;
				default:
					ligne.className = 'danger';
					intitule = 'IMPOSSIBLE DE R&Eacute;CUP&Eacute;RER LE DOCUMENT';
					colonne.innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span> ' + intitule;
					break;
			}
			ligne.appendChild(colonne); // on ajoute à la ligne une colonne contenant le type d'avertissement

			var info = document.createElement('td');	// la colonne contenant les informations sur l'erreur
			var ld, lf, cd, cf;							// lignes début / fin, colonnes début/fin dans le code
			if (val.firstLine)
				ld = val.firstLine;						// parfois la première ligne est aussi la dernière
			else ld = val.lastLine;
			lf = val.lastLine;
			cd = val.firstColumn;
			cf = val.lastColumn;
			var detail = 'De la ligne ' + ld + ', colonne ' + cd + ' &agrave; la ligne ' + lf + ', colonne ' + cf;
			info.innerHTML = '<strong>' + insererBalisesCode(val.message) + '</strong>' + '<br/>' + detail + '<br/>';

			if (val.extract) {								// l'extrait de code erroné
				var code = document.createElement('code');
				var extract = surlignage(val.extract);		// on découpe le code
				var mark = document.createElement('mark');	// on place les balise <mark></mark> de surlignage
				mark.append(extract[1]);
				code.append(extract[0]);
				code.appendChild(mark);
				code.append(extract[2]);
				info.appendChild(code);
			}
			ligne.appendChild(info);
			$('#w3c').append(ligne); // on ajoute la ligne au tableau HTML dédié aux résultats de W3C
		});
	});
}