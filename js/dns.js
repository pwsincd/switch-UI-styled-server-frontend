/* Javascript to manipulate SwitchBru DNS UI by pwsincd
   With gamepad support added by Ep8Script
   I am so sorry for the person reading this for how messy it is
   In some situations, I was just like "I don't know why,
   but this works!" and just left it. There may be a better
   way to do things, so feel free to change it if you know how to!
   ----------------------------------------------------------------
   This file contains everything relating to the main tabs on the
   landing page
*/

// Set variables
var gamepad = new Gamepad();
gamepad.init();
var starting = true;
var cursor = false;
var htmlContent = "";
var selected;
var change = true;
var XClosed = false;
var fromPopUp = false;

// Variables for the news page
// Ready for no news to be loaded
var newsBody = '<div id="news-articles"><h2>Latest</h2> Sorry, no news to show <svg class="svg-inline--fa fa-frown fa-w-16" aria-hidden="true" data-fa-processed="" data-prefix="far" data-icon="frown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 56c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m0-48C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm64 136c-9.535 0-18.512 2.386-26.37 6.589h.017c12.735 0 23.059 10.324 23.059 23.059 0 12.735-10.324 23.059-23.059 23.059s-23.059-10.324-23.059-23.059v-.017C266.386 181.488 264 190.465 264 200c0 30.928 25.072 56 56 56s56-25.072 56-56-25.072-56-56-56zm-128 0c-9.535 0-18.512 2.386-26.37 6.589h.017c12.735 0 23.059 10.324 23.059 23.059 0 12.735-10.324 23.059-23.059 23.059-12.735 0-23.059-10.324-23.059-23.059v-.017C138.386 181.488 136 190.465 136 200c0 30.928 25.072 56 56 56s56-25.072 56-56-25.072-56-56-56zm171.547 201.782c-56.595-76.964-158.383-77.065-215.057-.001-18.82 25.593 19.858 54.018 38.67 28.438 37.511-51.01 100.365-50.796 137.717-.001 18.509 25.172 57.821-2.395 38.67-28.436z"></path></svg><br><br><small>[<a onclick="loadNews(\'refresh\')" id="refresh" tabindex="-1" left="outer-news" up="user-icon">refresh</a>]</small><span class="select-next" selectnext="refresh"></span></div>';
var newsURL = "https://www.switchbru.com/news/";
var newsImageURL = "https://www.switchbru.com/news/images/";
// Load the news articles
loadNews("first");

// Switch between different HTML pages
function populateData(event){
	var divLoad = true;
	editingLinks = false;
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
		case 'three': // Feedback tab
			selected = "outer-survey";
			$(".title").html("Feedback");
			break;
		case 'four': // YouTube tab
			$(".title").html("YouTube");
			selected = "outer-yt";
			break;
		case 'five': // Useful Links tab
			$(".title").html("Useful Links");
			selected = "outer-links";
			break;
		case 'settings': // Open settings tab
			$(".title").html("Settings");
			selected = "outer-settings";
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
		
		if(selected == "outer-links") { // If the useful links tab is selected
			// Click custom links
			customClick();
			// Organise links correctly
			organiseLinks();
		}
		else if(selected == "outer-yt") { // If the YouTube tab is selected
			// Replace image for theme
			var ytimg = "light";
			if(theme == 1 || (customYT == 1 && theme == 2)) { // If the theme is dark or the custom theme wants the image to be dark
				ytimg = "dark";
			}
			// Set the image
			$(".main .ytimg").attr("src", "images/SwitchTube_"+ytimg+".png");
		}
	}
	else {
		change = true;
	}
	
	// Sidebar highlighting
	$(".inner").removeClass("inner-active");
	$("#"+event).addClass("inner-active");
	// Change icon
	if($("#"+event+" svg").length) {
		$("#nav #icon").replaceWith($("#"+event+" svg")[0].outerHTML);
		$("#nav svg").attr("id", "icon");
	}
	// Enable back button
	history.pushState({page: "same", tab: $("#"+event).parent().attr("id")}, "", "");
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

// Start by showing the time and pushing the home page state
startTime();
history.pushState({page: "home", tab: "google"}, "", "");

// On page load
$(document).ready(function() {
	// Stop ad from being selected by the stick
	var removeIndex = setInterval(function() {
	   if ($(".adsbygoogle iframe").length) {
			$(".adsbygoogle iframe").attr("tabindex", "-1");
			clearInterval(removeIndex);
	   }
	   else if(typeof disableAds !== 'undefined' && disableAds == 1) {
		   clearInterval(removeIndex);
	   }
	}, 100);
	
	$("#user-icon").hover(function() {
		$("#user-text").fadeIn("fast");
	}, function() {
		$("#user-text").fadeOut("fast");
	});
	
	// Simple hits counter
	$.ajax({
		type: "POST",
		data: {"add":true},
		url: "https://switchbru.com/hits/index.php", 
		dataType: "json",
	});
});

// Load news function
function loadNews(type) {
	// Set variables
	var news_id;
	var news_title;
	var news_image;
	var first;
	var isNews = false;
	$("#news-articles").fadeOut("fast");
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
						else if(i + 1 < data.length) // If there is an article below (but not directly below)
							// Set down to that article
							newsBox = $(newsBox).find(".news-item").attr("down", "news"+data[i+1].id).end()[0].outerHTML;
					}
					if(i > 1) { // If the article isn't on the first row
						// Set up to the article above
						newsBox = $(newsBox).find(".news-item").attr("up", "news"+data[i-2].id).end()[0].outerHTML;
					}
					else {
						// Set up to the user icon
						newsBox = $(newsBox).find(".news-item").attr("up", "user-icon").end()[0].outerHTML;
					}
					// Write in the edited HTML
					newsBody += $(newsBox).html();
					if(i == 0) { // If it is the first
						first = "news"+news_id;
					}
				}
				// Save the full HTML for the table
				newsBody = '<div id="news-articles"><h2>Latest</h2><div id="news-items">'+newsBody+'</div><span class="select-next" selectnext="'+first+'"></span></div>';
				isNews = true;
			}
			if(type == "refresh") { // If the user refreshed the news
				populateData("news");
				if(isNews == true) {
					$(".selected").removeClass("selected");
					$(".news-item:first-of-type").addClass("selected");
				}
				else {
					$(".selected").removeClass("selected");
					$("#refresh").addClass("selected");
				}
				$("#news-articles").fadeIn("fast");
			}
			else if(type == "reload") { // For the back button
				$("#content").html(newsBody);
				if(isNews == true) {
					$(".selected").removeClass("selected");
					$(".news-item:first-of-type").addClass("selected");
				}
				else {
					$(".selected").removeClass("selected");
					$("#refresh").addClass("selected");
				}
				$("#news-articles").fadeIn("fast");
				history.pushState({page: "same", tab: "outer-news"}, "", "");
				history.pushState({page: "same", tab: "outer-news"}, "", "");
			}
		},
		error: function() {
			// Just fade in the articles if there is an error
			$("#news-articles").fadeIn("fast");
		}
	});
}

// Full news display function
var prev = 0;
var next = 0;
function showNews(newsID) {
	// Sets variables
	var news_id, news_title, news_image, news_text, news_time, news_author;
	// Clean the article ID
	var ID = newsID.replace("news","");
	$("#news-articles").fadeOut("fast");
	$.ajax({
		url: newsURL+"get-news", // Gets the article information as JSON
		method: "POST",
		dataType: "json",
		data: {"id":ID},
		success: function(data) {
			if(data.error !== true) { // If there was no error
				$("#news-articles").empty();
				$(".selected").removeClass("selected");
				// Set default HTML for the page
				$("#news-articles").html('<div id="news-article"><div class="news-header"><span></span><span></span></div><h4 id="news-title"></h4><img class="news-image-main"><div class="news-text"></div><hr><div id="vote"><div id="like" onclick="vote(\'like\')" left="outer-news" right="dislike" up="back-button"><span><svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-heart fa-w-18" role="img" aria-hidden="true" viewBox="0 0 576 512" data-icon="heart" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 414.9 24 C 361.8 24 312 65.7 288 89.3 C 264 65.7 214.2 24 161.1 24 C 70.3 24 16 76.9 16 165.5 c 0 72.6 66.8 133.3 69.2 135.4 l 187 180.8 c 8.8 8.5 22.8 8.5 31.6 0 l 186.7 -180.2 c 2.7 -2.7 69.5 -63.5 69.5 -136 C 560 76.9 505.7 24 414.9 24 Z" /></svg> Like</span></div><div id="dislike" onclick="vote(\'dislike\')" left="like" up="back-button"><span><svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-heartbeat fa-w-18" role="img" aria-hidden="true" viewBox="0 0 576 512" data-icon="heartbeat" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 47.9 257 C 31.6 232.7 16 200.5 16 165.5 C 16 76.9 70.3 24 161.1 24 C 214.2 24 264 65.7 288 89.3 C 312 65.7 361.8 24 414.9 24 C 505.7 24 560 76.9 560 165.5 c 0 35 -15.5 67.2 -31.9 91.5 H 408 l -26.4 -58.6 c -4.7 -8.9 -17.6 -8.5 -21.6 0.7 l -53.3 134.6 L 235.4 120 c -3.7 -10.6 -18.7 -10.7 -22.6 -0.2 l -48 137.2 H 47.9 Z m 348 32 c -4.5 0 -8.6 -2.5 -10.6 -6.4 l -12.8 -32.5 l -56.9 142.8 c -4.4 9.9 -18.7 9.4 -22.3 -0.9 l -69.7 -209.2 l -33.6 98.4 c -1.7 4.7 -6.2 7.8 -11.2 7.8 H 73.4 c 5.3 5.7 -12.8 -12 198.9 192.6 c 8.8 8.5 22.8 8.5 31.6 0 c 204.3 -197.2 191 -184 199 -192.6 h -107 Z" /></svg> Dislike</span></div><p class="feedback-bubble left" style="display: none;">Thank you for your feedback.</p></div><br><br><br><br></div><span class="select-next" selectnext="back-button"></span>');
				$("#content").animate({
					scrollTop:  0
				}, 100); 
				if(data.vote == 1) { // If this IP has already liked the post
					$("#like").addClass("voted");
				}
				else if(data.vote == 2) { // If they already disliked it
					$("#dislike").addClass("voted");
				}
				history.pushState({page: "same", tab: "reload-news"}, "", "");
				history.pushState({page: "news"}, "", "");
				news_id = data.id;
				news_title = data.title;
				news_image = data.image;
				news_text = data.article;
				news_time = data.time;
				news_author = data.author;
				prev = data.prev;
				next = data.next;
				// Parse the article body
				news_text = $('<div class="ignore">'+news_text+'</div>').find("nl").replaceWith("<br><br>").end()[0].outerHTML;
				// Set the text to the article
				$(".news-text").html($(news_text).html());
				$(".news-text button").remove();
				// Add the article ID
				$("#news-article").addClass("article"+news_id);
				// Add the author
				$(".news-header span:first-of-type").html(news_author);
				// Get the date from the actual time
				parseTime(news_time);
				// Add the date seperated by slashes
				$(".news-header span:last-of-type").html(date+"/"+month+"/"+year);
				// Write the title with a back button
				$("#news-title").html('<a class="selected" id="back-button" onclick="loadNews(\'reload\')" left="outer-news" down="like" tabindex="-1">&lt; </a>'+news_title);
				// If there is a button
				if($(news_text).find("button").length) {
					var $b = $(news_text).find("button");
					var i = $b.text();
					if($b.attr("url")) {
						var url = $b.attr("url");
						var code = '<input type="submit" id="news-button" value="'+i+'" onclick="location.href=\''+url+'\'" tabindex="-1" up="back-button" left="outer-news" down="like">';
						$(".news-text").append(code);
						$("#back-button").attr("down", "news-button");
						$("#like, #dislike").attr("up", "news-button");
					}
					
				}
				// Add the main article image
				$(".news-image-main").attr("src", newsImageURL+news_image);
				$("#news-articles").fadeIn("fast");
			}
			else { // If there is an error
				// Alert the error message
				alert(data.message);
				$("#news-articles").fadeIn("fast");
			}
		},
		error: function() {
			// Alert an error message if the function fails
			alert("There was an error.");
			$("#news-articles").fadeIn("fast");
		}
	});
}

// Voting function
function vote(type, query) {
	query = typeof query !== 'undefined' ? query : "";
	// Get the article ID and clean it up
	var id = $("#news-article").attr("class");
	id = id.replace("article","");
	
	$.ajax({
		url: newsURL+"vote"+query, // Returns vote success / type as JSON
		method: "POST",
		dataType: "json",
		data: {"id":id,"type":type},
		success: function(data) {
			if(data.error == true && data.allowed == false) { // If the user has not yet allowed their IP address
				if(confirm("This will store your IP address in our servers.\nBy continuing, you are allowing us to store this information.")) {
					// If they accept, add the query string
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
		error: function() {
			alert("There was an error.");
		}
	});
}

// "Thank you for your feedback." balloon function (self-explanatory)
function feedbackThanks() {
	$('.feedback-bubble').fadeIn('fast', function () {
		$(this).delay(1800).fadeOut('fast');
	});
}

// Simple odd/even function for news items
function isOdd(i) {
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
	// Set inputs back to false
	holdUp = holdLeft = holdRight = holdDown = holdL = holdR = holdZL = holdZR = false;
	$(".touched").removeClass("touched");
	$("#"+id).addClass("touched");
	if($(".touched").hasClass("outer")) {
		$(".inner").removeClass("inner-active");
		$("#"+id+" .inner").addClass("inner-active");
	}
	$(".next").addClass("selected");
	resetState();
}

// Notification about cursor has been sent?
var cursorSent = false;

var ready = true;
var delay = 0;
// Constant loop while Joy-Con are connected
gamepad.bind(Gamepad.Event.TICK, function (gamepads) {
	if($(".touched:hover").length || $("body").attr("touching")) { // If the screen is touched
		cursor = false;
	}
	else if($("body:hover").length) { // If the actual cursor is on screen
		cursor = true;
		// Set inputs back to false
		holdUp = holdLeft = holdRight = holdDown = holdL = holdR = holdZL = holdZR = false;
		// Send notification about using cursor
		if(!cursorSent) {
			cursorSent = true;
			alert("Disable the cursor (press the left stick) to navigate like the real Switch UI.");
		}
	}
	// Constantly get selected button
	if($(".selected").attr("id")) {
		var newSelected = $(".selected").attr("id");
		$(".next").attr("up", newSelected).attr("down", newSelected).attr("left", newSelected).attr("right", newSelected);
		if(newSelected == "display-colors" && !cursor) {
			$(".display-colors").focus();
		}
		else {
			$(".display-colors").blur();
		}
		if(newSelected == "friends-notify" && !cursor) {
			$(".friends-online").focus();
		}
		else {
			$(".friends-online").blur();
		}
		if(newSelected == "show-status" && !cursor) {
			$("select.show-status").focus();
		}
		else {
			$("select.show-status").blur();
		}
	}
	
	if(cursor) {
		if(!$(".next.selected").length && !$("#cancel-search").length) {
			$(".selected").removeClass("selected");
		}
		$(".next").addClass("selected");
	}
	
	// If the cursor is no longer over the previously touched tab
	if(cursor && $(".touched:not(:hover)").length) {
		$(".touched").removeClass("touched");
	}
	
	// If the screen should no longer be touched
	if(cursor && $("body:not(:hover)").length) {
		$("body").removeAttr("touching");
	}
	
	// Allow joysticks/buttons to be held down
	if(ready && !cursor) {
        ready = false;
        if(holdUp) {
			UP();
		}
		if(holdLeft) {
			LEFT();
		}
		if(holdRight) {
			RIGHT();
		}
		if(holdDown) {
			DOWN();
		}
        setTimeout(function () {
            ready = true;
        }, delay)
    }

	// Open message from notification
	if($("#notification-box .press-l-r").length) {
		// If the buttons are being held down
		if(holdL && holdR || holdZL && holdZR) {
			var id = $(".press-l-r").attr("user");
			holdL = holdR = holdZL = holdZR = false;
			toggled = true;
			// Load the messages
			messageFromNotification(id);
		}
	}
	
	if($("#news-article").length) { // If a news article is open
		if(next !== 0 && (holdL || holdZL)) { // If the next article is set
			// Open the next news
			showNews(next);
		}
		else if(prev !== 0 && (holdR || holdZR)) { // If the previous article is set
			// Open the previous news
			showNews(prev);
		}
		holdL = holdZL = holdR = holdZR = false;
	}
});

// Set input variables
var holdUp, holdLeft, holdRight, holdDown, holdL, holdR, holdZL, holdZR;
holdUp = holdLeft = holdRight = holdDown = holdL = holdR = holdZL = holdZR = false;

// When a button is pressed - for DPAD, FACE buttons and TRIGGERS
gamepad.bind(Gamepad.Event.BUTTON_DOWN, function (e) {
	$(".spanbuttons").append(e.control); // I think it helped to do something with the control first but may not be necessary
	delay = 100;
    switch (e.control) { // This section should explain itself for the most part
		case "DPAD_UP":
			holdUp = true;
			break;
        case "DPAD_LEFT":
            holdLeft = true;
            break;
        case "DPAD_RIGHT":
            holdRight = true;
            break;
        case "DPAD_DOWN":
			holdDown = true;
            break;
		case "FACE_1": // B Button
			if($("input.selected, textarea.selected").is(":focus")) {
				if($("input.selected, textarea.selected").val().length == 0) {
					XClosed = true;
				}
			}
			break;
        case "FACE_2":
			// Created function to allow emulation
			pressA();
            break;
		case "FACE_3": // Y Button - Refresh
			var focused = $("input, textarea").is(":focus");
			if(XClosed || !focused) { 
				if($(".details.visible").length) {
					showDetails();
				}
				else {
					location.reload();
				}
			}
			break;
		case "FACE_4": // X Button
			XClosed = true;
			break;
		case "LEFT_BOTTOM_SHOULDER": // ZL Button
			holdZL = true;
			break;
		case "RIGHT_BOTTOM_SHOULDER": // ZR Button
			holdZR = true;
			break;
		case "LEFT_TOP_SHOULDER": // L Button
			holdL = true;
			break;
		case "RIGHT_TOP_SHOULDER": // R Button
			holdR = true;
			break;
    }
	cursor = false; // Set cursor back to false, just in case (otherwise it'll be turned back again anyway)
	// Check if an input was closed
	if(XClosed) {
		$("input, textarea").blur();
		XClosed = false;
	}
});

// When a button is released - for DPAD, FACE buttons and TRIGGERS
gamepad.bind(Gamepad.Event.BUTTON_UP, function (e) {
	$(".spanbuttons").append(e.control);
    switch (e.control) {
		case "DPAD_UP":
			holdUp = false;
			break;
        case "DPAD_LEFT":
            holdLeft = false;
            break;
        case "DPAD_RIGHT":
            holdRight = false;
            break;
        case "DPAD_DOWN":
            holdDown = false;
            break;
		case "LEFT_BOTTOM_SHOULDER":
			holdZL = false;
			break;
		case "RIGHT_BUTTON_SHOULDER": 
			holdZR = false;
			break;
		case "LEFT_TOP_SHOULDER":
			holdL = false;
			break;
		case "RIGHT_TOP_SHOULDER":
			holdR = false;
			break;
    }
	cursor = false; // Set cursor back to false, just in case (otherwise it'll be turned back again anyway)
});

// When A is pressed
function pressA() {
	if(cursor) {
		// Do nothing
	}
	else if($("#refresh.selected").length) { // Refresh the news if selected
		loadNews("refresh");
	}
	else if($(".selected.outer").length) { // If a tab is selected
		offTab(); // See comments at function
	}
	else if($("#survey.selected").length) {
		survey();
	}
	else if($("input[type=text].selected, input[type=url].selected, textarea.selected").length) { // Focus on the selected text box
		$(".selected").focus();
	}
	else if($("#nav.selected").length) {
		location.reload();
	}
	else if($(".selected.link:not('.custom-link')").length) { // Useful link selected
		window.location.href = $(".selected a").attr("href");
	}
	else if($("a.selected").attr("href") && $("a.selected").attr("href") !== "#") { // Anchor tag with link selected
		window.location.href = $("a.selected").attr("href");
	}
	else { // Otherwise just click it and hope for the best lol
		$(".selected").click();
	}
}

// Event for Joy-Con sticks moving
gamepad.bind(Gamepad.Event.AXIS_CHANGED, function (e) {
	if (!cursor) { // If the cursor isn't on screen
		delay = 130;
		switch (e.axis) { // Pretty self explanatory
			case "LEFT_STICK_X":
			case "RIGHT_STICK_X":
				if (e.value < -0.5) {
					holdLeft = true;
					holdRight = false;
				} else if (e.value > 0.5) {
					holdRight = true;
					holdLeft = false;
				} else if (e.value < 0.5 || e.value > -0.5) {
					holdLeft = false;
					holdRight = false;
				}
				break;
			case "LEFT_STICK_Y":
			case "RIGHT_STICK_Y":
				if (e.value > 0.5) {
					holdDown = true;
					holdUp = false;
				} else if (e.value < -0.5) {
					holdUp = true;
					holdDown = false;
				} else if (e.value < 0.5 || e.value > -0.5) {
					holdUp = false;
					holdDown = false;
				}
				break;
		}
	}
});

// Load a URL which is manually entered
function loadurl() {
	var input = $("#url").val();
	
	// Make sure it isn't empty
	if(input !== "") {
		// Add http:// to the front if it's not present
		if(!input.toLowerCase().startsWith("http://") && !input.toLowerCase().startsWith("https://")) {
			input = "http://" + input;
		}
		// Go to the inputted URL
		window.location.href = input;
	}
}

// Opens the survey page
function survey() {
	window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSewt6insjUEzg0dWV--n5OlDodk2Zflr3pbd4XWs6hEuZTzNg/viewform";
}

// Remove the selected object
function removeSelect() {
	$(".selected").removeClass("selected");
	// Allow the normal gamepad to work again
	$("body").removeAttr("touching");
	cursor = true;
}

// For pressing up
function UP() {
	// Boolean for an input being focused on
	var focused = $("input, textarea").is(":focus");
	if(XClosed || !focused) { // Only go up if the input has been closed or if it is not selected
		if($(".selected").attr("up")) { // If it can go up
			var up = $(".selected").attr("up");
			var tID = $(".selected").attr("id");
			if(up == "user-icon" || up == "message-scroll") {
				// Make the user icon go back down to the same element
				$("#"+up).attr("down", tID);
			}
			else if(up == "custom-edit") { // If going up leads to the custom link edit button
				// Make it go back down
				$("#"+up).attr("down", tID);
			}
			else if(up == "change-link" || up == "delete-links" || up == "save-links") { // if going up leads to the other custom link buttons
				// Same thing
				$("#"+up).attr("down", tID)
			}
			// Remove selected from original element
			$(".selected").removeClass("selected");
			// Make the new element selected
			$("#"+up).addClass("selected");
			// If an outer tab is selected
			if($(".selected.outer").length) {
				// Stop scrolling
				$("#content").stop();
				if($("#userpage-content").length) { // If on the user page
					// Open the tab
					userTab($(".selected .inner").attr("id"));
				} else if($("#settingspage-content").length) { // If on the settings page
					// Open the tab
					settingsTab($(".selected .inner").attr("id"));
				} else if($("#messages-main").length) { // If on the messages page
					// Load the messages
					showMessages($(".selected .inner").attr("id"));
				} else { // If on the main page
					// Yep, open a tab!
					populateData($(".selected .inner").attr("id"));
				}
			}
		}
		// Scroll up or down if neccessary
		linkScroll();
		// Check what element is selected
		checkSelected();
		// Reset some variables
		resetChange();
	}
}

// For pressing left
function LEFT() {
	// Boolean for an input being focused on
	var focused = $("input, textarea").is(":focus");
	if(XClosed || !focused) { // Only go up if the input has been closed or if it is not selected
		if($(".selected").attr("left")) { // If it can go left
			var left = $(".selected").attr("left");
			var selID = $(".selected").attr("id");
			// If the message scroll box is selected
			if(selID == "message-scroll") {
				// Change it back to the message enter box
				// Idk why but it didn't work with the variable
				var sn = "message-enter";
				if($("#learn-more").length) {
					sn = "learn-more";
				}
				else if($("#response-1").length) {
					sn = "response-1";
				}
				$(".active-page .select-next").attr("selectnext", sn);
				messagesBottom();
			}
			else {
				$(".active-page .select-next").attr("selectnext", selID);
			}
			$(".selected").removeClass("selected");
			$("#"+left).addClass("selected");
			// If an outer tab is selected
			if($(".selected.outer").length && starting) {
				if($("#userpage-content").length) {
					userTab($(".selected .inner").attr("id"));
				}
				else if($("#settingspage-content").length) {
					settingsTab($(".selected .inner").attr("id"));
				} else {
					populateData($(".selected .inner").attr("id"));
				}
				starting = false;
			}
		}
		if($("#four.inner-active").length && !change) {
			change = true;
		}
		else if($("#news.inner-active") && !change) {
			change = true;
		}
		// Do the other functions
		checkSelected();
		resetChange();
		otherLinkScroll("left");
	}
}

// For pressing right
function RIGHT() {
	// Boolean for an input being focused on
	var focused = $("input, textarea").is(":focus");
	if(XClosed || !focused) { // Only go up if the input has been closed or if it is not selected
		if($(".selected").attr("right")) { // If it can go left
			var right = $(".selected").attr("right");
			$(".selected").removeClass("selected");
			$("#"+right).addClass("selected");
		}
		else if($(".selected.outer").length) { // If a tab is selected
			// Move off the tab
			offTab();
		}
		// Check the new selected element
		checkSelected();
		resetChange();
		otherLinkScroll("right");
	}
}

// For pressing down
function DOWN() { // All of this is the same as the others
	var focused = $("input, textarea").is(":focus");
	if(XClosed || !focused) {
		if($(".selected").attr("down") && $("#"+$(".selected").attr("down")).length && $(".selected").attr("id") !== "message-scroll") {
			var down = $(".selected").attr("down");
			var tID = $(".selected").attr("id");
			if(down == "link-later") {
				$("#link-later").attr("up", tID);
			}
			$(".selected").removeClass("selected");
			$("#"+down).addClass("selected");
			if($(".selected.outer").length) {
				$("#content").stop();
				if($("#userpage-content").length) {
					userTab($(".selected .inner").attr("id"));
				}
				else if($("#settingspage-content").length) {
					settingsTab($(".selected .inner").attr("id"));
				}
				else if($("#messages-main").length && down.replace("messages-","") !== $("#messages-main").attr("user")) {
					showMessages($(".selected .inner").attr("id"));
				} else {
					populateData($(".selected .inner").attr("id"));
				}
			}
		}
		else if($(".selected#user-icon").length) {
			$(".selected").removeClass("selected");
			$("#"+$("#outer-google").attr("id")).addClass("selected");
		}
		linkScroll();
		checkSelected();
		resetChange();
	}
}

// Controls scrolling down on the pages when it's necessary
function linkScroll() {
	var sID = $(".selected").attr("id");
	var t = 150;
	if(!holdDown && !holdUp) {
		$("#content").stop();
	}
	if(sID == "1" || sID == "2" || sID == "3" ) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content #custom-4").offset().top 
		}, t); 
	}
	else if(sID == "4" || sID == "5" || sID == "6" ) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content #custom-7").offset().top 
		}, t);
	}
	else if(sID == "7" || sID == "8" || sID == "9" ) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content h3:nth-of-type(2)").offset().top 
		}, t); 
	}
	else if(sID == "10" || sID == "11" || sID == "12" ) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content #1 a").offset().top 
		}, t); 
	}
	else if(sID == "13" || sID == "14" || sID == "15" ) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content #4 a").offset().top 
		}, t); 
	}
	else if(sID == "16" || sID == "17" || sID == "18" ) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content br:nth-of-type(2)").offset().top 
		}, t); 
	}
	else if(sID == "19" || sID == "20" || sID == "21" ) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content h3:nth-of-type(3)").offset().top 
		}, t); 
	}
	else if(sID == "22" || sID == "23" || sID == "24" ) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content #10").offset().top 
		}, t); 
	}
	else if(sID == "custom-edit" || sID == "custom-1" || sID == "custom-2" || sID == "custom-3") {
		$("#content").animate({
			scrollTop: 0
		}, t); 
	}
	else if(sID == "custom-4" || sID == "custom-5" || sID == "custom-6") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content h3.custom-links").offset().top 
		}, t); 
	}
	else if(sID == "custom-7" || sID == "custom-8" || sID == "custom-9") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content .custom-link").first().offset().top 
		}, t); 
	}
	else if(sID == "gbatemp-thread") {
		$("#content").animate({
			scrollTop: 0
		}, t);
	}
	else if(sID == "instructions" && $("#first-para").length) {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#first-para").offset().top
		}, t); 
	}
	else if(sID == "in-order") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#instructions").offset().top
		}, t+100); 
	}
	else if(sID == "in-order2") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#in-order").offset().top
		}, t); 
	}
	else if(sID == "user-settings") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#user-settings").offset().top
		}, t); 
	}
	else if(sID == "sb-fb") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#browse-fb").offset().top
		}, t); 
	}
	else if(sID == "search-for") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#search-for").offset().top
		}, t); 
	}
	else if(sID == "ep8-twitter") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#how").offset().top
		}, t); 
	}
	else if(sID == "st-link") {
		$("#content").animate({
			scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#wont-play").offset().top
		}, t); 
	}
	else if(sID == "google-dns") {
		$("#settingspage-content").animate({
			scrollTop: 0
		}, t); 
	}
	else if(sID == "patreon") {
		$("#settingspage-content").animate({
			scrollTop: $("#settingspage-content").scrollTop() - $("#settingspage-content").offset().top + $("#patreon").offset().top
		}, t+200); 
	}
	else if(sID == "like" || sID == "back-button" || sID == "dislike" || sID == "news-button") {
		$("#content").stop();
		if(holdUp && !(sID == "news-button" && $("#like").attr("up") == "news-button")) {
			var y = $("#content").scrollTop() - 90;
		}
		else if(holdDown) {
			var y = $("#content").scrollTop() + 90;
		}
		$("#content").animate({
			scrollTop: y
		}, t); 
	}
	else if(sID == "message-scroll") {
		$("#messages-main").stop();
		if(holdUp) {
			var y = $("#messages-main").scrollTop() - 90;
		}
		else if(holdDown) {
			var y = $("#messages-main").scrollTop() + 90;
			if(isVisible($(".message-wrapper").last().find(".messages").last())) {
				y = y + 100;
				var down = $(".selected").attr("down");
				$(".selected").removeClass("selected");
				$("#"+down).addClass("selected");
			}
		}
		$("#messages-main").animate({
			scrollTop: y
		}, t); 
	}
	else if(sID == "blocked-list") {
		$("#userpage-content").stop();
		$("#userpage-content").animate({
			scrollTop: 0
		}, 200); 
	}
	else if(sID == "website") {
		$("#userpage-content").stop();
		$("#userpage-content").animate({
			scrollTop: $("#userpage-content").scrollTop() - $("#userpage-content").offset().top + $("#userpage-content #icon-button").offset().top
		}, 200); 
	}
	else if(sID == "unlink-account") {
		$("#userpage-content").stop();
		$("#userpage-content").animate({
			scrollTop: $("#userpage-content").scrollTop() - $("#userpage-content").offset().top + $("#userpage-content h3:last-of-type").offset().top
		}, 200); 
	}
	else if($(".selected").parent().attr("id") == "news-items") {
		if($(".selected").attr("up") && $(".selected.news-item").attr("up") !== "user-icon") {
			var up = $(".selected").attr("up");
			$("#content").animate({
				scrollTop: $("#content").scrollTop() - $("#content").offset().top + $("#content #"+up+" .news-title span").offset().top
			}, t); 
		}
		else {
			$("#content").animate({
				scrollTop: 0
			}, t); 
		}
	}
	else if($(".selected").parent().attr("id") == "friend-list") {
		if($(".selected.user-select").attr("up")) {
			var up = $(".selected").attr("up");
			// Get the center of the above image
			var $this = $("#userpage-content #"+up+" #user-pic-wrapper");
			var centerY = $this.offset().top + $this.height() / 2;
			
			$("#userpage-content").animate({
				scrollTop: $("#userpage-content").scrollTop() - $("#userpage-content").offset().top + centerY
			}, t); 
		}
		else {
			$("#userpage-content").animate({
				scrollTop: 0
			}, t); 
		}
	}
	else if($(".selected").parent().hasClass("users-list-page")) {
		if($(".selected.user-select").attr("up")) {
			var up = $(".selected").attr("up");
			// Get the center of the above image
			var $this = $(".users-list-page #"+up+" #user-pic-wrapper");
			var centerY = $this.offset().top + $this.height() / 2;
			$(".users-list-page").animate({
				scrollTop: $(".users-list-page").scrollTop() - $(".users-list-page").offset().top + centerY
			}, t); 
		}
		else {
			$(".users-list-page").animate({
				scrollTop: 0
			}, t); 
		}
	}
	else if($(".selected").parent().next().attr("id") == "messages-main") {
		fixTabScroll(t);
	}
	
	if($(".link.selected").length) {
		$(".active-page .select-next").attr("selectnext", sID);
	}
}

// Controls scrolling right when necessary
function otherLinkScroll(t) {
	if($(".selected").parent().attr("id") == "users-corner") {
		$("#users-corner").stop();
		var id = $(".selected").attr("id");
		id = parseInt(id.replace("uc-", ""));
		if(id > 5) {
			$("#users-corner").animate({
				scrollLeft: $("#users-corner").scrollLeft() - $("#users-corner").offset().left + $("#uc-"+parseInt(id-4)).offset().left
			}, 150);
		}
		else {
			if(t == "left") {
				$("#users-corner").animate({scrollLeft: 0}, 150);
			}
			
		}
	}
}

// Reset a few things
function resetChange() {
	var selID = $(".selected").attr("id");
	if(selID == "gbatemp-thread" || $(".selected").hasClass("news-item") || selID == "url" || selID == "load-page") { // If on a specific tab, set change = false
		change = false;
	}
	$("input, textarea").blur();
	XClosed = false;
}

// Check what is selected and maybe do something
function checkSelected() {
	if($("#user-icon.selected").length) { // If the user-icon is selected
		$("#user-text").fadeIn("fast");
	}
	else {
		$("#user-text").fadeOut("fast");
	}
	if($(".bg.selected").length) {
		var c = $(".bg.selected").attr("c");
		viewBG(c);
		fixScroll();
	}
	else if($(".icon.selected").length) { // If an icon is selected on the character page
		var src = $(".icon.selected img").attr("src");
		viewIcon(src);
		fixScroll();
	}
}

// For the back (B) button
window.onpopstate = function(event) {
	// Uncomment the line below to debug the back button
	//alert(JSON.stringify(event.state));
	// Get the new state as a JSON object
	var parsed = JSON.parse(JSON.stringify(event.state));
	// Get the current page
	page = parsed.page;
	switch(page) { // Check the current page
		case "account_spam": // Spammed history to disable going back
			$("#second-page").fadeOut("fast").removeClass("active-page");
			$(".selected").removeClass("selected");
			$("#outer-google").addClass("selected");
			populateData("one");
			setTimeout(function() {
				$("#second-page").empty();
				$("#main-page").fadeIn("fast").addClass("active-page");
			}, 600);
			break;
		case "create_user": // User creation page
			if(parsed.section == "first") {
				createUser(parsed.msg);
			}
			else if(parsed.section == "second") {
				NUNext();
			}
			else if(parsed.section == "name") {
				history.pushState({page: "create_user", section: "second"}, "", "");
				chooseNewIcon(newI, newBG, newName);
			}
			else if(parsed.section == "create-icon") {
				if(fromName) {
					createIcon("back");
					fromName = false;
				}
				else {
					resetLeft("create");
				}
			}
			break;
		case "friend-corner": // Friend Corner
			if(parsed.part == "start") {
				if(confirm("Are you sure you want to leave the Friend Corner?")) {
					friendCornerActive = false;
					history.pushState({page: "home", tab: "google"}, "", "");
					$("#second-page").fadeOut("fast");
					lastTab = "outer-add";
					setTimeout(function() {
						userPage(lastTab);
						$("#second-page").fadeIn("fast");
					}, 600);
				}
				else {
					history.pushState({page: "friend-corner", part: "real"}, "", "");
				}
			}
			break;
		case "friend_popup": // Friend Popup
			this.fromPopUp = true;
			$("#overlay").fadeOut("slow", function() {
				resetPopup();
			});
			history.back();
			if($(".users-list-page").length) {
				this.fromPopUp = false;
				$(".selected").removeClass("selected");
				$("#"+this.prevS).addClass("selected");
				this.prevS = "";
			}
			break;
		case "friend_settings": // Friend Settings page
			friendSettingsPage();
			break;
		case "home": // Main page
			var t = parsed.tab;
			if(t == undefined) {
				t = "google";
			}
			else {
				t = t.replace("outer-", "");
			}
			$("#second-page").fadeOut("fast").removeClass("active-page");
			$(".selected").removeClass("selected");
			$("#outer-"+t).addClass("selected");
			populateData($("#outer-"+t+" .inner").attr("id"));
			setTimeout(function() {
				$("#second-page").empty();
				$("#main-page").fadeIn("fast").addClass("active-page");
			}, 600);
			// Make sure the overlay is gone
			$("#overlay").fadeOut("slow", function() {
				resetPopup();
			});
			break;
		case "icon": // Icon page
			resetLeft();
			break;
		case "messages": // Back to messages
			$(".messages-title, .details-content").fadeOut("fast", function() {
				$(".messages-title").text("Messages");
				$(".details").addClass("visible");
				setTimeout(function() {
					$(".active-page .container, .current-messaging, .details, .messages-title").fadeIn("fast", function() {
						if($(".hide-conversation").length && !$(".hide-conversation").hasClass("disabled")) {
							$(".active-page #messages-"+currentUser).remove();
						}
						$(".details-content").remove();
						$(".selected").removeClass("selected");
						if($(".active-page .inner-active").length) {
							$(".active-page .inner-active").parent().addClass("selected");
						}
						else {
							// Select the first tab
							$(".active-page .inner").first().addClass("inner-active").parent().addClass("selected");
							showMessages($(".active-page .inner-active").attr("id"));
							fixTabScroll(150);
						}
						messagesBottom();
					});
				}, 600);
			});
			break;
		case "outer_popup": // Outer popup
			$(".selected").removeClass("selected");
			$("#close-box").addClass("selected");
			setTimeout(function() {
				$("#outer-overlay").fadeOut("slow", function() {
					$(this).remove();
					$("#options").addClass("selected");
					history.replaceState({page: "friend_popup"}, "", "");
				});
			}, 100);
			break;
		case "same": // Stay on the same page
			if(parsed.tab == "reload-news") { // If going back to main news page
				loadNews("reload");
				$("#content").scrollTop(0);
			}
			else {
				var sel = $(".selected").attr("id");
				var $n = $(".active-page .select-next");
				if($(".selected").parents(".main").length) {
					$n.attr("selectnext", sel);
				}
				// If on the messages page
				if($("#messages-main").length) {
					// If the message scroll is selected
					if(sel == "message-scroll") {
						// Go back to the correct element
						var sn = "message-enter";
						if($("#learn-more").length) {
							sn = "learn-more";
						}
						else if($("#response-1").length) {
							sn = "response-1";
						}
						$n.attr("selectnext", sn);
					}
					messagesBottom();
				}
				$(".selected").removeClass("selected");
				$(".inner-active").parent().addClass("selected");
				$("input, textarea").blur();
			}
			change = true;
			break;
		case "settings": // Settings page
			var t = parsed.tab;
			t = t.replace("outer-", "");
			$("#second-page").fadeOut("fast");
			lastTab = t;
			setTimeout(function() {
				openSettings();
				$("#second-page").fadeIn("fast");
			}, 600);
			break;
		case "user": // User page
			if(!$("#message-enter").length || $("#message-enter").val().length == 0 || confirm("The message you entered will be discarded.")) {
				if(!this.fromPopUp) {
					history.pushState({page: "home", tab: "google"}, "", "");
					$("#second-page").fadeOut("fast", function() {
						lastTab = parsed.tab;
						userPage(lastTab);
					});
				}
				else {
					this.fromPopUp = false;
					$(".selected").removeClass("selected");
					$("#"+this.prevS).addClass("selected");
					this.prevS = "";
					$(".blur").removeClass("blur");
				}
			}
			else {
				history.pushState({page: "user", tab: tabBack}, "", "");
				history.pushState({page: "same", tab: $(".inner-active").parent().attr("id")}, "", "");
			}
			break;
	}
	// Just to make sure
	if(friendCornerActive) {
		friendCornerActive = false;
	}
};

// Moving off a tab
function offTab() {
	// If select next exists
	if($(".active-page .select-next").length) {
		// Enable back button
		if($("#settingspage-content").length) {
			history.pushState({page: "home", tab: "settings"}, "", "");
		}
		else if($("#messages-main").length) {
			history.pushState({page: "user", tab: tabBack}, "", "");
		}
		else {
			history.pushState({page: "home", tab: "google"}, "", "");
		}
		history.pushState({page: "same", tab: $(".inner-active").parent().attr("id")}, "", "");
		resetState();
		$(".selected").removeClass("selected");
		if($("#userpage-content").length) {
			$("#"+$("#userpage-content .select-next").attr("selectnext")).addClass("selected");
		}
		else if($("#settingspage-content").length) {
			$("#"+$("#settingspage-content .select-next").attr("selectnext")).addClass("selected");
		}
		else {
			$("#"+$(".active-page .select-next").attr("selectnext")).addClass("selected");
		}
		// See comments at function
		resetChange();
	}
}

// Reset the state so back button works properly
function resetState() {
	if($("#userpage-content").length) {
		history.pushState({page: "user", tab: $(".inner-active").parent().attr("id")}, "", "");
	}
	else if($("#settingspage-content").length) {
		history.pushState({page: "settings", tab: $(".inner-active").parent().attr("id")}, "", "");
	}
	else {
		history.pushState({page: "home", tab: $(".inner-active").parent().attr("id")}, "", "");
	}
}

var selectedLink;
// Add custom useful link
function addLink(id) {
	if(userID == 0) { // If they don't have a user
		// Prompt to create one, with the correct message
		createUser("custom-link");
		selectedLink = id;
		resetState();
	}
	else {
		if(!editingLinks) { // If the links are not being edited
			actualAddLink("http://", id);
		}
	}
}

// Edit custom links
var editingLinks = false;
function editLinks() {
	if(userID == 0) { // If they do not have a user
		// Prompt to create one, with the correct message
		createUser("custom-link");
		resetState();
	}
	else {
		// Editing links
		editingLinks = true;
		// Disable all regular links from being clicked
		$(".main .link:not(.custom-link)").addClass("disabled");
		$(".main .link:not(.custom-link), .main .link:not(.custom-link) a").off("click").on("click", function(e) {
			if($(this).parent().hasClass("disabled")) { // Check if it is disabled
				// Stop it from going to URL
				e.preventDefault();
			}
		});
		// Hide edit button
		$(".main .edit-link-button").hide();
		// Show other buttons
		$(".main .edit-link-buttons").show();
		// Remove selected
		$(".selected").removeClass("selected");
		// Select first custom link
		$("#custom-1").addClass("selected").attr("up", "save-links");
		// Alter the up of the top links
		$("#custom-2, #custom-3").attr("up", "save-links");
		// Disable custom links that aren't complete
		$(".main .custom-link:not(.completed)").addClass("disabled");
		$(".main .custom-link").off("click").on("click", function() {
			if($(this).hasClass("completed") && editingLinks) { // If the link is complete and they are being edited
				// Make the link chosen
				$(this).toggleClass("chosen");
				// Get the number of chosen link
				var chosen = $(".custom-link.chosen").length;
				if(chosen > 0) { // If there is more than one chosen link
					// Enable change and delete buttons
					$("#change-link, #delete-links").removeClass("disabled");
					// Enable going up to change and delete buttons
					$("#custom-1").attr("up", "change-link");
					$("#custom-2").attr("up", "delete-links");
					// Enable going left and right between buttons
					$("#change-link").attr("right", "delete-links");
					$("#delete-links").attr("left", "change-link");
					$("#save-links").attr("left", "delete-links");
				}
				else { // If there are zero chosen links
					// Disbale change and delete buttons
					$("#change-link, #delete-links").addClass("disabled");
					// Disable moving left and right between links
					$("#change-link").removeAttr("right");
					$("#delete-links").removeAttr("left");
					$("#save-links").removeAttr("left");
					// Make up on custom links go to the save button
					$("#custom-1, #custom-2").attr("up", "save-links");
				}
				if(chosen > 1) { // If more than one link is chosen
					// Disable the change link button
					$("#change-link").addClass("disabled");
					// Disable moving left from delete button
					$("#delete-links").removeAttr("left");
					$("#custom-1").attr("up", "delete-links");
				}
			}
		});
		$(".main .custom-link.completed a").off("click").on("click", function(e) { 
			if(editingLinks) { // If editing
				// Prevent clicking on custom link
				e.preventDefault();
			}
		});
		$(".main #change-link").off("click").on("click", function() {
			if(!$(this).hasClass("disabled")) { // If change link button is not disabled
				// Allow them to change the link as normal
				actualAddLink($(".custom-link.chosen a").attr("href"), $(".custom-link.chosen").attr("id"));
			}
		});
		$(".main #delete-links").off("click").on("click", function() {
			if(!$(this).hasClass("disabled")) { // If the delete button is not disabled
				// Delete the chosen links
				deleteLinks();
			}
		});
		// Finish editing links
		$(".main #save-links").off("click").on("click", function() {
			// Disable editing mode
			editingLinks = false;
			// Reset everything that was changed
			$(".main .edit-link-buttons").hide();
			$(".main .edit-link-button").show();
			$(".main .disabled").removeClass("disabled");
			$(".main .chosen").removeClass("chosen");
			$(".main #change-link, .main #delete-links").addClass("disabled");
			$(".selected").removeClass("selected");
			$("#custom-1").addClass("selected").attr("up", "custom-edit");
			$("#custom-2").attr("up", "custom-edit");
			$("#custom-3").attr("up", "user-icon");
			customClick();
		});
	}
}

var origTitle;
// Actual add link
function actualAddLink(url, id) {
	url = typeof url !== 'undefined' ? url : "http://";
	var site = url;
	if(editingLinks) {
		site = prompt("Please enter a new URL.", site);
	}
	else {
		site = prompt("Please enter a URL.", site);
	}
	if(site == "") {
		alert("The URL cannot be blank.");
		actualAddLink(url, id);
	}
	if (site !== null) { //If anything was entered
		var title;
		if(editingLinks) {
			origTitle = $("#"+id+" a").html();
		}
		$("#"+id+" a").text("Please wait...");
		$.ajax({
			url: userURL+"checkURL", // 
			method: "POST",
			data: {"url": site},
			dataType: "json",
			success: function(response) {
				if(response.url == false) {
					alert("This URL does not exist.");
					if(editingLinks) {
						$("#"+id+" a").text(origTitle);
					}
					else {
						$("#"+id+" a").text("Add");
					}
					actualAddLink(url, id);
				}
				else {
					title = response.title;
					doLinkTitle(site, title, id);
				}
			},
			error: function() {
				alert("An error occurred.");
				if(editingLinks) {
					$("#"+id+" a").text(origTitle);
				}
				else {
					$("#"+id+" a").text("Add");
				}
			}
		});
	}
	else {
		if(editingLinks) {
			$("#"+id+" a").text(origTitle);
		}
		else {
			$("#"+id+" a").text("Add");
		}
		return;
	}
}

// Custom link title
function doLinkTitle(url, title, id) {
	var ntitle = title;
	var otitle = title;
	ntitle = prompt("Enter a title for the link.", ntitle);
	if(ntitle == "") {
		alert("The title cannot be blank.");
		doLinkTitle(url, otitle, id);
	}
	if(ntitle !== null) { // If anything was entered
		var title;
		var i = id.replace("custom-", "")
		$.ajax({
			url: userURL+"saveLink",
			method: "POST",
			data: {"url": url, "title": ntitle, "id": userID, "lID": i},
			dataType: "json",
			success: function(response) {
				if(response.error == true) { // If there was an error
					if(response.exists == false) {
						alert("This URL does not exist.");
						actualAddLink(url, i);
					}
					else if(response.length == true) {
						alert("That title is too long.\nPlease keep it below 15 characters.");
						doLinkTitle(url, ntitle, i);
					}
					else if(response.url_exists == false) {
						alert("This URL does not exist.");
						actualAddLink(url, i);
					}
					else {
						alert("An error occurred.");
						actualAddLink(url, i);
					}
					if(editingLinks) {
						$("#"+id+" a").text(origTitle);
					}
					else {
						$("#"+id+" a").text("Add");
					}
				}
				else {
					var s = "#custom-"+i+" a";
					if(editingLinks) {
						$(s).attr("href", response.url).text(response.title);
						editLinkReset();
					}
					else {
						$(s).attr("href", response.url).text(response.title).parent().addClass("completed");
						$(s).click(false);
					}
				}
			},
			error: function() {
				alert("An error occurred.");
				if(editingLinks) {
					$("#"+id+" a").text(origTitle);
				}
				else {
					$("#"+id+" a").text("Add");
				}
			}
		});
	}
	else {
		if(editingLinks) {
			$("#"+id+" a").text(origTitle);
		}
		else {
			$("#"+id+" a").text("Add");
		}
		actualAddLink(url, id);
		return;
	}
}

// Organise the links correctly
function organiseLinks() {
	// Set variables for later
	var hPos = 1; // Horizontal position
	var vPos = 1; // Vertical position
	var first = 0; // First link
	var last; // Last link
	var custom = false; // Ready to move on
	$(".main .link:not(.custom-link)").each(function(i) { // First loop
		$(this).attr("id", i+1); // Store IDs
	});
	$(".main .link:not(.custom-link)").each(function(i) { // Second loop
		// Get the ID of the first link
		if(first == 0)  {
			first = i + 1;
		}
		// Get the ID of the last link
		last = $(".main .link:not(.custom-link)").last().attr("id");
		// If it isn't in the top row
		if(i+1 !== first || i+1 !== first - 1 || i+1 !== first - 2) {
			$(this).attr("down", i+4); // Pressing down goes to the next link
		}
		else {
			// This wasn't working the normal way so
			$(this).attr("up", "custom-"+parseInt(i+7));
		}
		// If doing the last link
		if(i+1 == last) {
			// Move on to custom links
			custom = true;
		}
		
		// If not on the top row
		if(vPos !== 1) {
			// Add link one up
			$(this).attr("up", i-2);
		}
		else {
			// Add custom link up
			$(this).attr("up", "custom-"+parseInt(i+7));
		}
		// If not on the left side
		if(hPos !== 1) {
			// Add link one left
			$(this).attr("left", i);
		}
		else {
			// Left goes back to the tab
			$(this).attr("left", "outer-links");
		}
		// If not on the right side
		if(hPos !== 3) {
			// Add link one right
			$(this).attr("right", i+2);
		}
		else {
			// Reset horizontal position
			hPos = 0;
			// If not ready for custom links
			if(!custom) {
				// Increase vertical
				vPos++;
			}
			else {
				// Reset vertical
				vPos = 1;
			}
		}
		// If not ready for custom
		if(!custom) {
			// Increase horizontal
			hPos++;
		}
		else {
			// Reset horizontal
			hPos = 1;
		}
	});
	// Loop through custom links
	$(".main .link.custom-link").each(function(i) {
		// If on top row
		if(vPos == 1) {
			if(hPos == 3) {
				// Set the up button to the link
				$(this).attr("up", "user-icon");
			}
			else {
				// Set the up button to the edit button
				$(this).attr("up", "custom-edit");
				// Set the edit button's down to the link
				$("#custom-edit").attr("down", "custom-1");
			}
		}
		else if(!$(this).attr("down")) {
			// Get the next link
			var e = first + i-6;
			$(this).attr("down", e); 
		}
		// If on the third row
		if(hPos == 3) {
			// Add to vertical position
			vPos++;
		}
		// Add to horizontal position
		hPos++;
	});
	// Set up to the user icon
	$("#custom-edit, #change-link, #delete-links, #save-links").attr("up", "user-icon");
}

// Reset editing links
function editLinkReset() {
	$(".selected").removeClass("selected");
	$("#save-links").addClass("selected");
	$(".custom-link.chosen").removeClass("chosen");
	$("#change-link, #delete-links").addClass("disabled");
	$("#change-link").attr("right", "");
	$("#delete-links").attr("left", "");
	$("#save-links").attr("left", "");
	$("#custom-1, #custom-2").attr("up", "save-links");
}

// Delete selected custom links
function deleteLinks() {
	// Get the number of chosen links
	var chosen = $(".custom-link.chosen").length;
	var msg;
	if(chosen == 1) { // If one link is chosen
		msg = "Are you sure you want to delete this link?";
	}
	else { // If more than one link is chosen
		msg = "Are you sure you want to delete these links?";
	}
	if(confirm(msg)) { // If they confirm yes
		var data = new FormData();
		// Gather every link
		$(".custom-link.chosen").each(function() {
			data.append($(this).attr("id"), true);
		});
		// Store the users id and UID
		data.append("id", userID);
		data.append("UID", UID);
		// Post to the server for the links to be deleted
		$.ajax({
			method: "POST",
			url: userURL+"deleteLinks",
			data: data,
			processData: false,
			contentType: false,
			dataType: "json",
			success: function(response) {
				if(response.error == true) { // If there was an error
					if(response.exists == false) {
						alert("The account does not exist.");
					}
					else if(response.uid == true) {
						alert("The UID provided was incorrect.");
					}
					else {
						alert("An error occurred.");
					}
				}
				else { // If it was successful
					// Loop through each chosen link
					$(".custom-link.chosen").each(function() { 
						// Remove the link
						var id = $(this).attr("id");
						$("[id='"+id+"']").find("a").text("Add").removeAttr("href");
						// Remove the dependent class
						$("[id='"+id+"']").removeClass("completed");
						// Disable the link for editing mode
						$(this).addClass("disabled");
					});
					// Reset the links and buttons
					editLinkReset();
				}
			},
			error: function() {
				alert("An error occurred.");
			}
		});
	}
}

// Get CSS variables
var getCSS = function (prop, fromClass) {
    var $inspector = $("<div>").css('display', 'none').addClass(fromClass);
    $("body").append($inspector); // add to DOM, in order to read the CSS property
    try {
        return $inspector.css(prop);
    } finally {
        $inspector.remove(); // and remove from DOM
    }
};

// Get Nintendo Switch device mode - returns handheld or docked
function consoleMode() {
	return getCSS("content", "console-mode");
}

// Warn about selecting certain buttons
function cantSelect() {
	if(cursor) { // Make sure the cursor is active
		if(consoleMode() == "handheld") {
			// If in handheld mode, mention the touch screen
			alert("Sorry, you can't use the touch screen here - please use the regular controls instead.");
		}
		else {
			// If docked
			alert("Sorry, you can't select this with the cursor - please use the regular controls.");
		}
	}
}

// Decode base64
function b64Decode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}

// Encode base64
function b64Encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}

// Reset the popup overlay
function resetPopup() {
	$(".blur").removeClass("blur");
	$("#overlay .best-icon").hide();
	// There's probably a muchhhh neater way to do this but I'm LAZY ok
	$("#overlay .new, #overlay .new-request, .code-text, #overlay #online-status, #overlay h3[id='header'], #overlay .became-friends, #overlay .text, .date-text, .sent-by, .blocked-method, .date-blocked-text").remove();
}
// Check if an element is visible in a scrollbox
function isVisible(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
	if($(el).length) {
		var rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		);
	}
	else {
		return false;
	}
}

// Touch screen handling
$("body").on("touchstart", function() {
	$(this).attr("touching", "1");
});

// Fix scroll for message tabs
function fixTabScroll(t) {
	$(".active-page .menu").stop();
	var index = $(".active-page .menu .selected").index(".active-page .menu .outer");
	if(index > 3 && $(".active-page .menu .outer:nth-of-type("+parseInt(index-3)+")").length) {
		$(".active-page .menu").animate({
			scrollTop: $(".active-page .menu").scrollTop() - $(".active-page .menu").offset().top + $(".active-page .menu .outer:nth-of-type("+parseInt(index-3)+")").offset().top
		}, t);
	}
	else {
		$(".active-page .menu").animate({scrollTop: 0}, t);
	}
}