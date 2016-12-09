var credentials = null;

$(document).ready(function() {

	console.log("document ready");

    // Firebase Authentication
    //Show and hide the login and 
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
          $('#signupModal').modal('toggle');
          $('#loginModal').modal('toggle');
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          $('#previewPic').show();
          $('#loginDiv').hide();
          getUserInfo(firebaseUser);
         // location.reload();
            console.log(firebaseUser);
            
        } else {
            gvEmail="";
            $('#previewPic').hide();
            $('#loginDiv').show();
            // location.reload();
            console.log("not logged in");
        }
    });//Closing OnAuthSateChanged

    // Spotify Authentication
	checkAuthorization();

    // Login Process
    $('#btnLogin').on('click', function(){
        $('#loginModal').modal();
    });

    $("#btnSubmitLogin").on('click',function(){
        var email = $("#txtEmail").val().trim();
        var password = $("#txtPassword").val().trim();
        firebaseLogin(email, password);

    })

    // Signup Process

     $("#btnSignup").on('click',function(){
        $('#signupModal').modal();
        
     })


    $("#btnSubmitSignup").on('click',function(){

        var email=$("#txtSignupEmail").val().trim();
        var password = $("#txtSignupPassword").val().trim();

        firebaseSignup(email, password);
        
    })

    $('#spotifyConnect').on('click', function(){
        $('#spotifyModal').modal('toggle')
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
        loginWithSpotify();

    })

    // Uploading Images
    $("#filepicker").on('change', function(){
        previewFile(event.fpfile.url);
    })

});