/**
 * Created by rrieunier on 14/11/2016.
 */

function telecharger() {
	$.get("../html/index.html", telechargerW3C());
	$.get("../html/index.html", telechargerWPT());
}

function telechargerW3C(url) {
	jQuery.getJSON(url, function () {

	});
}

function telechargerWPT() {

}