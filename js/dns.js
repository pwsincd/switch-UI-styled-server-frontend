// Javascript to manipulate SwitchBru DNS UI by pwsincd
// With gamepad support added by Ep8Script
//
// Set variables
var gamepad = new Gamepad();
gamepad.init()
var starting = true;
var cursor = false;
var htmlContent = '';
var selected;
var change = true;

// Starting html content
var intro = '<div class="cancel-content"><p><h2>Welcome to SwitchBru DNS.</h2><p><br>Redirecting to <a id="google-link" href="https://www.google.com/webhp?nomo=1&hl=en" tabindex="-1" down="cancel" up="nav" left="outer-google">Google</a> in <span id="count">7</span> seconds. <div><input type="submit" class="selected" id="cancel" tabindex="-1" up="google-link" left="outer-google" value="Cancel Redirection" onclick="populateData(this.id)" /></div></div>';
$("#content").html(intro);

// Variables for the news page
// Ready for no news to be loaded
var newsBody = 'Sorry, no news to show <i class="far fa-frown"></i><br><br><small>[<a href="#" onclick="loadNews(\'refresh\')" id="refresh" tabindex="-1" left="outer-news">refresh</a>]</small><span class="select-next" selectnext="refresh"></span>';
// var newsURL = "https://www.switchbru.com/news/";
var newsURL = "http://switchbru-news.dx.am/";
// var newsImageURL = "https://www.switchbru.com/news/images/";
var newsImageURL = "http://switchbru-news.dx.am/images/image.php?name=";

// Switch between different HTML pages
function populateData(event){
	switch(event){
		case 'nav': // Top navigation
			location.reload();
			break;
		case 'one': // Google tab
			htmlContent = `<div class="google"><img class="google-rs" src="images/Google.png">
			<br><br>
			<form method="get" action="http://www.google.com/search">
			<div style="googlesearch">
			<input type="text" id="search-google" name="q" size="25" maxlength="255" value="" placeholder="Enter your search query..." tabindex="-1" up="nav" left="outer-google" down="google-button" onclick="touched(this.id)" /> <input type="submit" id="google-button" tabindex="-1" up="search-google" left="outer-google" value="Google Search" /><span class="select-next" selectnext="search-google"></span>
			</div>
			</form>
			</div>`;
			$(".title").html("Google");
			selected = "outer-google";
			break;
		case 'two': // URL tab
			htmlContent = `<div class="google"><img class="webkit" src="images/webkit.png">
			<br><br>
			<form id="form" onsubmit="return false;">
			<div style="googlesearch">
			<input type="url" name="q" size="25" maxlength="255" id="url" value="" placeholder="Enter your URL..." tabindex="-1" up="nav" left="outer-url" down="load-page" onclick="touched(this.id)"/>
			<input type="submit" id="load-page" value="Load Page" onclick="loadurl(url)" tabindex="-1" up="url" left="outer-url" />
			</form><span class="select-next" selectnext="url"></span>
			</div>
			<br>
			Enter a URL above and hit "Load Page".
			</div>`;
			$(".title").html("Enter URL");
			selected = "outer-url";
			break;
		case 'three': // Usage Survey tab
			htmlContent = `<div><h2><i class="far fa-question-circle"></i> SwitchBru DNS Server Feedback</h2><br>
			This is a survey to collect information on the usage of the SwitchBru DNS server (45.55.142.122).<br><br>
			We have made some design changes recently, and would like to better understand how people use the DNS service.<br><br>
			For usage information, please visit the <a id="visit-website" href="http://switchbru.com/dns/" tabindex="-1" up="nav" left="outer-survey" down="survey">SwitchBru DNS website</a>.<br><br>
			<form id="form" action="https://docs.google.com/forms/d/e/1FAIpQLSewt6insjUEzg0dWV--n5OlDodk2Zflr3pbd4XWs6hEuZTzNg/viewform">
			<div style="googlesearch">
			<input type="submit" id="survey" value="Take our survey" onclick="survey()" tabindex="-1" up="visit-website" left="outer-survey"/>
			</form><span class="select-next" selectnext="survey"></span>`;
			selected = "outer-survey";
			$(".title").html("Usage Survey");
			break;
		case 'four': // YouTube tab
			htmlContent = `<div class="youtube"><img class="ytimg" src="images/SwitchTube.png"><div><span id="first-para">Thanks to Ep8Script on GBATemp, there is now a way to watch YouTube videos on your Switch! There is a thread about it <a href="https://gbatemp.net/threads/tool-website-for-watching-most-youtube-videos-on-the-switch.494796/" tabindex="-1" id="gbatemp-thread" left="outer-yt" up="nav" down="instructions">here</a>.</span>
			<br><br>
			<h3 id="instructions" left="outer-yt" up="gbatemp-thread" down="in-order">Instructions</h3>
			<font color="red">You cannot watch videos using the DNS trick.</font> Nintendo has blocked video playback in the wifi login applet.<br><br>
			<span id="in-order" left="outer-yt" up="instructions" down="in-order2"></span><span id="in-order2" left="outer-yt" up="in-order" down="user-settings"></span>In order to watch videos, you must use the Share applet. To access this applet, do the following:<br>
			<ol>
			<li>Go to your Wifi settings and turn OFF this custom DNS server (this will prevent you from accessing this browser).</li>
			<li><span id="user-settings" left="outer-yt" up="in-order2" down="sb-fb"></span>Go to the Switch's User settings, and try to link a Facebook account for social media. If you have already linked a Facebook account to this user, you must unlink it first.</li>
			<li>A login page will come up, go to the bottom and click one of the links on the bottom to go to Facebook for real.</li>
			<li class="skip"><span id="browse-fb"></span><i>You can now browse Facebook, but can't access external websites. That's okay.</i></li>
			<li>On Facebook, search for "<b>SwitchBru</b>" to find our <a href="https://www.facebook.com/SwitchBru/" tabindex="-1" id="sb-fb" left="outer-yt" up="user-settings" down="search-for">Facebook page</a> (you might have to sign in).</li>
			<li>In the post at the top of the profile page, click the Google Sites URL for watching videos!</li>
			<li><span id="search-for" left="outer-yt" up="sb-fb" down="ep8-twitter"></span>Search for a YouTube video you want to play, then click on the video and it should play.</li>
			<li>If you want to go back to the rest of the internet, turn back on the custom DNS in Internet Settings.</li>
			</ol>
			<h3 id="how">How does it work?</h3>
			The Switch has a whitelist of websites that it's allowed to visit in the Share applet. This is more restricted than the Login applet, but it's allowed to play videos. Google.com is one of those websites, so the Google Sites link allows the Switch to play a video that is located on the Facebook page.<br>
			<br>
			If you need help troubleshooting or setting it up you can post in the above GBATemp thread, contact us, or contact <a href="https://twtitter.com/Ep8Script" tabindex="-1" id="ep8-twitter" left="outer-yt" up="search-for" down="st-link">@Ep8Script</a> on Twitter.
			<br><br>
			<h3 id="wont-play">Videos still won't play on the website</h3>
			Make sure you are accessing the page <b>through the share applet</b> in User settings, when you go to link a Facebook account. You have to search for the post to click on the link for it to work. Doing it through this page using the DNS trick will result in the video not being able to play. <b>This is a technical limitation!</b> Blame Nintendo!<br><br>
			Using our page isn't necessary, but you do need a way to get this link to the "Share" applet somehow: <a href="https://sites.google.com/site/ytnintendoswitch/" tabindex="-1" id="st-link" left="outer-yt" up="ep8-twitter">https://sites.google.com/site/ytnintendoswitch/</a>
			<br><br><br></div><span class="select-next" selectnext="gbatemp-thread"></span>`;
			$(".title").html("YouTube");
			selected = "outer-yt";
			break;
		case 'five': // Useful Links tab
			htmlContent = `
			<h3>Switch-related</h3>
			<div class="flex">
				<div class="link" id="1" left="outer-links" down="4" right="2"><a href="https://realdekkia.github.io/switch-tetris/" tabindex="-1">Play Tetris</a></div>
				<div class="link" id="2" left="1" down="5" right="3"><a href="http://switchboard.cool/" tabindex="-1">Switchboard</a></div>
				<div class="link" id="3" left="2" down="6"><a href="http://fights.today/" tabindex="-1">fights.today</a></div>
				<div class="link" id="4" left="outer-links" up="1" right="5" down="7"><a href="https://www.wiiubru.com/2048/" tabindex="-1">2048</a></div> 
				<div class="link" id="5" left="4" up="2" right="6" down="8"><a href="https://quickdraw.withgoogle.com/" tabindex="-1">QuickDraw</a></div> 
				<div class="link" id="6" left="5" up="3" down="9"><a href="http://browserquest.mozilla.org/" tabindex="-1">BrowserQuest</a></div> 
				<div class="link" id="7" left="outer-links" up="4" down="10" right="8"><a href="https://www.google.com/logos/2010/pacman10-i.html" tabindex="-1">Pac-Man</a></div> 
				<div class="link" id="8" left="7" up="5" down="11" right="9"><a href="http://www.wiiubru.com/gp.html" tabindex="-1">Gamepad</a></div> 
				<div class="link" id="9" left="8" up="6" down="12"><a href="https://gbatemp.net/categories/nintendo-switch-discussions.282/" tabindex="-1">GBAtemp</a></div>
			</div>
			<br>
			If you have your own site that you'd like to add to this page, let us know!
			<br>
			<h3>Other Links</h3>
			<div class="flex">
				<div class="link" id="10" left="outer-links" up="7" right="11" down="13"><a href="https://reddit.com" tabindex="-1">Reddit</a></div>
				<div class="link" id="11" left="10" up="8" right="12" down="14"><a href="https://tumblr.com" tabindex="-1">Tumblr</a></div>
				<div class="link" id="12" left="11" up="9" down="15"><a href="https://twitter.com" tabindex="-1">Twitter</a></div>
				<div class="link" id="13" left="outer-links" up="10" right="14" down="16"><a href="https://en.wikipedia.org" tabindex="-1">Wikipedia</a></div>
				<div class="link" id="14" left="13" up="11" right="15" down="17"><a href="https://mail.google.com" tabindex="-1">GMail</a></div>
				<div class="link" id="15" left="14" up="12" down="18"><a href="https://facebook.com" tabindex="-1">Facebook</a></div>
				<div class="link" id="16" left="outer-links" up="13" right="17" down="19"><a href="https://amazon.com" tabindex="-1">Amazon</a></div> 
				<div class="link" id="17" left="16" up="14" right="18" down="20"><a href="https://www.pixiv.net" tabindex="-1">Pixiv</a></div> 
				<div class="link" id="18" left="17" up="15" down="21"><a href="https://closed.pizza" tabindex="-1">ClosedVerse</a></div> 
				<div class="link" id="19" left="outer-links" up="16" down="22"><a href="https://roblox.com" tabindex="-1">Roblox.com</a></div>
				<div class="link" id="20" left="19" up="17" right="21" down="23"><a href="https://minecraft.net" tabindex="-1">Minecraft.net</a></div>
				<div class="link" id="21" left="20" up="18" down="24"><a href="http://zeldadungeon.net" tabindex="-1">ZeldaDungeon</a></div>
				<div class="link" id="22" left="outer-links" up="19" right="23" down="25"><a href="https://youtube.com" tabindex="-1">YouTube</a></div>
				<div class="link" id="23" left="22" up="20" right="24" down="26"><a href="https://github.com" tabindex="-1">GitHub</a></div>
				<div class="link" id="24" left="23" up="21" down="27"><a href="https://deviantart" tabindex="-1">DeviantArt</a></div>
				<div class="link" id="25" left="outer-links" up="22" right="26" down="28"><a href="https://wattpad.com" tabindex="-1">WattPad</a></div>
				<div class="link" id="26" left="25" up="23" right="27" down="29"><a href="https://gdax.com" tabindex="-1">GDAX</a></div>
				<div class="link" id="27" left="26" up="24" down="30"><a href="https://instagram.com" tabindex="-1">Instagram</a></div>
				<div class="link" id="28" left="outer-links" up="25" right="29"><a href="https://duckduckgo.com" tabindex="-1">DuckDuckGo</a></div>
				<div class="link" id="29" left="28" up="26" right="30"><a href="https://yahoo.com" tabindex="-1">Yahoo</a></div>
				<div class="link" id="30" left="29" up="27"><a href="https://bing.com" tabindex="-1">Bing</a></div>
			</div><span class="select-next" selectnext="1"></span><br>
			`;
			$(".title").html("Useful Links");
			selected = "outer-links";
			break;
		case 'cancel': // After cancelling redirection
			htmlContent = `<div class="cancel-content">
			<p><h2>Welcome to SwitchBru DNS.</h2><p>
			<br>Redirection to Google cancelled. Welcome to our DNS server. 
			<div><input class="selected" type="submit" id="cancel-search" value="Continue to Google"tabindex="-1"  onclick="google()" tabindex="-1" down="discord-link" left="outer-google" up="nav"/>
			</div><span up="cancel-search" left="outer-google" down="discord-link"></span>
			<br>
			Find us at:<br><br><a href="https://discord.gg/y2ASN3K" id="discord-link" tabindex="-1" up="cancel-search" left="outer-google" right="irccloud"><i class="fab fa-discord"></i>   https://discord.gg/y2ASN3K</a>
			<span>  and  </span>
			<a href="https://www.irccloud.com/irc/freenode:2/channel/switchbru" id="irccloud" tabindex="-1" up="cancel-search" left="discord-link"><i class="far fa-comments"></i>   IRCCLOUD</a>
			</div>`;
			selected = "outer-google";
			break;
		case 'about': // About tab
			htmlContent = `<h2>About SwitchBru DNS server</h2>
			This service is provided free of charge. We do not store or retain any personal data. Besides providing the Google redirect for the Nintendo Switch, all DNS queries are handled via <a href="https://developers.google.com/speed/public-dns/" tabindex="-1" id="google-dns" up="nav" left="outer-about" down="faq">Google DNS</a>.
			<br><br>
			We are hosting this service as we believe that those of us that purchased an Internet-capable Switch should have the right to browse the web! We hope that one day Nintendo adds an easily accessible web browser to the console.
			<br><br>
			This server <b>does not currently block firmware updates</b>. If you are looking to block updates, you should use the <a href="https://reswitched.tech/info/faq" tabindex="-1" id="faq" up="google-dns" left="outer-about">ReSwitched DNS</a>, or stay offline.
			<br><br><hr />
			<small>v3.0.0 &ndash; created by vgmoose and designed by pwsincd, with controller support by Ep8Script</small><span class="select-next" selectnext="google-dns"></span>`;
			$(".title").html("About");
			selected = "outer-about";
			break;
		case 'news': // News tab
			htmlContent = "<h2>Latest</h2>";
			htmlContent += newsBody;
			$(".title").html("News");
			selected = "outer-news";
			break;
	}
	if(change) { // I truly could not find a better way, don't know how I did it the first time
		$("#content").html(htmlContent); // Set content to new content
		var myDiv = document.getElementById('content');
		myDiv.scrollTop = 0;
		$(".next").attr("up", selected).attr("down", selected).attr("left", selected).attr("right", selected); // Prepare to select again
	}
	else {
		change = true;
	}
	// Sidebar highlighting
	if(event !== "cancel" || event !== "about") {
		$(".inner").removeClass("inner-active");
		$("#"+event).addClass("inner-active");
	}
	// Change icon
	$("#nav #icon").replaceWith($("#"+event+" svg")[0].outerHTML);
	$("#nav svg").attr("id", "icon");
	
};

// Check time function
function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

// Get the current time
function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	m = checkTime(m);
	$("#time").html(h + ":" + m);
	t = setTimeout(function() {
		startTime()
	}, 500);
}

startTime();

window.onload = function() {
	// Redirection countdown
	(function(){
		var counter = 7;
		setInterval(function() {
			counter--;
			if (counter >= 0 && ("#count").length) {
				$("#count").html(counter);
			}
			if (counter === 7) {
				clearInterval(counter);
				//window.location.href = "https://www.google.com/webhp?nomo=1&hl=en";
			}   
		}, 1000);
	})();
	
	// Load the news articles
	loadNews("first");
}

// Load news function
function loadNews(type) {
	// Set variables
	var news_id;
	var news_title;
	var news_image;
	var first;
	var isNews = false;
	$.ajax({
		url: newsURL+"get-articles.php", // Returns an article list
		dataType: "json",
		success: function(data) {
			if(data.length > 0) { // If there are articles
				newsBody = "";
				var newsBox = "";
				for (i = 0; i < data.length; i++) { // Loop through every news article
					news_id = data[i].id;
					news_title = data[i].title;
					news_image = data[i].image;
					// Prepare each news item
					// <div class="ignore"> is for HTML parsing
					newsBox = '<div class="ignore"><div class="news-item" id="news'+news_id+'" onclick="showNews(this.id)"><img class="news-image" src="'+newsImageURL+news_image+'" height="169"><div class="news-title"><span>'+news_title+'</span></div></div></div>';
					
					// Add the gamepad navigation elements
					// Not sure how to annotate this as it's a bit confusing
					// but I'll try
					if(!isOdd(i)) { // If the current number is odd
						// Set left to the News tab
						newsBox = $(newsBox).find(".news-item").attr("left", "outer-news").end()[0].outerHTML;
						if(i + 1 < data.length) { // If there is an article to the right
							// Set right to the next article
							newsBox = $(newsBox).find(".news-item").attr("right", "news"+data[i+1].id).end()[0].outerHTML;
						}
						if(i + 2 < data.length) { // If there is an article below
							// Set down to the article below
							newsBox = $(newsBox).find(".news-item").attr("down", "news"+data[i+2].id).end()[0].outerHTML;
						}
					}
					else { // If the current number is even
						// Set left to the previous article
						newsBox = $(newsBox).find(".news-item").attr("left", "news"+data[i-1].id).end()[0].outerHTML;
						if(i + 2 < data.length) { // If there is an article below
							// Set down to the article below
							newsBox = $(newsBox).find(".news-item").attr("down", "news"+data[i+2].id).end()[0].outerHTML;
						}
					}
					if(i > 1) { // If the article isn't on the first row
						// Set up to the article above
						newsBox = $(newsBox).find(".news-item").attr("up", "news"+data[i-2].id).end()[0].outerHTML;
					}
					// Write in the edited HTML
					newsBody += $(newsBox).html();
					if(i == 0) { // If it is the first
						first = "news"+news_id;
					}
				}
				// Save the full HTML for the table
				newsBody = '<div id="news-items">'+newsBody+'</div><span class="select-next" selectnext="'+first+'"></span>';
				isNews = true;
			}
			if(type == "refresh") { // If the user refreshed the news
				populateData("news"); // Reopen tab
				if(isNews == true) {
					$(".selected").removeClass("selected");
					$(".news-item:first-of-type").addClass("selected");
				}
				else {
					$(".selected").removeClass("selected");
					$("#refresh").addClass("selected");
				}
			}
		},
	});
}

// Full news display function
function showNews(newsID) {
	// Sets variables
	var news_id, news_title, news_image, news_text, news_time, news_author;
	// Clean the article ID
	var ID = newsID.replace("news","");
	$.ajax({
		url: newsURL+"get-news.php", // Gets the article information as JSON
		method: "POST",
		dataType: "json",
		data: {"id":ID},
		success: function(data) {
			if(data.error !== true) { // If there was no error
				$("#content").empty();
				$(".selected").removeClass("selected");
				// Set default HTML for the page
				$("#content").html('<div id="news-article"><div class="news-header"><span></span><span></span></div><h4 id="news-title"></h4><img class="news-image-main"><div class="news-text"></div><hr><div id="vote"><div id="like" onclick="vote(\'like\')" left="outer-news" right="dislike" up="back-button"><span><svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-heart fa-w-18" role="img" aria-hidden="true" viewBox="0 0 576 512" data-icon="heart" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 414.9 24 C 361.8 24 312 65.7 288 89.3 C 264 65.7 214.2 24 161.1 24 C 70.3 24 16 76.9 16 165.5 c 0 72.6 66.8 133.3 69.2 135.4 l 187 180.8 c 8.8 8.5 22.8 8.5 31.6 0 l 186.7 -180.2 c 2.7 -2.7 69.5 -63.5 69.5 -136 C 560 76.9 505.7 24 414.9 24 Z" /></svg> Like</span></div><div id="dislike" onclick="vote(\'dislike\')" left="like" up="back-button"><span><svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-heartbeat fa-w-18" role="img" aria-hidden="true" viewBox="0 0 576 512" data-icon="heartbeat" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 47.9 257 C 31.6 232.7 16 200.5 16 165.5 C 16 76.9 70.3 24 161.1 24 C 214.2 24 264 65.7 288 89.3 C 312 65.7 361.8 24 414.9 24 C 505.7 24 560 76.9 560 165.5 c 0 35 -15.5 67.2 -31.9 91.5 H 408 l -26.4 -58.6 c -4.7 -8.9 -17.6 -8.5 -21.6 0.7 l -53.3 134.6 L 235.4 120 c -3.7 -10.6 -18.7 -10.7 -22.6 -0.2 l -48 137.2 H 47.9 Z m 348 32 c -4.5 0 -8.6 -2.5 -10.6 -6.4 l -12.8 -32.5 l -56.9 142.8 c -4.4 9.9 -18.7 9.4 -22.3 -0.9 l -69.7 -209.2 l -33.6 98.4 c -1.7 4.7 -6.2 7.8 -11.2 7.8 H 73.4 c 5.3 5.7 -12.8 -12 198.9 192.6 c 8.8 8.5 22.8 8.5 31.6 0 c 204.3 -197.2 191 -184 199 -192.6 h -107 Z" /></svg> Dislike</span></div><p class="feedback-bubble left" style="display: none;">Thank you for your feedback.</p></div><br><br><br><br></div><span class="select-next" selectnext="back-button"></span>');
				if(data.vote == 1) { // If this IP has already liked the post
					$("#like").addClass("voted");
				}
				else if(data.vote == 2) { // If they already disliked it
					$("#dislike").addClass("voted");
				}
				news_id = data.id;
				news_title = data.title;
				news_image = data.image;
				news_text = data.article;
				news_time = data.time;
				news_author = data.author;
				// Parse the article body
				news_text = $('<div class="ignore">'+news_text+'</div>').find("nl").replaceWith("<br><br>").end()[0].outerHTML;
				// Set the text to the article
				$(".news-text").html($(news_text).html());
				// Add the article ID
				$("#news-article").addClass("article"+news_id);
				// Add the author
				$(".news-header span:first-of-type").html(news_author);
				// Get the date from the actual time
				parseTime(news_time);
				// Add the date seperated by slashes
				$(".news-header span:last-of-type").html(date+"/"+month+"/"+year);
				// Write the title with a back button
				$("#news-title").html('<a class="selected" id="back-button" href="#" onclick="loadNews(\'refresh\')" down="like" left="outer-news" tabindex="-1">&lt; </a>'+news_title);
				// Add the main article image
				$(".news-image-main").attr("src", newsImageURL+news_image);
			}
			else { // If there is an error
				// Alert the error message
				alert(data.message);
			}
		},
	});
}

// Voting function
function vote(type) {
	// Get the article ID and clean it up
	var id = $("#news-article").attr("class");
	id = id.replace("article","");
	
	$.ajax({
		url: newsURL+"vote.php", // Returns vote success / type as JSON
		method: "POST",
		dataType: "json",
		data: {"id":id,"type":type},
		success: function(data) {
			if(data.error !== true) { // If there is no error
				$(".voted").removeClass("voted"); // Remove the highlight if already voted
				switch(data.vote) { // Get vote type
					case 1: // If vote was a like
						$("#like").addClass("voted");
						feedbackThanks();
						break;
					case 2: // If vote was a dislike
						$("#dislike").addClass("voted");
						feedbackThanks();
						break;
				}
			}
			else { // If there is an error
				alert(data.message); // Show the error message
			}
		},
	});
}

// "Thank you for your feedback." balloon function (self-explanatory)
function feedbackThanks() {
	$('.feedback-bubble').fadeIn('fast', function () {
		$(this).delay(1800).fadeOut('fast');
	});
}

function isOdd(i) { // Simple odd/even function for news items
	if(i & 1) {
		return true;
	}
	else {
		return false;
	}
}

// Function for parsing the full time
var date;
var month;
var year;
function parseTime(time) {
	var match = time.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
	year = match[1];
	month = match[2];
	date = match[3];
}

// Check if screen was tapped with the touch screen
function touched(id) {
	$(".touched").removeClass("touched");
	$("#"+id).addClass("touched");
	$(".inner").removeClass("inner-active");
	$("#"+id+" .inner").addClass("inner-active");
	$(".next").addClass("selected");
}

// Constant loop while Joy-Con are connected
gamepad.bind(Gamepad.Event.TICK, function (gamepads) {
	if($(".touched:hover").length) { // If a tab was touched and the invisible cursor is still there
		cursor = false;
	}
	else if($("body:hover").length) { // If the actual cursor is on screen
		cursor = true;
		// Clauses to return to the right place
		if($("#cancel").length) {
			$(".next").attr("up", "cancel").attr("down", "cancel").attr("left", "cancel").attr("right", "cancel");
		}
		else if($("#cancel-search").length) {
			$(".next").attr("up", "cancel-search").attr("down", "cancel-search").attr("left", "cancel-search").attr("right", "cancel-search");
		}
	}
	// Constantly get selected button - honestly not sure why this
	// doesn't add ".next" to itself when it is selected just looking at it
	// (unless that's handled elsewhere and I've forgotten)
	var newSelected = $(".selected").attr("id");
	$(".next").attr("up", newSelected).attr("down", newSelected).attr("left", newSelected).attr("right", newSelected);
	if(cursor) {
		if(!$(".next.selected").length && !$("#cancel").length && !$("#cancel-search").length) {
			$(".selected").removeClass("selected");
		}
		$(".next").addClass("selected");
	}
	// If the cursor is no longer over the previously touched tab
	if(cursor && $(".touched:not(:hover)").length) {
		$(".touched").removeClass("touched");
	}
});

// When a button is pressed - for DPAD, FACE buttons and TRIGGERS
gamepad.bind(Gamepad.Event.BUTTON_DOWN, function (e) {
	$(".spanbuttons").append(e.control); // I think it helped to do something with the control first but may not be necessary
    switch (e.control) { // This section should explain itself for the most part
		case "DPAD_UP":
			UP();
			break;
        case "DPAD_LEFT":
            LEFT();
            break;
        case "DPAD_RIGHT":
            RIGHT();
            break;
        case "DPAD_DOWN":
            DOWN();
            break;
        case "FACE_2":
			if(cursor) {
				// Do nothing
			}
			else if($("#refresh.selected").length) { // Refresh the news if selected
				loadNews("refresh");
			}
			else if($(".selected.outer").length) { // If a tab is selected
				$(".selected").removeClass("selected");
				$("#"+$(".select-next").attr("selectnext")).addClass("selected");
				resetChange(); // See comments at function
			}
			else if($("#survey.selected").length) {
				survey();
			}
			else if($("input[type=text].selected, input[type=url].selected").length) { // Focus on the selected text box
				$(".selected").focus();
			}
			else if($("#nav.selected").length) {
				location.reload();
			}
			else if($(".selected.link").length) { // Useful link selected
				window.location.href = $(".selected a").attr("href");
			}
			else if($("a.selected").attr("href") && $("a.selected").attr("href") !== "#") { // Anchor tag with link selected
				window.location.href = $("a.selected").attr("href");
			}
			else { // Otherwise just click it and hope for the best lol
				$(".selected").click();
			}
            break;
		case "FACE_3": // Y Button - Refresh
			location.reload();
			break;
    }
	cursor = false; // Set cursor back to false, just in case (otherwise it'll be turned back again anyway)
});

var lastTime = 0; // Sets the last time the stick was moved

// Event for Joy-Con sticks moving
gamepad.bind(Gamepad.Event.AXIS_CHANGED, function (e) {
	var now = new Date().getTime(); // Get the current time
	if (now - lastTime > 200 && !cursor) { // If the time difference is greater than 200, as otherwise the stick moves too fast
		switch (e.axis) { // Pretty self explanatory
			case "LEFT_STICK_X":
			case "RIGHT_STICK_X":
				if (e.value < -0.5) {
					LEFT();
					lastTime = now;
				} else if (e.value > 0.5) {
					RIGHT();
					lastTime = now;
				}
				break;
			case "LEFT_STICK_Y":
			case "RIGHT_STICK_Y":
				if (e.value > 0.5) {
					DOWN();
					lastTime = now;
				} else if (e.value < -0.5) {
					UP();
					lastTime = now;
				}
				break;
		}
	}
});

// Redirects to Google
function google() {
	window.location.href = "https://www.google.com/webhp?nomo=1&hl=en";
}

//
function loadurl() {
	var input = document.getElementById("url").value;
	
	// add http:// to the front if it's not present
	if(!input.toLowerCase().startsWith("http://") && !input.toLowerCase().startsWith("https://")) {
		input = "http://" + input;
	}
	window.location.href = input;
}

// Opens the survey page
function survey() {
	window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSewt6insjUEzg0dWV--n5OlDodk2Zflr3pbd4XWs6hEuZTzNg/viewform";
}

// Remove the selected object
function removeSelect() {
	$(".selected").removeClass("selected");
	cursor = true;
}

function UP() {
	if($(".selected").attr("up")) {
		$(".selected").removeClass("selected").addClass("prevselected");
		$("#"+$(".prevselected").attr("up")).addClass("selected");
		$(".prevselected").removeClass("prevselected");
		if($(".selected.outer").length) {
			populateData($(".selected .inner").attr("id"));
		}
	}
	linkScroll();
}

function LEFT() {
	if($(".selected").attr("left")) {
		$(".select-next").attr("selectnext", $(".selected").attr("id"));
		$(".selected").removeClass("selected").addClass("prevselected");
		$("#"+$(".prevselected").attr("left")).addClass("selected");
		$(".prevselected").removeClass("prevselected");
		if($(".selected.outer").length && starting == true) {
			populateData($(".selected .inner").attr("id"));
			starting = false;
		}
	}
	if($("#four.inner-active").length && change == false) {
		change = true;
	}
	else if($("#news.inner-active") && change == false) {
		change = true;
	}
}

function RIGHT() {
	if($(".selected").attr("right")) {
		$(".selected").removeClass("selected").addClass("prevselected");
		$("#"+$(".prevselected").attr("right")).addClass("selected");
		$(".prevselected").removeClass("prevselected");
	}
	else if($(".selected.outer").length) {
		$(".selected").removeClass("selected");
		$("#"+$(".select-next").attr("selectnext")).addClass("selected");
		resetChange();
	}
}

function DOWN() {
	if($(".selected").attr("down")) {
		$(".selected").removeClass("selected").addClass("prevselected");
		$("#"+$(".prevselected").attr("down")).addClass("selected");
		$(".prevselected").removeClass("prevselected");
		if($(".selected.outer").length) {
			populateData($(".selected .inner").attr("id"));
		}
	}
	linkScroll();
}

function linkScroll() { // Controls scrolling on the tabs where necessary
	var sID = $(".selected").attr("id");
	$("#content").stop();
	if(sID == "1" || sID == "2" || sID == "3" ) {
		$("#content").animate({
			scrollTop:  0
		}, 200); 
	}
	else if(sID == "4" || sID == "5" || sID == "6" ) {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content h3:first-of-type").offset().top 
		}, 200); 
	}
	else if(sID == "7" || sID == "8" || sID == "9" ) {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content .link#1").offset().top 
		}, 200); 
	}
	else if(sID == "10" || sID == "11" || sID == "12" ) {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content .link#4").offset().top 
		}, 200); 
	}
	else if(sID == "13" || sID == "14" || sID == "15" ) {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content .link#7").offset().top 
		}, 200); 
	}
	else if(sID == "16" || sID == "17" || sID == "18" ) {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content br:first-of-type").offset().top 
		}, 200); 
	}
	else if(sID == "19" || sID == "20" || sID == "21" ) {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content h3:last-of-type").offset().top 
		}, 200); 
	}
	else if(sID == "gbatemp-thread") {
		$("#content").animate({
			scrollTop:  0
		}, 200);
	}
	else if(sID == "instructions") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content #first-para").offset().top
		}, 200); 
	}
	else if(sID == "in-order") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content #instructions").offset().top
		}, 300); 
	}
	else if(sID == "in-order2") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content #in-order").offset().top
		}, 200); 
	}
	else if(sID == "user-settings") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content #user-settings").offset().top
		}, 200); 
	}
	else if(sID == "sb-fb") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content #browse-fb").offset().top
		}, 200); 
	}
	else if(sID == "search-for") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content #search-for").offset().top
		}, 200); 
	}
	else if(sID == "ep8-twitter") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content h3#how").offset().top
		}, 200); 
	}
	else if(sID == "st-link") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content h3#wont-play").offset().top
		}, 200); 
	}
	else if(sID == "like") {
		$("#content").animate({
			scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content #news-article hr").offset().top
		}, 6000); 
	}
	else if(sID == "back-button") {
		$("#content").animate({
			scrollTop:  0
		}, 6000); 
	}
	else if($(".selected").parent().attr("id") == "news-items") {
		if($(".selected").attr("up")) {
			var up = $(".selected").attr("up");
			$("#content").animate({
				scrollTop:  $("#content").scrollTop() - $("#content").offset().top + $("#content #"+up+" .news-title span").offset().top
			}, 200); 
		}
		else {
			$("#content").animate({
				scrollTop:  0
			}, 200); 
		}
	}
	if($(".link.selected").length) {
		$(".select-next").attr("selectnext", sID);
	}
}

// Reset the "change" variable
function resetChange() {
	if($(".selected").attr("id") == "gbatemp-thread" || $(".selected").hasClass("news-item")) { // If on a specific tab, set change = false
		change = false;
	}
}