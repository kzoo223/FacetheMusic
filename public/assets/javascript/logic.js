 // Initialize Firebase

// var config = {
//   apiKey: "AIzaSyDz9GC105fz2aqAqcqVw-Fg-2SS-N4_8JA",
//   authDomain: "senthilproject-ae6ac.firebaseapp.com",
//   databaseURL: "https://senthilproject-ae6ac.firebaseio.com",
//   storageBucket: "senthilproject-ae6ac.appspot.com",
//   messagingSenderId: "32686972649"
// };

var config = {
  apiKey: "AIzaSyDbXfLQu6jNcSHaEBUH2FmRYnadVeKgRPo",
  authDomain: "spotifyapp-564b4.firebaseapp.com",
  databaseURL: "https://spotifyapp-564b4.firebaseio.com",
  storageBucket: "spotifyapp-564b4.appspot.com",
  messagingSenderId: "681817086164"
};

firebase.initializeApp(config);
//Global Variable
var gvUser={};

//------Database Reference
var database = firebase.database();
var ref = database.ref();

//------Authentication Reference
const auth = firebase.auth();

//------Storage Reference
const storage = firebase.storage();
var storageref= storage.ref();


//----------------filepicker Api
filepicker.setKey('AQJ6QdJrISSSWI7qBzBDCz');


//--------Signing up for a account


function firebaseSignup(email, password) {
	
  if(!checkEmail(email)){
    return false;
  }
	
  if(!checkPassword(password)){
    return false;
  }

  //Create a account
	const promise = auth.createUserWithEmailAndPassword(email,password);

  // catch an error and display it document
	promise.catch(e => 
    $(".errMsgSignUp").html(e.message));
  // ERROR HANDLING NEEDED

  //Add the user to the database
  promise.then(user => addToDatabase(user));
};

//------------Validating email-id
function checkEmail(email){
  if (typeof(email) == 'undefined' || email==null) {
    $(".errMsgSignUp").html("Enter an email-id");
    return false;
  }
  var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
      $(".errMsgSignUp").html("Please enter valid email-id- eg abc@efg.com");
      return false;
    } 
    return true;
}

//-----------------validate Pasword
function checkPassword(password){
  if (typeof(password) == 'undefined' || password==null) {
 
    $(".errMsgSignUp").html("Enter password");
    return false;
  }
  if(password.length >= 6){
    return true;
  } else {
    $(".errMsgSignUp").html("Password should have atleast 6 letters");
    return false;
  }
}

//------------------Create a new object for this user ------
function addToDatabase(user){
  console.log(user);
  console.log(user.email);
  var member={};
  member.name = $("#txtSignupUser").val().trim();
  member.email = user.email;
  database.ref('Members').push(member);
  getUserInfo(user);
}


//----------Get user from the Login -----
//----------------------------------------

function firebaseLogin(email, password){

	console.log('logging into firebase')
  if(!checkEmail(email)){
    return false;
  }
  
  if(!checkPassword(password)){
    return false;
  }

  //sign in with the user
	const promise = auth.signInWithEmailAndPassword(email,password)
	promise.then(user => getUserInfo(user));
  promise.catch(e => 
    $(".errMsgSignUp").html(e.message));
    // NEED ERROR HANDLING HERE
};

//-------get User info from database--------
function getUserInfo(user){
  database.ref('Members').orderByChild("email").equalTo(user.email).once('value',function(snapshot){
    //console.log("snapshot "+ JSON.stringify(snapshot.val()));
    snapshot.forEach(function(data) {
      var nameV = changetoCapitol(data.val().name);
      $('.usernameDisplay').html(nameV);
        console.log("Name: "+ data.val().name);
        console.log("email: "+ data.val().email);
        gvUser.email=data.val().email;
        gvUser.name=data.val().name;
        gvUser.key=data.key;
        console.log("key "+gvUser.key);
        $('#storedImages').empty();

        if(data.child("Picture").exists()){
          console.log("picture");
          data.child("Picture").forEach(function(picPath) {
  
          //Create image tag and add to the screen 
          var imgTab = $('<img>');
          imgTab.addClass('picture');
          imgTab.attr('src',picPath.val().picUrl);
          imgTab.attr('data-url',picPath.val().picUrl);
          $("#storedImages").append(imgTab);
            console.log(picPath.val().picUrl);

          });
        }//if picture exists
    }); //looping through the snapshot  

  });//database query

}//getUserInfo



//change the first letter after space to capital
function changetoCapitol(pharse){
  pharse= pharse.split(" ");
  for (var i=0; i < pharse.length; i++){
  //console.log(pharse[i][0].toUpperCase());
    pharse[i] = pharse[i].split("");
    pharse[i][0] = pharse[i][0].toUpperCase();
    pharse[i] = pharse[i].join("");
  }
  pharse=pharse.join(" ");
  return pharse;
}

// //Show and hide the login and 
// firebase.auth().onAuthStateChanged(firebaseUser => {
// 		if(firebaseUser){
//       $('#picForm').show();
//       $('#loginDiv').hide();
//       getUserInfo(firebaseUser);
//      // location.reload();
// 			console.log(firebaseUser);
//       loginWithSpotify();
// 		} else {
//       gvEmail="";
//       $('#picForm').hide();
//       $('#loginDiv').show();
//      // location.reload();
// 			console.log("not logged in");
// 		}
// });//Closing OnAuthSateChanged

//Log out 
$("#btnLogout").on('click', function(){
  console.log("Logging Out");
	firebase.auth().signOut();
  location.reload();
});
	

$("#storedImages").on("click",'.picture', function(e){
  downloadFile(e)
});

function downloadFile(e){
  var url =$(e.target).data("url");
  //Call emotive here/////////////////
  callEmotive(url, apiUrl, apiKey);
}

function previewFile(url) {
  // create preview image
  var preview = $('<img>');
  preview.addClass('uploadImage');
  preview.attr('src',url);
  preview.attr('data-url',url);

  // append image to div
  $('#previewPic img').remove();
  $('#previewPic').prepend(preview);

  database.ref("Members").child(gvUser.key+"/Picture").push({"picUrl": url});
  console.log(url);
  //Call emotive here/////////////////
  var file = '{"url":'+ '"' + url+ '"' + '}';
  console.log(file)
  callEmotive(file, apiUrl, apiKey);
}
