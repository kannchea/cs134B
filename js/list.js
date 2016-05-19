var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
var cHabitsRef;
var oHabitsRef;

oFirebaseRef.onAuth(authDataCallback);

//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
    if(authData){
      uId = authData.uid;
      cHabitsRef = oFirebaseRef.child("users/" + uId + "/currentHabit");
      oHabitsRef = oFirebaseRef.child('/users/' + uId + '/habits');


    } else{
        Rollbar.info("Unauthorized user attempted to access page", {page: "list.html"});
        window.location = "login.html";
    }
}

window.onload = function() {
    var habitList = document.getElementById("habit-list");
    var index = 0;
    oHabitsRef.once("value", function(snapshot){
    var sBestRecords = [];
    var sDaily_frequencys = [];
    var sDaysInARows = [];
    var sDescriptions = [];
    var sIcons = [];
    var sTitles = [];
    var sWeekly_frequencys = [];
    var sNumCompleted = [];
    var sTotalTodays = [];
    var sHabitIds = [];

    document.querySelector("#noHabits").style.display = 'none';
    
    snapshot.forEach(function(childSnapshot, key){
        
    var data = childSnapshot.val();
    sBestRecords[index] = data.bestRecord;
    sDaily_frequencys[index] = data.daily_frequency;
    sDaysInARows[index] = data.daysInARow;
    sDescriptions[index] = data.description;
    sIcons[index] = data.icon;
    sTitles[index] = data.title;
    sWeekly_frequencys[index] = data.weekly_frequency;
    sNumCompleted[index] = data.numCompleted;
    sHabitIds[index] = childSnapshot.key();
    
    index++;
        
  });
       
  for(i = 0; i<index; i++){
      var habitListItem = document.getElementById("habits").content.cloneNode(true);
      habitList.appendChild(habitListItem);
      document.getElementsByClassName("habit-name")[i].innerHTML = sTitles[i];
      document.getElementsByClassName("habit-icon")[i].src = ".." + sIcons[i];
      document.getElementsByClassName("habit-desc")[i].innerHTML = sDescriptions[i];
      document.getElementsByClassName("completed")[i].innerHTML = sNumCompleted[i];
      document.getElementsByClassName("totalNum")[i].innerHTML = sDaily_frequencys[i];
      document.getElementsByClassName("habit-days-in-a-row")[i].innerHTML = sDaysInARows[i];
      document.getElementsByClassName("habit-best-record")[i].innerHTML = sBestRecords[i];
      document.getElementsByClassName("habit-id")[i].setAttribute("data-habitId", sHabitIds[i]);
      habitList.appendChild(habitListItem); 
  
  }
  if(index == 0){
    document.querySelector("#noHabits").style.display = 'block';
  }
   

  document.querySelector("#logOut").onclick = function(){
    oFirebaseRef.unauth();
    window.location("login.html");
  }
        
  });

    
  function showMsg(element){
      var msgElement = (element.parentNode.parentNode.getElementsByClassName("message"))[0];
      msgElement.style.visibility="visible";
  }

  var progressBarAnimate = function(doneButton){
  	
  }

}

   
function done(currentButton){
    //var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/habits');
    var oHabitsRef = oFirebaseRef.child("users/" + uId + "/habits");

    var oParentLi = currentButton.parentNode.parentNode;
    var aChildren = oParentLi.getElementsByTagName('progress');
    var oProgress = aChildren[0];
    var habitTitle = "";
    var habitTitle = currentButton.parentNode.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.innerHTML;
    oHabitsRef.orderByChild("title").equalTo(habitTitle).once("value", function(snapshot){
                                          
    currentButton.parentNode.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.style.visibility= "visible";
        snapshot.forEach(function(childSnapshot){
           var data = childSnapshot.val(); 
            var index = 0;
        
        var countstop = data.daily_frequency;
            
        var counter = data.numCompleted;
      
        var newCount = counter + 1;
        
        oHabitsRef.child(childSnapshot.key()).update({numCompleted : newCount});
            var oCheckedNotificationRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/users/' + uId + '/notifications/' + childSnapshot.key());
            var oUpdatedDate = Date.now();
            oCheckedNotificationRef.update({'last_updated': oUpdatedDate});
           
        if (newCount >= countstop) {
            //message if habit is completed
           currentButton.parentNode.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.innerHTML = "Completed Habit!";
            animator(oProgress, 100, 100);
            
            mixpanel.track("Completed a Habit");
        }
        else {
          currentButton.parentNode.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.innerHTML=newCount;
            
          currentButton.parentNode.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.innerHTML=countstop;
          animator(oProgress, newCount, countstop);
            
          mixpanel.track("Did a Habit");
        }
        });
      });
}
var animator = function(oProgress, denom, num){
    var iMsecsPerUpdate = 1000/60;  // # of milliseconds between updates, this gives 60fps
    var iDuration = 3;              // secs to animate for
    var iInterval = ((denom/num) * oProgress.getAttribute('max'))/(iDuration*1000/iMsecsPerUpdate); //Edit this to change the amount the bar animates for
    oProgress.value = oProgress.value + iInterval;
    if (oProgress.value + iInterval < ((denom/num) * oProgress.getAttribute('max'))){
       setTimeout(animator(oProgress, denom, num), iMsecsPerUpdate);
    } else {
        oProgress.value = ((denom/num) * oProgress.getAttribute('max'));
    }
}


//delete habit alert and transition
function deleteHabit(element) {
    aChildren = element.parentNode.parentNode.childNodes;
    for(i=0; i<aChildren.length; i++){
      if(aChildren[i].className == "habit-id"){
        var sDeleteHabitId = aChildren[i].getAttribute("data-habitId");
      }
    }
    swal({ title: "Delete Habit?", text: "Are you sure you want to delete this habit?", type: "warning", showCancelButton: true, confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!", closeOnConfirm: false }, 
         
         function(){ 
        
            var child = element.parentNode.parentNode.parentNode;
            child.className = child.className + " animated fadeOutLeft";
            $(child).one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(event) {
                $(this).remove();
            });
            var habitTitle = element.previousElementSibling.innerHTML;
            var oHabitsRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/users/' + uId + '/habits/' + sDeleteHabitId);
            var oNotificationRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/users/' + uId + '/notifications/' + sDeleteHabitId);
           
           oHabitsRef.remove();
           oNotificationRef.remove(); 
            swal({   title: "Deleted!",   text: "Habit successfully deleted.",   timer: 800,   showConfirmButton: false });
        
            mixpanel.track("Deleted a Habit");
        });
    
}

var data = null;
oHabitsRef.once("value", function(snapshot){
    data = snapshot.val();
});


function editHabit(habit){
    var habitTitle = habit.previousElementSibling.previousElementSibling.innerHTML;
        for(var keys in data){
            if(data[keys].title == habitTitle)
            {   
                currentKey = keys;
                break;
            }
        }
    cHabitsRef
    .set({
        key: currentKey
    });     
    mixpanel.track("Habit Edited");
    location.href='edit.html';
}
