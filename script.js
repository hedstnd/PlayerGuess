var player;
var awards;
var hitStats;
var pitchStats;
var fieldStats;
var atr = new XMLHttpRequest();
var pr = new XMLHttpRequest();
var srch = new XMLHttpRequest();
const awr = ["NLAS","ALAS", "NLMVP","ALMVP","NLHAA","ALHAA","NLGG","ALGG","NLSS","ALSS","NLCY","ALCY","WSCHAMP","NLROY","ALROY","ROY","MVP","WSMVP"];
const teams = [   108,   109,   110,   111,   112,   113,   114,   115,   116,   117,   118,   119,   120,   121,   133,   134,   135,   136,   137,   138,   139,   140,   141,   142,   143,   144,   145,   146,   147,   158 ];



window.onload = function() {
	var que = window.location.search.substring(1);
	if (que.length > 0) {
		pr.open("GET","https://statsapi.mlb.com/api/v1/people/" + que + "?hydrate=awards,stats(group=[hitting,pitching,fielding],type=[yearByYear])");
		pr.responseType = 'json';
		pr.send();
	} else {
		tm = teams[Math.round(Math.random() * 29)];
		atr.open("GET","https://statsapi.mlb.com/api/v1/teams/"+tm+"/roster?rosterType=allTime");
		atr.responseType = 'json'
		atr.send();
	}
}
atr.onload = function() {
	pId = atr.response.roster[Math.round(Math.random() * atr.response.roster.length) - 1].person.id;
	pr.open("GET","https://statsapi.mlb.com/api/v1/people/" + pId + "?hydrate=awards,stats(group=[hitting,pitching,fielding],type=[yearByYear])");
	pr.responseType = 'json';
	pr.send();
}
pr.onload = function() {
	player = pr.response.people[0];
	if (player.awards) {
		awards = player.awards;
	} else {
		awards = [];
	}
	console.log(player);
	setStats(player);
	var tab = setTable(player);
	console.log(tab);
	// document.getElementById("stats").innerHTML = tab.join("");
}

srch.onload = function() {
	console.log(srch.response);
	document.getElementById("autocom").innerHTML = "";
	for (var i = 0; i < srch.response.people.length; i++) {
		document.getElementById("autocom").innerHTML+= "<li onclick='gPlay("+srch.response.people[i].id+")'>" + srch.response.people[i].fullName + " (b. " + srch.response.people[i].birthDate.substring(0,4) + ")</li>";
	}
}

function setStats(person) {
	if (isPitcher(person)) {
		 pitchStats = person.stats.filter(e => e.group.displayName == "pitching")[0].splits;
	} else {
		hitStats = person.stats.filter(e => e.group.displayName == "hitting")[0].splits;
		fieldStats = person.stats.filter(e => e.group.displayName == "fielding")[0].splits;
	}
}
function getAwards(yr, tm=0) {
	var aw;
	if (tm > 0) {
		aw = awards.filter(e => (e.date.substring(0,4)) == (yr) && e.team.id == tm).map(e => e.id).filter(e => awr.includes(e));
	} else {
		aw = awards.filter(e => (e.date.substring(0,4)) == (yr)).map(e => e.id).filter(e => awr.includes(e));
	}
//	aw = aw.map(e => e.id.substring(2));
	return aw.join(",");
}

function isPitcher(person) {
	return person.primaryPosition.code === "1";
}

function setTable(pl) {
	if (isPitcher(pl)) {
		return setTablePitch(pl);
	}
	var ret = [];	
	var head =  "<tr><th>Year</th><th>Team</th><th>G</th><th>PA</th><th>AB</th><th>R</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>SB</th><th>CS</th><th>BB</th><th>SO</th><th>AVG</th><th>OBP</th><th>OPS</th><th>TB</th><th>GDP</th><th>HBP</th><th>SH</th><th>SF</th><th>IBB</th><th>POS</th><th>Awards</th></tr>";
	document.getElementById("tg").innerHTML = head;
	for (var i = 0; i < hitStats.length; i++) {
		var yr = document.createElement("tr");
		var statPush = [];
		for (var j = 0; j < 26; j++) {
			// console.log(j);
			statPush.push(document.createElement("td"));
		}
		statPush[0].innerText = hitStats[i].season;
		yr.appendChild(statPush[0]);
		if (hitStats[i].numTeams) {
			statPush[1].innerText = "TOT";
		} else {
			statPush[1].innerText = hitStats[i].team.name;
		}
		yr.appendChild(statPush[1]);
		statPush[2].innerText = hitStats[i].stat.gamesPlayed;
		yr.appendChild(statPush[2]);
		statPush[3].innerText = hitStats[i].stat.plateAppearances;
		yr.appendChild(statPush[3]);
		statPush[4].innerText = hitStats[i].stat.atBats;
		yr.appendChild(statPush[4]);
		statPush[5].innerText = hitStats[i].stat.runs;
		yr.appendChild(statPush[5]);
		statPush[6].innerText = hitStats[i].stat.hits;
		yr.appendChild(statPush[6]);
		statPush[7].innerText = hitStats[i].stat.doubles;
		yr.appendChild(statPush[7]);
		statPush[8].innerText = hitStats[i].stat.triples;
		yr.appendChild(statPush[8]);
		statPush[9].innerText = hitStats[i].stat.homeRuns;
		yr.appendChild(statPush[9]);
		statPush[10].innerText = hitStats[i].stat.rbi;
		yr.appendChild(statPush[10]);
		statPush[11].innerText = hitStats[i].stat.stolenBases;
		yr.appendChild(statPush[11]);
		statPush[12].innerText = hitStats[i].stat.caughtStealing;
		yr.appendChild(statPush[12]);
		statPush[13].innerText = hitStats[i].stat.baseOnBalls;
		yr.appendChild(statPush[13]);
		statPush[14].innerText = hitStats[i].stat.strikeOuts;
		yr.appendChild(statPush[14]);
		statPush[15].innerText = hitStats[i].stat.avg;
		yr.appendChild(statPush[15]);
		statPush[16].innerText = hitStats[i].stat.obp;
		yr.appendChild(statPush[16]);
		statPush[17].innerText = hitStats[i].stat.ops;
		yr.appendChild(statPush[17]);
		statPush[18].innerText = hitStats[i].stat.totalBases;
		yr.appendChild(statPush[18]);
		statPush[19].innerText = hitStats[i].stat.groundIntoDoublePlay;
		yr.appendChild(statPush[19]);
		statPush[20].innerText = hitStats[i].stat.hitByPitch;
		yr.appendChild(statPush[20]);
		statPush[21].innerText = hitStats[i].stat.sacBunts;
		yr.appendChild(statPush[21]);
		statPush[22].innerText = hitStats[i].stat.sacFlies;
		yr.appendChild(statPush[22]);
		statPush[23].innerText = hitStats[i].stat.intentionalWalks;
		yr.appendChild(statPush[23]);
		if (hitStats[i].numTeams) {
			statPush[24].innerText = getPos(hitStats[i].season,hitStats[i].numTeams);
		} else {
			statPush[24].innerText = getPos(hitStats[i].season,hitStats[i].team.id);
		}
		yr.appendChild(statPush[24]);
		if (awards.length > 0) {
			var aw;
			if (hitStats[i].numTeams) {
				aw = getAwards(hitStats[i].season);
			} else {
				aw = getAwards(hitStats[i].season,hitStats[i].team.id);
			}
			statPush[25].innerText = aw;//.join(",");
			// for (var i = 0; i < aw.length; i++) {
				// statPush.innerText = aw[i];
				// if (i != aw.length - 1) {
					// yr.push(",");
				// }
			// }
		}
		yr.appendChild(statPush[25]);
		// for (var q = 0; q < 26; q++) {
			// yr.appendChild(statPush[i]);
		// }
		document.getElementById("tg").appendChild(yr);
		
		// yr.push("</td></tr>");
		// ret.push(yr.join(""));
	}
	return true;
}

function setTablePitch(pl) {
	var ret = [];
	head ="<table><tr><th>Year</th><th>Team</th><th>W</th><th>L</th><th>ERA</th><th>G</th><th>GS</th><th>GF</th><th>CG</th><th>SHO</th><th>SV</th><th>IP</th><th>H</th><th>R</th><th>ER</th><th>HR</th><th>BB</th><th>IBB</th><th>K</th><th>HBP</th><th>BK</th><th>WP</th><th>BF</th><th>WHIP</th><th>K:BB</th><th>Awards</th></tr>";
	document.getElementById("tg").innerHTML = head;
	for (var i = 0; i < pitchStats.length; i++) {
		var yr = document.createElement("tr");
		var statPush = [];
		for (var j = 0; j < 26; j++) {
			// console.log(j);
			statPush.push(document.createElement("td"));
		}
		statPush[0].innerText = pitchStats[i].season;
		yr.appendChild(statPush[0]);
		if (pitchStats[i].numTeams) {
			statPush[1].innerText = "TOT";
		} else {
			statPush[1].innerText = pitchStats[i].team.name;
		}
		yr.appendChild(statPush[1]);
		statPush[2].innerText = pitchStats[i].stat.wins;
		yr.appendChild(statPush[2]);
		statPush[3].innerText = pitchStats[i].stat.losses;
		yr.appendChild(statPush[3]);
		statPush[4].innerText = pitchStats[i].stat.era;
		yr.appendChild(statPush[4]);
		statPush[5].innerText = pitchStats[i].stat.gamesPitched;
		yr.appendChild(statPush[5]);
		statPush[6].innerText = pitchStats[i].stat.gamesStarted;
		yr.appendChild(statPush[6]);
		statPush[7].innerText = pitchStats[i].stat.gamesFinished;
		yr.appendChild(statPush[7]);
		statPush[8].innerText = pitchStats[i].stat.completeGames;
		yr.appendChild(statPush[8]);
		statPush[9].innerText = pitchStats[i].stat.shutouts;
		yr.appendChild(statPush[9]);
		statPush[10].innerText = pitchStats[i].stat.saves;
		yr.appendChild(statPush[10]);
		statPush[11].innerText = pitchStats[i].stat.inningsPitched;
		yr.appendChild(statPush[11]);
		statPush[12].innerText = pitchStats[i].stat.hits;
		yr.appendChild(statPush[12]);
		statPush[13].innerText = pitchStats[i].stat.runs;
		yr.appendChild(statPush[13]);
		statPush[14].innerText = pitchStats[i].stat.earnedRuns;
		yr.appendChild(statPush[14]);
		statPush[15].innerText = pitchStats[i].stat.homeRuns;
		yr.appendChild(statPush[15]);
		statPush[16].innerText = pitchStats[i].stat.baseOnBalls;
		yr.appendChild(statPush[16]);
		statPush[17].innerText = pitchStats[i].stat.intentionalWalks;
		yr.appendChild(statPush[17]);
		statPush[18].innerText = pitchStats[i].stat.strikeOuts;
		yr.appendChild(statPush[18]);
		statPush[19].innerText = pitchStats[i].stat.hitBatsmen;
		yr.appendChild(statPush[19]);
		statPush[20].innerText = pitchStats[i].stat.balks;
		yr.appendChild(statPush[20]);
		statPush[21].innerText = pitchStats[i].stat.wildPitches;
		yr.appendChild(statPush[21]);
		statPush[22].innerText = pitchStats[i].stat.battersFaced;
		yr.appendChild(statPush[22]);
		statPush[23].innerText = pitchStats[i].stat.whip;
		yr.appendChild(statPush[23]);
		statPush[24].innerText = pitchStats[i].stat.strikeoutWalkRatio;
		yr.appendChild(statPush[24]);
		if (awards.length > 0) {
			var aw;
			if (pitchStats[i].numTeams) {
				aw = getAwards(pitchStats[i].season);
			} else {
				aw = getAwards(pitchStats[i].season,pitchStats[i].team.id);
			}
			statPush[25].innerText = aw;//.join(",");
			// for (var i = 0; i < aw.length; i++) {
				// statPush.innerText = aw[i];
				// if (i != aw.length - 1) {
					// yr.push(",");
				// }
			// }
		}
		yr.appendChild(statPush[25]);
		// for (var q = 0; q < 26; q++) {
			// yr.appendChild(statPush[i]);
		// }
		document.getElementById("tg").appendChild(yr);
		
		// yr.push("</td></tr>");
		// ret.push(yr.join(""));
	}
	return true;
}

function gPlay(id) {
	if (id == player.id) {
		correct();
	} else {
		incorrect();
	}
}

function correct() {
	document.getElementById("guess").value = "";
	document.getElementById("guess").setAttribute("disabled",true);
	document.getElementById("corr").innerText = "CORRECT!";
}

function incorrect() {
	
}

function getPos(yr,tm) {
	ls = fieldStats.filter(e => parseInt(e.season) == parseInt(yr) && ((e.team && e.team.id == tm) || e.numTeams == tm));
	ls = ls.sort(function(a,b) {return b.stat.gamesPlayed-a.stat.gamesPlayed});
	ret = "";
	for (var i = 0; i < ls.length; i++) {
		if (ls[i].position.code == "10") {
			ret+= "D";
		} else {
			ret+= ls[i].position.code;
		}
	}
	return ret;
}

	function t() {
		var timer = null;
           clearTimeout(timer); 
           timer = setTimeout(doStuff, 1000)
    };
    
    function doStuff() {
        playerSearch();
    }

function playerSearch() {
	if (document.getElementById("guess").value != "") {
		srch.open("GET","https://statsapi.mlb.com/api/v1/people/search?names=" + document.getElementById("guess").value + "&sportId=22&hydrate=awards,stats(group=[hitting,pitching,fielding],type=[career,yearByYear])");
		srch.responseType = "json";
		srch.send();
	}
}