		//sidebar highlinhting
		$('.inner').click(function(){
			$('.inner').removeClass('inner-active');
			$(this).addClass('inner-active');
		});
		$('.nav').click(function(){
			$('.inner').removeClass('inner-active');
		});
		//set vars
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
					htmlContent = `<div class="flex">
					<div class="link">link</div>
					<div class="link">link</div>
					<div class="link">link</div>
					<div class="link">link</div>
					<div class="link">link</div>
					<div class="link">link</div>
					<div class="link">link</div>
					<div class="link">link</div>
					</div>`;
					break;
				}
				case 'cancel':{
					htmlContent = `<div><p><h2>Welcome to SwitchBru DNS.</h2><p><br>Redirection to Google cancelled welcome to our DNS server. <div><input type="submit"  value="Continue to Google" onclick="google()" /></div></div>`;
					break;
				}
			}
			targetDiv.innerHTML = htmlContent;
		};
		// time
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

