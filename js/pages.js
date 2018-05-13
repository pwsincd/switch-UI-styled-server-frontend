/* This whole file is just for storing HTML
   I thought it'd be better to do separately to make the main stuff more readable
   and less cluttered - I tried to name the variables obviously so that it'd explain 
   itself, so enjoy! There's also some functions at the end that deploy some of the 
   pages that use these variables
*/ 

var userPageHTML = `<div class="nav" style="height: 80px !important;">
				<div id="user-page-icon"><div id="user-page-icon-wrapper"></div></div> <span class="user-title"></span>
				<span class="next" down="outer-profile" up="outer-profile" left="outer-profile" right="outer-profile"></span>
			</div>
			<div class="container user-container">
				<div class="menu">
					<div class="outer" id="outer-profile" down="outer-friends" onclick="touched(this.id)">
						<div class="inner" id="profile" onclick="userTab(this.id)">&nbsp;&nbsp;Profile
						</div>
					</div>
					<div class="outer" id="outer-friends" up="outer-profile" down="outer-add" onclick="touched(this.id)">
						<div class="inner" id="friends" onclick="userTab(this.id)">&nbsp;&nbsp;Friend List
						</div>
					</div>
					<div class="outer" id="outer-add" up="outer-friends" down="outer-messages" onclick="touched(this.id)">
						<div class="inner" id="add-friend-tab" onclick="userTab(this.id)">&nbsp;&nbsp;Add Friend
						</div>
					</div>
					<div class="outer" id="outer-messages" up="outer-add" down="outer-usettings" onclick="touched(this.id)">
						<div class="inner" id="messages" onclick="userTab(this.id)">&nbsp;&nbsp;Messages
						</div>
					</div>
					<div class="outer" id="outer-usettings" up="outer-messages" onclick="touched(this.id)">
						<div class="inner" id="user-settings" onclick="userTab(this.id)">&nbsp;&nbsp;User Settings
						</div>
					</div>
				</div>
				<div class="main" id="userpage-content">
				</div>
			</div>`;
			
var leftSideHTML = `<div class="edit-icon-button selected" id="character-button" down="background" onclick="selectCharacter()"><span>Character</span> <img height="60" id="edit-character"></div>
						<div class="edit-icon-button" id="background" up="character-button" down="icon-ok" onclick="selectBG()"><span>Background</span> <div class="bg-color"></div></div>
						<div id="icon-ok" onclick="iconOK()" up="background"><div class="padding"><span>OK</span></div></div>
						</div>`;
			
var editIconHTML = `<div class="nav" style="height: 80px !important;"><span class="edit-icon-title">Edit Icon</span>
				<span class="next" down="character-button" up="character-button" left="character-button" right="character-button"></span>
			</div>
			<div class="container">
				<div class="main" id="editicon-content">
					<div class="icon-right">
						<div class="icon-right-wrapper">
							<img height="225" class="icon-right-image">
						</div>
					</div>
					<div class="left-side">`+leftSideHTML+`
					</div>
				</div>
			</div>`;
			
var settingsPageHTML = `<div class="nav">
				<svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-cog fa-w-16" id="icon" role="img" aria-hidden="true" viewBox="0 0 512 512" data-icon="cog" data-prefix="fas" data-fa-processed=""><path fill="currentColor" d="M 444.788 291.1 l 42.616 24.599 c 4.867 2.809 7.126 8.618 5.459 13.985 c -11.07 35.642 -29.97 67.842 -54.689 94.586 a 12.016 12.016 0 0 1 -14.832 2.254 l -42.584 -24.595 a 191.577 191.577 0 0 1 -60.759 35.13 v 49.182 a 12.01 12.01 0 0 1 -9.377 11.718 c -34.956 7.85 -72.499 8.256 -109.219 0.007 c -5.49 -1.233 -9.403 -6.096 -9.403 -11.723 v -49.184 a 191.555 191.555 0 0 1 -60.759 -35.13 l -42.584 24.595 a 12.016 12.016 0 0 1 -14.832 -2.254 c -24.718 -26.744 -43.619 -58.944 -54.689 -94.586 c -1.667 -5.366 0.592 -11.175 5.459 -13.985 L 67.212 291.1 a 193.48 193.48 0 0 1 0 -70.199 l -42.616 -24.599 c -4.867 -2.809 -7.126 -8.618 -5.459 -13.985 c 11.07 -35.642 29.97 -67.842 54.689 -94.586 a 12.016 12.016 0 0 1 14.832 -2.254 l 42.584 24.595 a 191.577 191.577 0 0 1 60.759 -35.13 V 25.759 a 12.01 12.01 0 0 1 9.377 -11.718 c 34.956 -7.85 72.499 -8.256 109.219 -0.007 c 5.49 1.233 9.403 6.096 9.403 11.723 v 49.184 a 191.555 191.555 0 0 1 60.759 35.13 l 42.584 -24.595 a 12.016 12.016 0 0 1 14.832 2.254 c 24.718 26.744 43.619 58.944 54.689 94.586 c 1.667 5.366 -0.592 11.175 -5.459 13.985 L 444.788 220.9 a 193.485 193.485 0 0 1 0 70.2 Z M 336 256 c 0 -44.112 -35.888 -80 -80 -80 s -80 35.888 -80 80 s 35.888 80 80 80 s 80 -35.888 80 -80 Z" /></svg>&nbsp;&nbsp;SwitchBru Settings
				<span class="next" down="outer-about" up="outer-about" left="outer-about" right="outer-about"></span>
			</div>
			<div class="container">
				<div class="menu">
					<div class="outer selected" id="outer-about" down="outer-themes" onclick="touched(this.id)">
						<div class="inner" id="about" onclick="settingsTab(this.id)">&nbsp;&nbsp;About
						</div>
					</div>
					<hr>
					<div class="outer" id="outer-themes" up="outer-about" down="outer-notifications" onclick="touched(this.id)">
						<div class="inner" id="themes" onclick="settingsTab(this.id)">&nbsp;&nbsp;Themes
						</div>
					</div>
					<div class="outer" id="outer-notifications" up="outer-themes" down="outer-system" onclick="touched(this.id)">
						<div class="inner" id="notifications" onclick="settingsTab(this.id)">&nbsp;&nbsp;Notifications
						</div>
					</div>
					<hr>
					<div class="outer" id="outer-system" up="outer-notifications" onclick="touched(this.id)">
						<div class="inner" id="system" onclick="settingsTab(this.id)">&nbsp;&nbsp;System
						</div>
					</div>
				</div>
				<div class="main" id="settingspage-content">
				</div>
			</div>`;
			
var customLinksHTML = ``;

var newUserHTML2 = `<div class="container" id="new-user-page">
				<input class="selected" tabindex="-1" id="next-button" down="reuse" type="submit" onclick="NUNext()" value="Next">
				<img class="new-user-image" src="images/users.png">
				<div id="info">Set your icon and nickname.<br><div class="additional-information">This information will be visible to your friends and some other users.</div></div>
				<a id="reuse" up="next-button" onclick="alreadyUser()">Already have a user?</a>
			</div>`;

var newUserHTML = `<div class="nav" style="height: 80px;">New User<span class="next" right="next-button" down="next-button" left="next-button" up="next-button"></span><span class="return-to" returnto=""></span>
			</div>`+newUserHTML2;
		
var newUserHTML3 = `<div style="display: block;">
		<div id="select">
			Select an icon.
			<br>
			<div class="change">
				You can change this at any time.
			</div>
		</div>
		<div id="icon-selection">`+prepIcons()+`
		</div>
		<input tabindex="-1" id="create-own" onclick="createIcon()" type="submit" value="Create Own Icon" up="new-icon7">
	</div>`;
	
var newUserHTML4 = `<div style="display: block;">
		<div class="added" id="select">
			This user will be added to the console.<br>
		</div>
		<div class="new-icon-selected"><div class="new-icon-wrapper"><img height="150" class="new-icon-image"></div></div>
		<div id="new-username">
		</div>
		<input class="selected" id="new-ok" onclick="newUserOK()" type="submit" value="OK" tabindex="-1">
	</div>`;
	
var leftSideCreateHTML = `<div class="edit-icon-button selected" id="character-button" 	down="background" onclick="selectCharacter('create')">
		<span>Character</span> <img height="60" id="edit-character">
	</div>
	<div class="edit-icon-button" id="background" up="character-button" down="icon-ok" onclick="selectBG('create')"><span>Background</span> <div class="bg-color"></div></div>
	<div id="icon-ok" onclick="iconOK('create')" up="background">
		<div class="padding">
			<span>OK</span>
		</div>
	</div>
</div>`;
			
var editIconCreateHTML = `<div class="nav" style="height: 80px !important;"><span class="edit-icon-title">Edit Icon</span>
				<span class="next" down="character-button" up="character-button" left="character-button" right="character-button"></span>
			</div>
			<div class="container">
				<div class="main" id="editicon-content">
					<div class="icon-right">
						<div class="icon-right-wrapper">
							<img height="225" class="icon-right-image">
						</div>
					</div>
					<div class="left-side">`+leftSideCreateHTML+`
					</div>
				</div>
			</div>`;

var accountPageHTML = `<div class="nav" style="height: 90px;">
			Link Account<span class="next" right="later-button" down="later-button" left="later-button" up="later-button"></span><span class="return-to" returnto=""></span>
		</div>
		<div class="container" id="link-account">
			<div id="linking-text">
				Linking to a SwitchBru Account enables you to fully enjoy the SwitchBru DNS and its online and user features.
				<div id="benefits">
					Having a SwitchBru Account allows you to:
					<br><br>
					<ul>
						<li>Access this user on multiple wifi networks</li>
						<li>Add lots of friends</li>
						<li>Create a custom and unique theme</li>
						<li>Recieve notifications (while you are on this page)</li>
						<li>Send messages to your friends</li>
						<li>Share your activity on the SwitchBru DNS</li>
					</ul>
				</div>
			</div>
			<div class="user-linked">
				<div class="linking-icon">
					<div class="linking-icon-wrapper">
						<img height="80" class="linking-icon-image">
					</div>
				</div>
				<span class="username-linking"></span>
				<br>
				<span class="no-account">No SwitchBru Account is linked.</span>
			</div>
			<input tabindex="-1" class="link-account-button" id="link-sign" right="link-create" down="link-later" onclick="signIn()" type="submit" value="Sign In">
			<input tabindex="-1" class="link-account-button" id="link-create" left="link-sign" down="link-later" onclick="createAccount()" type="submit" value="Create Account">
			<input tabindex="-1" class="link-account-button selected" id="link-later" up="link-sign" onclick="later()" type="submit" value="Later">
			<div id="benefits">Linking to a SwitchBru Account enables you to fully enjoy the SwitchBru DNS and its online and user features.</div></div>
		</div>`;
		
var customThemeHTML = `<div class="nav" style="height: 90px;">
			Custom Theme<span class="next" right="ok-back" down="ok-back" left="ok-back" up="ok-back"></span>
		</div>
		<div class="container" id="custom-theme">
			<div id="custom-theme-info" style="width: 50%">
				Creating a custom theme allows you to give the SwitchBru online page your own unique and exclusive look.<br><br>
				To start, please visit <a href="https://switchbru.com/account/theme/" tabindex="-1" id="sbt-link" down="ok-back">https://switchbru.com/account/theme/</a> on your PC.<br><br>
				<span class="smaller">
					Please note that in order to create a custom theme, you must have a small understanding of how to create JSON strings.
				</span><br><br><br><br>
				<input type="submit" class="selected" id="ok-back" value="OK" onclick="history.back()" tabindex="-1" up="sbt-link">
			</div>
		</div>`;
		
var friendNotificationsHTML = `<div class="nav" style="height: 90px;">
			<span class="title">Friend Notifications For User</span><span class="next" right="request-notifications" down="request-notifications" left="request-notifications" up="request-notifications"></span>
		</div>
		<div class="container" id="custom-theme">
			<div id="notification-info" style="width: 50%">
				You will only receive friend notifications when you are online.
				<div class="system-buttons selected" id="request-notifications" down="online-users">
					<span>Friend Request Notifications</span> <span class="request-notifications text-right">On</span>
				</div>
				<div class="system-buttons" id="online-users" up="request-notifications" down="friends-notify">
					<span>Online Users</span> <span class="online-users text-right">On</span>
				</div>
				<div class="system-buttons" id="friends-notify" up="online-users">
					<span>Notify When Friends Go Online</span> <span class="friends-notify text-right">All friends</span>
				</div>
				<div class="friends-notify-explain">If you receive a notification that a friend has come online, you won't receive<br>another if the same friend comes online again within half an hour.</div>
				<select class="friends-online">
					<option value="all">All friends</option>
					<option value="best">Best friends</option>
					<option value="off">No one</option>
				</select>
			</div>
		</div>`;
	
var messageNotificationsHTML = `<div class="nav" style="height: 90px;">
			<span class="title">Message Notifications for User</span><span class="next" right="later-button" down="later-button" left="later-button" up="later-button"></span>
		</div>
		<div class="container" id="custom-theme">
			<div id="notification-info" style="width: 50%">
				You will only receive message notifications when you are online.
				<div class="system-buttons selected" id="receive-notifications" down="show-message">
					<span>Receive Message Notifications</span> <span class="receive-notifications text-right">On</span>
				</div>
				<div class="system-buttons" id="show-message" up="receive-notifications">
					<span>Show Message</span> <span class="show-message text-right">On</span>
				</div>
				<div class="friends-notify-explain">Choose whether or not the message should be shown in the notification.</div>
				
			</div>
		</div>`;
		
var friendSettingsHTML = `<div class="nav" style="height: 90px;">
			<span class="title">Friend Settings</span><span class="next" right="show-status" down="show-status" left="show-status" up="show-status"></span>
		</div>
		<div id="friend-settings" style="width: 55%;">
			<span class="friend-settings-code">
				Your friend code: <span class="code"></span>
			</span>
			<div class="system-buttons selected" id="show-status" down="receive-requests">
				<span>Who do you want to see your online status?</span> <span class="show-status text-right">All friends</span>
			</div>
			<div class="system-buttons" id="receive-requests" up="show-status" down="friend-notifications">
				<span>Receive Friend Requests</span> <span class="receive-requests text-right">On</span>
			</div>
			<div class="system-buttons" id="friend-notifications" up="receive-requests">
				<span>Friend Notifications</span> 
			</div>
			<select class="show-status">
				<option value="all">All friends</option>
				<option value="best">Best friends</option>
				<option value="off">No one</option>
			</select>
		</div>`;
		
var receivedHTML = `<div class="nav" style="height: 90px;">
			<span class="title">Received Friend Requests</span>
		</div>
		<div class="users-list-page" id="received-friend-requests">
		</div>`;
	
var sentHTML = `<div class="nav" style="height: 90px;">
			<span class="title">Sent Friend Requests</span>
		</div>
		<div class="users-list-page" id="sent-friend-requests">
		</div>`;
		
var blockedHTML = `<div class="nav" style="height: 90px;">
			<span class="title">Blocked-User List</span>
		</div>
		<div class="users-list-page" id="blocked-page">
		</div>`;
		
var friendCornerHTML = `<div class="nav" style="height: 90px;">
			Friend Corner<span class="next" right="corner-start" down="corner-start" left="corner-start" up="corner-start"></span>
		</div>
		<div class="container" id="friend-corner">
			<div id="friend-corner-info">
				<img class="fc-image" src="images/friend_corner.png">
				<span>Search for random users to add friends.
					<div class="inner-text">
						While you are finding users in the Friend Corner, you are also visible to other users who are currently in the Friend Corner.
					</div>
				</span>
				<input type="submit" class="selected" id="corner-start" value="Start" tabindex="-1">
			</div>
		</div>`;

var friendCornerPage = `<div id="friend-corner-info">
				<div class="selectthe-user">
					Select the user you would like to be friends with. 
					<div class="request-will">
						A friend request will be sent.
					</div>
				</div>
			</div>
			<div class="friend-corner">
				<div id="user-pic">
					<div id="user-pic-wrapper">
						<img height="100" id="user-pic-image">
					</div>
					<span class="user-you">You</span>
					<span class="user-you-name"></span>
				</div>
			</div>
			<div id="users-corner">
				<div class="user-select selected">
					<img class="loading-icon" src="images/loading.gif">
				</div>
				<div class="user-select">
					<img class="loading-icon" src="images/loading.gif">
				</div>
				<div class="user-select">
					<img class="loading-icon" src="images/loading.gif">
				</div>
				<div class="user-select">
					<img class="loading-icon" src="images/loading.gif">
				</div>
				<div class="user-select">
					<img class="loading-icon" src="images/loading.gif">
				</div>
				<div class="user-select">
					<img class="loading-icon" src="images/loading.gif">
				</div>
				<div class="user-select">
					<img class="loading-icon" src="images/loading.gif">
				</div>
			</div>`;
			
var requestSent = `<br><span class='sent'><svg class="svg-inline--fa fa-envelope fa-w-16" aria-hidden="true" data-fa-processed="" data-prefix="far" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path></svg> Request Sent</span>`;

var friendButtons = `<div class="popup-button selected" id="best-friend" right="online-status" down="options">
						<svg class="svg-inline--fa fa-star fa-w-18" aria-hidden="true" data-fa-processed="" data-prefix="far" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg><!-- <i class="far fa-star"></i> -->
						<span class="best">Best Friends</span>
					</div>
					<div class="popup-button" id="options" up="best-friend" down="message" right="online-status">
						<span class="options">Options</span>
					</div>
					<div class="popup-button" id="message" up="options" right="online-status">
						<span class="message">Send Message</span>
					</div>`;
					
var requestButtons = `<div class="popup-button selected" id="become-friends" down="dont">
						<div class="padding">
							<span class="become">Become Friends</span>
						</div>
					</div>
					<div class="popup-button" id="dont" up="become-friends" down="block">
						<span class="dont">Don't Become<br>Friends</span>
					</div>
					<div class="popup-button" id="block" up="dont">
						<span class="block">Block</span>
					</div>`;
					
var codeButtons = `<div class="popup-button selected" id="send">
						<span class="send">Send Friend Request</span>
					</div>`;

var sentButtons = `<div class="popup-button selected" id="delete">
						<span class="delete">Delete</span>
					</div>`;
					
var blockedButtons = `<div class="popup-button selected" id="unblock">
						<span class="unblock">Unblock</span>
					</div>`;
					
var messagesHTML = `<div class="nav">
				&nbsp;&nbsp;<span class="messages-title">Messages</span><div class="current-messaging">
					<div class="messaging-name"></div>
					<div class="last-active"></div>
				</div>
				<div class="details"><img src="images/Y_button.png"> Details</div>
				<span class="next" down="" up="" left="" right=""></span>
			</div>
			<div class="container">
				<div class="menu">
					<img class="loading" src="images/loading.gif">
				</div>
				<div class="main" id="messages-main">
				</div>
			</div>`;
			
var detailsHTML = `<div class="details-content"><div class="system-buttons selected" id="mute-conversation" down="member-1">
					<span>Mute Notifications</span> <span class="mute-conversation text-right disabled">Off</span>
				</div>
				<h2>Members</h2>
				<div class="members">
				</div>
				<div class="details-content"><div class="system-buttons" id="hide-conversation">
					<span>Hide Conversation</span> <span class="hide-conversation text-right disabled">Off</span>
				</div>
				<div class="hide-explain">This conversation will be hidden from your messages list until the user sends<br>you a message again, or you send them a message through the Friend List.</div>
				</div>`;

// Load custom links
function loadCustomLinks() {
	// HTML for custom links
	customLinksHTML = `<div class="link-wrap">
		<div class="link custom-link" id="custom-1" left="outer-links" down="custom-4" right="custom-2"><a tabindex="-1">Add</a></div>
		<div class="link custom-link" id="custom-2" left="custom-1" down="custom-5" right="custom-3"><a tabindex="-1">Add</a></div>
		<div class="link custom-link" id="custom-3" left="custom-2" down="custom-6"><a tabindex="-1">Add</a></div>
		<div class="link custom-link" id="custom-4" left="outer-links" up="custom-1" right="custom-5" down="custom-7"><a tabindex="-1">Add</a></div> 
		<div class="link custom-link" id="custom-5" left="custom-4" up="custom-2" right="custom-6" down="custom-8"><a tabindex="-1">Add</a></div> 
		<div class="link custom-link" id="custom-6" left="custom-5" up="custom-3" down="custom-9"><a tabindex="-1">Add</a></div>
		<div class="link custom-link" id="custom-7" left="outer-links" up="custom-4" right="custom-8"><a tabindex="-1">Add</a></div> 
		<div class="link custom-link" id="custom-8" left="custom-7" up="custom-5" right="custom-9"><a tabindex="-1">Add</a></div> 
		<div class="link custom-link" id="custom-9" left="custom-8" up="custom-6"><a tabindex="-1">Add</a></div>
	</div>`;
	if(userID == 0) { // If they don't have a user
		// Save the HTML
		saveCustomLinks();
	}
	else {
		$.ajax({
			url: userURL+"getLinks", // Gets the user's custom links as JSON
			method: "POST",
			data: {"id":userID,"UID":UID},
			dataType: "json",
			success: function(linkData) {
				if(linkData.error == false) { // If there is no error
					if(linkData.hasLinks == true) { // If the user has custom links
						var arr = linkData.data;
						for (i = 0; i < arr.length; i++) { // Loop through each link
							// Add the link, the name and set it as a link
							customLinksHTML = $(customLinksHTML).find("#custom-"+arr[i].number).addClass("completed").end()[0].outerHTML;
							customLinksHTML = $(customLinksHTML).find("#custom-"+arr[i].number+" a").attr("href", arr[i].url).text(arr[i].title).end()[0].outerHTML;
						}
						saveCustomLinks();
					}
				}
			},
			error: function() {
				// If there's an error, just save the HTML
				saveCustomLinks();
			}
		});
	}
	saveCustomLinks();
}

// Save the custom links HTML
function saveCustomLinks() {
	$("#tab-five .flex").first().html($(customLinksHTML).html());
}

// Load the user page
function loadUserPage() {
	$("#second-page").html(userPageHTML);
	// Alter some things
	if(hasAccount) {
		setTimeout(function() {
			if(!$(".friends-online").length) {
				$("#friends.inner").addClass("account").append('<div class="friends-online">Online: <span class="online">0</span></div>');
			}
			if(!$(".unread-messages").length) {
				$("#messages.inner").addClass("account").append('<div class="unread-messages">Unread: <span class="unread">0</span></div>');
			}
		}, 100);
	}
}

// Load the Settings page
function loadSettingsPage() {
	$("#second-page").html(settingsPageHTML);
}

// Load the SwitchBru Account page
function loadAccountPage() {
	// Fade out pages
	$("#main-page").fadeOut("fast");
	$("#second-page").fadeOut("fast", function() {
		$(this).html(accountPageHTML);
	});
	setTimeout(function() {
		// Set the page to show the correct info
		$(".linking-icon-wrapper").css("background-color", "#"+userBG);
		$(".linking-icon-image").attr("src", userURL+"icons/"+userPhoto);
		$(".username-linking").text(userName);
		// Fade the page in
		$("#second-page").fadeIn("fast");
		history.pushState({page: "link_account", stage: "first"}, "", "");
	}, 500);
}

// Edit icon page
function editIconPage() {
	$("#second-page").html(editIconHTML);
}

// Create icon page
function createIconPage() {
	$("#second-page").html(editIconCreateHTML);
}

// Left side of user icon page
function leftSide(s, t) {
	if(typeof t === 'undefined') { // If not creating a user
		// Set the variables
		var lh = leftSideHTML;
		var b = userBG;
		var p = userPhoto;
		history.pushState({page: "user", tab: lastTab}, "", "");
		history.pushState({page: "icon", part: "home"}, "", "");
	}
	else if(t == "create") {
		var lh = leftSideCreateHTML;
		var b = newBG;
		var p = newPic + ".png";
	}
	// Update the page with correct icons
	$(".left-side").html(lh);
	$(".selected").removeClass("selected");
	$(".left-side #"+s).addClass("selected");
	$(".icon-right-wrapper").css("background-color", "#"+b);
	$(".icon-right-image").attr("src", userURL+"icons/"+p);
	$("#edit-character").attr("src", userURL+"icons/"+p);
	$(".bg-color").css("background-color", "#"+b);
}

// Clicking custom links
function customClick() {
	$(".custom-link").off("click").on("click", function() {
		// Check if the link is completed
		if(!$(this).hasClass("completed")) {
			// Create a new link
			addLink($(this).attr("id"));
		}
		else {
			// If not editing the links
			if(!editingLinks) {
				// Go to the link
				location.href = $(this).find("a").attr("href");
			}
		}
	});
	$(".main #custom-edit").click(function() {
		// Edit the links
		editLinks();
	});
}

// Set variables
var pics = [];
var bgs = [];
var newBG;
var newPic;

// New user next
function NUNext() {
	// First create user page (for back button)
	history.pushState({page: "create_user", section: "first", msg: pMsg}, "", "");
	// If creating the icon
	if(creatingIcon) {
		// Fade out the second page
		$("#second-page").fadeOut("fast", function() {
			$(this).html(newUserHTML);
			creatingIcon = false;
			setTimeout(function() {
				$("#new-user-page").html(newUserHTML3);
			}, 50);
		});
	}
	else {
		// Fade out the new user page
		$("#new-user-page").fadeOut("fast", function() {
			$(this).html(newUserHTML3);
		});
	}
	// Get a new random set of user icons
	randomNew();
	setTimeout(function() {
		// Loop through the icons
		for(i = 1; i <= 12; i++) {
			// Set the background and images
			$(".icon-selector:nth-of-type("+i+")").find(".icon-selector-wrapper").css({"background-color":"#"+bgs[i-1]}).find(".icon-selector-image").attr("src", userURL+"icons/"+pics[i-1]+".png");
			
			// Set the image and background IDs for easy access
			$(".icon-selector:nth-of-type("+i+")").attr("id", "new-icon"+i).attr("c", bgs[i-1]).attr("i", pics[i-1]+".png");
			
			// Handle joystick controls (up/down/left/right)
			var e;
			if(i !== 1 && i !== 7) {
				e = i-1;
				$("#new-icon"+i).attr("left", "new-icon"+e);
			}
			else if(i == 1) {
				$("#new-icon"+i).addClass("selected");
				newBG = bgs[i-1];
				newPic = pics[i-1];
			}
			if(i !== 6 && i !== 12) {
				e = i+1;
				$("#new-icon"+i).attr("right", "new-icon"+e);
			}
			if(i <= 6) {
				e = i+6;
				$("#new-icon"+i).attr("down", "new-icon"+e);
			}
			else {
				$("#new-icon"+i).attr("down", "create-own");
			}
			if(i > 6) {
				e = i-6;
				$("#new-icon"+i).attr("up", "new-icon"+e);
			}
		}
		// Second create user page for back button
		history.pushState({page: "create_user", section: "second", msg: $(".return-to").attr("returnto")}, "", "");
		// Add click event for choosing a new icon
		newIconsClick();
		// Fade pages in
		$("#second-page").fadeIn("fast");
		$("#new-user-page").fadeIn("fast");
	}, 500);
}

// Prepare the suggested random icons
function prepIcons() {
	var og = `<div class="icon-selector"><div class="icon-selector-wrapper"><img height="135" class="icon-selector-image"></div></div>`;
	var extra = "";
	for(i = 0; i < 12; i++) {
		extra += og;
	}
	return extra;
}

// Function for clicking an icon
function newIconsClick() {
	$(".icon-selector").click(function() {
		chooseNewIcon($(this).attr("i"), $(this).attr("c"));
	});
}

// Toggling the custom theme button
function customThemeToggle() {
	// If the user is logged in
	if(userID !== 0) {
		// Enable custom theme
		customEnabled = true;
		// Return HTML for button
		return `<div class="select-theme" id="custom" left="outer-themes" up="dark">
						<div class="color"></div>
						<span>Custom Theme</span>
						<img src="images/tick_`+themeTick+`.png">
					</div>`;
	}
	else {
		// Return empty
		return "";
	}
}

// Custom theme help page
function customThemePage() {
	// Fade out the page and change the HTML
	$("#second-page").fadeOut("fast", function() {
		$("#second-page").html(customThemeHTML);
		setTimeout(function() {
			// Fade the page back in
			$("#second-page").fadeIn("fast");
			// Add pushstate for back button
			history.pushState({page: "settings", tab: "themes"}, "", "");
			history.pushState({page: "custom_theme"}, "", "");
		}, 600);
	});
}

// Friend Notifications page
var friend_request_notify = 1;
var online_users = 1;
var friends_notify = 1;
function friendNotificationsPage(page) {
	page = typeof page !== 'undefined' ? page : "settings";
	// Fade out the page and change the HTML
	$("#second-page").fadeOut("fast", function() {
		$("#second-page").html(friendNotificationsHTML);
		$.ajax({
			url: userURL+"getNotificationSettings",
			method: "POST",
			data: {"id": userID, "t": "friends"},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Get variables
					friend_request_notify = response.requests;
					online_users = response.users;
					friends_notify = response.friends;
					if(friend_request_notify == 0) {
						$(".request-notifications").addClass("disabled").text("Off");
					}
					if(online_users == 0) {
						$(".online-users").addClass("disabled").text("Off");
					}
					var v = "all";
					if(friends_notify == 0) {
						$(".friends-notify").text("No one");
						v = "off";
					}
					else if(friends_notify == 1) {
						$(".friends-notify").text("Best friends");
						v = "best";
					}
					$(".friends-online").val(v);
					// Set the title
					$(".nav .title").text("Friend Notifications for "+userName);
					// Enable the select box
					enableNotifyChange();
					// Enable click events
					$("#request-notifications").click(function() {
						changeFriendNotifications();
					});
					$("#online-users").click(function() {
						changeUserNotifications();
					});
					// Fade the page back in
					$("#second-page").fadeIn("fast");
					// Add pushstate for back button
					if(page == "settings") {
						history.pushState({page: "settings", tab: "notifications"}, "", "");
					}
					else if(page == "friend-settings") {
						history.pushState({page: "friend_settings"}, "", "");
					}
					history.pushState({page: "friend_notifications"}, "", "");
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
}

// Message Notifications page
var receive_notifications = 1;
var show_message = 1;
function messageNotificationsPage() {
	// Fade out the page and change the HTML
	$("#second-page").fadeOut("fast", function() {
		$("#second-page").html(messageNotificationsHTML);
		$.ajax({
			url: userURL+"getNotificationSettings",
			method: "POST",
			data: {"id": userID, "t": "messages"},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Get variables
					receive_notifications = response.messages;
					show_message = response.show_message;
					if(receive_notifications == 0) {
						$(".receive-notifications").addClass("disabled").text("Off");
					}
					if(show_message == 0) {
						$(".show-message").addClass("disabled").text("Off");
					}
					// Set the title
					$(".nav .title").text("Message Notifications for "+userName);
					// Enable click events
					$("#receive-notifications").click(function() {
						changeMessageNotifications();
					});
					$("#show-message").click(function() {
						showHideMessage();
					});
					// Fade the page back in
					$("#second-page").fadeIn("fast");
					// Add pushstate for back button
					history.pushState({page: "settings", tab: "notifications"}, "", "");
					history.pushState({page: "message_notifications"}, "", "");
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
}

// Friend Settings page
var online_status = 2;
var receive_requests = 1;
function friendSettingsPage() {
	// Fade out the page and change the HTML
	$("#second-page").fadeOut("fast", function() {
		$("#second-page").html(friendSettingsHTML);
		$.ajax({
			url: userURL+"friendSettings",
			method: "POST",
			data: {"id": userID, "t": "get"},
			dataType: "json",
			success: function(response) {
				if(response.error == false) { // If there was no error
					// Get variables
					online_status = response.status;
					receive_requests = response.receive_requests;
					// Set default values
					var v = "all";
					if(online_status == 0) {
						$("span.show-status").text("No one");
						v = "off";
					}
					else if(online_status == 1) {
						$("span.show-status").text("Best friends");
						v = "best";
					}
					$("select.show-status").val(v);
					if(receive_requests == 0) {
						$(".receive-requests").addClass("disabled").text("Off");
					}
					// Enable click events
					$("#friend-notifications").click(function() {
						friendNotificationsPage("friend-settings");
					});
					$("#receive-requests").click(function() {
						receiveRequests();
					});
					// Enable the select box
					enableStatusChange();
					// Show friend code
					$(".friend-settings-code .code").text(friendCode);
					// Fade the page back in
					$("#second-page").fadeIn("fast");
					// Add pushstate for back button
					history.pushState({page: "user", tab: "outer-usettings"}, "", "");
					history.pushState({page: "friend_settings"}, "", "");
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
}

// Recieved Friend Requests page
function receivedPage() {
	$("#second-page").html(receivedHTML);
	history.pushState({page: "received_requests"}, "", "");
}
// Sent Friend Requests page
function sentPage() {
	$("#second-page").html(sentHTML);
	history.pushState({page: "sent_requests"}, "", "");
}
// Blocked-User List page
function blockedPage() {
	$("#second-page").html(blockedHTML);
	history.pushState({page: "blocked_page"}, "", "");
}

// Friend Corner starting page
function loadFriendCorner() {
	// Fade out the page and change the HTML
	$("#second-page").fadeOut("fast", function() {
		$("#second-page").html(friendCornerHTML);
		setTimeout(function() {
			var c = "";
			if((theme == 2 && themeTick == "dark") || theme == 1) {
				$(".fc-image").addClass("dark");
			}
			// Wait, and then fade the page back in
			$("#second-page").fadeIn("fast");
			// Add pushstate for back button
			history.pushState({page: "user", tab: "outer-add"}, "", "");
			history.pushState({page: "friend-corner", part: "start"}, "", "");
			// On start button click
			$("#corner-start").click(function() {
				friendCorner();
			});
		}, 500);
	});
}

var friendCornerActive = false;
// Friend Corner real page
function friendCorner() {
	// Fade out the page and change the HTML
	$("#friend-corner").fadeOut("fast", function() {
		$("#friend-corner").html(friendCornerPage);
		setTimeout(function() {
			// Set the user's image
			$("#user-pic-wrapper").css("background-color", "#"+userBG);
			$("#user-pic-image").attr("src", userURL+"icons/"+userPhoto);
			// Set the name
			$(".user-you-name").text(userName);
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
			// On click
			FCClick();
			// Wait, and then fade the page back in
			$("#friend-corner").fadeIn("fast");
			// Add pushstate for back button
			history.pushState({page: "friend-corner", part: "real"}, "", "");
			friendCornerActive = true;
			friendCornerRefresh();
		}, 500);
	});
}

// Load the messages page
function openMessages(id) {
	id = typeof id !== 'undefined' ? id : "";
	// Check if they have an account
	if(hasAccount) {
		// Remove the overlay popup if necessary
		if(id !== "") {
			$("#overlay").fadeOut("slow", function() {
				$(".blur").removeClass("blur");
				resetPopup();
			});
		}
		$("#second-page").fadeOut("fast", function() {
			$(this).html(messagesHTML);
			// Change the Y Button color
			if(theme == 1 || (customF == 1 && theme == 2)) {
				$(".details img").addClass("dark");
			}
		});
		setTimeout(function() {
			// Fade the page in
			$(".selected").removeClass("selected");
			$("#second-page").fadeIn("fast");
			history.pushState({page: "user", tab: lastTab}, "", "");
			history.pushState({page: "messages"}, "", "");
			$(".details").click(function() {
				showDetails();
			});
			// Load the actual messages
			loadMessages(id);
		}, 500);
	}
}

// Arrays for months and days
var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
var days = ['SUN','MON','TUE','WED','THU', 'FRI','SAT'];
