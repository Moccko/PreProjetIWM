/**
 * Created by rrieunier on 14/11/2016.
 */

function telecharger() {
	var url = $(".form-control").val();
	url = "https://www.facebook.com";
	url = encodeURI(url);
	telechargerW3C(url);
	telechargerWPT(url);
}

/*
 Méthode permettant d'afficher les données reçues par
 w3.validator.org
 */

function isURL(str) { // base trouvée sur StackOverFlow : sert à formater une URL (https:// + www + domaine)
	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	return pattern.test(str);
}

function telechargerWPT(url) {
	var APIKey = "A.a34749d67ebe591881ecce7fba51dc0e";
	var format = "json";
	var adresse = "http://www.webpagetest.org/runtest.php?url=" + url + "&k=" + APIKey + "&f=" + format;
	// http://www.webpagetest.org/runtest.php?url=https%3A%2F%2Fwww.twitter.com%2F&k=A.a34749d67ebe591881ecce7fba51dc0e&f=json
	$.getJSON(adresse, function (data) {
		console.debug(data);
		$.get(adresse, data.detailCSV, function (data) {
			console.debug(data);
		}, "csv");
	})
}

function telechargerW3C(url) {
	$("tbody").html('<td></td><td><img src="../images/ajax-loader.gif"></td>');

	return;


	$.getJSON("https://validator.w3.org/nu/?doc=" + url + "&out=json", function (data) { //https%3A%2F%2Fwww.facebook.com%2F
		var items = [];
		$.each(data.messages, function (key, val) {
			items.push(val);
		});

		$('tbody').empty();

		$.each(items, function (key, val) {
			var ligne = document.createElement("tr");
			$("tbody").append(ligne);
			var t = document.createElement("td");
			if (val.subType) {
				if (val.subType === "warning")
					ligne.className = 'warning';
				t.append(val.subType);
			}
			else {
				if (val.type === "error")
					ligne.className = 'danger';
				t.append(val.type);
			}
			ligne.appendChild(t); // on
			// ajoute à la ligne une colonne contenant le
			// type d'avertissement
			var m = document.createElement("td");
			m.append(val.message);
			ligne.appendChild(m);
			$("#w3c").append(ligne);
		})
	});
}