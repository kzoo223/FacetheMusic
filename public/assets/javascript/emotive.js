    

//apiKey: Replace this with your own Project Oxford Emotion API key, please do not use my key. I include it here so you can get up and running quickly but you can get your own key for free at https://www.projectoxford.ai/emotion 
 var apiKey = "2249a05a078e4e21877833c9a7409778";
 
 //apiUrl: The base URL for the API. Find out what this is for other APIs via the API documentation
 var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";


 // var file = '{"url": "https://cdn.filestackcontent.com/ALOiFAKmTNmBGtIqtcSM"}'
 
 $('#btn').click(function () {
 //file: The file that will be sent to the api
 // var file = document.getElementById('filename').files[0];

 callEmotive(file, apiUrl, apiKey);
 });

 
 function callEmotive(fileURL, apiUrl, apiKey)
 {
    $.ajax({
     url: apiUrl,
     beforeSend: function (xhrObj) {

     xhrObj.setRequestHeader("Content-Type", "application/json");

     xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
     },
     type: "POST",
     data: fileURL,
     processData: false
    })
    .done(function (response) {

    processResult(response);

    })
    .fail(function (error) {
        var url = 'http://ll-media.tmz.com/2015/06/16/0616-tom-anderson-myspace-friend-now-photos-launch-1200x630.jpg'
        var failfile = '{ "url": "http://ll-media.tmz.com/2015/06/16/0616-tom-anderson-myspace-friend-now-photos-launch-1200x630.jpg" }'
        $("#emotiveModal").modal()
        callEmotive(failfile, apiUrl, apiKey)
    
    });
  }
 
  function processResult(response) {
    if(response.length == 0){
        var url = 'http://ll-media.tmz.com/2015/06/16/0616-tom-anderson-myspace-friend-now-photos-launch-1200x630.jpg'
        var failfile = '{"url":'+ '"' + url+ '"' + '}';

        $("#emotiveModal").modal()
        callEmotive(failfile, apiUrl, apiKey)

        // create preview image
          var preview = $('<img>');
          preview.addClass('uploadImage');
          preview.attr('src',url);
          preview.attr('data-url',url);

          // append image to div
          $('#previewPic img').remove();
          $('#previewPic').prepend(preview);
    }else{
        console.log(response)
        var scores = response[0].scores;

        var scoresSorted = Object.keys(scores).sort(function(a,b){return scores[b]-scores[a]});

        console.log(scoresSorted);

        var mood = scoresSorted[0];

        console.log(mood);

        getPlaylists(mood);

    }


 };
