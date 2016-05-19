var currentKey = "";
var flag = null;
var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
var oHabitsRef;
var cHabitsRef;

oFirebaseRef.onAuth(authDataCallback);
var uId = 0;


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
    if(authData){
        uId = authData.uid;
        cHabitsRef = oFirebaseRef.child("users/" + uId + "/currentHabit");
        oHabitsRef = oFirebaseRef.child("users/" + uId + "/habits");
        populateFields();
    } else{
        Rollbar.info("Unauthorized user attempted to access page", {page: "edit.html"});
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
	cHabitsRef.once("value", function(snapshot){
		var ch = snapshot.val();
		
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

		//the path of current editing habit in firebase database
		oHabitsRef = oHabitsRef.child(ch.key);
		sHabitId = 	oHabitsRef.key();
		
		oHabitsRef
		.set({
			title: 				sHabitTitle,
			icon: 				sHabitIcon,
			weekly_frequency: 	sWeeklyFreq,
			daily_frequency: 	sDailyFreq,
	        description:        sDescription,
	        bestRecord:         sBestRecord,
	        daysInARow:         sDaysInARow, 
	        numCompleted:  sNumCompletedToday,
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
	    	location.href='list.html';
	});		
}
function populateFields(){
	cHabitsRef.once("value", function(snapshot){
		var ch = snapshot.val();
		//the path of current editing habit in firebase database
		oHabitsRef = oHabitsRef.child(ch.key);

		oHabitsRef.once("value", function(snapshot){
			 var data = snapshot.val();
			 document.getElementById("title").value = data.title;
			 document.getElementById("description").value = data.description;
			 document.getElementById("title").value = data.title;
			 if(data.icon == "/img/sleep.jpg")
			 {
			 	selectImage("icon1");
			 }
			 else if(data.icon == "/img/salad.jpg")
			 {
			 	selectImage("icon2");
			 }
			 else if(data.icon == "/img/run.jpg")
			 {
			 	selectImage("icon3");
			 }
			  else if(data.icon == "/img/add.png")
			 {
			 	selectImage("icon4");
			 }
			 var checkedFreq = "";
			 var aWeeklyElements = document.getElementsByClassName("weekly-freq");
			 var aDailyElements = document.getElementsByClassName("daily-freq");
			 for(var i = 0; i<data.weekly_frequency.length;i++)
			 {
			 	if(data.weekly_frequency[i]==',')
			 	{
					for(var j=0; j < aWeeklyElements.length; j++){
						if(aWeeklyElements[j].value == checkedFreq){
							aWeeklyElements[j].checked = true;
							break;
						}
					}
					checkedFreq = "";
			 	}
			 	else
			 	{
			 		checkedFreq += data.weekly_frequency[i];
			 	}
			 }
			 switch(data.daily_frequency)
			 {
			 	case 1:
			 		aDailyElements[0].checked = true;
			 		break;
			 	case 2:
			 		aDailyElements[1].checked = true;
			 		break;
			 	case 3:
			 		aDailyElements[2].checked = true;
			 		break;
			 }


		});	
	});	
}

document.querySelector("#logOut").onclick = function(){
  oFirebaseRef.unauth();
  window.location("login.html");
}
