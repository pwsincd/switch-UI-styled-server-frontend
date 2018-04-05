// Javascript to manipulate SwitchBru DNS UI by pwsincd
// With gamepad support and the news channel added by Ep8Script
//
// Set variables
var gamepad = new Gamepad();
gamepad.init()
var starting = true;
var cursor = false;
var htmlContent = '';
var selected;
var change = true;
var counting = true;
var XClosed = false;

// Starting html content
var intro = '<div class="cancel-content"><p><h2>Welcome to SwitchBru DNS.</h2><p><br>Redirecting to <a id="google-link" href="https://www.google.com/webhp?nomo=1&hl=en" tabindex="-1" down="cancel" up="nav" left="outer-google">Google</a> in <span id="count">10</span> seconds. <div><input type="submit" class="selected" id="cancel" tabindex="-1" up="google-link" left="outer-google" value="Cancel Redirection" onclick="populateData(this.id)" /></div></div>';
$("#content").html(intro);

// Variables for the news page
// Ready for no news to be loaded
var newsBody = 'Sorry, no news to show <i class="far fa-frown"></i><br><br><small>[<a href="#" onclick="loadNews(\'refresh\')" id="refresh" tabindex="-1" left="outer-news">refresh</a>]</small><span class="select-next" selectnext="refresh"></span>';
var newsURL = "https://www.switchbru.com/news/";
var newsImageURL = "https://www.switchbru.com/news/images/";

// Switch between different HTML pages
function populateData(event){
	var divLoad = true;
	switch(event){
		case 'nav': // Top navigation
			location.reload();
			break;
		case 'one': // Google tab
			$(".title").html("Google");
			selected = "outer-google";
			break;
		case 'two': // URL tab
			$(".title").html("Enter URL");
			selected = "outer-url";
			break;
		case 'three': // Usage Survey tab
			selected = "outer-survey";
			$(".title").html("Usage Survey");
			break;
		case 'four': // YouTube tab
			$(".title").html("YouTube");
			selected = "outer-yt";
			break;
		case 'five': // Useful Links tab
			$(".title").html("Useful Links");
			selected = "outer-links";
			break;
		case 'cancel': // After cancelling redirection
			selected = "outer-google";
			break;
		case 'about': // About tab
			$(".title").html("About");
			selected = "outer-about";
			break;
		case 'news': // News tab
			divLoad = false;
			htmlContent = newsBody;
			$(".title").html("News");
			selected = "outer-news";
			break;
	}
	if(change) { // I truly could not find a better way, don't know how I did it the first time
		if(divLoad) {
			htmlContent = $("#tab-"+event).html();
		}
		$("#content").html(htmlContent); // Set content to new content
		$("#content").scrollTop(0);
		$(".next").attr("up", selected).attr("down", selected).attr("left", selected).attr("right", selected); // Prepare to select again
		
		if(selected == "outer-links") {
			// Organise links correctly
			organiseLinks();
		}
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
	counting = false;
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
		var counter = 10;
		setInterval(function() {
			counter--;
			if (counter >= 0 && $("#count").length) {
				$("#count").html(counter);
			}
			if (counter === 0 && $("#count").length && counting) {
				clearInterval(counter);
				window.location.href = "https://www.google.com/webhp?nomo=1&hl=en";
			}   
		}, 1000);
	})();
	
	// Load the news articles
	loadNews("first");
	$(".adsbygoogle iframe").attr("tabindex", "-1");
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
		url: newsURL+"get-articles", // Returns an article list
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
					newsBox = '<div class="ignore"><div class="news-item" id="news'+news_id+'" onclick="showNews(this.id)"><div class="news-image-wrapper"><img class="news-image" src="'+newsImageURL+news_image+'"></div><div class="news-title"><span>'+news_title+'</span></div></div></div>';
					
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
		url: newsURL+"get-news", // Gets the article information as JSON
		method: "POST",
		dataType: "json",
		data: {"id":ID},
		success: function(data) {
			if(data.error !== true) { // If there was no error
				$("#content").empty();
				$(".selected").removeClass("selected");
				// Set default HTML for the page
				$("#content").html('<div id="news-article"><div class="news-header"><span></span><span></span></div><h4 id="news-title"></h4><img class="news-image-main"><div class="news-text"></div><hr><div id="vote"><div id="like" onclick="vote(\'like\')" left="outer-news" right="dislike" up="back-button"><span><svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-heart fa-w-18" role="img" aria-hidden="true" viewBox="0 0 576 512" data-icon="heart" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 414.9 24 C 361.8 24 312 65.7 288 89.3 C 264 65.7 214.2 24 161.1 24 C 70.3 24 16 76.9 16 165.5 c 0 72.6 66.8 133.3 69.2 135.4 l 187 180.8 c 8.8 8.5 22.8 8.5 31.6 0 l 186.7 -180.2 c 2.7 -2.7 69.5 -63.5 69.5 -136 C 560 76.9 505.7 24 414.9 24 Z" /></svg> Like</span></div><div id="dislike" onclick="vote(\'dislike\')" left="like" up="back-button"><span><svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-heartbeat fa-w-18" role="img" aria-hidden="true" viewBox="0 0 576 512" data-icon="heartbeat" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 47.9 257 C 31.6 232.7 16 200.5 16 165.5 C 16 76.9 70.3 24 161.1 24 C 214.2 24 264 65.7 288 89.3 C 312 65.7 361.8 24 414.9 24 C 505.7 24 560 76.9 560 165.5 c 0 35 -15.5 67.2 -31.9 91.5 H 408 l -26.4 -58.6 c -4.7 -8.9 -17.6 -8.5 -21.6 0.7 l -53.3 134.6 L 235.4 120 c -3.7 -10.6 -18.7 -10.7 -22.6 -0.2 l -48 137.2 H 47.9 Z m 348 32 c -4.5 0 -8.6 -2.5 -10.6 -6.4 l -12.8 -32.5 l -56.9 142.8 c -4.4 9.9 -18.7 9.4 -22.3 -0.9 l -69.7 -209.2 l -33.6 98.4 c -1.7 4.7 -6.2 7.8 -11.2 7.8 H 73.4 c 5.3 5.7 -12.8 -12 198.9 192.6 c 8.8 8.5 22.8 8.5 31.6 0 c 204.3 -197.2 191 -184 199 -192.6 h -107 Z" /></svg> Dislike</span></div><p class="feedback-bubble left" style="display: none;">Thank you for your feedback.</p></div><br><br><br><br></div><span class="select-next" selectnext="back-button"></span>');
				$("#content").animate({
					scrollTop:  0
				}, 100); 
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
function vote(type, query = "") {
	// Get the article ID and clean it up
	var id = $("#news-article").attr("class");
	id = id.replace("article","");
	
	$.ajax({
		url: newsURL+"vote"+query, // Returns vote success / type as JSON
		method: "POST",
		dataType: "json",
		data: {"id":id,"type":type},
		success: function(data) {
			if(data.error == true && data.allowed == false) {
				if(confirm("This will store your IP address in our database.\nBy continuing, you are allowing us to store this information.")) {
					vote(type, "?granted=true");
				}
			}
			else if(data.error !== true) { // If there is no error
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

// Notification about cursor has been sent?
var sent = false;

// Constant loop while Joy-Con are connected
gamepad.bind(Gamepad.Event.TICK, function (gamepads) {
	if($(".touched:hover").length) { // If a tab was touched and the invisible cursor is still there
		cursor = false;
	}
	else if($("body:hover").length) { // If the actual cursor is on screen
		cursor = true;
		// Sent notification about using cursor
		if(!sent) {
			sent = true;
			alert("Did you know?\nYou no longer need to use the cursor. Feel free to turn it off and navigate like the real Switch UI!");
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
				$("#"+$(".main .select-next").attr("selectnext")).addClass("selected");
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
		case "FACE_4": // X Button
			XClosed = true;
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
	var focused = $("input").is(":focus");
	if(XClosed || !focused) {
		if($(".selected").attr("up")) {
			$(".selected").removeClass("selected").addClass("prevselected");
			$("#"+$(".prevselected").attr("up")).addClass("selected");
			$(".prevselected").removeClass("prevselected");
			if($(".selected.outer").length) {
				populateData($(".selected .inner").attr("id"));
			}
		}
		linkScroll();
		resetChange();
	}
}

function LEFT() {
	var focused = $("input").is(":focus");
	if(XClosed || !focused) {
		if($(".selected").attr("left")) {
			$(".main .select-next").attr("selectnext", $(".selected").attr("id"));
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
		resetChange();
	}
}

function RIGHT() {
	var focused = $("input").is(":focus");
	if(XClosed || !focused) {
		if($(".selected").attr("right")) {
			$(".selected").removeClass("selected").addClass("prevselected");
			$("#"+$(".prevselected").attr("right")).addClass("selected");
			$(".prevselected").removeClass("prevselected");
		}
		else if($(".selected.outer").length) {
			$(".selected").removeClass("selected");
			$("#"+$(".main .select-next").attr("selectnext")).addClass("selected");
		}
		resetChange();
	}
}

function DOWN() {
	var focused = $("input").is(":focus");
	if(XClosed || !focused) {
		if($(".selected").attr("down")) {
			$(".selected").removeClass("selected").addClass("prevselected");
			$("#"+$(".prevselected").attr("down")).addClass("selected");
			$(".prevselected").removeClass("prevselected");
			if($(".selected.outer").length) {
				populateData($(".selected .inner").attr("id"));
			}
		}
		linkScroll();
		resetChange();
	}
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
		$(".main .select-next").attr("selectnext", sID);
	}
}

// Reset the "change" variable
function resetChange() {
	if($(".selected").attr("id") == "gbatemp-thread" || $(".selected").hasClass("news-item")) { // If on a specific tab, set change = false
		change = false;
	}
	$("input").blur();
	XClosed = false;
}

// Organise the links correctly
function organiseLinks() {
	// Set variables for later
	var hPos = 1; // Horizontal position
	var vPos = 1; // Vertical position
	var last; // Last link
	$(".link").each(function(i) { // First loop
		$(this).attr("id", i+1); // Store IDs
	});
	$(".link").each(function(i) { // Second loop
		last = $(".link:not(.custom-link)").last().attr("id"); // Get the ID of the last link
		if(i+1 !== last || i+1 !== last - 1 || i+1 !== last - 2) { // If it isn't in the bottom row
			$(this).attr("down", i+4); // Pressing down goes to the next link
		}
		
		if(vPos !== 1) { // If not on the top row
			$(this).attr("up", i-2); // Add link one up
		}
		if(hPos !== 1) { // If not on the left side
			$(this).attr("left", i); // Add link one left
		}
		else {
			$(this).attr("left", "outer-links"); // Left goes back to the tab
		}
		if(hPos !== 3) { // If not on the right side
			$(this).attr("right", i+2); // Add link one right
		}
		else {
			hPos = 0; // Reset horizontal position
			vPos++; // Increase vertical
		}
		hPos++; // Increase horizontal
	});
}
