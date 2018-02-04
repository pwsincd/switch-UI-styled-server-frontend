		//Javascript to manipulate switchbru dns UI bu pwsincd
		//
		//sidebar highlighting
		$('.inner').click(function(){
			$('.inner').removeClass('inner-active');
			$(this).addClass('inner-active');
		});
		//set variabless
		var targetDiv = document.getElementById('content');
		var htmlContent = '';
		var intro = '<div><p><h2>Welcome to SwitchBru DNS.</h2><p><br>Redirecting to <a href="https://www.google.com/webhp?nomo=1&hl=en">Google</a> in <span id="count">5</span> seconds. <div><input type="submit" id="cancel" value="Cancel Redirection." onclick="populateData(this.id)" /></div></div>';
		targetDiv.innerHTML = intro;
		//option specific html
		function populateData(event){
			switch(event){
				case 'nav':{
					location.reload();
					break;
				}
				case 'one':{
					htmlContent = `<div class="google"><img class="google-rs" src="images/Google.png">
					<br><br>
					<form method="get" action="http://www.google.com/search">
					<div style="googlesearch">
					<input type="text" name="q" size="25" maxlength="255" value="" placeholder="Enter your search query..." /> <input type="submit" value="Google Search" />
					</div>
					</form>
					</div>`;
					break;
				}
				case 'two':{
					htmlContent = `<div class="google"><img class="webkit" src="images/webkit.png">
					<br><br>
					<form id="form" onsubmit="return false;">
					<div style="googlesearch">
					<input type="url" name="q" size="25" maxlength="255" id="url" value="" placeholder="Enter your URL..." />
					<input type="submit" value="Load Page" onclick="loadurl(url)" />
					</form>
					</div>
					<br>
					Enter a URL above and hit Load Page.
					</div>`;
					break;
				}
				case 'three':{
					htmlContent = `<div><h2><i class="far fa-question-circle"></i> SwitchBru DNS Server Feedback</h2><br>
					This is a survey to collect information on the usage of the SwitchBru DNS server (45.55.142.122).<br><br>
					We have made some design changes recently, and would like to better understand how people use the DNS service.<br><br>
					For usage info please visit : <a href="http://switchbru.com/dns/">Switchbru DNS website</a><br><br>
					<form id="form" onsubmit="return false;">
					<div style="googlesearch">
					<input type="submit" value="Take our survey" onclick="survey()" />
					</form>
					</div></div>`;
					break;
				}
				case 'four':{
					htmlContent = `<div class="youtube"><img class="ytimg" src="images/youtube.png"><div>Thanks to Ep8Script on gbatemp there is now a way to watch YouTube videos on your switch! There is a thread about it <a href="https://gbatemp.net/threads/tool-website-for-watching-most-youtube-videos-on-the-switch.494796/">here</a>.<br><br>

<h3>Instructions</h3>
<font color="red">You cannot watch videos using the DNS trick.</font> Nintendo has blocked video playback in the login applet.<br><br>

In order to watch videos, you must use the Share applet. To access this applet, do the following:<br>

<ol>
<li>Go to your Wifi settings and turn OFF this custom DNS server (this will prevent you from accessing this browser)</li>
<li>Go to the Switch's User settings, and try to link a Facebook account for social media.</li>
<li>A login page will come up, go to the bottom and click one of the links on the bottom to go to Facebook for real></li>
<li class="skip"><i>You can now browse Facebook, but can't access external websites. That's okay</i></li>
<li>On Facebook, search for "<b>SwitchBru</b>" to find our <a href="https://www.facebook.com/SwitchBru/">facebook page.</a> (you might have to sign in)</li>
<li>In the post at the top of the profile page, click the google sites URL for watching videos!</li>
<li>Search for a YouTube video you want to play, and it should play</li>
<li>If you want to go back to the rest of the Internet, turn back on the custom DNS in Wifi settings</li>
</ol>

<h3>How does it work</h3>
The Switch has a whitelist of websites that it's allowed to visit in the Share applet. This is more restricted than the Login applet, but it's allowed to play videos. Google.com is one of those websites, so the Google site link allows the switch to play a video that is located on the Facebook page.<br>
<br>
If you need help troubleshooting or setting it up you can post in the above GBATemp thread, or contact us.
<br><br>
<h3>Videos still won't play on the website</h3>
Make sure you are accessing the page <b>through the share applet</b> in User settings, when you go to link a Facebook account. You have to search for the post to click on the link for it to work. Doing it through this page using the DNS trick will result in the video not being able to play. <b>This is a technical limitation!</b> Blame Nintendo!<br><br>

Using our page isn't necessary, but you do need a way to get this link to the "Share" applet somehow: <a href="https://sites.google.com/site/ytnintendoswitch/">https://sites.google.com/site/ytnintendoswitch/</a>

<br><br><br></div>`;
					break;
				}
				case 'five':{
					htmlContent = `
					<h3>Switch-related</h3>
					<div class="flex">
						<div class="link"><a href="https://realdekkia.github.io/switch-tetris/">Play Tetris</a></div>
						<div class="link"><a href="http://switchboard.cool/">Switchboard</a></div>
						<div class="link"><a href="http://fights.today/">fights.today</a></div>
						<div class="link"><a href="https://www.wiiubru.com/2048/">2048</a></div>
						<div class="link"><a href="https://quickdraw.withgoogle.com/">QuickDraw</a></div>
						<div class="link"><a href="http://browserquest.mozilla.org/">BrowserQuest</a></div>
						<div class="link"><a href="https://www.google.com/logos/2010/pacman10-i.html">Pac-Man</a></div>
						<div class="link"><a href="http://www.wiiubru.com/gp.html">Gamepad</a></div>
						<div class="link"><a href="https://gbatemp.net/categories/nintendo-switch-discussions.282/">GBAtemp</a></div>
					</div>
					<br>
					If you have your own site that you'd like to add to this page, let us know!
					<br>
					<h3>Other Links</h3>
					<div class="flex">
						<div class="link"><a href="https://reddit.com">Reddit</a></div>
						<div class="link"><a href="https://tumblr.com">Tumblr</a></div>
						<div class="link"><a href="https://twitter.com">Twitter</a></div>
						<div class="link"><a href="https://wikipedia.org">Wikipedia</a></div>
						<div class="link"><a href="https://mail.google.com">GMail</a></div>
						<div class="link"><a href="https://facebook.com">Facebook</a></div>
						<div class="link"><a href="https://roblox.com">Roblox.com</a></div>
						<div class="link"><a href="https://minecraft.net">Minecraft.net</a></div>
						<div class="link"><a href="http://zeldadungeon.net">ZeldaDungeon</a></div>
						<div class="link"><a href="https://youtube.com">YouTube</a></div>
						<div class="link"><a href="https://github.com">GitHub</a></div>
						<div class="link"><a href="https://deviantart">DeviantArt</a></div>
						<div class="link"><a href="https://wattpad.com">WattPad</a></div>
						<div class="link"><a href="https://gdax.com">GDAX</a></div>
						<div class="link"><a href="https://instagram.com">Instagram</a></div>
						<div class="link"><a href="https://duckduckgo.com">DuckDuckGo</a></div>
						<div class="link"><a href="https://yahoo.com">Yahoo</a></div>
						<div class="link"><a href="https://bing.com">Bing</a></div>

					</div>
					`;
					break;
				}
				case 'cancel':{
					htmlContent = `<div>
					<p><h2>Welcome to SwitchBru DNS.</h2><p>
					<br>Redirection to Google cancelled welcome to our DNS server. 
					<div><input type="submit"  value="Continue to Google" onclick="google()" />
					</div>
					<br>
					Find us at :<br><br><a href="https://discord.gg/y2ASN3K"><i class="fab fa-discord"></i>   https://discord.gg/y2ASN3K</a>
					<span>  and  </span>
					<a href="https://www.irccloud.com/irc/freenode:2/channel/switchbru"><i class="far fa-comments"></i>   IRCCLOUD</a>
					</div>`;
					break;
				}
				case 'about':{
					htmlContent = `<h2>About SwitchBru DNS server</h2>
					This service is provided free of charge with no warranty whatsoever. The service does not store or retain any personal data. Besides providing the Google redirect for the Nintendo Switch, all DNS queries are handled via <a href="https://developers.google.com/speed/public-dns/">Google DNS</a>.
<br><br>
We are hosting this service as we believe that those of us that purchased an Internet-capable Switch should have the right to browse the web! We hope that one day Nintendo adds an official web browser to the console.
<br><br>
This server <b>does not currently block firmware updates</b>. If you are looking to block updates, you should use <a href="https://reswitched.tech/info/faq">ReSwitched DNS</a>, or stay offline.`;
					break;
				}
			}
			targetDiv.innerHTML = htmlContent;
			var myDiv = document.getElementById('content');
			myDiv.scrollTop = 0;
		};
		// time function
		function checkTime(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		}
		function startTime() {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			m = checkTime(m);
			document.getElementById('time').innerHTML = h + ":" + m;
			t = setTimeout(function() {
				startTime()
			}, 500);
		}
		startTime();	
		// redirection countdown
		window.onload = function(){
			(function(){
				var counter = 5;
				setInterval(function() {
					counter--;
					if (counter >= 0) {
						span = document.getElementById("count");
						span.innerHTML = counter;
					}
					if (counter === 0) {
						clearInterval(counter);
						window.location.href = "https://www.google.com/webhp?nomo=1&hl=en";
					}   
				}, 1000);
			})();

		}
		//link specific functions
		function google() {
			window.location.href = "https://www.google.com/webhp?nomo=1&hl=en";
		}
		function loadurl() {
			var input = document.getElementById("url").value;
			
			// add an http:// to the front if it's not present
			if (!input.toLowerCase().startsWith("http://") && !input.toLowerCase().startsWith("https://"))
				input = "http://" + input;
			
			window.location.href = input;
		}
		function survey() {
			window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSewt6insjUEzg0dWV--n5OlDodk2Zflr3pbd4XWs6hEuZTzNg/viewform";
		}

