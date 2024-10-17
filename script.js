var player;
var queries = new Object();
var awards;
var hitStats;
var pitchStats;
var fieldStats;
var hitRank;
var allTimeLead;
var singleSeasonLead;
var pitchRank;
const hitCats = ["yr","tm","gamesPlayed","plateAppearances","atBats","runs","hits","doubles","triples","homeRuns","rbi","stolenBases","caughtStealing","baseOnBalls","strikeOuts","avg","obp","ops","totalBases","groundIntoDoublePlay","hitByPitch","sacBunts","sacFlies","intentionalWalks","pos","awards"];
const pitchCats = ["yr","tm","wins","losses","era","gamesPitched","gamesStarted","gamesFinished","completeGames","shutouts","saves","inningsPitched","hits","runs","earnedRuns","homeRuns","baseOnBalls","intentionalWalks","strikeOuts","hitBatsmen","balks","wildPitches","battersFaced","whip","strikeoutWalkRatio","awards"];
var awardJson;
var atr = new XMLHttpRequest();
var pr = new XMLHttpRequest();
var srch = new XMLHttpRequest();
var atL = new XMLHttpRequest();
var atL2 = new XMLHttpRequest();
// var ssRec = new XMLHttpRequest();
// var ssRec2 = new XMLHttpRequest();
const awr = ["NLAS","ALAS","NLGG","ALGG","NLSS","ALSS","WSCHAMP","ROY","MVP","WSMVP"];
var teams = [   108,   109,   110,   111,   112,   113,   114,   115,   116,   117,   118,   119,   120,   121,   133,   134,   135,   136,   137,   138,   139,   140,   141,   142,   143,   144,   145,   146,   147,   158];
var nlbTeams = [1536, 1541, 1490, 1491, 1492, 1493, 1495, 1508, 1512, 1513, 1514, 1515, 1517, 1520, 1523, 1524, 1529, 1530, 1534];



window.onload = function() {
	var que = window.location.search.substring(1);
	// ssRec.open("GET","https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=wins,losses,era,completeGames,shutouts,saves,inningsPitched,earnedRuns,hitBatsmen,balks,wildPitches,battersFaced,whip,strikeoutWalkRatio&statType=statsSingleSeason&limit=1");
	// ssRec.responseType = 'json';
	// ssRec.send();
	var ssRec = getData("https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=wins,losses,era,completeGames,shutouts,saves,inningsPitched,earnedRuns,hitBatsmen,balks,wildPitches,battersFaced,whip,strikeoutWalkRatio&statType=statsSingleSeason&limit=1").then((ssr) => {
		document.getElementById("prog").value=25;
		var ssRec2 = getData("https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=plateAppearances,atBats,runs,hits,doubles,triples,homeRuns,rbi,stolenBases,caughtStealing,baseOnBalls,strikeOuts,avg,obp,ops,totalBases,gidp,hitByPitch,sacBunts,sacFlies,intentionalWalks&statType=statsSingleSeason&limit=1").then((ssr2) => {
			document.getElementById("prog").value= 50;
			singleSeasonLead = ssr.leagueLeaders.filter(e => e.statGroup == "pitching" || e.statGroup == "hitting").concat(ssr2.leagueLeaders.filter(f => f.statGroup == "pitching" || f.statGroup == "hitting"));
	
	var aJson = getData('./awards.json').then((val) => {
		document.getElementById("prog").value = 75;
		awardJson = val;
		if (que.length > 0 && !que.includes("=")) {
			pr.open("GET","https://statsapi.mlb.com/api/v1/people/" + que + "?hydrate=xrefId,awards,stats(group=[hitting,pitching,fielding],type=[career,rankings,yearByYear,rankingsByYear,sabermetrics](team(league)))");
			pr.responseType = 'json';
			pr.send();
		} else if (que.length > 0 && que.includes("playerId")) {
			var queSpl = que.split("&");
			for (var i = 0; i < queSpl.length; i++) {
				var query = queSpl[i].split("=");
				queries[query[0]] = query[1];
			}
			pr.open("GET","https://statsapi.mlb.com/api/v1/people/" + queries.playerId + "?hydrate=xrefId,awards,stats(group=[hitting,pitching,fielding],type=[career,rankings,yearByYear,rankingsByYear,sabermetrics](team(league)))");
			pr.responseType = 'json';
			pr.send();
		} else {
			teams = teams.concat(nlbTeams);
			tm = teams[Math.round(Math.random() * (teams.length - 1))];
			atr.open("GET","https://statsapi.mlb.com/api/v1/teams/"+tm+"/roster?rosterType=allTime");
			atr.responseType = 'json'
			atr.send();
		}
	});});});
}
// ssRec.onload = function() {
	// singleSeasonLead = ssRec.response.leagueLeaders.filter(e => e.statGroup == "pitching" || e.statGroup =="hitting");
	// ssRec2.open("GET","https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=plateAppearances,atBats,runs,hits,doubles,triples,homeRuns,rbi,stolenBases,caughtStealing,baseOnBalls,strikeOuts,avg,obp,ops,totalBases,gidp,hitByPitch,sacBunts,sacFlies,intentionalWalks&statType=statsSingleSeason&limit=1");
	// ssRec2.responseType = 'json';
	// ssRec2.send();
// }
// ssRec2.onload = function() {
	// singleSeasonLead = singleSeasonLead.concat(ssRec2.response.leagueLeaders.filter(e => e.statGroup == "hitting" || e.statGroup == "pitching"));
	
// }
atL.onload = function() {
	allTimeLead = atL.response.leagueLeaders.filter(e => e.statGroup == "pitching" || e.statGroup == "hitting");
	atL2.open("GET","https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=plateAppearances,atBats,runs,hits,doubles,triples,homeRuns,rbi,stolenBases,caughtStealing,baseOnBalls,strikeOuts,avg,obp,ops,totalBases,gidp,hitByPitch,sacBunts,sacFlies,intentionalWalks&statType=career&limit=1");
	atL2.responseType = 'json';
	atL2.send();
}
atL2.onload = function() {
	allTimeLead = allTimeLead.concat(atL2.response.leagueLeaders.filter(e => e.statGroup == "hitting" || e.statGroup == "pitching"));
	console.log(allTimeLead);
	if (isPitcher(player)) {
		for (var i = 0; i < pitchCats.length; i++) {
			if (allTimeRecord(pitchCats[i],"pitching")) {
				document.getElementById(pitchCats[i]).style.backgroundColor = "gold";
				document.getElementById(pitchCats[i]).style.fontStyle = "italic";
			}
		}
	} else {
		for (var i = 2; i < hitCats.length; i++) {
			console.log("hi" + allTimeRecord(hitCats[i],"hitting"));
			if (allTimeRecord(hitCats[i],"hitting")) {
				console.log(hitCats[i]);
				document.getElementById(hitCats[i]).style.backgroundColor = "gold";
				document.getElementById(hitCats[i]).style.fontStyle = "italic";
			}
		}
	}
}
atr.onload = function() {
	document.getElementById("prog").value = 87.5;
	pId = atr.response.roster[Math.max(0,Math.round(Math.random() * atr.response.roster.length) - 1)].person.id;
	pr.open("GET","https://statsapi.mlb.com/api/v1/people/" + pId + "?hydrate=currentTeam,team,stats(group=[hitting,pitching,fielding],type=[yearByYear,careerRegularSeason,rankings,rankingsByYear](team(league)),leagueListId=mlb_hist),xrefId,awards&site=en");
	pr.responseType = 'json';
	pr.send();
}
pr.onload = function() {
	document.getElementById("prog").value = 100;
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
	atL.open("GET","https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=wins,losses,era,completeGames,shutouts,saves,inningsPitched,earnedRuns,hitBatsmen,balks,wildPitches,battersFaced,whip,strikeoutWalkRatio&statType=career&limit=1");
	atL.responseType="json";
	atL.send();
}

srch.onload = function() {
	console.log(srch.response);
	document.getElementById("autocom").innerHTML = "";
	document.getElementById("comp").className = "";
	for (var i = 0; i < srch.response.people.length; i++) {
		document.getElementById("autocom").innerHTML+= "<li id='i"+srch.response.people[i].id+"' onclick='gPlay("+srch.response.people[i].id+")'>" + srch.response.people[i].fullName + " (b. " + srch.response.people[i].birthDate.substring(0,4) + ")</li>";
	}
}

function setStats(person) {
	if (isPitcher(person)) {
		 pitchStats = person.stats.filter(e => e.group.displayName == "pitching" && e.type.displayName == "yearByYear")[0].splits;
		 pitchRank = person.stats.filter(e => e.group.displayName == "pitching" && e.type.displayName == "rankingsByYear")[0].splits;
	} else {
		hitStats = person.stats.filter(e => e.group.displayName == "hitting" && e.type.displayName == "yearByYear")[0].splits;
		try {
			fieldStats = person.stats.filter(e => e.group.displayName == "fielding" && e.type.displayName == "yearByYear")[0].splits;
		} catch(err) {
			fieldStats = [];
		}
		hitRank = person.stats.filter(e => e.group.displayName == "hitting" && e.type.displayName == "rankingsByYear")[0].splits;
	}
}
function getAwards(yr, tm=0) {
	var aw;
	var refId;
	try {
		refId = player.xrefIds.filter(e => e.xrefType == "lahman")[0].xrefId;
	} catch(err) {
		refId = player.lastName.replaceAll(" ","").toLowerCase().substring(0,5) + (player.useFirstName || player.useName).replaceAll(" ","").replaceAll(".","").toLowerCase().substring(0,2);
		try {
			refId+=player.xrefIds.filter(e => e.xrefType == "retrosheet")[0].xrefId.substring(6);
		} catch (err2) {
			refId+= "01";
		}
	}
	console.log(refId);
	if (tm > 0) {
		aw = awards.filter(e => (e.date.substring(0,4)) == (yr) && e.team.id == tm).map(e => e.id).filter(e => awr.includes(e));
		var refAwr = awardJson.filter(e => e.yearID == yr && (e.playerID == player.id || e.playerID == refId));
		console.log(refAwr);
		if (refAwr.length > 0) {
			for (var i = 0; i < refAwr.length; i++) {
				var share = awardJson.filter(e => e.awardID == refAwr[i].awardID && e.yearID == refAwr[i].yearID);
				console.log(share);
				var ind = share.indexOf(refAwr);
				while (share[i].pointsWon == refAwr[i].pointsWon) {
					ind--;
				}
				aw+=", "+refAwr[i].awardID+"-"+(ind+1);
			}
		}
	} else {
		aw = awards.filter(e => (e.date.substring(0,4)) == (yr)).map(e => e.id).filter(e => awr.includes(e));
		var refAwr = awardJson.filter(e => e.yearID == yr && (e.playerID == refId || e.playerID == player.id));
		console.log(refAwr);
		if (refAwr.length > 0) {
			for (var i = 0; i < refAwr.length; i++) {
				var share = awardJson.filter(e => e.lgID == refAwr[i].lgID && e.awardID == refAwr[i].awardID && e.yearID == refAwr[i].yearID);
				console.log(share);
				var ind = share.indexOf(refAwr[i]);
				console.log(ind);
				while (ind >= 0 && share[ind].pointsWon == refAwr[i].pointsWon) {
					ind--;
				}
				console.log(share.indexOf(refAwr[i]));
				if (share.indexOf(refAwr[i]) > 0) {
					aw.push(refAwr[i].awardID+"-"+(ind/*share.indexOf(refAwr[i])*/+2));
				} else {
					aw.push("<b>"+refAwr[i].awardID+"-"+(share.indexOf(refAwr[i])+1)+"</b>");
				}
			}
		}
	}
//	aw = aw.map(e => e.id.substring(2));
	console.log(aw);
	return aw.join(",").replaceAll("CHALM","MVP").replaceAll("AWARD","MVP").replaceAll("AL","").replaceAll("NL","");
}

function isPitcher(person) {
	return person.primaryPosition.code === "1";
}

async function setTable(pl) {
	document.getElementById("prog").style.display = "none";
	document.getElementById("load").style.display = "none";
	if (isPitcher(pl)) {
		return setTablePitch(pl);
	}
	if (queries.startYear) {
		hitStats = hitStats.filter(e => e.season >= parseInt(queries.startYear));
	}
	if (queries.endYear) {
		hitStats = hitStats.filter(e => e.season <= parseInt(queries.endYear));
	}
	var ret = [];	
	var head =  "<tr><th>Year</th><th>Team</th><th>G</th><th>PA</th><th>AB</th><th>R</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>SB</th><th>CS</th><th>BB</th><th>SO</th><th>AVG</th><th>OBP</th><th>OPS</th><th>TB</th><th>GDP</th><th>HBP</th><th>SH</th><th>SF</th><th>IBB</th><th>POS</th><th>Awards</th></tr>";
	document.getElementById("tg").innerHTML = head;
	for (var i = 0; i < hitStats.length; i++) {
		var yr = document.createElement("tr");
		var statPush = [];
		var oneTeam = getHitStats(hitStats[i].season).length == 1;
		for (var j = 0; j < 26; j++) {
			// console.log(j);
			statPush.push(document.createElement("td"));
		}
		console.log(hitStats[i].season);
		if (i > 0 && parseInt(hitStats[i-1].season) < parseInt(hitStats[i].season)-1) {
			console.log("THIS " + hitStats[i-1].season + " " + hitStats[i].season);
			var emptyRow = document.createElement("tr");
			var rowData = document.createElement("td");
			rowData.className = "dnp";
			rowData.setAttribute("colspan","26")
			emptyRow.appendChild(rowData);
			document.getElementById("tg").appendChild(emptyRow);
		}
		statPush[0].innerText = hitStats[i].season;
		yr.appendChild(statPush[0]);
		// if (hitStats[i].numTeams) {
			// statPush[1].innerText = "TOT";
		// } else {
			// statPush[1].innerText = hitStats[i].team.name;
		// }
		statPush[1].innerText = getTeamAbbr(hitStats[i]);
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
			var aw = "";
			if (hitStats[i].numTeams || oneTeam) {
				aw = getAwards(hitStats[i].season);
			}
			statPush[25].innerHTML = aw;//.join(",");
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
		if ((oneTeam || hitStats[i].numTeams) && hitRank.length > 0 && parseInt(hitStats[i].season) > 1900) {
			for (var j = 2; j < 24; j++) {
				if (isHitLeader(hitStats[i].season,hitCats[j])) {
					statPush[j].style.fontWeight = 'bold';
				}
			}
		}
		for (var j = 0; j < 24; j++) {
			if (hitStats[i].stat[hitCats[j]] == singleSeasonRecord(hitCats[j],"hitting")) {
				console.log("record" + hitCats[j] + " " + hitStats[i].season);
				statPush[j].style.backgroundColor = "gold";
				statPush[j].style.fontWeight = "bold";
			}
		}
		if (!oneTeam && !hitStats[i].numTeams) {
			// console.log('two team year');
			// yr.style.color = 'gray';
			yr.className += " multi";
		}
		document.getElementById("tg").appendChild(yr);
		
		// yr.push("</td></tr>");
		// ret.push(yr.join(""));

	}
	var car = document.createElement("tr");
	var carFirst = document.createElement("th");
	carFirst.innerText = "Career";
	carFirst.setAttribute("colspan","2");
	car.appendChild(carFirst);
	var careerNums = pl.stats.filter(e => e.group.displayName == "hitting" && e.type.displayName == "career")[0].splits[0].stat;
	if (pl.stats.filter(e => e.group.displayName == "hitting" && e.type.displayName == "career")[0].splits[0].numTeams) {
		carFirst.innerText += " (" + (pl.stats.filter(e => e.group.displayName == "hitting" && e.type.displayName == "career")[0].splits[0].numTeams || 1) + " Tms)";
	}
	for (var i = 2; i < 24; i++) {
		var thisStat = document.createElement("th");
		thisStat.innerText = careerNums[hitCats[i]];
		thisStat.id = hitCats[i];
		car.appendChild(thisStat);
	}
	carPos = document.createElement("th");
	carPos.innerText = getPos("career",0);
	car.appendChild(carPos);
	car.appendChild(document.createElement("th"));
	document.getElementById("tg").appendChild(car);
	document.getElementById("tg").innerHTML = document.getElementById("tg").innerHTML.replaceAll("undefined","-");
	return true;
}

function setTablePitch(pl) {
	var ret = [];
	head ="<table><tr><th>Year</th><th>Team</th><th>W</th><th>L</th><th>ERA</th><th>G</th><th>GS</th><th>GF</th><th>CG</th><th>SHO</th><th>SV</th><th>IP</th><th>H</th><th>R</th><th>ER</th><th>HR</th><th>BB</th><th>IBB</th><th>K</th><th>HBP</th><th>BK</th><th>WP</th><th>BF</th><th>WHIP</th><th>K:BB</th><th>Awards</th></tr>";
	document.getElementById("tg").innerHTML = head;
	if (queries.startYear) {
		pitchStats = pitchStats.filter(e => e.season >= parseInt(queries.startYear));
	}
	if (queries.endYear) {
		pitchStats = pitchStats.filter(e => e.season <= parseInt(queries.endYear));
	}
	for (var i = 0; i < pitchStats.length; i++) {
		var yr = document.createElement("tr");
		var statPush = [];
		var oneTeam = getPitchStats(pitchStats[i].season).length == 1;
		for (var j = 0; j < 26; j++) {
			// console.log(j);
			statPush.push(document.createElement("td"));
		}
		if (i > 0 && parseInt(pitchStats[i-1].season) < parseInt(pitchStats[i].season)-1) {
			console.log("THIS " + pitchStats[i-1].season + " " + pitchStats[i].season);
			var emptyRow = document.createElement("tr");
			var rowData = document.createElement("td");
			rowData.className = "dnp";
			rowData.setAttribute("colspan","26")
			emptyRow.appendChild(rowData);
			document.getElementById("tg").appendChild(emptyRow);
		}
		statPush[0].innerText = pitchStats[i].season;
		yr.appendChild(statPush[0]);
		// if (pitchStats[i].numTeams) {
			// statPush[1].innerText = "TOT";
		// } else {
			// statPush[1].innerText = pitchStats[i].team.name;
		// }
		statPush[1].innerText = getTeamAbbr(pitchStats[i]);
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
			var aw = "";
			if (pitchStats[i].numTeams || oneTeam) {
				aw = getAwards(pitchStats[i].season);
			} //else {
				// aw = getAwards(pitchStats[i].season,pitchStats[i].team.id);
			// }
			statPush[25].innerHTML = aw;//.join(",");
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
		if ((oneTeam || pitchStats[i].numTeams) && pitchRank.length > 0 && parseInt(pitchStats[i].season) > 1900 && parseInt(pitchRank[0].season) >= parseInt(pitchStats[i].season)) {
			for (var j = 2; j < 24; j++) {
				if (isPitchLeader(pitchStats[i].season,pitchCats[j])) {
					statPush[j].style.fontWeight = 'bold';
				}
			}
		}
		for (var j = 2; j < 24; j++) {
			if (pitchStats[i].stat[pitchCats[j]] == singleSeasonRecord(pitchCats[j],"pitching")) {
				console.log("record" + pitchCats[j] + " " + pitchStats[i].season);
				statPush[j].style.backgroundColor = "gold";
				statPush[j].style.fontWeight = "bold";
			}
		}
		if (!oneTeam && !pitchStats[i].numTeams) {
			// console.log('two team year');
			// yr.style.color = 'gray';
			yr.className+= " multi";
		}
		document.getElementById("tg").appendChild(yr);
		
		// yr.push("</td></tr>");
		// ret.push(yr.join(""));
	}
	var car = document.createElement("tr");
	var carFirst = document.createElement("th");
	carFirst.innerText = "Career";
	carFirst.setAttribute("colspan","2");
	car.appendChild(carFirst);
	if (pl.stats.filter(e => e.group.displayName == "pitching" && e.type.displayName == "career")[0].splits[0].numTeams) {
		carFirst.innerText += " (" + (pl.stats.filter(e => e.group.displayName == "pitching" && e.type.displayName == "career")[0].splits[0].numTeams || 1) + " Tms)";
	}
	var careerNums = pl.stats.filter(e => e.group.displayName == "pitching" && e.type.displayName == "career")[0].splits[0].stat;
	for (var i = 2; i < 25; i++) {
		var thisStat = document.createElement("th");
		thisStat.innerText = careerNums[pitchCats[i]];
		thisStat.id = pitchCats[i];
		car.appendChild(thisStat);
	}
	car.appendChild(document.createElement("th"));
	document.getElementById("tg").appendChild(car);
	document.getElementById("tg").innerHTML = document.getElementById("tg").innerHTML.replaceAll("undefined","-");
	return true;
}

function gPlay(id) {
	if (id == player.id) {
		correct();
	} else {
		incorrect(id);
	}
}

function correct() {
	document.getElementById("guess").value = "";
	document.getElementById("guess").setAttribute("disabled",true);
	document.getElementById("btn").setAttribute("disabled",true);
	document.getElementById("corr").innerText = player.fullName;
	document.getElementById("corr").style = "color:green;";
}

function incorrect(id) {
	console.log('wrong');
	document.getElementById("i" + id).onclick = "";
	document.getElementById("i"+id).innerHTML = document.getElementById("i"+id).innerHTML.strike();
	document.getElementById("i"+id).style.color = "red";
	document.getElementById("style").appendChild(document.createTextNode("#i"+id+" {color: red; text-decoration: line-through;}"))
}

function getPos(yr,tm) {
	var ls = [];
	if (yr != "career") {
		if (tm < 100) {
			ls = posMultiTm(yr)
		} else {
			ls = fieldStats.filter(e => parseInt(e.season) == parseInt(yr) && ((e.team && e.team.id == tm) || e.numTeams == tm));
		}
	} else {
		try {
			ls = player.stats.filter(e => e.group.displayName == "fielding" && e.type.displayName == "career")[0].splits;
		} catch(err) {
			ls = [];
		}
	}
	ls = ls.sort(function(a,b) {return b.stat.gamesPlayed-a.stat.gamesPlayed});
	ret = "";
	for (var i = 0; i < ls.length; i++) {
		console.log(ls);
		if (ls[i].stat.gamesPlayed < 10) {
			console.log("l10");
			if (i == 0 || ls[i-1].stat.gamesPlayed >= 10) {
				ret+= "/";
			}
		}
		if (ls[i] && ls[i].position.code == "10") {
			ret+= "D";
		} else {
			ret+= ls[i].position.code;
		}
	}
	return ret;
}
function posMultiTm(year) {
	var ls = [];
	for (var i = 0; i < 10; i++) {
		ls[i] = new Object();
		ls[i].stat = new Object();
		ls[i].position = new Object();
	}
	var oneTmNums = fieldStats.filter(e => parseInt(e.season) == parseInt(year) && !e.numTeams);
	for (var i = 0; i < 10; i++) {
		var gp = 0;
		var j = i+1;
		var yrStat = oneTmNums.filter(e => e.position.code == j);
		yrStat.forEach(e => gp+= e.stat.gamesPlayed);
		ls[i].position.code = j;
		ls[i].stat.gamesPlayed = gp;
	}
	return ls.filter(e => e.stat.gamesPlayed > 0);
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
		document.getElementById("comp").className = "loader";
		srch.open("GET","https://statsapi.mlb.com/api/v1/people/search?names=" + document.getElementById("guess").value + "&sportId=22&hydrate=awards,stats(group=[hitting,pitching,fielding],type=[career,yearByYear])");
		srch.responseType = "json";
		srch.send();
	} else {
		document.getElementById("comp").className = "";
		document.getElementById("autocom").innerHTML = "";
	}
}
function getTeamAbbr(season) {
	if (season.numTeams) {
		return "TOT";
	// } else if (season.team.name == "Milwaukee Brewers" && parseInt(season.season) < 1954) {
		// return "MLA";
	// } else if (season.team.name == "Washington Senators" && parseInt(season.season) > 1960) {
		// return "WSA";
	// }
	// else {
		// if (season.team.id == 133) {
			// if (parseInt(season.season) < 1955) {
				// return "PHA";
			// } else if (parseInt(season.season) < 1968) {
				// return "KCA";
			// } else {
				// return "OAK";
			// }
		// } else if (season.team.id == 134) {
			// return "PIT";
		// } else if (season.team.id == 135) {
			// return "SD";
		// } else if (season.team.id == 136) {
			// return "SEA";
		// } else if (season.team.id == 137) {
			// if (parseInt(season.season) < 1958) {
				// return "NYG";
			// } else {
				// return "SF";
			// }
		// } else if (season.team.id == 138) {
			// return "STL";
		// } else if (season.team.id == 139) {
			// if (parseInt(season.season) < 2008) {
				// return "TBD";
			// } else {
				// return "TB";
			// }
		// } else if (season.team.id == 140) {
			// return "TEX";
		// } else if (season.team.id == 141) {
			// return "TOR";
		// } else if (season.team.id == 142) {
			// if (parseInt(season.season) < 1961) {
				// return "WAS";
			// } else {
				// return "MIN";
			// }
		// } else if (season.team.id == 143) {
			// return "PHI";
		// } else if (season.team.id == 144) {
			// if (parseInt(season.season) < 1953) {
				// return "BSN";
			// } else if (parseInt(season.season) < 1966) {
				// return "MLN";
			// } else {
				// return "ATL";
			// }
		// } else if (season.team.id == 145) {
			// return "CHW";
		// } else if (season.team.id == 146) {
			// if (parseInt(season.season) < 2012) {
				// return "FLA";
			// } else {
				// return "MIA";
			// }
		// } else if (season.team.id == 147) {
			// return "NYY";
		// } else if (season.team.id == 158) {
			// if (parseInt(season.season) < 1970) {
				// return "SEP";
			// } else {
				// return "MIL";
			// }
		// } else if (season.team.id == 108) {
			// if (parseInt(season.season) < 1965 || parseInt(season.season) > 2004) {
				// return "LAA";
			// } else if (parseInt(season.season) < 1997) {
				// return "CAL";
			// } else if (parseInt(season.season) < 2005) {
				// return "ANA";
			// }
		// } else if (season.team.id == 109) {
			// return "ARI";
		// } else if (season.team.id == 110) {
			// if (parseInt(season.season) < 1955) {
				// return "SLB";
			// } else {
				// return "BAL";
			// }
		// } else if (season.team.id == 111) {
			// return "BOS";
		// } else if (season.team.id == 112) {
			// return "CHC";
		// } else if (season.team.id == 113) {
			// return "CIN";
		// } else if (season.team.id == 114) {
			// return "CLE";
		// } else if (season.team.id == 115) {
			// return "COL";
		// } else if (season.team.id == 116) {
			// return "DET";
		// } else if (season.team.id == 117) {
			// return "HOU";
		// } else if (season.team.id == 118) {
			// return "KC";
		// } else if (season.team.id == 119) {
			// if (parseInt(season.season) < 1958) {
				// return "BKN";
			// } else {
				// return "LAD";
			// }
		// } else if (season.team.id == 120) {
			// if (parseInt(season.season) < 2005) {
				// return "MON";
			// } else {
				// return "WSN";
			// }
		// } else if (season.team.id == 121) {
			// return "NYM";
		// } else if (season.team.id == 209 || season.team.id == 208) {
			// return "CLV";
		// } else if (season.team.id == 224) {
			// return "PRO";
		// } else if (season.team.id == 163) {
			// return "BLN";
		// } else if (season.team.id == 213) {
			// return "DTN";
		// } else if (season.team.id == 148) {
			// return "LOU";
		 } else {
			// var lg = season.league.name.replaceAll("(I)","1").replaceAll("(II)","2").split(" ");
			// var lgA = "";
			// for (var i = 0; i < lg.length; i++) {
				// lgA+= lg[i].charAt(0);
			// }
			// var sName = season.team.name;
			// var grab;
			// await getData("https://statsapi.mlb.com" + season.team.link + "?season=" + season.season).then((tmInfo) => {
				// console.log(tmInfo);
				// sName = tmInfo.teams[0].abbreviation;
			// });
			if (season.team.active) {
				return season.team.abbreviation;
			}
			return season.team.abbreviation + " (" +season.team.league.abbreviation+")";
		}
	// }
}
function giveUp() {
	document.getElementById("corr").innerText = player.fullName;
	document.getElementById("corr").style = "color:red;";
	document.getElementById("guess").value = "";
	document.getElementById("guess").setAttribute("disabled",true);
	document.getElementById("btn").setAttribute("disabled",true);
}
function getHitStats(season) {
	return hitStats.filter(e => e.season == season);
}
function isHitLeader(year,cat) {
	if (year == "career") {
		return player.stats.filter(e => e.group.displayName == "hitting" && e.type.displayName == "rankings")[0].splits[cat]
	}
	var retVal;
	try {
		retVal = hitRank.filter(e => e.season == year)[0].stat[cat];
	} catch(err) {
		return false;
	}
	return hitRank.filter(e => e.season == year)[0].stat[cat] == 1 || hitRank.filter(e => e.season == year)[0].stat[cat] == "1";
}
function getPitchStats(season) {
	return pitchStats.filter(e => e.season == season);
}
function isPitchLeader(year,cat) {
	var retVal;
	try {
		retVal = pitchRank.filter(e => e.season == year)[0].stat[cat];
	} catch(err) {
		return false;
	}
	return pitchRank.filter(e => e.season == year)[0].stat[cat] == 1 || pitchRank.filter(e => e.season == year)[0].stat[cat] == "1";
}
function getAbbrev(abbr) {
	if (abbr=="plateAppearances") {
		return "totalPlateAppearances";
	} else if (abbr=="rbi") {
		return "runsBattedIn";
	} else if (abbr == "baseOnBalls") {
		return "walks";
	} else if (abbr == "strikeOuts") {
		return abbr.toLowerCase();
	} else if (abbr == "avg") {
		return "battingAverage";
	} else if (abbr == "obp") {
		return "onBasePercentage";
	} else if (abbr=="ops") {
		return "onBasePlusSlugging";
	} else if (abbr=="groundIntoDoublePlay") {
		return "groundIntoDoublePlays";
	} else if (abbr == "hitByPitch") {
		return "hitByPitches";
	} else if (abbr == "sacBunts" || abbr == "sacFlies") {
		return abbr.replaceAll("sac","sacrifice");
	} else if (abbr == "era") {
		return "earnedRunAverage";
	} else if (abbr == "whip") {
		return "walksAndHitsPerInningPitched";
	} else {
		return abbr;
	}
}
function allTimeRecord(abbr,hitOrPitch) {
	if (allTimeLead.filter(e => e.leaderCategory == getAbbrev(abbr)).length == 0) {
		return false;
	}
	return player.id == allTimeLead.filter(e => e.leaderCategory==(getAbbrev(abbr) || abbr) && e.statGroup == hitOrPitch)[0].leaders[0].person.id;
}
function singleSeasonRecord(abbr,hitOrPitch) {
	try {
		return singleSeasonLead.filter(e => e.leaderCategory == (getAbbrev(abbr) || abbr) && e.statGroup == hitOrPitch)[0].leaders[0].value;
	} catch {
		return -1;
	}
}
async function getData(url) {
	var ret;
	var jso = await fetch(url);
	ret = await jso.json();
	return ret;
}