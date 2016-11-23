﻿/**
 * Created by rrieunier on 14/11/2016.
 */

/**
 * Méthode encodant correctement l'URL et appelant les autres méthodes de téléchargement des données
 */
function telecharger() {
	$("tbody").html('<td></td><td><img src="../images/ajax-loader.gif"></td>'); // on affiche une image de chargement
																				// pour le style
	var url = $("input").val();
	url = encodeURI(url);
	telechargerW3C(url);
	telechargerWPT(url);
}


/**
 * méthode future que j'implémenterai peut-être plus tard pour formater correctement l'URL passée (ex: facebook.com
 * --> https://www.facebook.com/ )
 * @param str
 * @returns {str}
 */
// function isURL(str) { // base trouvée sur StackOverFlow : sert à formater une URL (https:// + www + domaine + /)
// 	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
// 		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
// 		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
// 		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
// 		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
// 		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
// 	return pattern.test(str);
// }


/**
 * Méthode permettant d'afficher les données reçues par webpagetest.org
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

	$.getJSON(adresse, function (original) { //on récupère les données au format JSON, ce JSON contient lui-même un lien
		// vers le fichier JSON qui lui contient les données intéressantes
		console.log(original.data.jsonUrl);
		$.getJSON("http://www.webpagetest.org/jsonResult.php?test=161119_1R_HT6"/*original.data.jsonUrl*/, function (result) {
			console.debug(result);
			var loadTime = result.data.average.firstView.loadTime;
			var visComplete = result.data.average.firstView.visualComplete;
			var fullLoaded = result.data.average.firstView.fullyLoaded;
			var speedIndex = result.data.average.firstView.SpeedIndex;

			$('#wpt').empty(); // on réinitialise le tableau des résultats pour ne garder que les résultats de l'analyse
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
 * @param url : adresse entrée
 */
function telechargerW3C(url) {

	$.getJSON('https://validator.w3.org/nu/?doc=' + url + '&out=json', function (data) { // on récupère les données
		// dans un fichier JSON
		var datas = [];
		$.each(data.messages, function (key, val) { // qu'on place dans un tableau
			datas.push(val);
		});

		$('#w3c').empty(); // on réinitialise le tableau des résultats pour ne garder que les résultats de l'analyse
		// courante et retirer l'image d'animation

		$.each(datas, function (key, val) { // on place les données dans un tableau HTML avec des classes Bootstrap
			var ligne;
			ligne = document.createElement('tr');
			$('tbody').append(ligne); // on crée une ligne <tr>
			var colonne = document.createElement('th');
			if (val.subType) {
				if (val.subType === 'warning')
					ligne.className = 'warning';
				colonne.innerHTML = '<span class="glyphicon glyphicon-exclamation-sign"></span> ' + val.subType;
			}
			else {
				if (val.type === 'error') // qu'on stylise avec une classe de Bootstrap
					ligne.className = 'danger';
				colonne.innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span> ' + val.type;
			}

			ligne.appendChild(colonne); // on ajoute à la ligne une colonne contenant le type d'avertissement
			var info = document.createElement('td');
			var ld, lf, cd, cf; // lignes début / fin colonnes début/fin
			if (val.firstLine)
				ld = val.firstLine;
			else ld = val.lastLine;
			lf = val.lastLine;
			cd = val.firstColumn;
			cf = val.lastColumn;
			var detail = 'From line ' + ld + ', column ' + cd + '; to line ' + lf + ', column ' + cf;
			info.innerHTML = '<strong>' + insererCode(val.message) + '</strong>' + '<br/>' + detail + '<br/>';
			var code = document.createElement('code');

			var extract = surlignage(val.extract);
			var mark = document.createElement('mark');
			mark.append(extract[1]);
			code.append(extract[0]);
			code.appendChild(mark);
			code.append(extract[2]);
			//code.append(val.extract); //.innerHTML = surlignage(val.extract);//


			info.appendChild(code);
			ligne.appendChild(info);
			$('#w3c').append(ligne); // on ajoute la ligne au tableau HTML dédié aux résultats de W3C
		});
	});
}

function insererCode(str) {
	str = str.replace(/“/g, "<code>");
	str = str.replace(/”/g, "</code>");
	return str;
}

function surlignage(str) {
	var tab = str.split("");
	var results = [];
	results.push(tab.splice(0, 10).join(''));
	var place = tab.length - 6;
	results.push(tab.splice(0, place).join(''));
	console.log(place + ' ' + tab.length);
	results.push(tab.join(''));
	console.log(tab.splice(place).join(''));
	return results;
}