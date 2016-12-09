console.log('spotify loaded')


// deprecated for now. using OAuth
function loginWithSpotify() {
    console.log('logging in with spotify');
    var client_id = 'c06624947f124dcbb0d4375eb2336a40';
    var redirect_uri = 'https://spotifyapp-564b4.firebaseapp.com/';
    var scopes = 'playlist-modify-public';

    
    if (document.location.hostname == 'localhost') {
        redirect_uri = 'http://localhost:8000/index.html';
    }
    var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
        '&response_type=token' + // switch to 'code' for oauth
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(redirect_uri);
    document.location = url;
}

// var token;

var spotifyApi = new SpotifyWebApi();

function getTime() {
    return Math.round(new Date().getTime() / 1000);
}

function checkAuthorization() {
    // if we already have a token and it hasn't expired, use it,
    if ('credentials' in localStorage) {
        credentials = JSON.parse(localStorage.credentials);
    }
    if (credentials && credentials.expires > getTime()) {

        spotifyApi.setAccessToken(credentials.token);
      
    } else {
    // we have a token as a hash parameter in the url
    // so parse hash
        var hash = location.hash.replace(/#/g, '');
        var all = hash.split('&');
        var args = {};

        all.forEach(function(keyvalue) {
            var idx = keyvalue.indexOf('=');
            var key = keyvalue.substring(0, idx);
            var val = keyvalue.substring(idx + 1);
            args[key] = val;
        });
        if (typeof(args['access_token']) != 'undefined') {
            var g_access_token = args['access_token'];
            var expiresAt = getTime() + 3600;
            if (typeof(args['expires_in']) != 'undefined') {
                var expires = parseInt(args['expires_in']);
                expiresAt = expires + getTime();
            }
            credentials = {
                token:g_access_token,
                expires:expiresAt
            }
            callSpotify('https://api.spotify.com/v1/me').then(
                function(user) {
                    credentials.user_id = user.id;
                    localStorage['credentials'] = JSON.stringify(credentials);
                    location.hash = '';

                },
                function() {
                    error("Can't get user info");
                })

            spotifyApi.setAccessToken(credentials.token);
            ;
        } else {
         // otherwise, go to spotify to get auth
            $('#spotifyModal').modal()

        }
    }
}

// may want to use spotifyapi calls instead
function callSpotify(url, data) {
    return $.ajax(url, {
        dataType: 'json',
        data: data,
        headers: {
            'Authorization': 'Bearer ' + credentials.token
        }
    });
}


function getPlaylists(mood){
    var query = mood;
    var url = 'https://api.spotify.com/v1/search/'
    var data = {
        q: query,
        type: "playlist"
    };
    
    callSpotify(url, data).then(function(response){
        console.log(response);
        console.log(response.playlists.items)
        displayPlaylists(response);
    })
}

// takes the response from a spotify playlist query and displays the first 4 relevant playslists

function displayPlaylists(response) {

    var playlistArray = response.playlists.items;
    $("#playlists").empty();

    for (playlist = 0; playlist < 1; playlist ++) {
  
        var uri = playlistArray[playlist].uri;

        var iframe = '<iframe src="https://embed.spotify.com/?uri=' + uri +'"' + ' width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'

        $("#playlists").append(iframe);
    }
}

function onTokenReceived(accessToken) {

    token = accessToken;

    spotifyApi.setAccessToken(token);

};

function onUserDataFetched(data) {
    var user = data.id;
};