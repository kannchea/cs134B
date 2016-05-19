//Mixpanel
(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("0d2f16c090a094f434fd3a30d5df6bb6");

var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
var uId = 0;

oFirebaseRef.onAuth(authDataCallback);


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
    if(authData){
        uId = authData.uid;

    } else{
        Rollbar.info("Unauthorized user attempted to access page", {page: "add.html"});
        window.location = "login.html";
    }
}

function selectImage(name) {
	//Clear all the other effects
	document.getElementById('icon1').style.border = "none";
	document.getElementById('icon2').style.border = "none";
	document.getElementById('icon3').style.border = "none";

	document.getElementById('icon1').setAttribute("data-active", "false");
	document.getElementById('icon2').setAttribute("data-active", "false");
	document.getElementById('icon3').setAttribute("data-active", "false");

	var image = document.getElementById(name);
	image.style.border = "5px solid #42A5F5";
	image.setAttribute("data-active", "true");
}

//To allow users to toggle the radio buttons
$("input:radio").on("click",function (e) {

    //if the radio button is selected, set checked to false and remove class
    if($(this).is(".theone")) { 
        $(this).prop("checked",false).removeClass("theone");
        return;
    }
            
    //add class back to the radio button
    $("input:radio[name='"+$(this).prop("name")+"'].theone").removeClass("theone");
    $(this).addClass("theone");
});


//Save button pressed
document.querySelector('#save_p').onclick = function(){

    //checks to ensure form is filled in correctly before submitting
	//if no title, alert user
    if(!$('#title').val()) {
        document.getElementById("noTitle").style.display=""
        return;
    }
            
    //if a weekly frequency isn't selected, alert user
    if(!$('input:checkbox').is(':checked')){
        document.getElementById("noWFreq").style.display=""
        return;
    }
              
    //if a daily frequency or others frequency isn't selected, alert user
    if(!$('input:radio').is(':checked')){                 
         if(!$('#others').val()){
            document.getElementById("noDFreq").style.display=""
            return;
        }
        //if user enters number less than the minimum, alert user 
        if($('#others').val() < $('#others').attr('min')){
            swal("Oops!", "Please enter a valid Daily Frequency", "error");
            return;
        }
    }
            
    //if both a daily frequency and others frequency are chosen, go with others frequency
    if($('input:radio').is(':checked')) {
        if ($('#others').val() > 3) {
            $('input:radio').prop("checked",false);  //or .attr
        }
        else
            $('#others').attr('value','0');
    }
            
    //if a habit icon isn't chosen, use default add icon
    if(document.getElementById('icon1').getAttribute("data-active") == "false"){
        if(document.getElementById('icon2').getAttribute("data-active") == "false"){
            if(document.getElementById('icon3').getAttribute("data-active") == "false"){
                document.getElementById('icon4').setAttribute("data-active", "true");
            }
        }       
    }
       
    
    var images = document.getElementsByClassName("icon");
	var image = "";

	for(var i = 0; i< images.length; i++){
		if(images[i].getAttribute("data-active") == "true"){
			image = images[i].src.substring(images[i].src.indexOf("/img/"), images[i].src.length);
		}
	}
    
    
	var sHabitTitle = document.querySelector('#title').value;
	var sHabitIcon = image;
	var sWeeklyFreq = "";
	var sDailyFreq = 0;
    var sBestRecord = 0;
    var sDaysInARow = 0;
    var sNumCompletedToday = 0;
    var sTotalToday = 5;
    var sDescription = document.querySelector('#description').value;
	var sOthers = document.querySelector('#others').value;

	var aWeeklyElements = document.getElementsByClassName("weekly-freq");
	var aDailyElements = document.getElementsByClassName("daily-freq");

	for(var i=0; i < aWeeklyElements.length; i++){
		if(aWeeklyElements[i].checked){
			sWeeklyFreq += aWeeklyElements[i].value + ",";
		}
	}

	for(var i=0; i < aDailyElements.length; i++){
		if(aDailyElements[i].checked){
			sDailyFreq = parseInt(aDailyElements[i].value);
		}
	}

	var oHabitsRef = oFirebaseRef.child("users/" + uId + "/habits");

	oNewHabitRef = oHabitsRef.push();
	sHabitId = oNewHabitRef.key();
	
	oNewHabitRef.set({
		title: 				sHabitTitle,
		icon: 				sHabitIcon,
		weekly_frequency: 	sWeeklyFreq,
		daily_frequency: 	sDailyFreq,
        description:        sDescription,
        bestRecord:         sBestRecord,
        daysInARow:         sDaysInARow, 
        numCompleted:  sNumCompletedToday,
        numMissed: 0
	});

	var oNotificationsRef = oFirebaseRef.child("users/" + uId + "/notifications");
	var date = Date.now();
	
	var oNewNotificationRef = oNotificationsRef.child(sHabitId);

	oNewNotificationRef.set({
    	habitTitle:			sHabitTitle,
    	weekly_frequency: 	sWeeklyFreq,
    	daily_frequency: 	sDailyFreq,
    	last_updated: 		date

    });				

    mixpanel.track("Habit Added");
    
	document.location.href = "list.html";
}

document.querySelector("#logOut").onclick = function(){
  oFirebaseRef.unauth();
  window.location("login.html");
}


