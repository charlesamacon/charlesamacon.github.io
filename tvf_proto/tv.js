//Charles Alan Macon
//CSCE 3420 - Final Project

var playlist = {
	// List of links
	links: [],
	// Initial index
	index: 0,
	// Player object
	player: {},
	// Target object
	target: {},
	// Data stuff...all basic API work.
	data: {},
	// Basic handling of events
	event: function(e) {
		playlist.target = e.target;
		playlist.data = e.data;
		return playlist;
	},
	playVideo: function(id) {
		
		// If, for whatever reason, id isn't properly defined, default back to index.
		if (typeof id === 'undefined') 
		{
			id = playlist.index;
		}
		else
		{
			playlist.index = id;
		}
		
		console.log("Play Video");
		//var data;
		// Yay, youTube API!
		playlist.target.loadVideoById(playlist.links[id]);
		setTimeout(function() {
			// This injects the current video title into the page.
			// 1.5 seconds seems to work in most cases. Just a little lag.
			var data = playlist.target.getVideoData();
			var title = data['title'];
			var currentVideo = document.getElementById("currentVideo");
			console.log(currentVideo);
			if (title != "")
			{
				currentVideo.innerHTML = title;
				console.log(title);
			}
			else
			{
				currentVideo.innerHTML = "Loading Channel...";
				console.log("Video is taking a while to load...");
			}
		}, 1500);
		//var title = data['title'];
		//console.log(data);
	},
	playNext: function() {
		console.log("Next Video");
		console.log("Play random from channel");
		// Plays next random video, this will produce duplicates...
		var ran = Math.floor(Math.random() * (playlist.links.length - 0 + 1));
		if (playlist.index == ran)
		{
			// Hopefully this will fix it...
			ran = Math.floor(Math.random() * (playlist.links.length - 0 + 1));
			playlist.index = ran;
		}
		else
		{
			playlist.index = ran;
		}
		playlist.playVideo();
	},
	refreshData: function() {
		// Check for new data ever 2 minutes...
		console.log("Checking data");
		getData();
		setInterval(getData, 120000);
	}
}

// Default station is 90s commercials...because reasons
var station = "https://www.reddit.com/r/90scommercials.json?limit=100";

function getData() {
	$.getJSON(station,
				function foo(data)
				{
					$.each(
						// Let's get the first 100 links and parse the data out of them.
						data.data.children.slice(0,100),
						function (i, post) {
							//$("#reddit-content").append( '<br>' + post.data.title );
							//$("#reddit-content").append( '<br>' + post.data.url );
							var txt = post.data.url;
							console.log(txt);
							var test = txt.search("=");
							console.log(test);
							// We're currently only looking for links that come from youtube, not youtu.be
							if (test != -1)
							{
								// Split the link, find the ampersand, and parse out the video id.
								var video_id = txt.split('v=')[1];
								var ampersandPosition = video_id.search('&');
								if(ampersandPosition > 0) 
								{
									video_id = video_id.substring(0, ampersandPosition);
								}
								
								var isInArray = playlist.links.indexOf(video_id);
								
								if (isInArray === -1)
								{
									playlist.links.push(video_id);
									console.log("Pushed " + video_id + " to list");
								}
								else
								{
									// Skip the video
									console.log("Skipping video, already in array.");
								}
							}
							else
							{
								// This is where we could implement youtu.be videos.
								//var video_id = txt.split('/')[1];
								console.log("Invalid Format. Skipped Video.");
							}
							
							
							
				}
			)
		}
	)
	.success(function() { console.log("second success"); })
    .error(function() { console.log("error"); })
    .complete(function() { console.log("complete"); });
}

function onYouTubeIframeAPIReady() { 
	// Straight from the YouTube API documentation
	console.log("Youtube Ready?");
	getData();
	playlist.player = new YT.Player('tv', {
		height: '95%',
		width: '100%',
		playerVars: {
			autoplay: 1,
			controls: 0
		},
		events: {
			'onReady': function(e) 
			{
				// On IFrame ready, play the first video
				playlist.event(e).playVideo();		
			},
			'onStateChange': function(e)
			{
				// If the video ends, play the next video
				if (e.data == YT.PlayerState.ENDED) 
				{
					playlist.event(e).playNext();
				}
			},
			'onError': function(e)
			{
				// If the video errors out, play the next video
				playlist.event(e).playNext();
			}
		}
	}
	);
	console.log("Youtube Ready.");
	playlist.refreshData();
}

function clearPlaylist(){
	// Wipe the playlist
	console.log("Clearing Playlist?");
	playlist.links = [];
	playlist.index = 0;
	console.log("Playlist Cleared.");
}

function changeStation(newStation) {
	console.log("Changing the channel");
	// Wipe playlist
	clearPlaylist();
	// Change the station variable to the newly selected station.
	station = newStation;
	// Get data from stations subreddit
	getData();
	// And continue on our merry way
	playlist.playNext();
}

window.onload = function() {
	// Gets the value of the selected option from the drop-down menu and
	// switches to that "channel", it then plays the next video from that "channel"
	var myButton = document.getElementById('changeChannel').onclick = function foo() {
		var selected = document.getElementById('channels');
		channel = selected.options[selected.selectedIndex].value;
		
		if (channel != station)
		{
			changeStation(channel);
		}
		else
		{
			console.log("Same station, ya' Dingus");
		}
	}
}
//getData();