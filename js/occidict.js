var dictionary, re;
var tables = ["#results_occ", "#results_nat"];

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

	Papa.parse('data/en-ie.csv', {
		download: true,
		header: false,
		skipEmptyLines: true,
		complete: function(results) {
			dictionary = results.data.slice(1);
			console.log(dictionary);
		}
	});
});

function searchOcc(entry) {
	return re.test(entry[1].toLowerCase());
}

function searchNat(entry) {
	return re.test(entry[0].toLowerCase());
}

function doSearch() {
	$("#searchfield").focus();
	$("#searchfield").select();

	var query = $("#searchfield").val().trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*?");

	if(query.length > 0) {
		$(".results_table").hide();
		re = new RegExp("\\b" + query + "\\b");

		var results = [[], []]
		if($("#search_occ").is(":checked"))
			results[0] = dictionary.filter(searchOcc);
		if($("#search_nat").is(":checked"))
			results[1] = dictionary.filter(searchNat);

		if(results[0].length > 0 || results[1].length > 0) {
			$("#noresults").hide();
			$(".results_table tr:has(td)").remove();
			$(document).prop("title", $("#searchfield").val() + " - OcciDict");

			var re_start = new RegExp("^\\b" + query + "\\b");
			results.forEach(function(ra, i) {
				if(ra.length > 0) {
					var entries = [[], []];
					ra.sort(function(a, b){return a[1-i] < b[1-i] ? -1 : 1});
					ra.forEach(function(r) {
						if(re_start.test(r[1-i].toLowerCase()))
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
		}
	}
}
