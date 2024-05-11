let dictionary, re;
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

	$("body").on("keydown", function() {
		$("#searchfield").focus();
	});

	$("#dictselector").on("change", function() {
		loadDict($( this ).val());

		setSearchParam("d", $( this ).val());
	});

	$("input:checkbox").on("change", doSearch);

	const sp = new URLSearchParams(location.search);
	if(sp.has("q"))
		$("#searchfield").val(sp.get("q"));

	let language;
	if(sp.has("d") && sp.get("d") in languages)
		language = sp.get("d");
	else
		language = localStorage.getItem("language");

	if(!language)
		language = "en";

	$("#dictselector").val(language);
	setSearchParam("d", language);
	loadDict(language);
});

function loadDict(language) {
	Papa.parse("data/" + language + "-ie.csv", {
		download: true,
		header: false,
		skipEmptyLines: true,
		complete: function(results) {
			dictionary = results.data.slice(1);

			$(".natlang").text(languages[language][0]);
			$(".natlang_lower").text(languages[language][1]);

			localStorage.setItem("language", language);

			doSearch();
		}
	});
}

function setSearchParam(key, value) {
	const url = new URL(location);
	url.searchParams.set(key, value);
	history.pushState({}, "", url);
}

function searchOcc(entry) {
	return re.test(entry[1]);
}

function searchNat(entry) {
	return re.test(entry[0]);
}

function doSearch() {
	$("#searchfield").focus();
	$("#searchfield").select();

	const query_raw = $("#searchfield").val();
	const query = query_raw.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*?");

	if(query.length > 0) {
		$(".results_table").hide();
		re = new RegExp("(^|\\P{L})" + query + "($|\\P{L})", "ui");

		const results = [[], []]
		if($("#search_occ").is(":checked"))
			results[0] = dictionary.filter(searchOcc);
		if($("#search_nat").is(":checked"))
			results[1] = dictionary.filter(searchNat);

		if(results[0].length > 0 || results[1].length > 0) {
			$("#noresults").hide();
			$(".results_table tr:has(td)").remove();
			$(document).prop("title", query_raw + " – OcciDict");

			setSearchParam("q", query_raw);

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
			$(document).prop("title", "OcciDict");

			const url = new URL(location);
			url.searchParams.delete("q");
			history.pushState({}, "", url);
		}
	}
}
