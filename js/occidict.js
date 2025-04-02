let dictionary, language, re;
const tables = ["#results_occ", "#results_nat"];
const languages = {
	en:	["Anglés",	"anglés"],
	de:	["German",	"german"],
	cn:	["Chinés",	"chinés"],
	ru:	["Russ",	"russ"],
	eo:	["Esperanto",	"Esperanto"],
	es:	["Hispan",	"hispan"],
	val:	["Valencian",	"valencian"],
	bal:	["Balearic",	"balearic"],
	an:	["Aragonés",	"aragonés"],
	gl:	["Galician",	"galician"],
	pt:	["Portugalés",	"portugalés"]
};

$(document).ready(function() {
	$("#searchfield").focus();
	$("#searchfield").on("keypress", function(event) {
		if(event.key === "Enter") {
			event.preventDefault;
			$("#searchbutton").click();
		}
	});

	$("body").on("keydown", function(event) {
		if(event.key === "Tab") {
			event.preventDefault;
			let newLanguage;
			if(!(newLanguage = Object.keys(languages).at(Object.keys(languages).indexOf(language) + (event.shiftKey ? -1 : 1))))
				newLanguage = Object.keys(languages)[0];
			loadDict(newLanguage, true);
		}
	});

	$("body").on("keydown", function() {
		$("#searchfield").focus();
	});

	$("#dictselector").on("change", function() {
		loadDict($( this ).val(), true);
	});

	$("input:checkbox").on("change", function() {
		doSearch(true);
	});

	$(window).on("popstate", function(e) {
		const state = e.originalEvent.state;
		if(state) {
			$("#searchfield").val(state.q);

			if(state.d != language)
				loadDict(state.d, false);
			else
				doSearch(false);
		}
	});

	const date = new Date();

	function wink() {
		$("#eyesclosed").show();
		setTimeout(function() {
			$("#eyesclosed").hide();
		}, 300);
		setTimeout(wink, 1000 + Math.random() * 5000);
	}

	if(date.getMonth() == 7 && date.getDate() == 23 && $(window).width() > 600) {
		let svg = '<svg id="logo2" xmlns="http://www.w3.org/2000/svg">';
		svg += '<image id="edgar" href="img/edgar.png" width="150" height="150" />';
		svg += '<circle id="eye1" cx="45" cy="69" r="2" style="fill:#333;" />';
		svg += '<circle id="eye2" cx="82" cy="66" r="2" style="fill:#333;" />';
		svg += '<image id="eyesclosed" href="img/edgar2.png" width="150" height="150" />';
		svg += '</svg>';
		$("#logo_link").prepend(svg);
		$("#logo_link").attr('title', (date.getFullYear() - 1867).toString() + '-im aniversarie de Edgar de Wahl');
		$("#eyesclosed").hide();
		$(window).on("mousemove", function(e) {
			let xc = $(window).width() / 2;
			let xo = (e.pageX - xc) / xc * 4;
			$("#eye1").attr("cx", 45 + xo);
			$("#eye2").attr("cx", 82 + xo);
			let yo = (e.pageY - 120) / (e.pageY < 120 ? 120 : $(window).height() - 120);
			$("#eye1").attr("cy", 69 + yo);
			$("#eye2").attr("cy", 66 + yo);
		});
		setTimeout(wink, 500);
	}

	const sp = new URLSearchParams(location.search);
	if(sp.has("q"))
		$("#searchfield").val(sp.get("q"));

	if(sp.has("d") && sp.get("d") in languages)
		language = sp.get("d");
	else
		language = localStorage.getItem("language");

	if(!language)
		language = "en";

	history.replaceState({ d: language, q: $("#searchfield").val() }, "", document.location.href);
	loadDict(language, false);
});

function loadDict(lang, history) {
	language = lang;
	Papa.parse("data/" + language + "-ie.csv", {
		download: true,
		header: false,
		skipEmptyLines: true,
		complete: function(results) {
			dictionary = results.data.slice(1);

			if(history)
				pushHistory();

			$(".natlang").text(languages[language][0]);
			$(".natlang_lower").text(languages[language][1]);
			$("#dictselector").val(language);

			localStorage.setItem("language", language);

			doSearch(false);
		}
	});
}

function pushHistory() {
	const url = new URL(location);
	url.searchParams.set("d", language);
	if($("#searchfield").val().length > 0)
		url.searchParams.set("q", $("#searchfield").val());
	else
		if(url.searchParams.has("q"))
			url.searchParams.delete("q");
	history.pushState({ d: language, q: $("#searchfield").val() }, "", url);
}

function searchOcc(entry) {
	return re.test(entry[1]);
}

function searchNat(entry) {
	return re.test(entry[0]);
}

function doSearch(history) {
	$("#searchfield").focus();
	$("#searchfield").select();
	$(".results_table").hide();
	$("#noresults").hide();

	if(history)
		pushHistory();

	const query_raw = $("#searchfield").val();
	const query = query_raw.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*?");

	if(query.length > 0) {
		re = new RegExp("(^|\\P{L})" + query + "($|\\P{L})", "ui");

		const results = [[], []]
		if($("#search_occ").is(":checked"))
			results[0] = dictionary.filter(searchOcc);
		if($("#search_nat").is(":checked"))
			results[1] = dictionary.filter(searchNat);

		$(document).prop("title", query_raw + " – OcciDict");

		if(results[0].length > 0 || results[1].length > 0) {
			$(".results_table tr:has(td)").remove();

			const re_start = new RegExp("^" + query + "($|\\P{L})", "ui");
			results.forEach(function(ra, i) {
				if(ra.length > 0) {
					const entries = [[], []];
					ra.sort(function(a, b){return a[1-i] < b[1-i] ? -1 : 1});
					ra.forEach(function(r) {
						if(re_start.test(r[1-i]))
							entries[0].push(r);
						else
							entries[1].push(r);
					});
					entries.forEach(function(e) {
						e.forEach(function(r) {
							$(tables[i]).append("<tr><td>" + r[1-i] + "</td><td>" + r[i] + "</td></tr>");
						});
					});
					$(tables[i]).show();
				}
			});
		}
		else {
			$("#noresults").show();
		}
	}
	else
		$(document).prop("title", "OcciDict");
}
