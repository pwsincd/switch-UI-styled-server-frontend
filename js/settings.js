/* This code controls the settings page and all of its functions */

var settingsPageContent = "";
// Open the settings page
function openSettings() {
	loadSettingsPage();
	$("#main-page").fadeOut("fast").removeClass("active-page");
	$("#second-page").fadeOut("fast").removeClass("active-page");
	setTimeout(function() {
		$("#second-page").fadeIn("fast").addClass("active-page");
	}, 600);
	// Reset the last tab
	if(lastTab !== "themes" && lastTab !== "system" && lastTab !== "notifications") {
		lastTab = "about";
	}
	// Remove original selected and select the tab
	$(".selected").removeClass("selected");
	$("#"+lastTab).parent().addClass("selected");
	settingsTab(lastTab);
}

// Switch between different settings tabs
var customEnabled;
function settingsTab(tab) {
	customEnabled = false;
	switch(tab) {
		case "about": // About tab
			settingsPageContent = `<h2>About SwitchBru DNS server</h2>
				This service is provided free of charge. We do not store or retain any personal web browsing data. Besides providing the initial redirect for the Nintendo Switch, all DNS queries are handled via <a href="https://developers.google.com/speed/public-dns/" tabindex="-1" id="google-dns" left="outer-about" down="patreon">Google DNS</a>.
                <br><br>
				We are hosting this service as we believe that those of us that purchased an Internet-capable Switch should have the right to browse the web! We hope that one day Nintendo adds an easily accessible web browser to the console.
				<br><br>
                If you choose to make an IP-based user to store options and bookmarks, or a SwitchBru account to store friends, themes, and messages, we will not share any personal data stored with us with any third parties.
                <br><br>The personal data that is stored is only used to facilitate the services offered by this website. We cannot make any guarantees about how long any data stored with us is retained. If you have any questions, please contact us on Discord or Twitter. 
				<br><hr>
				<small><b>v4.0.0</b> &ndash; created by vgmoose, designed by pwsincd, with news, user features and messaging added by <a href="https://www.patreon.com/ep8script" id="patreon" tabindex="-1" left="outer-about" up="google-dns">Ep8Script</small><span class="select-next" selectnext="google-dns"></span>`
			selected = "outer-about";
			break;
		case "themes": // Themes tab
			settingsPageContent = `<div class="themes">
					<div class="select-theme" id="light" left="outer-themes" down="dark">
						<div class="color"></div>
						<span>Basic White</span>
						<img src="images/tick_light.png">
					</div>
					<div class="select-theme chosen" id="dark" left="outer-themes" up="light">
						<div class="color"></div>
						<span>Basic Black</span>
						<img src="images/tick_dark.png">
					</div>`+customThemeToggle()+`
				</div><span class="select-next" selectnext="light"></span>`
			selected = "outer-themes";
			break;
		case "notifications": // Notifications tab
			settingsPageContent = `<div class="notifications-page">
				<input type="submit" id="friend-notifications" value="Friend Notifications" left="outer-notifications" down="message-notifications" tabindex="-1">		
				<input type="submit" id="message-notifications" value="Message Notifications" left="outer-notifications" up="friend-notifications" down="welcome-notifications" tabindex="-1">
				<div class="system-buttons" id="welcome-notifications" up="message-notifications" left="outer-notifications">
					<span>Welcome Notifications</span> <span class="welcome-notifications text-right disabled">Off</span>
				</div>
				<span class="welcome-notifications-text">Allows you to catch up on the notifications you missed</span>
			</div><span class="select-next" selectnext="friend-notifications"></span>`;
			break;
		case "system": // System tab
			settingsPageContent = `<div class="system-page">
				<input type="submit" id="check-update" value="Check Update" onclick="checkUpdate()" left="outer-system" down="console-name" tabindex="-1">
				<span class="version-string">
					Current system version: <span class="version"></span>
				</span>
				<div class="system-buttons" id="console-name" up="check-update" left="outer-system" down="display-colors">
					<span>Console Nickname</span> <span class="console-name text-right"></span>
				</div>
				<select class="display-colors">
					<option value="default">Default</option>
					<option value="invert">Invert Colors</option>
					<option value="greyscale">Greyscale</option>
				</select>
				<div class="system-buttons" id="display-colors" up="console-name" left="outer-system" down="send-error-info">
					<span>Change Display Colors</span> <span class="display-color text-right">Default</span>
				</div>
				<div class="system-buttons" id="send-error-info" up="display-colors" left="outer-system" down="disable-ads">
					<span>Send Error Information</span> <span class="send-errors text-right">On</span>
				</div>
				<div class="system-buttons" id="disable-ads" up="send-error-info" left="outer-system">
					<span>Disable Ads</span> <span class="disable-ads text-right disabled">Off</span>
				</div>
			</div><span class="select-next" selectnext="check-update"></span>`;
			break;
	}
	// Best I can think to do it
	if(change) {
		// Set user-page content to new content
		$("#settingspage-content").html(settingsPageContent);
		$("#settingspage-content").scrollTop(0);
		$(".next").attr("up", selected).attr("down", selected).attr("left", selected).attr("right", selected); // Prepare to select again
		// Check for specific tabs
		if(tab == "themes") {
			// If the light theme is selected
			if(theme == 0) {
				// Choose the light button
				$("#dark").removeClass("chosen");
				$("#light").addClass("chosen");
			}
			// If the custom theme is selected
			else if(theme == 2) {
				// Choose the custom button
				$("#dark").removeClass("chosen");
				$("#custom").addClass("chosen");
			}
			// Enable selecting themes
			$(".select-theme").click(function() {
				selectTheme($(this).attr("id"));
			});
			// Check if the custom themeis enabled
			if(customEnabled) {
				// Enable pressing down to select the custom button
				$("#dark").attr("down", "custom");
			}
			// If the user has a custom theme
			if(hasCustomTheme) {
				// Set the custom theme with the color and name
				$("#custom .color").css("background-color", themeC);
				$("#custom span").html(themeName+" (Custom)");
			}
		}
		else if(tab == "notifications") {
			// Set click events
			$("#friend-notifications").click(function() {
				editNotifications("friends");
			});
			$("#message-notifications").click(function() {
				editNotifications("messages");
			});
			$("#welcome-notifications").click(function() {
				welcomeNotifiations();
			});
			// Set button
			if(hasAccount && welcome) {
				$(".welcome-notifications").text("On").removeClass("disabled");
			}
		}
		else if(tab == "system") {
			// Get the system version
			checkVersion();
			// Set the console name
			$(".console-name").text(consoleName);
			// Allow the console name to be edited
			$("#console-name").click(function() {
				consoleNameE($(".console-name").text());
			});
			// Enable changing the display color
			enableDisplayChange();
			// If errors are not to be sent
			if(errors == 0) {
				$(".send-errors").addClass("disabled").text("Off");
			}
			// Allow toggling sending errors
			$("#send-error-info").click(function() {
				toggleSendErrors();
			});
			// If ads are disabled
			if(disableAds == 1) {
				$(".disable-ads").removeClass("disabled").text("On");
			}
			// Toggle sending ads on click
			$("#disable-ads").click(function() {
				toggleAds();
			});
		}
	}
	else {
		change = true;
	}
	// Enable back button
	history.pushState({page: "home", tab: "settings"}, "", "");
	history.pushState({page: "same", tab: $("#"+tab).parent().attr("id")}, "", "");
	// Highlight sidebar
	$(".inner").removeClass("inner-active");
	$("#"+tab).addClass("inner-active");
	lastTab = $("#"+tab).parent().attr("id");
};

// Save the selected theme
function selectTheme(t) {
	if(userID !== 0) { // If they have a user
		if(t == "custom") { // If the custom theme is selected
			if(!hasAccount) { // If they don't have an account
				// Prompt to link an account
				linkAccount();
			}
			else {
				if(!hasCustomTheme) { // If they don't have a custom theme
					// Tell them how to create a custom theme
					customThemePage();
				}
				else {
					// Change the theme
					changeTheme(t);
				}
			}
		}
		else {
			// Change the theme
			changeTheme(t);
		}		
	}
	else {
		// Prompt to create a new user
		createUser("theme");
	}
}

// Function to change theme
function changeTheme(t) {
	var th = 0;
	if(t == "dark") { // If selected theme is dark
		th = 1;
	}
	else if(t == "custom") { // If selected theme is custom
		th = 2;
	}
	$.ajax({
		url: userURL+"changeTheme",
		method: "POST",
		data: {"id": userID, "theme": t},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there was no error
				// Unselect chosen theme
				$(".chosen").removeClass("chosen");
				// Select newly chosen theme
				$("#"+t).addClass("chosen");
				// Disable transitions temporarily
				$("body").attr("id", "rt");
				setTimeout(function() {
					// Set the new theme
					$("body").attr("class", t);
					// Refresh stylesheets quickly
					reloadStylesheets();
					setTimeout(function() {
						// Enable transitions
						$("body").removeAttr("id");
					}, 100);
				}, 100);
				// Set the theme
				theme = th;
			}
			else {
				// Error handling
				if(response.theme_exists == false) {
					alert("The theme you selected does not exist.");
				}
				else if(response.exists == false) {
					alert("This user account does not exist.");
				}
				else {
					alert("There was an error.");
					return;
				}
			}
		},
		error: function() {
			alert("There was an error.");
			return;
		}
	});
}

var systemVersion;
function checkVersion() {
	// Approx defaults to false - set if the user agent is not unique
	var approx = false;
	// Get the user agent
	var UA = navigator.userAgent;
	var SUA = /Mozilla\/5\.0 \(Nintendo Switch; .*\) AppleWebKit\/601\.6 \(KHTML, like Gecko\) NF\/(.*) NintendoBrowser\/(.*)/
	if(UA.match(SUA)) { // If the user agent is correct
		var match = SUA.exec(UA);
		switch(match[2]) { // Check the version based on known strings
			case "5.1.0.11682":
				systemVersion = "1.0.0";
				break;
			case "5.1.0.13341":
				systemVersion: "2.0.0";
				break;
			case "5.1.0.13343":
				systemVersion = "2.1.0";
				approx = true;
				break;
			case "5.1.0.14936":
				systemVersion = "3.0.0";
				approx = true;
				break;
			case "5.1.0.15785":
				systemVersion = "4.0.0";
				approx = true;
				break;
			case "5.1.0.16739":
				systemVersion = "5.0.0";
				approx = true;
				break;
		}
	}
	else {
		// If the user agent doesn't match, we don't know the sysver
		systemVersion = "Unknown";
	}
	// Set the system version
	$(".version-string .version").text(systemVersion);
	
	if(approx) {
		// If the version is approximate, mention that
		$(".version-string .version").append(" (approx)");
	}
}

// Check if this version can use homebrew
function checkUpdate() {
	if(systemVersion == "Unknown") {
		// If unknown sysver
		alert("Could not check the update!");
	}
	else {
		// Parse the number
		var v = parseFloat(systemVersion);
		// Check if the system version is 3.0.0 or below
		if(v <= 3) {
			alert("You are able to run homebrew on "+systemVersion+"!");
		}
		else {
			alert("You can not yet use homebrew on "+systemVersion+".");
		}
	}
}

// To edit the "console name"
function consoleNameE(originalName) {
	if(userID !== 0) { // If they have a user
		// Original name
		var name = originalName;
		name = prompt("Enter a nickname.", name);
		if(name == "") {
			alert("This nickname is blank.");
			consoleNameE(originalName);
		}
		if (name !== null) { //If anything was entered
			$.ajax({
				url: userURL+"renameConsole", // 
				method: "POST",
				data: {"id": userID, "console_name": name},
				dataType: "json",
				success: function(response) {
					if(response.error == false) { // If there was no error
						$("#console-name .console-name").html(name);
						consoleName = name;
					}
					else {
						// Error handling
						if(response.badword == true) {
							alert("This nickname contains innappropriate language.");
							consoleNameE(name);
						}
						else if(response.length == true) {
							alert("This nickname is too long.");
							consoleNameE(name);
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
	else {
		// Prompt to create a user
		createUser("console-name");
	}
}

// Change the display colors
function enableDisplayChange() {
	// Set the current value
	var d = "default";
	if(display == 1) {
		d = "invert";
	}
	else if(display == 2) {
		d = "greyscale";
	}
	// Properly set the value
	$(".display-colors").val(d);
	$(".display-color").text($(".display-colors option[value='"+d+"']").text());
	
	// Detect when the value is changed
	$(".display-colors").change(function() {
		if(userID !== 0) {
			var value = this.value;
			$.ajax({
				url: userURL+"changeDisplay",
				method: "POST",
				data: {"id": userID, "display": value},
				dataType: "json",
				success: function(response) {
					if(response.error == false) { // If there was no error
						// Set the new value and change the display color
						if(value == "default") {
							$("html").removeClass("invert").removeClass("greyscale");
							display = 0;
						}
						else if(value == "invert") {
							$("html").removeClass("greyscale").addClass("invert");
							display = 1;
						}
						else if(value == "greyscale") {
							$("html").addClass("greyscale").removeClass("invert");
							display = 2;
						}
						// Set the text
						$(".display-color").text($(".display-colors option[value='"+value+"']").text());
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
		else {
			// Prompt to create a user
			createUser("display-colors");
		}		
	});
	
	// If clicking on the display colors button with the cursor
	$("#display-colors").click(function() {
		cantSelect();
	});
}

// Toggle sending error information
function toggleSendErrors() {
	// Make sure they have a user account
	if(userID !== 0) {
		if(errors == 0) {
			// If sending errors is being turned on, explain it a bit more
			if(confirm("Do you allow SwitchBru to collect error information from this webpage for anaylsis and improvement purposes?\nYou can change this setting at any time.")) {
				// Toggle it on
				doToggle("on");
			}
		}
		else {
			// Toggle it off
			doToggle("off");
		}
	}
	else {
		// Prompt them to create a user
		createUser("error-info");
	}
}

// Actually toggle error sending
function doToggle(toggled) {
	$.ajax({
		url: userURL+"errorInfo",
		method: "POST",
		data: {"id": userID, "errors": toggled},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there was no error
				// Set the new information
				if(toggled == "off") {
					$(".send-errors").addClass("disabled").html("Off");
					errors = 0;
				}
				else if(toggled == "on") {
					$(".send-errors").removeClass("disabled").html("On");
					errors = 1;
				}
			}
			else {
				// Error handling (ironic...?)
				alert("There was an error.");
				return;
			}
		},
		error: function() {
			alert("There was an error.");
		}
	});
}

// Toggle ads
function toggleAds() {
	// If ads are disabled
	if(userID !== 0) { // If they have a user
		// Check on or off
		var d = "off";
		if(disableAds == 0) {
			d = "on";
		}
		$.ajax({
			url: userURL+"disableAds",
			method: "POST",
			data: {"id": userID, "disable": d},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Toggle variables and appearances
					if(d == "off") {
						$(".disable-ads").addClass("disabled").html("Off");
						disableAds = 0;
						setTimeout(function() {
							// If they choose to show ads, show this message
							alert("Ads will be shown next time you reload the page.");
						}, 100);
					}
					else if(d == "on") {
						$(".disable-ads").removeClass("disabled").html("On");
						disableAds = 1;
						// Hide the ads
						$(".adsbygoogle").addClass("hide-ads");
						$("#nav, #user-text").removeClass("ad");
					}
				}
				else {
					// Error handling
					alert("There was an error.");
					return;
				}
			},
			error: function() {
				alert("There was an error.");
			}
		});
	}
	else {
		// Prompt to create a user
		createUser("ads");
	}
}

// Edit notification settings
function editNotifications(type) {
	if(userID == 0) { // If they do not have a user
		createUser("notifications");
	}
	else if(!hasAccount) { // If they do not have a SwitchBru Account
		linkAccount();
	}
	else {
		if(type == "friends") {
			friendNotificationsPage();
		}
		else if(type == "messages") {
			messageNotificationsPage();
		}
	}
}

// Toggle welcome notifications
function welcomeNotifiations() {
	if(userID == 0) { // If they do not have a user
		createUser("notifications");
	}
	else if(!hasAccount) { // If they do not have a SwitchBru Account
		linkAccount();
	}
	else {
		// Check on or off
		var w = "off";
		if(!welcome) {
			w = "on";
		}
		$.ajax({
			url: userURL+"toggleWelcome",
			method: "POST",
			data: {"id": userID, "val": w},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Toggle variables and appearances
					if(w == "off") {
						$(".welcome-notifications").addClass("disabled").html("Off");
						welcome = false;
					}
					else if(w == "on") {
						$(".welcome-notifications").removeClass("disabled").html("On");
						welcome = true;
					}
				}
				else {
					// Error handling
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

// Change the settings for notifying about friends
function enableNotifyChange() {
	// Detect when the value is changed
	$(".friends-online").change(function() {
		var value = this.value;
		$.ajax({
			url: userURL+"changeNotifications",
			method: "POST",
			data: {"id": userID, "friends": value},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Set the new value and change the display color
					if(value == "all") {
						friends_notify = 2;
					}
					else if(value == "best") {
						friends_notify = 1;
					}
					else if(value == "off") {
						friends_notify = 0;
					}
					// Set the text
					$(".friends-notify").text($(".friends-online option[value='"+value+"']").text());
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
	$("#friends-notify").click(function() {
		cantSelect();
	});
}

// Change Friend Request Notifications
function changeFriendNotifications() {
	var value = "off";
	if(friend_request_notify == 0) {
		value = "on";
	}
	$.ajax({
		url: userURL+"changeNotifications",
		method: "POST",
		data: {"id": userID, "requests": value},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there was no error
				// Set the new value and change the text
				if(value == "off") {
					friend_request_notify = 0;
					$(".request-notifications").addClass("disabled").text("Off");
				}
				else if(value == "on") {
					friend_request_notify = 1;
					$(".request-notifications").removeClass("disabled").text("On");
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

// Change Online Users
function changeUserNotifications() {
	var value = "off";
	if(online_users == 0) {
		value = "on";
	}
	$.ajax({
		url: userURL+"changeNotifications",
		method: "POST",
		data: {"id": userID, "users": value},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there was no error
				// Set the new value and change the text
				if(value == "off") {
					online_users = 0;
					$(".online-users").addClass("disabled").text("Off");
				}
				else if(value == "on") {
					online_users = 1;
					$(".online-users").removeClass("disabled").text("On");
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

// Change Receive Message Notifications
function changeMessageNotifications() {
	var value = "off";
	if(receive_notifications == 0) {
		value = "on";
	}
	$.ajax({
		url: userURL+"changeNotifications",
		method: "POST",
		data: {"id": userID, "messages": value},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there was no error
				// Set the new value and change the text
				if(value == "off") {
					receive_notifications = 0;
					$(".receive-notifications").addClass("disabled").text("Off");
				}
				else if(value == "on") {
					receive_notifications = 1;
					$(".receive-notifications").removeClass("disabled").text("On");
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

// Change Show Message
function showHideMessage() {
	var value = "off";
	if(show_message == 0) {
		value = "on";
	}
	$.ajax({
		url: userURL+"changeNotifications",
		method: "POST",
		data: {"id": userID, "show_message": value},
		dataType: "json",
		success: function(response) {
			if(response.error == false) { // If there was no error
				// Set the new value and change the text
				if(value == "off") {
					show_message = 0;
					$(".show-message").addClass("disabled").text("Off");
				}
				else if(value == "on") {
					show_message = 1;
					$(".show-message").removeClass("disabled").text("On");
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

// Refresh stylesheets - useful for changing theme
function reloadStylesheets() {
    var queryString = "";
    $('link[rel="stylesheet"]').each(function () {
		if($(this).attr("id") == "custom-css") {
			this.href = this.href.replace(/\?.*|$/, "?"+themeQuery);
		}
		else {
			this.href = this.href.replace(/\?.*|$/, queryString);
		}
    });
}