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
					Enter a URL including the http:// and hit Load Page.
					</div>`;
					break;
				}
				case 'three':{
					htmlContent = `<div><h2><i class="far fa-question-circle"></i> SwitchBru DNS Server Feedback</h2><br>
					This is a survey to collect information on the usage of the SwitchBru DNS server (45.55.142.122).<br><br>
					We had a server outage from Wednesday to Friday recently, and would like to better understand how many people use the DNS service now that it is back up again.<br><br>
					For usage info please visit : <a href="http://switchbru.com/dns/">Switchbru DNS website</a><br><br>
					<form id="form" onsubmit="return false;">
					<div style="googlesearch">
					<input type="submit" value="Take our survey" onclick="survey()" />
					</form>
					</div></div>`;
					break;
				}
				case 'four':{
					htmlContent = `<div class="youtube"><img class="ytimg" src="images/youtube.png"><br><br>(Placeholder content)   
You cannot watch videos using the DNS trick. Nintendo has blocked video playback in the login applet.<br>
In order to watch videos, you must use the Share applet. To access this applet, do the following:<br><br>
Go to your Wifi settings and turn OFF this custom DNS server (this will prevent you from accessing the browser)
Go to the User settings, and try to link a Facebook account for social media.
A login page will come up after pressing "link", go to the bottom and click one of the links on the bottom to go to Facebook for real
Notice: You can now browse Facebook, but can't access external websites. That's okay
On Facebook, search for "SwitchBru" to find our facebook page. (you might have to sign in)
In the post at the top of the profile page, click the google sites URL for watching videos!
Search for a video you want to play, and it should play
If you want to go back to the rest of the Internet, turn back on the custom DNS in Wifi settings</div>`;
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
			window.location.href = input;
		}
		function survey() {
			window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSewt6insjUEzg0dWV--n5OlDodk2Zflr3pbd4XWs6hEuZTzNg/viewform";
		}

