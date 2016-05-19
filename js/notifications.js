if(oFirebaseRef == null){
	var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
}

var oNotificationsRef = oFirebaseRef.child("users/" + uId + "/notifications");

//Get all notifications, check which ones have not been displayed, and display them and update the timestamp

var oCurDate = Date.now();

oNotificationsRef.once("value", function(data) {
	// do some stuff once
	data.forEach(function(childSnapshot){
		var oNotification = childSnapshot.val();

		var sNotificationKey = childSnapshot.key();
		checkNotification(oNotification, sNotificationKey);
	});
});

var checkNotification = function(oNotification, sNotificationKey){
	oCurDate = new Date(oCurDate);
	var iMissedNotifications = 0;
	var oLastUpdated = new Date(oNotification.last_updated);
	var aDays = getWeeklyFrequency(oNotification.weekly_frequency);

	var iDateDifference = oCurDate.getDate() - oLastUpdated.getDate();

	if(iDateDifference > 1){		//Not on same date
		if(iDateDifference > 7){
			iWeeks = iDateDifference / 7;
			iMissedNotifications = aDays.length * oNotification.daily_frequency * iWeeks;
		} else{
			var iCurDay = oCurDate.getDay();
			var iNotDay = oNotification.getDay();
			var iMinDay = 0;
			if(iCurDay > iNotDay){
				iMinDay = iNotDay;
				for(i=0; i<aDays.length; i++){
					if(aDays[i] > iMinDay){
						iMissedNotifications+= oNotification.daily_frequency;
					}
				}
			} else{
				iMinDay = iCurDay;
				for(i=0; i<aDays.length; i++){
					if(aDays[i] < iCurDay){
						iMissedNotifications+= oNotification.daily_frequency;
					}
				}
			}
		}
	} else{
		//Hourly Notifications here
		var iCurHour =oCurDate.getHours();
		var iNotHour = oLastUpdated.getHours();
		var hourlyCheck = 12/oNotification.daily_frequency;
		for(i=1; i<oNotification.daily_frequency+1; i++){
			if(iCurHour > (8+(i*hourlyCheck))){		//starting at 8AM and increment by the hourly check
				iMissedNotifications+=1;
			}

		}
	}


	if(iMissedNotifications > 0){
		//TODO: GET HABIT HERE
		var oHabitRef = oFirebaseRef.child("users/" + uId + "habits/" + sNotificationKey);
			oHabitRef.once("value", function(data){
				var oHabit = data.val();
				showUserNotifications(iMissedNotifications, oHabit.title);
				var oCheckedNotificationRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/users/' + uId + 'notifications/' + sNotificationKey);
				var oUpdatedDate = Date.now();
				var bestRecord = 0;
				if(oHabit.daysInARow > oHabit.bestRecord){
					bestRecord = oHabit.daysInARow;
				} else{
					bestRecord = oHabit.bestRecord;
				}
				var numMissed = oHabit.numMissed + iMissedNotifications;
				oCheckedNotificationRef.update({'last_updated': oUpdatedDate});
				oHabitRef.update({'bestRecord': bestRecord, 'numMissed': numMissed})
			});
			
		}

	
}


var getWeeklyFrequency = function(sDays){
	aDays = [];
	if(sDays.indexOf("sunday") > -1){
		aDays.push(0);
	}
	if(sDays.indexOf("monday") > -1){
		aDays.push(1);
	}
	if(sDays.indexOf("tuesday") > -1){
		aDays.push(2);
	}
	if(sDays.indexOf("wednesday") > -1){
		aDays.push(3);
	}
	if(sDays.indexOf("thursday") > -1){
		aDays.push(4);
	}
	if(sDays.indexOf("friday") > -1){
		aDays.push(5);
	}
	if(sDays.indexOf("saturday") > -1){
		aDays.push(6);
	}

	return aDays;

}

var showUserNotifications = function(iNotificationCount, sHabitTitle){
    alert("You have missed your habit: " + sHabitTitle + " " + iNotificationCount.round() + " times!");
}
