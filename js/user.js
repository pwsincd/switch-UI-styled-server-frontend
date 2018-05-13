/* I hope everything is somewhat readable!
   This file contains everything relating to users / friends / messages 
*/
   
// Variables for user information
// Declare most variables below
var userID, theme, display, disableAds, userBG, userName, userPhoto, UID, accountID, userEmail, userSignIn, friendCode, lastTab, hasAccount, signedIn, reused, welcome, hasFriends;

// Set identical variables
userID = theme = display = disableAds = 0;
hasFriends = signedIn = reused = welcome = hasFriends = false;
var errors = 1;
var consoleName = "SwitchBru";
var userURL = "/users/";
var accountURL = "https://switchbru.com/account/";
//var accountURL = "/account/";

// Custom theme related variables
var hasCustomTheme = false;
var themeName = "";
var themeC = "";
var themeTick = "light";
var themeQuery = "";
var customYT = 0;
var customF = 0;

// Get user account
getUser();

// Get user account information (if it exists)
function getUser() {
	if(navigator.platform == "Nintendo Switch") { // If on a Switch (which it should be...)
		$("html").addClass("switch");
	}
	$.ajax({
		async: false,
		url: userURL+"getUser?info=true", // Gets the user information as JSON
		method: "POST",
		data: {"all": true},
		dataType: "json",
		success: function(data) {
			if(data.hasUser == true) { // If there is a user
				userID = data.id;
				userBG = data.bg;
				userName = data.name;
				userPhoto = data.photo;
				UID = data.uid;
				hasAccount = data.hasAccount;
				// If the user has a SwitchBru Account
				if(hasAccount) {
					// Set the account ID
					accountID = data.accountID;
					hasCustomTheme = data.custom_theme.hasTheme;
					// If they just logged into their account
					if(location.hash == "#SBAL") {
						// Confirm that the user just signed in
						signedIn = true;
					}
					else if(location.hash == "#SBAR") {
						// Confirm that the user just signed in
						signedIn = true;
						// Confirm that they are reusing an account
						reused = true;
					}
					// If the user has a custom theme
					if(hasCustomTheme) {
						// Get all the theme data
						themeName = data.custom_theme.themeName;
						themeC = data.custom_theme.themeC;
						themeTick = data.custom_theme.themeTick;
						customYT = data.custom_theme.themeYT;
						customF = data.custom_theme.themeFriends;
						themeQuery = 'user='+userID+'&UID='+UID+'&accountID='+accountID;
						// Add the CSS for the custom theme
						$('head').append('<link rel="stylesheet" type="text/css" href="'+accountURL+'theme/custom-theme.css?'+themeQuery+'" id="custom-css">');
						// Wait for the CSS to load
						if(!signedIn) {
							var cssWait = setInterval(function(){
								if($("body").css("content") == "ready" || navigator.platform !== "Nintendo Switch"){
									clearInterval(cssWait);
									fadeInStart(data);
								}
							}, 50);
						}
					}
					// Check if they have friends
					hasFriends = data.friends;
					// Check if a welcome notification should be pushed
					welcome = data.welcome_notifications;
				}
				// Set all the information
				var checkExist = setInterval(function() {
				   if ($(".no-user").length) {
						$("#user-text").html(data.name + "'s Page");
						$(".no-user").removeClass("no-user");
						$("#icon-wrapper, #notification-icon-wrapper").css("background-color", "#"+data.bg);
						$("#icon-wrapper").html("<img height='40' id='user-image' src='"+userURL+"icons/"+data.photo+"'>");
						if(data.requests) {
							$("#icon-wrapper").prepend('<div class="requests"></div><div class="requests requests-circle"></div>');
						}
						$("#notification-image").attr("src", userURL+"icons/"+data.photo);
						// Write the user's name on the welcome screen, just for fun
						$(".welcome-user").text(", "+userName);
						// Check if they have friends
						if(hasFriends) {
							// If any friends are online
							if(data.online_friends > 0) {
								$("#friends-online span").text(data.online_friends);
							}
						}
						// Load custom links
						loadCustomLinks();
						clearInterval(checkExist);
				   }
				}, 100);
				theme = data.theme;
				display = data.display;
				consoleName = data.console_name;
				errors = data.errors;
				disableAds = data.disable_ads;
			}
			$(document).ready(function() {
				// Change the look of the page
				if(theme == 0) { // If using light theme
					$("body").attr("class", "light");
				}
				else if(theme == 2) { // If using a custom theme
					$("body").attr("class", "custom");
				}
				if(display == 1) { // If display is inverted
					$("html").addClass("invert");
				}
				else if(display == 2) { // If display is greyscale
					$("html").addClass("greyscale");
				}
				if(!signedIn && !hasCustomTheme) { // If they didn't just sign in
					// Fade in after 600ms
					setTimeout(function() {
						fadeInStart(data);
					}, 600);
				}
				else if(signedIn) {
					// Remove the hash
					removeHash();
					// Go to the user page
					userPage();
					setTimeout(function() {
						getNotifications();
					}, 3000);
				}
				else {
					setTimeout(function() {
						getNotifications();
					}, 3000);
				}
			});
		},
		error: function() {
			// If there was an error, just do these anyway
			$("body").attr("class", "light");
			// Load custom links
			loadCustomLinks();
			setTimeout(function() {
				$("#main-page").fadeIn("fast");
			}, 600);
		}
	});
}

// First fade in
function fadeInStart(data) {
	$("#main-page").fadeIn("fast", function() {
		// Set up notifications
		if(userID !== 0 && hasAccount) {
			// If welcome notifications are turned on
			if(welcome) {
				// Set the default text
				$(".notification-message").text("Welcome back, "+userName+"!");
				// Get the number of notifications
				var msgs = data.notifications.messages;
				var frs = data.notifications.friend_requests;
				// Check if it should be plural
				var ms = "";
				var fs = "";
				if(msgs > 1) {
					ms = "s";
				}
				if(frs > 1) {
					fs = "s";
				}
				// If there is a new message
				if(msgs > 0) {
					// If there is also a new friend request
					if(frs > 0) {
						$("#notification-box").addClass("wider");
						$(".inner-message").html("You have <span>"+msgs+"</span> new message"+ms+" and <span>"+frs+"</span> friend request"+fs+".");
					}
					// If there is only a new message
					else {
						$(".inner-message").html("You have <span>"+msgs+"</span> new message"+ms+".");
					}
				}
				// If there is only a new friend request
				else if(frs > 0) {
					$(".inner-message").html("You have <span>"+frs+"</span> new friend request"+fs+".");
				}
				else {
					// If there is nothing
					$(".inner-message").text("You have no new notifications.");
				}
				// Show the notification
				$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
				setTimeout(function() {
					// Fade the notification back out after a few seconds
					$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
					$(".wider").removeClass("wider");
				}, 5000);
			}
			setTimeout(function() {
				getNotifications();
			}, 6000);
		}
	});
}

// Error detection
window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
	if(errors == 1) { // If the user wishes to send errors (or they have no user)
		$.ajax({
			url: userURL+"sendError",
			method: "POST",
			data: {"msg": "Error: " + errorMsg + ', File: ' + url},
			dataType: "json",
		});
	}
}

// Remove user-text
$(document).on('mouseover', 'body', function(e) {
    var target = e.target;
	if (!$(target).is('#user-icon') && !$(target).parents().is('#user-icon')) {
		$("#user-text").fadeOut("fast");
	}
	// Remove selected element
	removeSelect();
});

// When user is clicked
function selectUser() {
	$("#main-page").fadeOut("fast").removeClass("active-page");
	$("#user-text").fadeOut("fast");
	if(userID == 0 || $(".no-user").length) {
		createUser();
	}
	else {
		userPage();
	}
}

var userPageContent = "";
var requests = false;
var requestsNum = 0;

// Open the user page
function userPage(tab) {
	tab = typeof tab !== 'undefined' ? tab : "outer-profile";
	$(".selected").removeClass("selected");
	requests = false;
	requestsNum = 0;
	loadUserPage();
	$.ajax({
		url: userURL+"getUserInfo", // Gets more user information as JSON
		cache: false,
		method: "POST",
		data: {"id": userID},
		dataType: "json",
		success: function(userData) {
			if(userData.exists == true) { // If there is a user
				try {
					var selTab = $("#main-page .inner-active").parent().attr("id");
					var cur = selTab.replace("outer-", "");
					history.pushState({page: "home", tab: cur}, "", "");
				}
				catch(e) {
				}
				$("#count").attr("id", "nocount");
				counting = false;			
				change = true;
				$(".user-title").html(userName + "'s Page");
				$("#user-page-icon-wrapper").css("background-color", "#"+userBG);
				$("#user-page-icon-wrapper").html("<img height='40' id='user-image' src='"+userURL+"icons/"+userPhoto+"'>");
				hasAccount = userData.account;
				if(hasAccount) { // If they have an account
					// Get the user's email address and signin ID (censored)
					userEmail = userData.email;
					userSignIn = userData.signin;
					// Get the user's friend code
					friendCode = userData.friend_code.code;
					// Checks if they have any friend requests
					requests = userData.requests;
					requestsNum = userData.requests_num;
					if(requests) {
						$("#outer-add").append('<div class="received"></div>');
					}
					else {
						$("#user-icon .requests").remove();
					}
					hasFriends = userData.friends;
					if(userData.new_friends > 0) {
						$("#outer-friends").append('<div class="received"></div>');
					}
				}
				var t;
				if(tab == "outer-profile" || lastTab == "outer-profile") {
					$("#outer-profile").addClass("selected");
					userTab("profile");
					t = "outer-profile";
				}
				else {
					$("#"+lastTab).addClass("selected");
					userTab($("#"+lastTab+" .inner").attr("id"));
					t = lastTab;
				}
				setTimeout(function() {
					// Show information
					if(hasAccount) {
						// Friend information
						var o = userData.online_friends;
						if(o > 0) {
							$(".friends-online").addClass("online").find(".online").text(o);
							$("#friends-online span").text(o);
						}
						else {
							$("#friends-online span").empty();
						}
						var m = userData.unread_messages;
						if(m > 0) {
							$(".unread-messages").addClass("unread").find(".unread").text(m);
						}
					}
					// Wait 500ms and fade the page in
					$("#second-page").fadeIn("fast", function() {
						if(signedIn) {
							setTimeout(function() {
								// If they just signed in, tell them it was successful
								var str = "Successfully linked SwitchBru Account ("+userEmail+") to "+userName+"!";
								if(reused) {
									str = "Successfully logged back in to "+userName+" ("+userEmail+")!";
									reused = false;
								}
								alert(str);
								signedIn = false;
								history.pushState({page: "user", tab: t}, "", "");
							}, 100);
						}
					}).addClass("active-page");
				}, 500);
			}
			else {
				alert("There was an error.");
				$("#main-page").fadeIn("fast").addClass("active-page");
				$(".selected").removeClass("selected");
				$("#outer-google").addClass("selected");
			}
		},
		error: function() {
			alert("There was an error.");
			$("#main-page").fadeIn("fast").addClass("active-page");
			$(".selected").removeClass("selected");
			$("#outer-google").addClass("selected");
		}
	});
}

// Switch between different user tabs
function userTab(tab) {
	switch(tab) {
		case "profile": // Profile page
			if(!hasAccount) {
				userPageContent = `<div id="profile-page">
					<div id="profile-photo" down="profile-link" left="outer-profile" right="user-name-enter" onclick="editIcon()">
						<div id="profile-photo-wrapper">
							<img height="200" id="user-profile-image" src="`+userURL+"icons/"+userPhoto+`">
							<div class="pencil-circle">
								<svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" aria-hidden="true" viewBox="0 0 512 512" data-icon="pencil-alt" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 497.9 142.1 l -46.1 46.1 c -4.7 4.7 -12.3 4.7 -17 0 l -111 -111 c -4.7 -4.7 -4.7 -12.3 0 -17 l 46.1 -46.1 c 18.7 -18.7 49.1 -18.7 67.9 0 l 60.1 60.1 c 18.8 18.7 18.8 49.1 0 67.9 Z M 284.2 99.8 L 21.6 362.4 L 0.4 483.9 c -2.9 16.4 11.4 30.6 27.8 27.8 l 121.5 -21.3 l 262.6 -262.6 c 4.7 -4.7 4.7 -12.3 0 -17 l -111 -111 c -4.8 -4.7 -12.4 -4.7 -17.1 0 Z M 124.1 339.9 c -5.5 -5.5 -5.5 -14.3 0 -19.8 l 154 -154 c 5.5 -5.5 14.3 -5.5 19.8 0 s 5.5 14.3 0 19.8 l -154 154 c -5.5 5.5 -14.3 5.5 -19.8 0 Z M 88 424 h 48 v 36.3 l -64.5 11.3 l -31.1 -31.1 L 51.7 376 H 88 v 48 Z" /></svg>
							</div>
						</div>
					</div>
					<div id="user-name-enter" left="profile-photo" down="profile-link" onclick="editName(userName)">
						<span>`+userName+`</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" aria-hidden="true" viewBox="0 0 512 512" data-icon="pencil-alt" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 497.9 142.1 l -46.1 46.1 c -4.7 4.7 -12.3 4.7 -17 0 l -111 -111 c -4.7 -4.7 -4.7 -12.3 0 -17 l 46.1 -46.1 c 18.7 -18.7 49.1 -18.7 67.9 0 l 60.1 60.1 c 18.8 18.7 18.8 49.1 0 67.9 Z M 284.2 99.8 L 21.6 362.4 L 0.4 483.9 c -2.9 16.4 11.4 30.6 27.8 27.8 l 121.5 -21.3 l 262.6 -262.6 c 4.7 -4.7 4.7 -12.3 0 -17 l -111 -111 c -4.8 -4.7 -12.4 -4.7 -17.1 0 Z M 124.1 339.9 c -5.5 -5.5 -5.5 -14.3 0 -19.8 l 154 -154 c 5.5 -5.5 14.3 -5.5 19.8 0 s 5.5 14.3 0 19.8 l -154 154 c -5.5 5.5 -14.3 5.5 -19.8 0 Z M 88 424 h 48 v 36.3 l -64.5 11.3 l -31.1 -31.1 L 51.7 376 H 88 v 48 Z" /></svg>
					</div>
					<div class="linking-text">
						Linking to a SwitchBru Account enables you to use a small variety of online features and services.
					</div>
					<input tabindex="-1" id="profile-link" onclick="linkAccount()" type="submit" value="Link to a SwitchBru Account" left="outer-profile" up="profile-photo">
					<span class="select-next" selectnext="profile-photo"></span></div>`;
			} else {
				userPageContent = `<div id="profile-page">
					<div id="profile-photo" down="profile-link" left="outer-profile" right="user-name-enter" onclick="editIcon()">
						<div id="profile-photo-wrapper">
							<img height="200" id="user-profile-image" src="`+userURL+"icons/"+userPhoto+`">
							<div class="pencil-circle">
								<svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" aria-hidden="true" viewBox="0 0 512 512" data-icon="pencil-alt" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 497.9 142.1 l -46.1 46.1 c -4.7 4.7 -12.3 4.7 -17 0 l -111 -111 c -4.7 -4.7 -4.7 -12.3 0 -17 l 46.1 -46.1 c 18.7 -18.7 49.1 -18.7 67.9 0 l 60.1 60.1 c 18.8 18.7 18.8 49.1 0 67.9 Z M 284.2 99.8 L 21.6 362.4 L 0.4 483.9 c -2.9 16.4 11.4 30.6 27.8 27.8 l 121.5 -21.3 l 262.6 -262.6 c 4.7 -4.7 4.7 -12.3 0 -17 l -111 -111 c -4.8 -4.7 -12.4 -4.7 -17.1 0 Z M 124.1 339.9 c -5.5 -5.5 -5.5 -14.3 0 -19.8 l 154 -154 c 5.5 -5.5 14.3 -5.5 19.8 0 s 5.5 14.3 0 19.8 l -154 154 c -5.5 5.5 -14.3 5.5 -19.8 0 Z M 88 424 h 48 v 36.3 l -64.5 11.3 l -31.1 -31.1 L 51.7 376 H 88 v 48 Z" /></svg>
							</div>
						</div>
					</div>
					<div class="account" id="user-name-enter" left="profile-photo" down="online-status" onclick="editName(userName)">
						<span>`+userName+`</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" aria-hidden="true" viewBox="0 0 512 512" data-icon="pencil-alt" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 497.9 142.1 l -46.1 46.1 c -4.7 4.7 -12.3 4.7 -17 0 l -111 -111 c -4.7 -4.7 -4.7 -12.3 0 -17 l 46.1 -46.1 c 18.7 -18.7 49.1 -18.7 67.9 0 l 60.1 60.1 c 18.8 18.7 18.8 49.1 0 67.9 Z M 284.2 99.8 L 21.6 362.4 L 0.4 483.9 c -2.9 16.4 11.4 30.6 27.8 27.8 l 121.5 -21.3 l 262.6 -262.6 c 4.7 -4.7 4.7 -12.3 0 -17 l -111 -111 c -4.8 -4.7 -12.4 -4.7 -17.1 0 Z M 124.1 339.9 c -5.5 -5.5 -5.5 -14.3 0 -19.8 l 154 -154 c 5.5 -5.5 14.3 -5.5 19.8 0 s 5.5 14.3 0 19.8 l -154 154 c -5.5 5.5 -14.3 5.5 -19.8 0 Z M 88 424 h 48 v 36.3 l -64.5 11.3 l -31.1 -31.1 L 51.7 376 H 88 v 48 Z" /></svg>
					</div>
					<div id="online-status" left="profile-photo" up="user-name-enter" down="profile-link">
						<span><div id="online-square"></div> Online</span>
					</div>
					<span class="friend-code">
						Friend code: <span class="code">`+friendCode+`</span>
					</span>
					<span class="select-next" selectnext="profile-photo"></span></div>`;
			}
			selected = "outer-profile";
			break;
		case 'friends': // Friend List
			var friends_image = "friends_light";
			if(theme == 1 || (customF == 1 && theme == 2)) {
				friends_image = "friends_dark";
			}
			// Different page depending on if they have an account
			if(!hasAccount) {
				userPageContent = `<div id="friend-list"><img height="260" class="have-fun" src="images/`+friends_image+`.png"><div class="add-friends-text">You can have even more fun online with friends! Add lots of friends and interact online together!</div> <input tabindex="-1" id="add-friend" onclick="addFriend()" type="submit" value="Add Friend" left="outer-friends"><span class="select-next" selectnext="add-friend"></span></div>`;
			}
			else {
				if(!hasFriends) { // If the user doesn't have any friends
					userPageContent = `<div id="friend-list"><img class="try-sending" src="images/`+friends_image+`_alt.png"><div class="try-sending-text">Try sending friend requests to people you'd like to interact with online!</div> <input tabindex="-1" id="about-requests" type="submit" value="About Friend Requests" left="outer-friends"><span class="select-next" selectnext="about-requests"></span></div>`;
				}
				else {
					userPageContent = `<div id="friend-list"><img class="loading-icon" src="images/loading.gif"></div>`;
				}
			}
			selected = "outer-friends";
			break;
		case 'add-friend-tab': // Add Friend
			if(!hasAccount) {
				userPageContent = `<div id="friend-add"><div class="link-add">Link your SwitchBru Account to add friends.</div><input tabindex="-1" class="link-button" id="friend-link" onclick="linkAccount()" type="submit" value="Link to a SwitchBru Account" left="outer-add"><span class="select-next" selectnext="friend-link"></span></div>`;
			}
			else {
				var c = "";
				if((theme == 2 && themeTick == "dark") || theme == 1) {
					c = " class=\"dark\"";
				}
				userPageContent = `<div id="friend-add">
						<div class="system-buttons" id="received-requests" down="friend-corner" left="outer-add">
							<img`+c+` src="images/add/requests.png">
							<span>Received Friend Requests</span>
						</div>
						<div class="system-buttons" id="friend-corner" left="outer-add" up="received-requests" down="friend-code">
							<img`+c+` src="images/add/meet.png">
							<span>Meet Users in the Friend Corner</span> 
						</div>
						<div class="system-buttons" id="friend-code" left="outer-add" up="friend-corner" down="sent-requests">
							<img`+c+` src="images/add/code.png">
							<span>Search with Friend Code</span> 
						</div>
						<div class="system-buttons" id="sent-requests" left="outer-add" up="friend-code">
							<img`+c+` src="images/add/sent.png">
							<span>Sent Friend Requests</span> 
						</div>
						<span class="select-next" selectnext="received-requests"></span>
					</div>`;
			}
			selected = "outer-add";
			break;
		case 'messages': // Messages tab
			if(!hasAccount) {
				userPageContent = `<div id="send-messages"><div class="link-messages">Link your SwitchBru Account to send and receive messages.</div><input tabindex="-1" class="link-button" id="messages-link" onclick="linkAccount()" type="submit" value="Link to a SwitchBru Account" left="outer-messages"><span class="select-next" selectnext="messages-link"></span></div>`;
			}
			else {
				userPageContent = `<br><input type="submit" id="open-messages" value="Open Messages" onclick="openMessages()" tabindex="-1" left="outer-messages"/><span class="select-next" selectnext="open-messages"></span>`;
			}
			selected = "outer-messages";
			break;
		case 'user-settings': // User Settings
			if(!hasAccount) {
				userPageContent = `<div id="user-settings-page">
					<h3 id="header">Profile Settings</h3>
					<div class="profile-settings-buttons" id="nickname-button" left="outer-usettings" down="icon-button">
						<span>Nickname</span> <span class="username">`+userName+`</span>
					</div>
					<div class="profile-settings-buttons" id="icon-button" left="outer-usettings" up="nickname-button" down="usettings-link">
						<span>Edit Icon</span>
						<div class="icon-edit">
							<div class="icon-edit-wrapper">
								<img height="45" class="icon-edit-image" src="`+userURL+`icons/`+userPhoto+`">
							</div>
						</div>
					</div><br><br>
					<div class="profile-settings-buttons" id="usettings-link" left="outer-usettings" up="icon-button" down="log-out" onclick="linkAccount()">
						<span>Link to a SwitchBru Account</span>
					</div>
					<div class="profile-settings-buttons" id="log-out" left="outer-usettings" up="usettings-link">
						<span>Log out of <div class="logout-name">`+userName+`</div></span> 
					</div>
					<span class="select-next" selectnext="nickname-button"></span>`;
			}
			else {
				userPageContent = `<div id="user-settings-page">
					<h3 id="header">Profile Settings</h3>
					<div class="profile-settings-buttons" id="nickname-button" left="outer-usettings" down="icon-button">
						<span>Nickname</span> <span class="username">`+userName+`</span>
					</div>
					<div class="profile-settings-buttons" id="icon-button" left="outer-usettings" up="nickname-button" down="friend-settings">
					<span>Edit Icon</span>
					<div class="icon-edit">
						<div class="icon-edit-wrapper">
							<img height="45" class="icon-edit-image" src="`+userURL+`icons/`+userPhoto+`"></div>
						</div>
					</div>
					<h3 id="header">Friend Settings</h3>
					<div class="profile-settings-buttons" id="friend-settings"" left="outer-usettings" down="blocked-list" up="icon-button">
						<span>Friend Settings</span>
					</div>
					<div class="profile-settings-buttons" id="blocked-list" left="outer-usettings" up="friend-settings" down="website">
						<span>Manage Blocked-User List</span> 
					</div>
					<h3 id="header">Linked SwitchBru Account <small>(and log out)</small></h3>
					<div id="linked-account"></div>
					<span class="configure-account">You can configure your SwitchBru Account using a smart device or PC.
						<span id="website" left="outer-usettings" down="unlink-account" up="blocked-list">switchbru.com/account</span>
					</span><br><br>
					<div class="profile-settings-buttons" id="unlink-account" left="outer-usettings" down="log-out" up="website">
						<span>Unlink Account</span>
					</div>
					<div class="profile-settings-buttons" id="log-out" left="outer-usettings" up="unlink-account">
						<span>Log out of <div class="logout-name">`+userName+`</div></span> 
					</div><br><br>
					<span class="select-next" selectnext="nickname-button"></span>
				</div>`;
			}
			selected = "outer-usettings";
			break;
	}
	if(change) { // Best I can think to do it
		$("#userpage-content").html(userPageContent); // Set user-page content to new content
		$("#userpage-content").scrollTop(0);
		$(".next").attr("up", selected).attr("down", selected).attr("left", selected).attr("right", selected); // Prepare to select again
		// Change background color (if applicable)
		$("#profile-photo-wrapper").css("background-color", "#"+userBG);
		$(".icon-edit-wrapper").css("background-color", "#"+userBG);
		if(tab == "profile") {
			// If on the profile tab
			if(hasAccount) {
				// Check actual online status
				if(navigator.onLine) {
					$("#profile-page #online-status").addClass("online").removeClass("offline").html('<span><div id="online-square"></div> Online</span>');
				} else {
					$("#profile-page #online-status").addClass("offline").removeClass("online").html("<span>Offline</span>");
				}
			}
		}
		else if(tab == "friends") {
			if(hasAccount && !hasFriends) {
				$("#about-requests").click(function() {
					alert("Select Add Friend to start looking for friends and sending friend requests! You can send friend requests to:\n\n• People who've told you their friend code\n• Random users in the Friend Corner");
				});
			}
			else if(hasAccount && hasFriends) {
				$("#friend-list").addClass("move-left");
				getFriends();
			}
		}
		else if(tab == "add-friend-tab" && hasAccount) {
			// When the "Received Friend Requests" button is selected
			$("#received-requests").click(function() {
				getRequests("received");
			});
			// Search via friend code
			$("#friend-code").click(function() {
				searchCode();
			});
			// Meet Users in the Friend Corner
			$("#friend-corner").click(function() {
				loadFriendCorner();
			});
			// If they have any requests
			if(requestsNum > 0) {
				$("#received-requests").addClass("requests");
				if(requests) {
					$("#received-requests").prepend('<div class="requests"></div>')
				}
				$("#received-requests span").text("You've received a friend request!").after('<span class="right">'+requestsNum+'</div>');
			}
			// When the "Sent Friend Requests" button is selected
			$("#sent-requests").click(function() {
				getRequests("sent");
			});
		}
		else if(tab == "user-settings") {
			// If on the user settings tab
			$("#nickname-button").click(function() {
				// Open the edit name dialog
				editName(userName, "settings");
			});
			$("#icon-button").click(function() {
				// Edit the user icon
				editIcon();
			});
			$("#log-out").click(function() {
				logOut();
			});
			if(hasAccount) {
				$("#linked-account").text(userEmail);
				if(userSignIn !== "") {
					$("#linked-account").append(" / "+userSignIn);
				}
				$("#friend-settings").click(function() {
					friendSettingsPage();
				});
				$("#blocked-list").click(function() {
					blockedList();
				});
				$("#unlink-account").click(function() {
					unlinkAccount();
				});
			}
		}
	}
	else {
		change = true;
	}
	// Enable back button
	history.pushState({page: "home", tab: "google"}, "", "");
	history.pushState({page: "same", tab: $("#"+tab).parent().attr("id")}, "", "");
	// Highlight sidebar
	$(".inner").removeClass("inner-active");
	$("#"+tab).addClass("inner-active");
	lastTab = $("#"+tab).parent().attr("id");
};

// To edit the username
function editName(firstName, page) {
	page = typeof page !== 'undefined' ? page : "profile";
	// Original username
	var name = firstName;
	name = prompt("Enter a nickname.", name);
	// If the username is empty
	if(name == "") {
		alert("This nickname is blank.");
		editName(firstName);
	}
	// If anything was entered
	if (name !== null) {
		$.ajax({
			url: userURL+"renameUser",
			method: "POST",
			data: {"id": userID, "name": name},
			dataType: "json",
			success: function(response) {
				if(response.error == false) {
					// Update the username where needed
					name = response.name;
					if(page == "profile") {
						$("#user-name-enter span").text(name);
					}
					else if(page == "settings") {
						$("#nickname-button .username").text(name);
						$(".logout-name").text(name);
					}
					$(".user-title, #user-text").text(name + "'s Page");
					userName = name;
				}
				else {
					// Error cases
					if(response.badword == true) {
						alert("This nickname contains innappropriate language.");
						editName(name);
					}
					else if(response.length == true) {
						alert("This nickname is too long.");
						editName(name);
					}
					else {
						alert("There was an error.");
						return;
					}
				}
			},
			error: function() {
				alert("There was an error.");
			}
		});
	}
	else {
		return;
	}
}

// Edit the user icon
function editIcon() {
	// If they have a user
	if(userID !== 0) {
		$("#second-page").fadeOut("fast", function() {
			// Fade the page out and load the new page
			editIconPage();
		});
		setTimeout(function() {
			// Wait 600ms and do all this stuff (setting user image etc.)
			$("#second-page").fadeIn("fast");
			$(".icon-right-wrapper").css("background-color", "#"+userBG);
			$(".icon-right-image").attr("src", userURL+"icons/"+userPhoto);
			$("#edit-character").attr("src", userURL+"icons/"+userPhoto);
			$(".bg-color").css("background-color", "#"+userBG);
			history.pushState({page: "user", tab: lastTab}, "", "");
			history.pushState({page: "icon", part: "home"}, "", "");
		}, 600);
	}
}

// Select a character icon
function selectCharacter(t) {
	// Make sure this should be done
	if((t !== undefined || userID !== 0) && $("#editicon-content").length) {
		// Replace the title text
		$(".edit-icon-title").fadeOut('fast', function () {
			$(".edit-icon-title").html("Character");
			$(this).delay(300).fadeIn('fast');
		});
		// Fade out the left side of the page
		$(".left-side").fadeOut("fast");
		setTimeout(function() {
			$(".left-side").addClass("seperate");
			$(".seperate").empty();
			// Gets all of the icons in order
			$.ajax({
				url: userURL+"/getIcons",
				dataType: "json",
				success: function(icon) {
					var row = 1;
					var column = 1;
					// Get the selected icon
					var sP = userPhoto;
					// If in create user mode
					if(t == "create") {
						sP = newPic+".png";
					}
					for (i = 0; i < icon.length; i++) { // Loop through each icon
						// Set onclick event
						var ch = 'chooseCharacter(this)';
						// If in create user mode
						if(t == "create") {
							// Reset onclick event
							ch = "chooseCharacter(this, 'create')";
						}
						// Append new icon
						$(".left-side").append('<div class="icon" onclick="'+ch+'"><img class="thing" src="'+userURL+'icons/'+icon[i]+'.png"></div>');
						// Get icon ID
						var v = i + 1;
						// Set icon ID
						$(".icon:last-of-type").attr("id", "icon"+v);
						// If not on the first column
						if(column > 1) {
							var ve = v - 1;
							$(".icon:last-of-type").attr("left", "icon"+ve);
						}
						// If not in the first row
						if(row > 1) {
							var ve = v - 6;
							$(".icon:last-of-type").attr("up", "icon"+ve);
						}
						// If the row is less than row 17
						if(row < 17) {
							var ve = v + 6;
							$(".icon:last-of-type").attr("down", "icon"+ve);
						}
						$(".icon:last-of-type").attr("r", row);
						// If not on the final column
						if(column < 6) {
							var ve = v + 1;
							$(".icon:last-of-type").attr("right", "icon"+ve);
						}
						else {
							// Next row
							row++;
							// Reset column
							column = 0;
						}
						// Continue column
						column++;	
					}
					// Show the left side
					$(".left-side").fadeIn("fast").removeAttr("style");
					// Set the selected icon
					if(!$(".icon img[src$='/"+sP+"']").length) {
						sP = "Mario.png";
					}
					$(".icon img[src$='/"+sP+"']").parent().addClass("chosen").addClass("selected");
					// Show image on mouseover
					$(".icon").mouseenter(function() {
						var src = $(this).find("img").attr("src");
						viewIcon(src);
					});
					// Fix the scroll level
					fixScroll();
					// For the back button
					if(typeof t === 'undefined') {
						history.pushState({page: "icon", part: "character"}, "", "");
					}
					else if(t == "create") {
						history.pushState({page: "create_user", section: "create-icon"}, "", "");
					}
				},
				error: function() {
					// Error, go back
					alert("An error occurred.");
					history.back();
				}
			});
		}, 300);
	}
}

// View the currently selected icon
function viewIcon(src) {
	$(".icon-right-image").attr("src", src);
}

// Choose a character icon
function chooseCharacter(img, t) {
	// Get the chosen icon
	var i = $(img).find("img").attr("src");
	// Clean the selected icon
	i = i.replace(userURL+"icons/","");
	if(typeof t === 'undefined') { // If in the regular edit mode
		$.ajax({
			url: userURL+"saveIcon",
			method: "POST",
			data: {"id": userID, "icon": i},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Set the new user icon
					userPhoto = i;
					// Change the new icon on the main screen
					$("#user-image").attr("src",userURL+"icons/"+i);
					// Reset the left side
					resetLeft();
				}
				else {
					// Error, do nothing
					alert("There was an error.");
					return;
				}
			},
			error: function() {
				// Error
				alert("There was an error.");
				return;
			}
		});
	}
	else if(t == "create") { // If in the create user mode
		// Clean the image
		i = i.replace(".png", "");
		// Set the new image
		newPic = i;
		// Reset the left side
		resetLeft(t);
	}
}

// Select a background color
function selectBG(t) {
	// Make sure this should be done
	if((t !== undefined || userID !== 0) && $("#editicon-content").length) {
		// Replace the title
		$(".edit-icon-title").fadeOut('fast', function () {
			$(".edit-icon-title").html("Background");
			$(this).delay(300).fadeIn('fast');
		});
		// Fade out the left side
		$(".left-side").fadeOut("fast");
		setTimeout(function() {
			// Empty the left side
			$(".left-side").addClass("seperate");
			$(".seperate").empty();
			$.ajax({
				url: userURL+"getBackgrounds", // Gets all the icons in order
				dataType: "json",
				success: function(colour) {
					// Set the columns
					var row = 1;
					var column = 1;
					for (i = 0; i < colour.length; i++) { // Loop through each colour
						// Set onclick event
						var ch = 'chooseBG(this)';
						// Set selected background
						var sB = userBG;
						// If in create user mode
						if(t == "create") {
							// Reset onclick event
							ch = "chooseBG(this, 'create')";
							// Set background to new (random) background
							sB = newBG;
						}
						// Append new background
						$(".left-side").append('<div class="icon bg" onclick="'+ch+'"><span class="thing"></span></div>');
						// Set colour
						$(".bg:last-of-type").css("background-color", "#"+colour[i]);
						// Set colour ID
						$(".bg:last-of-type").attr("c", colour[i]);
						// If the colour is the selected backgrounds
						if(colour[i] == sB) {
							// Set it to chosen and selected
							$(".bg:last-of-type").addClass("chosen");
							$(".bg:last-of-type").addClass("selected");
						}
						// Get BG ID
						var v = i + 1;
						// Set the BG ID
						$(".icon:last-of-type").attr("id", "icon"+v);
						// If not on the first column
						if(column > 1) {
							var ve = v - 1;
							$(".icon:last-of-type").attr("left", "icon"+ve);
						}
						// If not in the first row
						if(row > 1) {
							var ve = v - 6;
							$(".icon:last-of-type").attr("up", "icon"+ve);
						}
						// If the row is less than 17
						if(row < 17) {
							var ve = v + 6;
							$(".icon:last-of-type").attr("down", "icon"+ve);
						}
						$(".icon:last-of-type").attr("r", row);
						// If not on the final column
						if(column < 6) {
							var ve = v + 1;
							$(".icon:last-of-type").attr("right", "icon"+ve);
						}
						else {
							// Next row
							row++;
							// Reset column
							column = 0;
						}
						// Continue column
						column++;	
					}
					// Show the left side
					$(".left-side").fadeIn("fast").removeAttr("style");
					$(".icon").mouseenter(function() {
						var c = $(this).attr("c");
						viewBG(c);
					});
					// Fix the scroll level
					fixScroll();
					// For the back button
					if(typeof t === 'undefined') {
						history.pushState({page: "icon", part: "bg"}, "", "");
					}
					else if(t == "create") {
						history.pushState({page: "create_user", section: "create-icon"}, "", "");
					}
				},
				error: function() {
					//Error, go back
					alert("An error occurred.");
					history.back();
				}
			});
		}, 300);
	}
}

// View the currently selected background
function viewBG(c) {
	$(".icon-right-wrapper").css("background-color", "#"+c);
}

// Choose the chosen background
function chooseBG(cl, t) {
	// Get the chosen background
	var c = $(cl).attr("c");
	if(typeof t === 'undefined') { // If in the regular edit mode
		$.ajax({
			url: userURL+"saveBG",
			method: "POST",
			data: {"id": userID, "bg": c},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Set the new user background
					userBG = c;
					// Change the new background on the main screen
					$("#icon-wrapper").css("background-color", "#"+c);
					// Reset the left side
					resetLeft();
				}
				else {
					// Error, do nothing
					alert("There was an error.");
					return;
				}
			},
			error: function() {
				// Error
				alert("There was an error.");
				return;
			}
		});
	}
	else if(t == "create") { // If in the create user mode
		// Set the new background
		newBG = c;
		// Reset the left side
		resetLeft(t);
	}
}

// Fix the scroll level
function fixScroll() {
	// Get the row number
	var r = parseInt($(".icon.selected").attr("r"));
	var s = 0;
	// If the row is greater than 3
	if($(".seperate").length) {
		if(r > 3) {
			// Get the row before the previous row
			r = r - 2;
			// Get the scroll height of the row "r"
			s = ($(".seperate").scrollTop() - $(".seperate").offset().top + $(".icon[r*='"+r+"'] .thing").offset().top) - 20;
		}
		// Scroll to that scroll height (animated over 200ms)
		$(".seperate").animate({
			scrollTop: s
		}, 200);
	}
}
 
// Pressing the usually blue "OK" button
function iconOK(t) {
	// Fade out the second page
	$("#second-page").fadeOut("fast");
	setTimeout(function() {
		// Wait 600ms
		if(typeof t === 'undefined') { // If in the normal editing mode
			// Go to the user page
			userPage(lastTab);
			$("#second-page").fadeIn("fast");
		}
		else if(t == "create") { // If in the create user mode
			history.pushState({page: "create_user", section: "name"}, "", "");
			// Create a username
			checkName("", newPic, newBG);
		}
	}, 600);
}

// Reset the left side
function resetLeft(t) {
	var s;
	// Fade out the title
	$(".edit-icon-title").fadeOut('fast', function () {
		// Check which page it is on
		if($(".edit-icon-title").html() == "Character") {
			s = "character-button";
		}
		else {
			s = "background";
		}
		$(".edit-icon-title").html("Edit Icon");
		$(this).delay(300).fadeIn('fast');
	});
	// Fade out the left side
	$(".left-side").fadeOut("fast");
	setTimeout(function() {
		$(".left-side").removeClass("seperate");
		$(".left-side").empty();
		// Reopen the left side
		if(typeof t === 'undefined') {
			leftSide(s);
		}
		else if(t == "create") {
			leftSide(s, t);
		}
		$(".left-side").fadeIn("fast");
	}, 300);
}

var pMsg;
// Create a new user
function createUser(v) {
	pMsg = undefined;
	// Make sure they don't already have a user
	if(userID == 0) {
		// Unselect the currently selected element
		$(".selected").removeClass("selected");
		var nup = false;
		// If the new user page is open
		if($("#new-user-page").length) {
			nup = true;
			// Fade the new user page out
			$("#new-user-page").fadeOut("fast", function() {
				$(this).html(newUserHTML2);
			});
		}
		else {
			// Fade out the second page
			$("#second-page").fadeOut("fast", function() {
				$(this).html(newUserHTML);
			});
		}
		// If a string is ready
		if(v !== undefined) {
			pMsg = v;
			if(v == "custom-link" && !nup) {
				// Fade out the main page
				$("#main-page").fadeOut("fast");
			}
			setTimeout(function() {
				var msg = "";
				// Add the extra info tag
				$(".additional-information").append('<br><span class="extra-info"></span>');
				// Switch based on different information to add
				switch(v) {
					case "ads":
						msg = "You must create a user to disable ads.";
						history.pushState({page: "settings", tab: "system"}, "", "");
						break;
					case "console-name":
						msg = "You must create a user to change your console name.";
						history.pushState({page: "settings", tab: "system"}, "", "");
						break;
					case "custom-link":
						msg = "You must create a user to add custom links.";
						history.pushState({page: "home", tab: "links"}, "", "");
						break;
					case "display-colors":
						msg = "You must create a user to change the display colors.";
						history.pushState({page: "settings", tab: "system"}, "", "");
						break;
					case "error-info":
						msg = "You must create a user to disable sharing error information.";
						history.pushState({page: "settings", tab: "system"}, "", "");
						break;
					case "notifications":
						msg = "You must create a user to change notification settings.";
						history.pushState({page: "settings", tab: "notifications"}, "", "");
						break;
					case "theme":
						msg = "You must create a user to change the theme.";
						history.pushState({page: "settings", tab: "themes"}, "", "");
						break;
				}
				// Write in the extra info
				$(".extra-info").html(msg);
			}, 400);
			// For back button at some point
			$(".return-to").attr("returnto", v);
		}
		else {
			history.pushState({page: "home", tab: "google"}, "", "");
		}
		setTimeout(function() {
			// Final stuff
			history.pushState({page: "create_user", section: "first", msg: v}, "", "");
			$("#count").attr("id", "nocount");
			counting = false;
			$("#second-page").fadeIn("fast").addClass("active-page");
			$("#new-user-page").fadeIn("fast");
		}, 800);
	}
}

// After selecting an icon
function chooseNewIcon(i, b, name) {
	name = typeof name !== 'undefined' ? name : "";
	// Fade out the new user page
	$("#new-user-page").fadeOut("fast", function() {
		setTimeout(function() {
			// Wait 600 ms then push a state and make a username
			history.pushState({page: "create_user", section: "name"}, "", "");
			checkName(name, i, b);
		}, 600);
	});
}

// Set new variables
var newI = "";
var newBG = "";
var newName = "";

// Finish creating a new user
function newUserFinal(i, b, name) {
	if(!$("#new-user-page").length) {
		$("#second-page").html(newUserHTML);
		i = i+".png";
	}
	history.pushState({page: "create_user", section: "final"}, "", "");
	// Set variables
	newI = i;
	newBG = b;
	newName = name;
	// Get the page ready
	$("#new-user-page").html(newUserHTML4);
	$(".new-icon-wrapper").css("background-color", "#"+b);
	$(".new-icon-image").attr("src", userURL+"icons/"+i);
	$("#new-username").text(name);
	setTimeout(function() {
		// Fade in
		$("#second-page").fadeIn("fast");
		$("#new-user-page").fadeIn("fast");
	}, 600);
}


// For back button checking
var fromName = false;
// To check a username
var granted = false;
function checkName(firstName, i, b) {
	fromName = true;
	// Original username
	var name;
	if(newName !== "") {
		name = newName;
	}
	else {
		name = firstName;
	}
	// Prompt the user
	name = prompt("Enter your nickname.\nYou can change this at any time.", name);
	// Check if the name is empty, and go back if so
	if(name == "") {
		alert("This nickname is blank.");
		checkName(firstName, i, b);
		return;
	}
	// Check if anything was entered in the box
	if (name !== null) {
		$.ajax({
			url: userURL+"checkUserName",
			method: "POST",
			data: {"name": name},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Check if their IP is granted for use
					granted = response.granted;
					// Go to the final page
					newUserFinal(i, b, response.name);
				}
				else {
					if(response.badword == true) {
						// If the name contains a censored word
						alert("This nickname contains innappropriate language.");
						checkName(name, i, b);
					}
					else if(response.length == true) {
						// If the name is too long
						alert("This nickname is too long.");
						checkName(name, i, b);
						return false;
					}
					else {
						// Generic error
						alert("There was an error.");
						return false;
					}
				}
			},
			error: function() {
				// Other error
				history.back();
				return false;
			}
		});
		// Reset the back button
		fromName = false;
	}
	else {
		// If they cancel the prompt
		history.back();
		return false;
	}
}

// Save the user
var saving = false;
function newUserOK() {
	// Make sure they don't click the button multiple times - seems to have happened on occasion
	if(!saving) {
		if(!granted) {
			// If the IP address is not yet granted, make sure it is ok
			if(confirm("In order to let you use this user account again, your IP address must be stored on our server.\nBy continuing, you agree to let this happen.")) {
				saveNewUser();
			}
		}
		else {
			// Save the user
			saveNewUser();
		}
	}
}

// Actually save the user
function saveNewUser() {
	saving = true;
	$.ajax({
		url: userURL+"saveUser",
		method: "POST",
		data: {"name": newName, "icon": newI, "bg": newBG},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there was no error
				// Save all of the information to variables
				userName = newName;
				userPhoto = newI;
				userBG = newBG;
				userID = response.userID;
				UID = response.UID;
				consoleName = response.console_name;
				// Add user info to pages
				$("#user-text").html(newName + "'s Page");
				$(".no-user").removeClass("no-user");
				$("#icon-wrapper").css("background-color", "#"+newBG);
				$("#icon-wrapper").html("<img height='40' id='user-image' src='"+userURL+"icons/"+newI+"'>");
				// Flood history to stop them from going back
				fillHistory();
				// Ask them if they want to link an account
				linkAccount();
			}
			else {
				// Generic error
				alert("There was an error.");
			}
			saving = false;
		},
		error: function() {
			alert("There was an error.");
			saving = false;
			return;
		}
	});
}

// Get random sets of user icons for creating a user
function randomNew() {
	// Ger random number from 1 - 3
	var random = Math.floor(Math.random() * 3) + 1;
	if(random == 1) {
		pics = ["Mario", "Peach", "Link (BotW)", "Link (Drawn)", "Yellow Pikmin", "Samus", "Isabelle", "K. K. Slider", "Green Inkling B", "Pink Squid", "Star Fox", "Star"];
		bgs = ["FE0000", "FF73D4", "3597BC", "52A21D", "FFFF00", "700F10", "FFE700", "D9D9D9", "32D80C", "FEA7E5", "C28039", "451277"];
	}
	else if(random == 2) {
		pics = ["Luigi", "Donkey Kong", "Zelda", "Ganon (WW)", "Yellow Pikmin", "Samus (Zero Suit)", "Reese", "Mabel", "Yellow Inkling", "Purple Squid", "Star Fox", "Kirby"];
		bgs = ["32D80C", "6D4722", "3597BC", "FFB064", "FFFF00", "3597BC", "FEA7E5", "7FBDFE", "D4F126", "304FFF", "C28039", "FF999A"];
	}
	else {
		pics = ["Yoshi", "Bowser", "Master Sword and Hylian Shield", "Zelda (TP)", "Blue Pikmin", "Samus", "Blathers", "Celeste", "Pink Inkling B", "Pink Squid", "Arwing", "Cappy"];
		bgs = ["32D80C", "FFB600", "1C3D68", "BFA745", "479BFE", "C80A0A", "C28039", "FF6967", "8B18FF", "FEA7E5", "D9D9D9", "5BD7F0"];
	}
}

// Link a SwitchBru Account
function linkAccount() {
	if(!hasAccount) { // If they do not already have one
		loadAccountPage();
	}
}

// Add a friend
function addFriend() {
	if(!hasAccount) { // If they do not have an account
		// Prompt to create an account
		linkAccount();
	}
}

// Declare variable
var creatingIcon = false;
// Create icon function
function createIcon(bk) {
	creatingIcon = true;
	// Fade out the second page
	$("#second-page").fadeOut("fast", function() {
		// Load the icon creation page
		createIconPage();
	});
	setTimeout(function() {
		// Wait, then fade in and set up the page
		$("#second-page").fadeIn("fast");
		$(".icon-right-wrapper").css("background-color", "#"+newBG);
		$(".icon-right-image").attr("src", userURL+"icons/"+newPic+".png");
		$("#edit-character").attr("src", userURL+"icons/"+newPic+".png");
		$(".bg-color").css("background-color", "#"+newBG);
		if(bk !== "back") {
			history.pushState({page: "create_user", section: "create-icon"}, "", "");
		}
	}, 600);
}

// Remove hash from URL
function removeHash() {
	history.replaceState("", document.title, window.location.pathname + window.location.search);
}

// Link Account page-related functions
// Sign in to account
function signIn() {
	// If they have a user account and aren't already logged in
	if(userID !== 0 && !hasAccount) {
		$.ajax({
			url: userURL+"generateToken", // Generates a token for the SwitchBru signup
			method: "POST",
			data: {"id":userID,"UID":UID},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there is no error
					// Redirect to the account login page with the token and return page (encrypted)
					window.location.href = accountURL+"dns?token="+response.token+"&return="+response.r+"&signin=true";
				}
				else {
					// If there is an error
					alert("An error occurred.");
				}
			},
			error: function() {
				alert("An error occurred.");
			}
		});
	}
}

// Create an account
function createAccount() {
	// If they have a user account and aren't already logged in
	if(userID !== 0 && !hasAccount) {
		$.ajax({
			url: userURL+"generateToken", // Generates a token for the SwitchBru signup
			method: "POST",
			data: {"id":userID,"UID":UID},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there is no error
					// Redirect to the account creation page with the token and return page (encrypted)
					window.location.href = accountURL+"dns?token="+response.token+"&return="+response.r+"&signup=true";
				}
				else {
					alert("An error occurred.");
				}
			},
			error: function() {
				alert("An error occurred.");
			}
		});
	}
}

// Link later
function later() {
	history.back();
}

// Fill history a bit more in order to disable back button
function fillHistory() {
	for(i = 0; i < 30; i++) {
		history.pushState({page: "account_spam"}, "", "");
	}
}

// Check online status properly
window.addEventListener('online', function(e) {
	$("#profile-page #online-status").addClass("online").removeClass("offline").html('<span><div id="online-square"></div> Online</span>');
	onlineFriends();
	if($("#messages-main").length) {
		refreshMessages();
	}
}, false);
window.addEventListener('offline', function(e) {
	// Do all this stuff if it can, when the Switch goes offline
	$("#profile-page #online-status").addClass("offline").removeClass("online").html("<span>Offline</span>");
	$(".friends-online.online").removeClass("online");
	$(".friends-online .online").text(0);
	$(".online-sep").removeClass("online").text("Offline");
	$(".messages-online").remove();
	$(".last-active").text("SwitchBru");
}, false);

// If they already have a user
// Both the client and server side for this is really messy but idc at this point
// (if it works)
function alreadyUser(q) {
	q = typeof q !== 'undefined' ? q : "";
	$.ajax({
		url: userURL+"generateToken"+q, // Generates a token for the SwitchBru login
		method: "POST",
		data: {"reusing":true},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there is no error
				// Redirect to the account login page with the token and return page (encrypted)
				window.location.href = accountURL+"dns?token="+response.token+"&return="+response.r+"&reuse=true&signin=true";
			}
			else {
				// Check if their IP is allowed
				if(response.granted == false) {
					if(confirm("This will store your IP address on our servers, so that you will be automatically logged back in.\nBy continuing, you are allowing us to store this information.")) {
						// If they accept, add the query string
						alreadyUser("?granted=true");
					}
				}
				else {
					alert("An error occurred.");
				}
			}
		},
		error: function() {
			alert("An error occurred.");
		}
	});
}

// Change Receive Friend Requests
function receiveRequests() {
	var value = "off";
	if(receive_requests == 0) {
		value = "on";
	}
	$.ajax({
		url: userURL+"friendSettings",
		method: "POST",
		data: {"id": userID, "t": "set", "receive_requests": value},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there was no error
				// Set the new value and change the text
				if(value == "off") {
					receive_requests = 0;
					$(".receive-requests").addClass("disabled").text("Off");
				}
				else if(value == "on") {
					receive_requests = 1;
					$(".receive-requests").removeClass("disabled").text("On");
				}
			}
			else {
				// If there is an error
				alert("There was an error.");
				return;
			}
		},
		error: function() {
			alert("There was an error.");
		}
	});
}

// Change the settings for who to show the online status too
function enableStatusChange() {
	// Detect when the value is changed
	$("select.show-status").change(function() {
		var value = this.value;
		$.ajax({
			url: userURL+"friendSettings",
			method: "POST",
			data: {"id": userID, "t": "set", "status": value},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Set the new value and change the display color
					if(value == "all") {
						online_status = 2;
					}
					else if(value == "best") {
						online_status = 1;
					}
					else if(value == "off") {
						online_status = 0;
					}
					// Set the text
					$("span.show-status").text($("select.show-status option[value='"+value+"']").text());
				}
				else {
					// If there is an error
					alert("There was an error.");
					return;
				}
			},
			error: function() {
				alert("There was an error.");
			}
		});	
	});
	
	// If clicking on the display colors button with the cursor
	$("#show-status").click(function() {
		cantSelect();
	});
}

// Check received friend requests
function getRequests(type) {
	if(userID !== 0 && hasAccount) {
		$("#second-page").fadeOut("fast", function() {
			$.ajax({
				type: 'POST',
				url: userURL+'getRequests?type='+type,
				data: {"id":userID},
				dataType: "json",
				success: function(data) {
					if(data.error == true) {
						alert("An error occurred.");
						$("#second-page").fadeIn("fast");
					}
					else {
						history.pushState({page: "user", "tab": "outer-add"}, "", "");
						var no = "";
						if(type == "received") {
							receivedPage();
						}
						else if(type == "sent") {
							sentPage();
						}
						if(data.requests == false) {
							$("#"+type+"-friend-requests").addClass("none").html('<span class="no-requests">You have not '+type+' any friend requests at this time.</span>');
						}
						else {
							var l = 1;
							var t = 1;
							for (i = 0; i < data.requests.length; i++) {
								var method = "";
								if(data.requests[i].method == 2 && type == "received") {
									method = "Friend Corner";
								}
 								$("#"+type+"-friend-requests").append(`<div class="user-select" id="request-`+parseInt(i+1)+`" user="`+data.requests[i].id+`"><div id="select-user-pic"><div id="user-pic-wrapper" style="background-color: #`+data.requests[i].bg+`"><img id="user-pic-image" src="`+userURL+`icons/`+data.requests[i].image+`"></div></div><span class="nickname">`+data.requests[i].name+`</span><br><span class="method">`+method+`</span></div>`);
								// Check position
								if(l > 1) { // If the user is on the left
									$(".user-select:last-of-type").attr("left", "request-"+parseInt(i));
								}
								if(l < 5 && i + 1 < data.requests.length) { // If there is a user to the right
									$(".user-select:last-of-type").attr("right", "request-"+parseInt(i+2));
								}
								if(t > 1) { // If there is a user above
									$(".user-select:last-of-type").attr("up", "request-"+parseInt(i-4));
								}
								if(i + 4 < data.requests.length) { // If there is a user below
									$(".user-select:last-of-type").attr("down", "request-"+parseInt(i+6));
								}
								l++;
								if(l == 6) {
									l = 1;
									t++;
								}
								// Check if the user is verified
								if(data.requests[i].verified) {
									$(".user-select:last-of-type .nickname").append(" <img class='verified' src='images/verified.png'>");
								}
								// Check if it is new or not
								if(data.requests[i].viewed == 0 && type == "received") {
									$(".user-select:last-of-type #user-pic-wrapper").prepend('<div class="new-request"></div><div class="new">New</div>');
								}
							}
							var r = "request";
							if(type == "sent") {
								r = "sent-request";
							}
							$(".user-select").click(function() {
								showUser($(this).attr("user"), r);
							});
							$(".selected").removeClass("selected");
							$(".user-select:first-of-type").addClass("selected");
						}
						setTimeout(function() {
							$("#second-page").fadeIn("fast");
						}, 300);
						
					}
				},
				error: function() {
					alert("An error occurred.");
					$("#second-page").fadeIn("fast");
				}
			});
		});
	}
}

// Search with Friend Code
function searchCode(code) {
	// Original friend code
	var FC = "";
	if(code !== undefined) {
		FC = code;
	}
	// Prompt the user
	FC = prompt("Enter the friend code of the person you want to register.\nEnter the 12 digits that follow \"SB\".", FC);
	// Check if the name is empty, and go back if so
	if(FC == "") {
		alert("The friend code is blank.");
		searchCode(FC);
		return;
	}
	// Check if anything was entered in the box
	if (FC !== null) {
		$.ajax({
			url: userURL+"searchCode",
			method: "POST",
			data: {"id": userID, "code": FC},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					if(response.found == true) {
						if(response.self == true) {
							alert("You can not send a friend request to yourself.")
							searchCode(FC);
						}
						else if(response.requested == true) {
							alert("You have already sent a friend request to this user.");
						}
						else if(response.friends == true) {
							alert("You are already friends with this user.");
						}
						else {
							showUser(FC, "code");
						}
					}
					else {
						alert("This friend code does not exist.\nPlease make sure you correctly enter the 12 digits of the friend code that follow \"SB\".");
						searchCode(FC);
					}
				}
				else {
					alert("There was an error.");
				}
			},
			error: function() {
				alert("There was an error.");
			}
		});
	}
}

function sendFriendRequest(id, type) {
	if(hasAccount && userID !== 0) {
		if(type == "corner" || type == "code") {
			$.ajax({
				url: userURL+"sendFriendRequest",
				method: "POST",
				data: {"id": userID, "friend": id, "type": type},
				dataType: "json",
				success: function(response) {
					if(response.error == false && response.sent == false) { // If there was no error
						if(type == "corner") {
							$(".user-select[user='"+id+"']").append(requestSent);
						}
						else if(type == "code") {
							alert("Friend request sent.\nYou will become friends when the other user accepts your request.");
							history.back();
						}
					}
					else if(response.sent == true) {
						alert("You have already sent this user a friend request.");
					}
					else {
						if(response.receive) {
							alert("The request could not be sent.\nThe user has set their console to not receive friend requests.");
						}
						else {
							alert("The friend request was unable to send.");
						}
					}
				},
				error: function() {
					alert("The friend request was unable to send.");
				}
			});
		}
	}
}

// Refresh Friend Corner
function friendCornerRefresh() {
	if(userID !== 0 && hasAccount && friendCornerActive) {
		$.ajax({
			url: userURL+"updateFriendCorner",
			method: "POST",
			data: {"id": userID},
			dataType: "json",
			success: function(data) {
				if(data.error == true) { // If there is an error
					alert("Could not connect to the Friend Corner.");
					loadFriendCorner();
				}
				else {
					$(".user-select[user]").html('<img class="loading-icon" src="images/loading.gif">').removeAttr("user");
					if(data.length > 0) { // If there are users
						// Loop through the users
						for (i = 0; i < data.length; i++) {
							// Get variables
							var id = data[i].id;
							var name = data[i].name;
							var icon = data[i].icon;
							var bg = data[i].bg;
							var requested = data[i].requested;
							var e = "";
							// If a request has already been sent
							if(requested) {
								e = requestSent;
							}
							var box = ".user-select:nth-of-type("+parseInt(i+1)+")";
							// If the box exists
							if($(box).length) {
								// Set the box's new HTML
								$(box).attr("user", id).html('<div id="select-user-pic"><div id="user-pic-wrapper" style="background-color: #'+bg+'"><img id="user-pic-image" src="'+userURL+'icons/'+icon+'"></div></div><span class="nickname">'+name+'</span>'+e);
								// If there is more to go
								if($(".user-select").length < data.length + 1) {
									$("#users-corner").append('<div class="user-select"><img class="loading-icon" src="images/loading.gif"></div>');
								}
								else if(data.length < 6) {
									if(!cursor && $(".user-select.selected").length) {
										var num = parseInt($(".user-select.selected").attr("id").replace("uc-", ""));
										if(num > 7) {
											$("#uc-7").addClass("selected");
											$("#users-corner").animate({scrollLeft: 0}, 150);
										}
									}
									$(".user-select:gt(6)").remove();
									$(".user-select:last-of-type").removeAttr("right");
								}
							}
							// if it is the seventh box
							else if(i == 6) {
								$("#users-corner").append('<div class="user-select" user="'+id+'"><div id="select-user-pic"><div id="user-pic-wrapper" style="background-color: #'+bg+'"><img id="user-pic-image" src="'+userURL+'icons/'+icon+'"></div></div><span class="nickname">'+name+'</span></div>');
							}
							// Check if the user is verified
							if(data[i].verified) {
								$(box+" .nickname").append(" <img class='verified' src='images/verified.png'>");
							}
						}
						// Loop through the boxes
						$(".user-select").each(function(i) {
							// "UC" stands for "User Corner"
							$(this).attr("id", "uc-"+parseInt(i+1));
							if(i > 0) {
								$(this).attr("left", "uc-"+i);
							}
							if($(".user-select:nth-of-type("+parseInt(i+2)+")").length) {
								$(this).attr("right", "uc-"+parseInt(i+2));
							}
						});
						FCClick();
					}
					else {
						if(!cursor && $(".user-select.selected").length) {
							var num = parseInt($(".user-select.selected").attr("id").replace("uc-", ""));
							if(num > 7) {
								$("#uc-7").addClass("selected");
								$("#users-corner").animate({scrollLeft: 0}, 150);
							}
						}
						$(".user-select:gt(6)").remove();
						$(".user-select:last-of-type").removeAttr("right");
					}
					setTimeout(function() {
						friendCornerRefresh();
					}, 3000);
				}
			},
			error: function() {
				if(navigator.onLine) {
					alert("You were disconnected from the Friend Corner.");
				}
				else {
					alert("Could not connect to the Friend Corner.");
				}
				loadFriendCorner();
			}
		});
	}
}

// For clicking on users in the friend corner
function FCClick() {
	$(".user-select").off("click").on("click", function() {
		if($(this).attr("user")) {
			if(!$(this).find(".sent").length) {
				sendFriendRequest($(this).attr("user"), "corner");
			}
		}
	});
}

// Get new notifications
var toggled = false;
function getNotifications() {
	if(hasAccount && userID !== 0 && navigator.onLine) {
		$.ajax({
			type: 'POST',
			url: userURL+'getNotifications',
			data: {"id": userID},
			dataType: "json",
			success: function(data) {
				if(data.new == true) {
					if(data.type == 1) {
						$(".notification-message").addClass("request").text("You received a friend request.");
						$(".inner-message").hide();
						$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
						$("#icon-wrapper").prepend('<div class="requests"></div><div class="requests requests-circle"></div>');
						setTimeout(function() {
							// Fade the notification back out after a few seconds
							$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
							resetNotifications();
						}, 4000);
					}
					else if(data.type == 2) {
						$(".notification-message").addClass("friend").html(data.name+" is now <span class='online'>online</span>.");
						$(".inner-message").hide();
						$("#notification-icon-wrapper").css("background-color", "#"+data.bg);
						$("#notification-image").attr("src", userURL+"icons/"+data.icon);
						$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
						setTimeout(function() {
							// Fade the notification back out after a few seconds
							$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
							resetNotifications();
						}, 4000);
					}
					else if(data.type == 3 && !$("#messages-main").length) {
						$(".notification-message").text(data.name+" sent you a message");
						if(data.message) {
							$(".inner-message").html('"'+b64Decode(data.message)+'"').addClass("notif-message");
						}
						else {
							$(".notification-message").addClass("friend");
							$(".inner-message").hide();
						}
						$(".inner-message").after('<span class="press-l-r" from="'+data.from+'">(Press L + R to view)</span>');
						$("#notification-icon-wrapper").css("background-color", "#"+data.bg);
						$("#notification-image").attr("src", userURL+"icons/"+data.icon);
						$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
						// Add the message if it can
						if($(".unread-messages").length) {
							var num = parseInt($(".unread-messages .unread").text());
							num++;
							$(".unread-messages").addClass("unread").find(".unread").text(num);
						}
						setTimeout(function() {
							// Fade the notification back out after a few seconds
							if(!toggled) {
								$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
							}
							toggled = false;
							resetNotifications();
						}, 4500);
					}
				}
				setTimeout(function() {
					// Loop again
					getNotifications();
				}, 4500);
			},
			error: function() {
				getNotifications();
			}
		});
	}
}

// Get friends
var numViewed = 0;
function getFriends() {
	if(hasAccount && userID !== 0) {
		numViewed = 0;
		$.ajax({
			type: 'POST',
			url: userURL+'getFriends',
			data: {"id": userID},
			dataType: "json",
			success: function(data) {
				if(data.error == false) {
					// Get number of online friends
					var o = data.online_friends;
					// Update page with friends number
					if(o > 0) {
						$(".friends-online").addClass("online").find(".online").text(o);
						$("#friends-online span").text(o);
					}
					else {
						$(".friends-online").removeClass("online").find(".online").text(o);
						$("#friends-online span").empty();
					}
					// Loop through all friends
					$("#friend-list").empty();
					var l = 1;
					var t = 1;
					for (i = 0; i < data.friends.length; i++) {
						$("#friend-list").append(`<div class="user-select bigger" id="friend-`+parseInt(i+1)+`" user="`+data.friends[i].id+`"><div id="select-user-pic"><div id="user-pic-wrapper" style="background-color: #`+data.friends[i].bg+`"><img id="user-pic-image" src="`+userURL+`icons/`+data.friends[i].icon+`"></div></div><span class="nickname">`+data.friends[i].name+`</span><br><div class="online-sep"></div></div>`);
						// Check position
						if(l == 1) { // If the user is on the left
							$(".user-select:last-of-type").attr("left", "outer-friends");
						}
						else { // If the user is not on the left
							$(".user-select:last-of-type").attr("left", "friend-"+parseInt(i));
						}
						if(l < 4 && i + 1 < data.friends.length) { // If there is a user to the right
							$(".user-select:last-of-type").attr("right", "friend-"+parseInt(i+2));
						}
						if(t > 1) { // If there is a user above
							$(".user-select:last-of-type").attr("up", "friend-"+parseInt(i-3));
						}
						// Check below the user
						if(i + 3 < data.friends.length) {
							$(".user-select:last-of-type").attr("down", "friend-"+parseInt(i+5));
						}
						// Check if the user is online
						if(data.friends[i].online) {
							$(".user-select:last-of-type .online-sep").addClass("online").html("<div id='online-square'></div> <span>Online</span>");
						}
						else {
							$(".user-select:last-of-type .online-sep").text(data.friends[i].last_online);
						}
						l++;
						if(l == 5) {
							l = 1;
							t++;
						}
						// Check if the user is verified
						if(data.friends[i].verified) {
							$(".user-select:last-of-type .nickname").append(" <img class='verified' src='images/verified.png'>");
						}
						// Check if they are a best friend
						$(".user-select:last-of-type #user-pic-wrapper").prepend('<div class="best-icon" style="display: none;">'+$("#popup-user-wrap .best-icon").html()+"</div>");
						if(data.friends[i].best) {
							$(".user-select:last-of-type .best-icon").show();
						}
						// Check if it is new or not
						if(data.friends[i].viewed == 0) {
							$(".user-select:last-of-type #user-pic-wrapper").prepend('<div class="new-request"></div><div class="new">New</div>');
							numViewed++;
						}
					}
					// Remove the received icon if there are no new friends
					if(numViewed == 0) {
						$("#outer-friends .received").remove();
					}
					// Enable clicking the user
					$(".user-select").click(function() {
						showUser($(this).attr("user"), "friend");
					});
					// Enable getting off the tab
					$("#friend-list").append('<span class="select-next" selectnext="friend-1"></span');
				}
				else {
					if(data.friends = "false") {
						hasFriends = false;
						$(".friends-online").removeClass("online").find(".online").text(0);
						$("#friends-online span").empty();
						$("#outer-friends .received").remove();
						userTab("friends");
					}
					else {
						alert("There was an error.");
					}
				}
				
			},
			error: function() {
				alert("There was an error.");
			}
		});
	}
}

var prevS = "";
// Show a user
function showUser(id, type) {
	if(hasAccount && userID !== 0 && userID !== id && !pressed) {
		pressed = true;
		$.ajax({
			type: "POST",
			url: userURL+"showUser",
			data: {"id": userID, "friend": id, "type": type},
			dataType: "json",
			success: function(data) {
				if(data.error == false) {
					// Push state twice to trick back button
					history.pushState({page: "friend_popup"}, "", "");
					history.pushState({page: "friend_popup"}, "", "");
					// Add in the user information
					$("#popup-user-wrap").css("background-color", "#"+data.bg);
					$("#popup-user-image").attr("src", userURL+"icons/"+data.icon);
					$(".popup-username").text(data.name);
					// If the user is verified
					if(data.verified) {
						// Add the verified tick
						$(".popup-username").append(' <img class="verified" src="images/verified.png">');
					}
					prevS = $(".selected").attr("id");
					$(".selected").removeClass("selected");
					// Check which type of popup it is
					// Show different buttons / info depending
					if(type == "blocked") {
						$("#show-buttons").html(blockedButtons);
						// Add the blocked information
						$("#show-buttons").after('<h3 class="date-blocked" id="header">Date Blocked:</h3><div class="date-blocked-text">'+formatWhen(data.time)+'</div>');
						// If a friend request was sent before they were blocked
						if(data.request) {
							$("#user-popup").prepend('<div class="blocked-method">This user sent you a friend request.</div>');
							$(".date-blocked").addClass("push");
						}
						$("#unblock").click(function() {
							unblock(id);
						});
					}
					else if(type == "code") {
						$("#show-buttons").html(codeButtons);
						$("#show-buttons").after('<h3 class="code" id="header">Friend Code:</h3><div class="code-text">'+data.code+'</div>');
						userCode(id);
					}
					else if(type == "friend") {
						$("#show-buttons").html(friendButtons);
						// Get the method
						var method;
						if(data.method == 1) {
							method = "By exchanging friend codes.";
						}
						else if(data.method == 2) {
							method = "By using the Friend Corner.";
						}
						$("#show-buttons").after('<h3 class="how" id="header">How You Became Friends:</h3><div class="became-friends how-text">'+method+'</div> <h3 class="when" id="header">When You Became Friends:</h3><div class="became-friends when-text">'+formatWhen(data.when)+'</div>');
						// Add online status
						$(".left").after('<div id="online-status" left="best-friend"></div>');
						$("#best-friend, #options").attr("right", "online-status");
						// Check if they are online
						if(data.online) {
							$("#online-status").addClass("online").html('<span><div id="online-square"></div> Online</span>');
						}
						else {
							$("#online-status").html('<span>'+data.last_online+'</span>');
						}
						// Check if they are best friends
						if(data.best) {
							$("#popup-user-wrap .best-icon").show();
							$("#best-friend .fa-star").replaceWith($(".best-icon").html());
						}
						// Check if it has been viewed yet
						if(!data.viewed) {
							$("#popup-user-wrap .best-icon").after('<div class="new">New</div><div class="new-request"></div>');
							numViewed -= 1;
						}
						userFriend(id);
					}
					else if(type == "request") {
						$("#show-buttons").html(requestButtons);
						// Get the method
						var method = "This friend request was sent via ";
						if(data.method == 1) {
							method += "your friend code.";
						}
						else if(data.method == 2) {
							method += "the Friend Corner.";
						}
						// Prepend the friend request text
						$("#user-popup").prepend('<div class="text">You\'ve received a friend request!<br><span class="date">'+formatWhen(data.when)+'</span><br><span class="method">'+method+'</span></div>');
						// Check if it hasn't already been used
						if(!data.viewed) {
							// Add "New"
							$("#popup-user-wrap .best-icon").after('<div class="new">New</div><div class="new-request"></div>');
							// Remove one new request
							requestsNum -= 1;
						}
						userRequest(id);
					}
					else if(type == "sent-request") {
						$("#show-buttons").html(sentButtons);
						// Get the method
						if(data.method == 1) {
							var via = "a friend code";
						}
						else if(data.method == 2) {
							var via = "the Friend Corner";
						}
						// Prepend the method
						$("#show-buttons").after('<div class="sent-by">You sent this request via '+via+'.</div><h3 class="date-sent" id="header">Date Friend Request Sent:</h3><div class="date-text">'+formatWhen(data.when)+'</div>');
						$("#delete").click(function() {
							deleteRequest(id);
						});
					}
					// Fade the overlay in
					$("#overlay").fadeIn("slow", function() {
						// Blur the background
						$(".active-page").addClass("blur");
						// Remove the "New" label
						$(".user-select[user='"+id+"'] .new, .user-select[user='"+id+"'] .new-request").remove();
						// If there are no more requests
						if(type == "request" && requestsNum == 0) {
							$("#user-icon .requests").remove();
						}
						else if(type == "friend" && numViewed == 0) {
							$("#outer-friends .received").remove();
						}
						pressed = false;
					});
				}
				else { // If there is an error
					if(data.friends == false) {
						if(type == "sent-request") {
							alert("You have not sent this user a friend request.");
						}
						else if(type == "received") {
							alert("You have not received a friend request from this user.");
						}
						else if(type == "blocked") {
							alert("You have not blocked this user.");
						}
						else {
							alert("You are not friends with this user.");
						}
					}
					else if(data.self == true) {
						alert("You can not send a friend request to yourself.");
					}
					else {
						alert("There was an error.");
					}
					pressed = false;
				}
				
			},
			error: function() {
				alert("There was an error.");
				pressed = false;
			}
		});
	}
}

// Toggle the user being a best friend
var pressed = false;
function bestFriend(id) {
	if(hasAccount && userID !== 0 && userID !== id && !pressed) {
		var h = $("#best-friend").html();
		pressed = true;
		$("#best-friend").html('<img src="images/loading.gif">');
		$.ajax({
			type: "POST",
			url: userURL+"bestFriend",
			data: {"id": userID, "friend": id},
			dataType: "json",
			success: function(data) {
				if(data.error == false) {
					$("#show-buttons").html(friendButtons);
					if(data.best) {
						$("#popup-user-wrap .best-icon").show();
						$(".user-select[user='"+id+"'] .best-icon").show();
						$("#best-friend .fa-star").replaceWith($(".best-icon").html());
					}
					else {
						$("#popup-user-wrap .best-icon").hide();
						$(".user-select[user='"+id+"'] .best-icon").hide();
					}
					userFriend(id);
				}
				else {
					if(data.friends = "false") {
						alert("You are not friends with this user.");
					}
					else {
						alert("There was an error.");
					}
					$("#best-friend").html(h);
				}
				pressed = false;
			},
			error: function() {
				alert("There was an error.");
				$("#best-friend").html(h);
				pressed = false;
			}
		});
	}
}

// For things that are triggered constantly during showUser
function userFriend(id) {
	$("#best-friend").click(function() {
		bestFriend(id);
	});
	$("#options").click(function() {
		showOptions(id);
	});
	$("#message").click(function() {
		if(confirm("Do you wish to open your messages with "+$(".popup-username").text().trim()+"?")) {
			// Open the user's messages
			openMessages(id);
		}
	});
	$("#best-friend").addClass("selected");
}

function userRequest(id) {
	$("#become-friends").click(function() {
		requestRespond(id, true);
	});
	$("#dont").click(function() {
		requestRespond(id, false);
	});
	$("#block").click(function() {
		blockUser(id, "received");
	});
	$("#become-friends").addClass("selected");
}

function userCode(id) {
	$("#send").click(function() {
		sendFriendRequest(id, "code");
	});
	$("#send").addClass("selected");
}

// Show options for friend
function showOptions(id) {
	if(hasAccount && userID !== 0 && userID !== id && $("#overlay #options").length) {
		// Add the box to the HTML
		$("#overlay").before('<div id="outer-overlay" style="display: none;"><div class="user-box"><div class="options-text">Options</div><div class="options-button" id="delete-friend" down="block-friend">Delete Friend</div><div class="options-button" id="block-friend" down="close-box" up="delete-friend">Block</div><div class="options-button" id="close-box" up="block-friend">Close</div></div></div>');
		// Unselect the selected element
		$(".selected").removeClass("selected");
		$("#delete-friend").addClass("selected");
		$("#outer-overlay").fadeIn("slow", function() {
			// Select the delete friend button
			// Push state twice to trick back button
			history.pushState({page: "outer_popup"}, "", "");
			history.pushState({page: "outer_popup"}, "", "");
			// When the Delete Friend button is clicked
			$("#delete-friend").click(function() {
				deleteFriend(id);
			});
			// When the Block button is clicked
			$("#block-friend").click(function() {
				blockUser(id, "friend");
			});
			// When the close button is clicked
			$("#close-box").click(function() {
				history.back();
			});
		});
	}
}

// Accept or decline a friend request
function requestRespond(id, accept) {
	if(hasAccount && userID !== 0 && userID !== id && !pressed) {
		pressed = true;
		if(accept || confirm("This friend request will be deleted.")) {
			$.ajax({
				type: "POST",
				url: userURL+"requestRespond",
				data: {"id": userID, "friend": id, "accept": accept},
				dataType: "json",
				success: function(data) {
					if(data.error == false) {
						if(accept) {
							alert("You are now friends.");
						}
						else {
							alert("The friend request was deleted.");
						}
						getRequests("received");
						history.back();
					}
					else {
						alert("There was an error.");
					}
					pressed = false;
				},
				error: function() {
					alert("There was an error.");
					pressed = false;
				}
			});
		}
		else {
			pressed = false;
		}
	}
}

// Delete a friend request
function deleteRequest(id) {
	if(hasAccount && userID !== 0 && userID !== id && !pressed) {
		pressed = true;
		if(confirm("This friend request will be deleted.")) {
			$.ajax({
				type: "POST",
				url: userURL+"deleteRequest",
				data: {"id": userID, "friend": id},
				dataType: "json",
				success: function(data) {
					if(data.error == false) {
						alert("The friend request was deleted.");
						history.back();
						history.back();
						getRequests("sent");
					}
					else {
						alert("There was an error.");
					}
					pressed = false;
				},
				error: function() {
					alert("There was an error.");
					pressed = false;
				}
			});
		}
		else {
			pressed = false;
		}
	}
}

// To block a user
function blockUser(id, type) {
	if(hasAccount && userID !== 0 && userID !== id && !pressed) {
		pressed = true;
		if(confirm("You will not receive friend requests or messages sent to you by blocked users, and you will not encounter those users in the Friend Corner.") && (type !== "friend" || confirm("You are friends with this user.\nBlocking them will automatically remove them from your friend list."))) {
			$.ajax({
				type: "POST",
				url: userURL+"blockUser",
				data: {"id": userID, "user": id, "type": type},
				dataType: "json",
				success: function(data) {
					if(data.error == false) {
						alert("Successfully blocked.");
						if(type == "received") {
							history.back();
							getRequests("received");
						}
						else if(type == "friend") {
							hideOptions();
						}
					}
					else {
						alert("There was an error.");
					}
					pressed = false;
				},
				error: function() {
					alert("There was an error.");
					pressed = false;
				}
			});
		}
		else {
			pressed = false;
		}
	}
}

// Delete a friend
function deleteFriend(id) {
	if(hasAccount && userID !== 0 && userID !== id && !pressed) {
		pressed = true;
		if(confirm("Are you sure you want to delete this friend?")) {
			$.ajax({
				type: "POST",
				url: userURL+"deleteFriend",
				data: {"id": userID, "friend": id},
				dataType: "json",
				success: function(data) {
					if(data.error == false) {
						alert("The friend was deleted.");
						hideOptions();
					}
					else {
						if(data.friends == false) {
							alert("You are not friends with this user.");
						}
						else {
							alert("There was an error.");
						}
					}
					pressed = false;
				},
				error: function() {
					alert("There was an error.");
					pressed = false;
				}
			});
		}
		else {
			pressed = false;
		}
	}
}

// Hide options for blocking/deleting
function hideOptions() {
	// Fades out the options overlay
	$("#outer-overlay").fadeOut("slow", function() {
		// Removes the overlay
		$(this).remove();
	});
	// Fades out the main overlay
	$("#overlay").fadeOut("slow", function() {
		resetPopup();
	});
	// Removes the blur
	$(".active-page").removeClass("blur");
	$(".selected").removeClass("selected");
	// Gets friends again
	userTab("friends");
	$("#outer-friends").addClass("selected");
}

// Manage Blocked-User List
function blockedList() {
	if(userID !== 0 && hasAccount) {
		$("#second-page").fadeOut("fast", function() {
			$.ajax({
				type: 'POST',
				url: userURL+'getBlocked',
				data: {"id":userID},
				dataType: "json",
				success: function(data) {
					if(data.error == true) {
						alert("An error occurred.");
						$("#second-page").fadeIn("fast");
					}
					else {
						history.pushState({page: "user", "tab": "outer-usettings"}, "", "");
						blockedPage();
						if(data.blocked == false) {
							$("#blocked-page").addClass("none").html('<span class="no-requests">There are no blocked users at this time.</span>');
						}
						else {
							var l = 1;
							var t = 1;
							for (i = 0; i < data.users.length; i++) {
 								$("#blocked-page").append(`<div class="user-select" id="blocked-`+parseInt(i+1)+`" user="`+data.users[i].id+`"><div id="select-user-pic"><div id="user-pic-wrapper" style="background-color: #`+data.users[i].bg+`"><img id="user-pic-image" src="`+userURL+`icons/`+data.users[i].image+`"></div></div><span class="nickname">`+data.users[i].name+`</span><br></div>`);
								// Check position
								if(l > 1) { // If the user is on the left
									$(".user-select:last-of-type").attr("left", "blocked-"+parseInt(i));
								}
								if(l < 5 && i + 1 < data.users.length) { // If there is a user to the right
									$(".user-select:last-of-type").attr("right", "blocked-"+parseInt(i+2));
								}
								if(t > 1) { // If there is a user above
									$(".user-select:last-of-type").attr("up", "blocked-"+parseInt(i-4));
								}
								if(i + 4 < data.users.length) { // If there is a user below
									$(".user-select:last-of-type").attr("down", "blocked-"+parseInt(i+6));
								}
								l++;
								if(l == 6) {
									l = 1;
									t++;
								}
								// Check if the user is verified
								if(data.users[i].verified) {
									$(".user-select:last-of-type .nickname").append(" <img class='verified' src='images/verified.png'>");
								}
								$(".user-select:last-of-type #user-pic-wrapper").prepend('<div class="blocked-bg"></div><div class="blocked-text">'+data.users[i].time+'</div>');
							}
							$(".user-select").click(function() {
								showUser($(this).attr("user"), "blocked");
							});
							$(".selected").removeClass("selected");
							$(".user-select:first-of-type").addClass("selected");
						}
						setTimeout(function() {
							$("#second-page").fadeIn("fast");
						}, 300);
						
					}
				},
				error: function() {
					alert("An error occurred.");
					$("#second-page").fadeIn("fast");
				}
			});
		});
	}
}

// Unblock a user
function unblock(id) {
	if(hasAccount && userID !== 0 && userID !== id && !pressed) {
		pressed = true;
		if(confirm("This user will be removed from your blocked-user list.")) {
			$.ajax({
				type: "POST",
				url: userURL+"unblock",
				data: {"id": userID, "user": id},
				dataType: "json",
				success: function(data) {
					if(data.error == false) {
						alert("This user has been unblocked.");
						history.back();
						blockedList();
					}
					else {
						if(data.blocked == false) {
							alert("You have not blocked this user.");
						}
						else {
							alert("There was an error.");
						}
					}
					pressed = false;
				},
				error: function() {
					alert("There was an error.");
					pressed = false;
				}
			});
		}
		else {
			pressed = false;
		}
	}
}

// Get online status of friends again
function onlineFriends() {
	if(hasAccount && userID !== 0) {
		$.ajax({
			type: 'POST',
			url: userURL+'onlineFriends',
			data: {"id": userID},
			dataType: "json",
			success: function(data) {
				if(data.error == false) {
					// Get number of online friends
					var o = data.online_friends;
					// Update page with friends number
					if(o > 0) {
						$(".friends-online").addClass("online").find(".online").text(o);
						$("#friends-online span").text(o);
						if(data.online_notification) {
							$(".notification-message").addClass("friend").text("Friends online: "+o);
							$(".inner-message").hide();
							$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
							setTimeout(function() {
								// Fade the notification back out after a few seconds
								$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
								resetNotifications();
								getNotifications();
							}, 4000);
						}
					}
					else {
						$(".friends-online").removeClass("online").find(".online").text(o);
						$("#friends-online span").empty();
						getNotifications();
					}
					// Loop through all friends
					var l = 1;
					var t = 1;
					for (i = 0; i < data.friends.length; i++) {
						// Check if the user is online
						if(data.friends[i].online) {
							$(".user-select[user='"+data.friends[i].id+"'] .online-sep").addClass("online").html("<div id='online-square'></div> <span>Online</span>");
						}
						else {
							$(".user-select:last-of-type .online-sep").text(data.friends[i].last_online+" ago");
						}
					}
				}
				else {
					if(data.friends = "false") {
						hasFriends = false;
						$(".friends-online").removeClass("online").find(".online").text(0);
						$("#friends-online span").empty();
						$("#outer-friends .received").remove();
						userTab("friends");
					}
					else {
						alert("There was an error.");
					}
					getNotifications();
				}
			},
			error: function() {
				alert("There was an error.");
				getNotifications();
			}
		});
	}
}

// Load messages
// Get the tab to go back to
var tabBack = "outer-messages";
function loadMessages(id) {
	id = typeof id !== 'undefined' ? id : "";
	tabBack = "outer-messages";
	if(userID !== 0 && hasAccount) {
		$.ajax({
			type: 'POST',
			url: userURL+'getMessages',
			data: {"id": userID, "user": id},
			dataType: "json",
			success: function(data) {
				if($("#messages-main").length) {
					handleMessages(data, "load", id);
				}
			},
			error: function() {
				alert("There was an error.");
			}
		});
	}
}

var checkForOlder = true;
// Show all the exchanged messages
function showMessages(id) {
	if(userID !== 0 && hasAccount) {
		if(!$("#message-enter").length || $("#message-enter").val().length == 0 || confirm("The message you entered will be discarded.")) {
			var s = $(".selected").attr("id");
			$("#messages-main").html('<img class="loading-icon" src="images/loading.gif">');
			$(".messaging-name").text("Loading messages...");
			$(".details").removeClass("visible");
			$(".last-active").empty();
			$(".inner").removeClass("inner-active");
			$("#"+id).addClass("inner-active");
			// Reset variable
			checkForOlder = true;
			// Set the user information
			$("#messages-main").attr("user", id);
			$.ajax({
				type: 'POST',
				url: userURL+'showMessages',
				data: {"id": userID, "user": id},
				dataType: "json",
				success: function(data) {
					// If there is no error
					if(data.error == false) {
						// If the loaded tab is the selected one (for spamming the up and down buttons)
						if($(".inner-active").attr("id") == data.uid) {
							// Check if the selected item exists
							$(".selected").removeClass("selected");
							if($("#"+s).length) {
								$("#"+s).addClass("selected");
							}
							else {
								if(!$("#search-messages.selected").length) {
									$("#messages-"+id).addClass("selected");
								}
							}
							// If the user isn't friends anymore
							$(".messaging-name").text(data.name);
							// If the user is verified
							if(data.verified) {
								$(".messaging-name").append(' <img class="verified" src="images/verified.png">');
							}
							// Get the users online status
							if(data.online) {
								$(".last-active").text("Active now");
							}
							else if(!data.friends || data.last_online == "SwitchBru") {
								$(".last-active").text("SwitchBru");
							}
							else {
								$(".last-active").text("Active "+data.last_online+" ago");
							}
							$(".loading-icon").remove();
							for (i = 0; i < data.messages.length; i++) {
								// Store the array in a variable
								var msg = data.messages[i];
								// Prepend the message to the HTML
								var duplicate = false;
								// If there is already a message nearby
								if(($(".message-wrapper").first().hasClass("message-received") && $(".message-wrapper").last().hasClass("message-received") && msg.received || $(".message-wrapper").first().hasClass("message-sent") && $(".message-wrapper").last().hasClass("message-sent") && msg.sent) && !msg.show_time && msg.timestamp - 900 > data.messages[i].timestamp) {
									// Add the message next to the other one
									$(".message-wrapper").first().find(".inner-wrap").prepend('<div class="messages" id="message-'+msg.id+'">'+b64Decode(msg.msg)+'</div>');
									duplicate = true;
								}
								else {
									// Insert the message
									$("#messages-main").prepend('<div class="message-wrapper"><div class="inner-wrap"><div class="messages" id="message-'+msg.id+'">'+b64Decode(msg.msg)+'</div></div></div>');
									// If the time should be added before the message
									if(msg.show_time) {
										$("#message-"+msg.id).parent().parent().before('<div class="date">'+formatDateTime(msg.timestamp)+'</div>');
									}
								}
								// Color the message box
								if(msg.received && !duplicate) {
									$("#message-"+msg.id).parent().parent().addClass("message-received").prepend('<div class="messages-icon"><div class="messages-icon-wrap" style="background-color: #'+data.bg+'"><img height="45" class="messages-icon-image" src="'+userURL+'icons/'+data.icon+'"></div></div>');
								}
								else if(msg.sent) {
									if(!duplicate) {
										$("#message-"+msg.id).parent().parent().addClass("message-sent");
									}
									// If the message has been seen
									if(msg.seen && i == 0) {
										$("#message-"+msg.id).after('<div class="seen">Seen</div>');
									}
								}
								$("#"+id).next(".received").remove();
								$("#"+id).find(".message-tab-prev").removeClass("bold");
							}
							fixMessages();
							
							var goUp = true;
							// If there are no messages
							if(data.messages.length == 0) {
								// Get the right image
								var friends_image = "friends_light";
								if(theme == 1 || (customF == 1 && theme == 2)) {
									friends_image = "friends_dark";
								}
								$("#messages-main").html('<img class="try-sending" src="images/'+friends_image+'_alt.png"><div class="start-conversation">Start a conversation with '+data.name+'!</div>');
								goUp = false;
							}
							// If they are typing
							if(data.typing) {
								typingIcon(userURL+"icons/"+data.icon, "background-color: "+data.bg);
							}
							
							// Check if they are friends
							if(data.friends) {
								// Add the send message box
								$("#messages-main").append('<div id="message-create"><span id="message-scroll" left="messages-'+id+'"></span><form onsubmit="return sendMessage()"><input autocomplete="off" id="message-enter" placeholder="Enter a message..." left="messages-'+id+'" maxlength="300" tabindex="-1" type="text"><div class="disabled" id="send-message" onclick="sendMessage()" left="message-enter"><div class="padding"><span>Send</span></div></div><span class="count"><span>0</span>/300</span></form></div><span class="select-next" selectnext="message-enter"></span>');
								if(goUp) {
									// Allow them to go up
									$("#message-enter, #send-message").attr("up", "message-scroll");
								}
							}
							else {
								var nr = '<span>You can not reply to this conversation. <a id="learn-more" left="messages-'+id+'" up="message-scroll">Learn more</a></span>';
								var sn = "learn-more";
								if(id == "switchbruofficial" && data.r1 && data.r2) {
									nr = '<input type="submit" id="response-1" value="'+data.r1+'" onclick="sendResponse(this.id)" tabindex="-1" left="messages-'+id+'" right="response-2" up="message-scroll"><input type="submit" id="response-2" value="'+data.r2+'" onclick="sendResponse(this.id)" tabindex="-1" left="response-1" up="message-scroll">';
									sn = "response-1";
								}
								// Add the "can't reply" message
								$("#messages-main").append('<div class="no-reply" id="message-create"><span id="message-scroll" left="messages-'+id+'" down="learn-more"></span>'+nr+'</div><span class="select-next" selectnext="'+sn+'"></span>');
								// When "Learn more" is clicked
								$("#learn-more").click(function() {
									// If it is the official SwitchBru account
									if(id == "switchbruofficial") {
										alert("You can not respond to the official SwitchBru account until they send you messages.");
									}
									else {
										alert("You can not message users who you are no longer friends with, or if they have blocked you.");
									}
								});
							}
							// Add class to last message
							$(".message-wrapper").last().addClass("last");
							// Enable the back button
							history.pushState({page: "user", tab: tabBack}, "", "");
							history.pushState({page: "same", tab: $("#messages-"+id).attr("id")}, "", "");
							// On key press in message box
							$("#message-enter").keyup(function() {
								// Enable / disable send button
								var count = $(this).val().length;
								if(count > 0) {
									$("#send-message").removeClass("disabled");
									$("#message-enter").attr("right", "send-message");
								}
								else {
									$("#send-message").addClass("disabled");
									$("#message-enter").removeAttr("right");
								}
								// Change character count 
								if(count > 300) {
									count = 300;
								}
								$(".count span").text(count);
								isTyping();
							});
							// Scroll to the bottom
							if($(".message-wrapper").length && $(".message-wrapper").last().length) {
								$("#messages-main").scrollTop($("#messages-main").scrollTop() - $("#messages-main").offset().top + $(".message-wrapper").last().find(".messages").last().offset().top);
							}
							// Check scrolling
							$("#messages-main").scroll(function() {
								seenMessages();
								if ($(this).scrollTop() <= 0) {
									loadMoreMessages();
								}
							});
							// Show details icon
							$(".details").addClass("visible");
						}
					}
					else {
						alert("There was an error.");
						$(".messaging-name").empty();
						$("#messages-main").empty();
					}
				},
				error: function() {
					alert("There was an error.");
					$(".messaging-name").empty();
					$("#messages-main").empty();
				}
			});
		}
		else {
			// Re-select the same tab
			$(".selected").removeClass("selected");
			$(".inner-active").parent().addClass("selected");
		}
	}
}

// Load more messages after scrolling up
function loadMoreMessages() {
	var id = $("#messages-main").attr("user");
	if(userID !== 0 && hasAccount && $("#messages-main").length && !$(".loading-more").length && id !== "switchbruofficial" && $(".message-wrapper").length && checkForOlder && navigator.onLine) {
		$("#messages-main").prepend('<div class="loading-more"><img src="images/loading.gif"></div>');
		$(".loading-more").hide().fadeIn("slow");
		var last = $(".messages").first().attr("id");
		last = last.replace("message-", "");
		
		// This is all basically the same as showMessages(), but I'm leaving it duplicated to save time!
		$.ajax({
			type: 'POST',
			url: userURL+'showMessages',
			data: {"id": userID, "user": id, "last": last},
			dataType: "json",
			success: function(data) {
				// Remove loading icon
				$(".loading-more").remove();
				// If there is no error
				if(data.error == false) {
					// Make sure the tab is correct
					if($(".inner-active").attr("id") == data.uid) {
						for (i = 0; i < data.messages.length; i++) {
							// Store the array in a variable
							var msg = data.messages[i];
							// Prepend the message to the HTML
							var duplicate = false;
							// If there is already a message nearby
							if(($(".message-wrapper").first().hasClass("message-received") && $(".message-wrapper").last().hasClass("message-received") && msg.received || $(".message-wrapper").first().hasClass("message-sent") && $(".message-wrapper").last().hasClass("message-sent") && msg.sent) && !msg.show_time && msg.timestamp - 900 > data.messages[i].timestamp) {
								// Add the message next to the other one
								$(".message-wrapper").first().find(".inner-wrap").prepend('<div class="messages" id="message-'+msg.id+'">'+b64Decode(msg.msg)+'</div>');
								duplicate = true;
							}
							else {
								// Insert the message
								$("#messages-main").prepend('<div class="message-wrapper"><div class="inner-wrap"><div class="messages" id="message-'+msg.id+'">'+b64Decode(msg.msg)+'</div></div></div>');
								// If the time should be added before the message
								if(msg.show_time) {
									$("#message-"+msg.id).parent().parent().before('<div class="date">'+formatDateTime(msg.timestamp)+'</div>');
								}
							}
							// Color the message box
							if(msg.received && !duplicate) {
								$("#message-"+msg.id).parent().parent().addClass("message-received").prepend('<div class="messages-icon"><div class="messages-icon-wrap" style="background-color: #'+data.bg+'"><img height="45" class="messages-icon-image" src="'+userURL+'icons/'+data.icon+'"></div></div>');
							}
							else if(msg.sent) {
								if(!duplicate) {
									$("#message-"+msg.id).parent().parent().addClass("message-sent");
								}
							}
							$("#"+id).next(".received").remove();
							$("#"+id).find(".message-tab-prev").removeClass("bold");
						}
						if(data.messages.length == 0) {
							checkForOlder = false;
						}
						else {
							if(data.remove_time) {
								$("#message-"+last).parent().parent().prevAll(".date").first().remove();
							}
							// This does NOT scroll neatly but I can't do anything about that
							$("#messages-main").animate($("#message-"+last).offset().top - 400);
							fixMessages();
						}
					}
				}
				else {
					alert("There was an error.");
				}
			},
			error: function() {
				alert("There was an error.");
			}
		});
	}
}

// Do some mahor fixes to messages
function fixMessages() {
	$(".message-wrapper").each(function() {
		// If it is a sent message
		if($(this).hasClass("message-sent")) {
			// Check if the next element is a sent message
			if($(this).next(".message-sent").length) {
				// Get the message(s) and add them to the correct place
				$(this).next(".message-sent").find(".inner-wrap").prepend($(this).find(".inner-wrap").html());
				// Remove the wrapper
				$(this).remove();
			}
		}
		// Same as above
		if($(this).hasClass("message-received")) {
			if($(this).next(".message-received").length) {
				$(this).next(".message-received").find(".inner-wrap").prepend($(this).find(".inner-wrap").html());
				$(this).remove();
			}
		}
	});
}

// Send a seen request
var seen = false;
function seenMessages() {
	// Get the users ID
	var uid = $("#messages-main").attr("user");
	// Make sure the user is logged in and that there is an unread message - this took longer than I should admit to fix and it was a lot better before I messed it up
	if(userID !== 0 && hasAccount && !seen && $("#"+uid+" + div.received").length && isVisible($(".message-wrapper.message-received").last())) {
		// Remove the seen stuff
		$("#"+uid).next("div").remove();
		$("#"+uid+" .message-tab-prev").removeClass("bold");
		// Get the users UID
		var uid = $("#messages-main").attr("user");
		// Mark it as seen so it doesn't flash again
		seen = true;
		$.ajax({
			type: 'POST',
			url: userURL+'seenMessages',
			data: {"id": userID, "user": uid},
			dataType: "json",
			success: function(data) {
				if(data.error == false) {
					// ?
				}
				seen = false;
			},
			error: function() {
				seenMessages();
			}
		});
	}
}

// Search users for messages
function searchMessages() {
	// Check for key presses
	$("#search-messages").keyup(function() {
		// Remove line breaks
		$(this).val($(this).val().replace(/\n/g, ""));
		// Get the searched text
		var search = $(this).val().toLowerCase();
		// Get the text length
		var count = search.length;
		// Unfind all previously searched strings
		$(".outer.found").removeClass("found");
		$(this).removeAttr("down");
		$(".no-results").remove();
		// If they entered something
		if(count > 0) {
			$(".active-page .menu").addClass("searching");
			// Check if there is a user with that name
			$(".message-search-name").filter(function(){
				return $(this).text().indexOf(search) == 0 
			}).parent().parent().addClass("found");
			
			// If anything was found
			if($(".found").length) {
				// Allow the search box to go down
				$(this).attr("down", $(".found").first().attr("id"));
			}
			else {
				// No results
				$(this).after('<span class="no-results">No results to show</span>');
			}
			// Loop through the found searches
			$(".outer.found").each(function() {
				$(this).removeAttr("up").removeAttr("down");
				$(this).attr("up", $(this).prevAll("#search-messages, .found").attr("id"));
				$(this).attr("down", $(this).nextAll(".found").attr("id"));
			});
		}
		else {
			// If nothing is entered, reset the sidebar
			$(".active-page .menu").removeClass("searching");
			$(this).attr("down", $(".active-page .outer").first().attr("id"));
			resetMessageUsers();
		}
	});
}

// Send message
var sent = false;
function sendMessage() {
	if(userID !== 0 && hasAccount && !sent) {
		var uid = $("#messages-main").attr("user");
		var message = $("#message-enter").val();
		if(message.length > 0) {
			sent = true;
			$.ajax({
				type: 'POST',
				url: userURL+'sendMessage',
				data: {"id": userID, "user": uid, "message": b64Encode(message)},
				dataType: "json",
				success: function(data) {
					// If there is no error
					if(data.error == false) {
						// Reset the message box
						$("#message-enter").val("");
						$(".count span").text(0);
						if($("#send-message").hasClass("selected")) {
							$("#send-message").removeClass("selected");
							$("#message-enter").addClass("selected");
						}
						$("#message-enter").removeAttr("right");
						$("#send-message").addClass("disabled");
						// Set variable
						// If the date should be shown (a new section)
						var newMsg = '<div class="message-wrapper message-sent last"><div class="inner-wrap"><div class="messages" id="message-'+data.id+'">'+b64Decode(data.msg)+'</div></div></div>';
						var msgDate = '<div class="date">'+formatDateTime(data.timestamp)+'</div>';
						// Remove seen
						$(".seen").remove();
						$(".last").removeClass("last");
						
						// Check how to remove the typing icon and do it
						var wasTyping = false;
						if($("#message-typing").length) {
							wasTyping = true;
						}
						if($("#message-typing").prev(".messages").length || $("#message-typing").next(".messages").length) {
							$("#message-typing").remove();
						}
						else {
							$("#message-typing").parent().parent().remove();
						}
						
						// Reset last
						$(".message-wrapper").last().addClass("last");
						
						// If the page is blank
						if($(".try-sending").length) {
							// Remove the no conversation stuff
							$(".try-sending, .start-conversation").remove();
							// Prepend the message to the space
							$("#messages-main").prepend(msgDate+newMsg);
							$("#message-enter, #send-message").attr("up", "message-scroll");
						}
						else if(data.show_date) {
							newMsg = msgDate+newMsg;
							$(".last").after(newMsg).removeClass("last");
						}
						else {
							// If the last message was sent
							if($(".message-wrapper").last().hasClass("message-sent")) {
								// Append the message
								$(".message-wrapper").last().find(".inner-wrap").append('<div class="messages" id="message-'+data.id+'">'+b64Decode(data.msg)+'</div>');
							}
							else if($(".message-wrapper").last().hasClass("message-received")) {
								$(".last").after(newMsg).removeClass("last");
							}
						}
						messagesBottom();
						
						// Check if they were typing
						if(wasTyping) {
							$(".last").removeClass("last");
							$(".seen").remove();
							// Prepare the typing message HTML
							var newMsg = '<div class="message-wrapper message-received last"><div class="messages-icon"><div class="messages-icon-wrap" style="'+$(".inner-active").find(".messages-icon-wrap").attr("style")+'"><img height="45" class="messages-icon-image" src="'+$(".inner-active").find(".messages-icon-image").attr("src")+'"></div></div><div class="inner-wrap"><div class="messages" id="message-typing"><div class="typing-icon">• • •</div></div></div></div>';
							
							// If there aren't any messages already
							if($(".message-wrapper").last().hasClass("message-sent")) {
								// If the last message was sent, append the message separately
								$(".message-wrapper").last().after(newMsg);
							}
							else if($(".message-wrapper").last().hasClass("message-received")) {
								// If the last message was received, combine them
								$(".message-wrapper").last().addClass("last").find(".inner-wrap").append('<div class="messages" id="message-typing"><div class="typing-icon">• • •</div></div>');
							}
							// If the page is scrolled to the bottom
							if(isVisible($(".message-wrapper").last().find(".messages").last())) {
								// Scroll it to the bottom again
								messagesBottom();
							}
							$("#"+data.uid+" .message-tab-prev").html('<div class="typing-wrap"><div class="typing-icon">• • •</div></div>');
						}
						else {
							// Set the sidebar tab with the correct message
							$("#"+data.uid+" .message-tab-prev").html("You: "+b64Decode(data.msg));
						}
						// Move the user to the top of the sidebar and scroll up
						$(".inner-active").parent().detach().insertAfter("#search-messages");
						$("#second-page .menu").animate({
							scrollTop: 0
						}, 400);
					}
					else {
						// If there is an error
						alert("Could not message the user.");
						$("#message-enter").val("");
						showMessages(uid);
					}
					sent = false;
				},
				error: function() {
					alert("Could not message the user.");
					sent = false;
				}
			});
		}
	}
	// Reset some things
	$("input, textarea").blur();
	XClosed = false;
	return false;
}

// Send default response
function sendResponse(rID) {
	if(userID !== 0 && hasAccount && !sent) {
		sent = true;
		$.ajax({
			type: 'POST',
			url: userURL+'sendResponse',
			data: {"id": userID, "response": rID},
			dataType: "json",
			success: function(data) {
				// If there is no error
				if(data.error == false) {
					// Set the sidebar tab with the correct message
					$("#switchbruofficial .message-tab-prev").html("You: "+b64Decode(data.msg));
					// Set variables
					var newMsg = '<div class="message-wrapper message-sent last"><div class="inner-wrap"><div class="messages" id="message-'+data.id+'-reply">'+b64Decode(data.msg)+'</div></div></div>';
					var msgDate = '<div class="date">'+formatDateTime(data.timestamp)+'</div>';
					// If the date should be shown
					if(data.show_date) {
						newMsg = msgDate+newMsg;
					}
					// Add the message
					$(".last").after(newMsg).removeClass("last");
					$(".selected").removeClass("selected");
					// Remove buttons
					$(".no-reply").html('<span id="message-scroll" left="messages-switchbruofficial" down="learn-more"></span><span>You can not reply to this conversation. <a class="selected" id="learn-more" left="messages-switchbruofficial" up="message-scroll">Learn more</a></span>')
					messagesBottom();
					// When "Learn more" is clicked
					$("#learn-more").click(function() {
						alert("You can not respond to the official SwitchBru account until they send you messages.");
					});
					$(".inner-active").parent().detach().insertAfter("#search-messages");
					$("#second-page .menu").animate({
						scrollTop: 0
					}, 400);
					// Append the responses response
					setTimeout(function() {
						$(".last").removeClass("last");
						// Prepare the response message
						var newMsg = '<div class="message-wrapper message-received last"><div class="messages-icon"><div class="messages-icon-wrap" style="'+$(".inner-active").find(".messages-icon-wrap").attr("style")+'"><img height="45" class="messages-icon-image" src="'+$(".inner-active").find(".messages-icon-image").attr("src")+'"></div></div><div class="inner-wrap"><div class="messages" id="message-'+data.id+'-final">Thank you for replying!</div></div></div>';
						// Add the reply
						$(".message-wrapper").last().after(newMsg);
						// If the page is scrolled to the bottom
						if(isVisible($(".message-wrapper").last().find(".messages").last())) {
							// Scroll it to the bottom again
							messagesBottom();
						}
						$("#switchbruofficial .message-tab-prev").html('Thank you for replying!');
					}, 1000);
				}
				else {
					// If there is an error
					alert("Could not send the response.");
					showMessages("switchbruofficial");
				}
				sent = false;
			},
			error: function() {
				alert("Could not send the response.");
				sent = false;
			}
		});
	}
}

// Refresh messages constantly
function refreshMessages() {
	if(userID !== 0 && hasAccount && $("#messages-main").length && navigator.onLine) {
		sent = false;
		$.ajax({
			type: 'POST',
			url: userURL+'updateMessages',
			data: {"id": userID, "user": $("#messages-main").attr("user")},
			dataType: "json",
			success: function(data) {
				handleMessages(data, "update");
			},
			error: function() {
				setTimeout(function() {
					refreshMessages();
				}, 2800);
			}
		});
	}
}

// Handle main messages page for loading and updating
function handleMessages(data, mode, id) {
	id = typeof id !== 'undefined' ? id : "";
	var searching = false;
	if(mode == "update") {
		var cSelected = $(".selected").attr("id");
		var refresh = false;
		if($("#search-messages").length && $("#search-messages").val().length) {
			searching = true;
			var search = $("#search-messages").val();
			$(".found").each(function() {
				var i = $(this).attr("id");
				$(".active-page .menu").append('<found user="'+i+'" />');
				if($(this).attr("up")) {
					$("found[user='"+i+"']").attr("up", $(this).attr("up"));
				}
				if($(this).attr("down")) {
					$("found[user='"+i+"']").attr("down", $(this).attr("down"));
				}
			});
		}
	}
	var touchedTab = "";
	var scrollPos = $(".active-page .menu").scrollTop();
	if(data.error == false && $("#messages-main").length) {
		// Remove the loading icon
		if(mode == "load") {
			$("#second-page .menu").empty();
		}
		else if(mode == "update") {
			// Store all the users in a hidden div
			$("body").append('<div class="prev-messages">'+$(".active-page .menu").html()+'</div>');
			// Get the touched tab
			if($("#second-page .outer.touched").length) {
				touchedTab = $("#second-page .outer.touched").attr("id");
			}
			// Remove them
			$("#second-page .menu .outer").remove();
		}
		
		var selectedUser = "";
		// Loop through the users
		for (i = 0; i < data.messages.length; i++) {
			// Set variable for current message
			var msg = data.messages[i];
			// Check if the user is online
			var msgOnline = "";
			if(msg.online) {
				msgOnline = '<div class="messages-online"></div>';
			}
			// Set the variables
			var bg, icon, usersName, usersUID, verified;
			bg = usersName = usersUID = "";
			usersUID = msg.uid;
			verified = false;
			if(mode == "load") {
				bg = "background-color: #"+msg.bg;
				icon = userURL+`icons/`+msg.icon;
				usersName = msg.name;
				if(msg.verified) {
					verified = true;
				}
			}
			else if(mode == "update" && $(".prev-messages .outer#messages-"+usersUID).length) {
				var $p = $(".prev-messages .outer#messages-"+usersUID);
				bg = $p.find(".messages-icon-wrap").attr("style");
				icon = $p.find(".messages-icon-image").attr("src");
				usersName = $p.find(".message-tab-name .name").text();
				if($p.find(".verified").length) {
					verified = true;
				}
			}
			else {
				icon = "images/loading.gif";
				reloadUser(usersUID);
			}
			// Set the HTML for the new tab
			var tabCode = `<div class="outer" id="messages-`+usersUID+`" onclick="touched(this.id)"><div class="inner" id="`+usersUID+`" onclick="showMessages(this.id)">&nbsp;&nbsp;<div class="messages-icon"><div class="messages-icon-wrap" style="`+bg+`"><img height="40" class="messages-icon-image" src="`+icon+`"></div>`+msgOnline+`</div><div class="message-tab-name"><span class="name">`+usersName+`</span><br><div class="message-tab-prev"></div></div><div class="message-search-name">`+usersName.toLowerCase()+`</div></div></div>`;
			// Add the new tab
			$("#second-page .menu").append(tabCode);
			// Check if there is a previous message
			if(msg.last) {
				// Decode the message and place it in the HTML
				$("#second-page .inner").last().find(".message-tab-prev").html(b64Decode(msg.last));
			}
			// Check if the message is seen or not
			if(msg.unread && ((mode == "update" && !seen) || mode == "load")) {
				// Add the dot
				$("#second-page .inner").last().after('<div class="received"></div>');
				// Make the preview text bold
				$("#second-page .inner").last().find(".message-tab-prev").addClass("bold");
			}
			// Check if the user is verified
			if(verified) {
				$("#second-page .inner").last().find(".message-tab-name br").before(' <img class="verified" src="images/verified.png">');
			}
			// Check if there is a user below
			if(i + 1 < data.messages.length && !searching) {
				// Set down to the below user
				$("#second-page .outer").last().attr("down", "messages-"+data.messages[i+1].uid);
			}
			// Check if there is a user above (janky)
			if($("#second-page .outer[down='messages-"+usersUID+"']").length && !searching) {
				// Set up to the user above	
				$("#second-page .outer").last().attr("up", "messages-"+data.messages[i-1].uid);
			}
			// If the user was the chosen user
			if(msg.found && mode == "load") {
				// Store the user's UID
				selectedUser = usersUID;
			}
			// If the user is the open tab
			var showTyping = true;
			if(usersUID == $("#messages-main").attr("user") && mode == "update") {
				if($("#messages-main .loading-icon").length) {
					$(".last-active").empty();
				}
				else if(msg.online) {
					$(".last-active").text("Active now");
				}
				else if(!msg.friends || msg.last_active == "SwitchBru") {
					$(".last-active").text("SwitchBru");
				}
				else {
					$(".last-active").text("Active "+msg.last_active+" ago");
				}
				// If the new message has been seen
				if(msg.seen) {
					// If it has not already been marked as seen
					if(!$(".message-sent.last .messages").last().next(".seen").length) {
						// Remove the previous seen element
						$(".seen").remove();
						// If the page is scrolled to the bottom
						if(isVisible($(".message-wrapper").last().find(".messages").last())) {
							// Add seen
							$(".message-sent.last .messages").last().after('<div class="seen">Seen</div>');
							// Scroll it to the bottom again
							$("#messages-main").animate({
								scrollTop: $("#messages-main").scrollTop() - $("#messages-main").offset().top + $(".message-wrapper").last().find(".messages").last().offset().top
							}, 300);
						}
						else {
							// Add seen anyway
							$(".message-sent.last .messages").last().after('<div class="seen">Seen</div>');
						}
					}
				}
				// If there are new messages
				if(msg.new_messages) {
					// Loop through the messages
					for(x = 0; x < msg.new_messages.length; x++) {
						var m = msg.new_messages[x];
						// If the message isn't already displayed
						if(!$("#message-"+m.id).length) {
							// Remove things
							$(".last").removeClass("last");
							$(".seen").remove();
							// Prepare the messages HTML
							var newMsg = '<div class="message-wrapper message-received last"><div class="messages-icon"><div class="messages-icon-wrap" style="'+bg+'"><img height="45" class="messages-icon-image" src="'+icon+'"></div></div><div class="inner-wrap"><div class="messages" id="message-'+m.id+'">'+b64Decode(m.msg)+'</div></div></div>';
							
							// If the time should be shown
							if(m.show_time || $(".try-sending").length) {
								newMsg = '<div class="date">'+formatDateTime(m.timestamp)+'</div>'+newMsg;
							}
							// If there aren't any messages already
							if($(".try-sending").length) {
								// Remove the no conversation stuff
								$(".try-sending, .start-conversation").remove();
								// Prepend the message to the space
								$("#messages-main").prepend(newMsg);
								$("#message-enter, #send-message").attr("up", "message-scroll");
							}
							else if($(".message-wrapper").last().hasClass("message-sent") || m.show_time) {
								// If the last message was sent, append the message separately
								$(".message-wrapper").last().after(newMsg);
							}
							else if($(".message-wrapper").last().hasClass("message-received")) {
								// If the last message was received, combine them
								$(".message-wrapper").last().addClass("last").find(".inner-wrap").append('<div class="messages" id="message-'+m.id+'">'+b64Decode(m.msg)+'</div>');
							}
							// If the page is scrolled to the bottom
							if(isVisible($(".message-wrapper").last().find(".messages").last())) {
								// Scroll it to the bottom again
								messagesBottom();
							}
						}
					}
					// Remove typing indicator
					$("#message-typing").remove();
					showTyping = false;
				}
				// If the user is typing
				if(msg.typing && showTyping) {
					if(!$("#message-typing").length) {
						typingIcon(icon, bg);
					}
				}
				else {
					// If they aren't typing
					$(".last").removeClass("last");
					// Check how to remove the typing icon and do it
					if($("#message-typing").prev(".messages").length || $("#message-typing").next(".messages").length) {
						$("#message-typing").remove();
					}
					else {
						$("#message-typing").parent().parent().remove();
					}
					$(".message-wrapper").last().addClass("last");
				}
				// Check if it should be marked seen
				seenMessages();
			}
			
			// If the user on the sidebar is typing
			if(msg.typing && showTyping) {
				$("#second-page .outer").last().find(".message-tab-prev").html('<div class="typing-wrap"><div class="typing-icon">• • •</div></div>');
			}
		}
		if(data.messages.length > 0) {
			// Prepare the first user
			// If a user was selected
			if(id !== "" && selectedUser !== "") {
				$("#second-page #messages-"+selectedUser).addClass("selected").find(".inner").addClass("inner-active");
				// Show the chosen users messages
				showMessages(selectedUser);
				// Enable going back to the right tab
				tabBack = "outer-friends";
				// Set the user attr
				$("#messages-main").attr("user", selectedUser);
			}
			else {
				if(mode == "update") {
					$("#second-page .outer:first-of-type").attr("up", "search-messages");
					$("#search-messages").attr("down", $(".active-page .outer:first-of-type").attr("id"));
					$("#second-page .outer#messages-"+$("#messages-main").attr("user")+" .inner").addClass("inner-active");
				}
				else if(mode == "load") {
					// Select the first user
					$(".active-page .outer:first-of-type").addClass("selected").find(".inner").addClass("inner-active");
					// Show the first users messages
					showMessages($("#second-page .outer").first().find(".inner").attr("id"));
					// Set the user attr
					$("#messages-main").attr("user", $("#second-page .outer").first().find(".inner").attr("id"));
				}
			}
			// Remove the previous users
			$(".prev-messages").remove();
			// If the search box isn't there, add it
			if(!$("#search-messages").length) {
				$("#second-page .outer:first-of-type").before('<textarea id="search-messages" maxlength="20" placeholder="Search" rows="1" down="'+$(".active-page .outer:first-of-type").attr("id")+'" tabindex="-1"></textarea>').attr("up", "search-messages");
			}
			// If it is in search mode
			if(searching) {
				$("found").each(function() {
					var user = $(this).attr("user");
					if($(this).attr("up")) {
						$("#"+user).attr("up", $(this).attr("up"));
					}
					if($(this).attr("down")) {
						$("#"+user).attr("down", $(this).attr("down"));
					}
					$("#"+user).addClass("found");
					$(this).remove();
				});
			}
		}
		if(mode == "load") {
			fixTabScroll(150);
			refreshMessages();
		}
		else if(mode == "update") {
			if(!$("#mute-conversation").length) {
				$(".selected").removeClass("selected");
				$("#"+cSelected).addClass("selected");
			}
			refresh = true;
			// Reset the touched tab
			if(touchedTab !== "") {
				$("#"+touchedTab).addClass("touched");
			}
			// Reset the scroll position
			$("#second-page .menu").scrollTop(scrollPos);
		}
		// Enable searching users
		searchMessages();
		$("#search-messages").val(search);
	}
	else {
		// If there are no messages
		if(data.messages == false) {
			// Cover the tabs
			$("#second-page .menu").html('<div class="no-messages">No Messages</div>');
			// Get the right image
			var friends_image = "friends_light";
			if(theme == 1 || (customF == 1 && theme == 2)) {
				friends_image = "friends_dark";
			}
			$("#messages-main").html('<img class="try-sending" src="images/'+friends_image+'_alt.png"><div class="start-conversation">You must add friends to send messages.</div><input tabindex="-1" id="about-requests" type="submit" value="Back" class="selected">');
			refresh = true;
			$("#about-requests").click(function() {
				history.back();
			});
		}
		else if(mode == "load") {
			alert("There was an error.");
		}
	}
	if(refresh && mode == "update") {
		setTimeout(function() {
			refreshMessages();
		}, 2800);
	}
}

// Scroll to the bottom of messages
function messagesBottom() {
	if(!$(".try-sending").length) {
		$("#messages-main").animate({
			scrollTop: $("#messages-main").scrollTop() - $("#messages-main").offset().top + $(".message-wrapper").last().find(".messages").last().offset().top
		}, 300);
	}
}

// Load messages from ntoifications
function messageFromNotification(id) {
	id = typeof id !== 'undefined' ? id : "";
	// Check if they have an account and make sure they want to leave the FC
	if(hasAccount && (!$("#friend-corner.container").length || confirm("Are you sure you want to leave the Friend Corner?"))) {
		// Hide the notification if it is visible
		if($(".press-l-r").length) {
			$("#notification-box").animate({ width: "toggle", opacity: "toggle"}, "slow");
			resetNotifications();
		}
		// Remove the overlays and popups if necessary
		if($("#outer-overlay").length) {
			$("#outer-overlay").fadeOut("slow", function() {
				$(this).remove();
			});
		}
		var s = "fast";
		$("#overlay").fadeOut("slow", function() {
			$(".blur").removeClass("blur");
			resetPopup();
			s = "slow";
		});
		// Fade out the active page
		$(".active-page").fadeOut(s, function() {
			// Load the messages page
			$("#second-page").html(messagesHTML).addClass("active-page");
		}).removeClass("active-page");
		setTimeout(function() {
			// Fade the page in
			$(".selected").removeClass("selected");
			$("#second-page").fadeIn("fast");
			history.pushState({page: "user", tab: "outer-messages"}, "", "");
			history.pushState({page: "messages"}, "", "");
			// Load the actual messages
			loadMessages(id);
		}, 500);
	}
}

// Reset the sidebar for messages
function resetMessageUsers() {
	$(".active-page .outer").each(function() {
		$(this).removeAttr("up").removeAttr("down");
		$(this).attr("up", $(this).prevAll(".outer, #search-messages").attr("id"));
		$(this).attr("down", $(this).nextAll(".outer").attr("id"));
		$("#search-messages").attr("down", $(".active-page .outer").attr("id"));
	});
}

// Reset notification box to default
function resetNotifications() {
	setTimeout(function() {
		$(".notification-message").removeClass("friend").removeClass("request");
		$(".inner-message").show().removeClass("notif-message");
		$(".press-l-r").remove();
		$("#notification-icon-wrapper").css("background-color", "#"+userBG);
		$("#notification-image").attr("src", userURL+"icons/"+userPhoto);
	}, 500);
}

// Format the messages time
function formatDateTime(timestamp) {
	var date = new Date(timestamp*1000);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	hours = hours < 10 ? '0'+hours : hours;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	// If the date is today
	if(today(date)) {
		 return hours + ':' + minutes + ' ' + ampm;
	}
	// If the date was this week
	else if(week(new Date()) == week(date)) {
		return days[date.getDay()] + ' ' + hours + ':' + minutes + ' ' + ampm;
	}
	return date.getDate() + ' ' + months[date.getMonth()] + ', ' + hours + ':' + minutes + ' ' + ampm;
}

// Formatting "when" stuff
function formatWhen(timestamp) {
	var d = new Date(timestamp*1000);
	return  ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}

// Check if date was today
function today(td) {
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
}

// Get the week number
function week(date){
	var onejan = new Date(date.getFullYear(), 0, 1);
	return Math.ceil( (((date - onejan) / 86400000) + onejan.getDay() + 1) / 7 );	
};

// Unlink the SwitchBru account
function unlinkAccount() {
	if(userID !== 0 && hasAccount) {
		alert("This will unlink your SwitchBru Account from this user.");
		alert("If you unlink your account from this user, you will be unable to add friends or message anybody until you link this user back to a SwitchBru Account.");
		if(confirm("Are you sure you want to unlink your SwitchBru Account?")) {
			$.ajax({
				type: 'POST',
				url: userURL+'unlinkAccount',
				data: {"id": userID},
				dataType: "json",
				success: function(data) {
					if(data.error == false) {
						// Successfully unlinked account
						alert("Your account was successfully unlinked. This page will now be refreshed.");
						location.reload();
					}
					else {
						alert("There was an error while unlinking your account.");
					}
				},
				error: function() {
					alert("Failed to unlink your account. Please try again later.");
				}
			});
		}
	}
}

// Get the users icon, name and background
function reloadUser(uuid) {
	if(userID !== 0 && hasAccount && $("#messages-main").length) {
		$.ajax({
			type: 'POST',
			url: userURL+'reloadUser',
			data: {"id": userID, "user": uuid},
			dataType: "json",
			success: function(data) {
				if(data.error == false) {
					// Add all the data
					$("#"+uuid).find(".messages-icon-wrap").css("background-color", "#"+data.bg).find(".messages-icon-image").attr("src", userURL+"icons/"+data.icon).parent().parent().next().find(".name").text(data.name).parent().next().text(data.name.toLowerCase());
				}
			},
		});
	}
}

// Log out of the user
function logOut() {
	if(userID !== 0 && confirm("Are you sure you want to sign out of your user account?")) {
		if(hasAccount || confirm("You have not linked to this user to a SwitchBru Account. If you log out, the user will be deleted and you will not be able to reuse it.")) {
			$.ajax({
				type: 'POST',
				url: userURL+'logOut',
				data: {"id": userID},
				dataType: "json",
				success: function(data) {
					if(data.error == false) {
						// Successfully logged out
						if(hasAccount) {
							alert("Successfully logged out of the user, and your IP address has been removed from the SwitchBru servers. This page will now refresh.");
						}
						else {
							alert("Successfully logged out and deleted the user account, and your IP address has been removed from our servers. The page will now be refreshed.");
						}
						location.reload();
					}
					else {
						alert("There was an error while logging out of the user.");
					}
				},
				error: function() {
					alert("Failed to log out. Please try again later.");
				}
			});
		}
	}
}

// Say that the user is typing
var lastTyping = new Date().getTime() / 1000;
var sendTyping = true;
function isTyping() {
	var now = new Date().getTime() / 1000;
	if(now - 4 > lastTyping && sendTyping) {
		sendTyping = false;
		$.ajax({
			type: 'POST',
			url: userURL+'typing',
			data: {"id": userID, "user": $("#messages-main").attr("user")},
			dataType: "json",
			success: function(data) {
				sendTyping = true;
			},
			error: function() {
				sendTyping = true;
			}
		});
	}
}

// Append the typing indicator
function typingIcon(icon, bg) {
	// Remove bottom stuff
	$(".last").removeClass("last");
	$(".seen").remove();
	
	// Prepare the typing message HTML
	var newMsg = '<div class="message-wrapper message-received last"><div class="messages-icon"><div class="messages-icon-wrap" style="'+bg+'"><img height="45" class="messages-icon-image" src="'+icon+'"></div></div><div class="inner-wrap"><div class="messages" id="message-typing"><div class="typing-icon">• • •</div></div></div></div>';
	
	// If there aren't any messages already
	if($(".message-wrapper").last().hasClass("message-sent")) {
		// If the last message was sent, append the message separately
		$(".message-wrapper").last().after(newMsg);
	}
	else if($(".message-wrapper").last().hasClass("message-received")) {
		// If the last message was received, combine them
		$(".message-wrapper").last().addClass("last").find(".inner-wrap").append('<div class="messages" id="message-typing"><div class="typing-icon">• • •</div></div>');
	}
	// If the page is scrolled to the bottom
	if(isVisible($(".message-wrapper").last().find(".messages").last())) {
		// Scroll it to the bottom again
		messagesBottom();
	}
}

// Show details for messages
var currentUser = "";
function showDetails() {
	// Fade out all the elements
	$(".active-page .container, .current-messaging, .details, .messages-title").fadeOut("fast", function() {
		$(".messages-title").text("Details");
	});
	// Unselect the selected element
	$(".selected").removeClass("selected");
	$(detailsHTML).insertAfter(".active-page .container").hide();
	currentUser = $("#messages-main").attr("user");
	$.ajax({
		url: userURL+"getDetails",
		method: "POST",
		data: {"id": userID, "user": currentUser},
		dataType: "json",
		success: function(data) {
			if(data.error == false) { // If there was no error
				if(data.muted == 1) {
					$(".mute-conversation").removeClass("disabled").text("On");
				}
				if(data.hidden == 1) {
					$(".hide-conversation").removeClass("disabled").text("On");
				}
				// Hide details button
				$(".details").removeClass("visible");
				// Add members
				var name = $(".messaging-name").html();
				var style = $(".active-page .inner-active").find(".messages-icon-wrap").attr("style");
				var img = $(".active-page .inner-active").find(".messages-icon-image").attr("src");
				$(".members").append('<div class="member"><div class="user-wrap" style="'+style+'"><img src="'+img+'"></div><span class="member-name">'+name+'</span></div>');
				$(".member").each(function(i) {
					$(this).attr("id", "member-"+parseInt(i+1));
				});
				// Up and down attributes
				$("#member-1").attr("up", "mute-conversation");
				$(".member").last().attr("down", "hide-conversation");
				$("#hide-conversation").attr("up", $(".member").last().attr("id"));
				
				// Fade the page back in
				$(".messages-title, .details-content").fadeIn("fast");
				// Enable click events
				$("#mute-conversation").click(function() {
					mute();
				});
				$("#hide-conversation").click(function() {
					hideConversation();
				});
				// Add multiple states for back button to work properly
				history.pushState({page: "user", tab: tabBack}, "", "");
				history.pushState({page: "same", tab: $(".inner-active").attr("id")}, "", "");
				history.pushState({page: "messages"}, "", "");
				history.pushState({page: "messages"}, "", "");
			}
			else {
				alert("There was an error.");
				return;
			}
		},
		error: function() {
			alert("There was an error.");
		}
	});
}

// Mute a conversation
function mute() {
	if(userID !== 0 && hasAccount) {
		$.ajax({
			url: userURL+"mute",
			method: "POST",
			data: {"id": userID, "user": $("#messages-main").attr("user")},
			dataType: "json",
			success: function(data) {
				if(data.error == false) { // If there was no error
					if(data.muted == 0) {
						$(".mute-conversation").addClass("disabled").text("Off");
					}
					else {
						$(".mute-conversation").removeClass("disabled").text("On");
					}
				}
				else {
					alert("There was an error.");
					return;
				}
			},
			error: function() {
				alert("There was an error.");
			}
		});
	}
}

// Hide a conversation
function hideConversation() {
	if(userID !== 0 && hasAccount && confirm("Are you sure you want to hide this conversation?")) {
		$.ajax({
			url: userURL+"hideConversation",
			method: "POST",
			data: {"id": userID, "user": $("#messages-main").attr("user")},
			dataType: "json",
			success: function(data) {
				if(data.error == false) { // If there was no error
					if(data.hidden == 0) {
						$(".hide-conversation").addClass("disabled").text("Off");
					}
					else {
						$(".hide-conversation").removeClass("disabled").text("On");
					}
				}
				else {
					alert("There was an error.");
					return;
				}
			},
			error: function() {
				alert("There was an error.");
			}
		});
	}
}