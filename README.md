# hw5: App Prep and Distribution

Team Members: 
  - Kann Chea
  - Megan Ring
  - Tyler Tedeschi
  - Jiangtian Wang
  - **Note:** Xu He used to be in our group, but he told us he dropped the class on Tuesday. 

##### Services Used

1. Rollbar - Error monitoring
2. Mixpanel - Usage monitoring/analytics, notification/email reminders
3. PhoneGap - Phone app Proof of Concept
4. Grunt - Minification
5. Firebase - Database
6. Sweet Alert - Custom alert library

##### Login Credentials

User email: mcring@ucsd.edu
User password: 1234

User email: luchea@ucsd.edu
User password: hello

##### Summary of Issues and Limitations

Packaging:
  - PhoneGap: we can not obtain the package for iOS because in order to build the iOS app, we need to have an iOS developer certificate. It is the same for Windows. We need to have Windows publisher ID to build a Windows app. Also, We have built a .apk file for android by adding config.xml, keystore, and all the required files. However, the "save" button is not working as it does on the browser. We had added some functions that were suggested as a fix such as "function onDeviceReady()", but it ended up breaking our code on browser instead. We also tried another method by moving javascripts from other related html files to index.html, but that didn't make the "save" button work either. We don't want to break the features that are running smoothly on browser and we didn't have enough time to debug line by line, we decided to leave it like that. But if we had more time to make changes to our javascripts to work according to PhoneGap, our app would be properly working after the build in PhoneGap.
  
  - Chrome App: We were able to launch and package our app using Chrome extensions. However, Chrome's Content Security Policy (CSP) prevented our inline JavaScript from being executed. We tried to relax the default script security property, and when that did not work we tried rewriting some of our code. Overall, the cost of reformatting and rewriting our code outweighed the benefits so we left our code as is. If we had more time, I think we could go about fixing this by going through our code and eliminating inline JavaScript, and making sure all of our JavaScript functions were in external JS files. For instance, we used the "onclick="(do something)"" attribute throughout our code, when we could get rid of them and use JS eventListeners instead.  

  - Windows App: We were going to try to package our app to be a functional Universal Windows app.  We found a good tutorial to do so, but the necessary tools for Visual Studio were not installed by default.  We tried to figure out how to install the tools without completely reinstalling Visual Studio; which was difficult finding a standalone download page.  Once we found it though, applying it required a Visual Studio update which took too long to download and install.  Therefore we did not have enough time to complete the packaging for Windows
  

Validations:
 - When validating our JavaScript files, a lot of problems we found using JSLint were from the Mixpanel functions, or problems with our whitespace (like in-between ')' and '{' for functions, indentation, and unexpected trailing space).  

Display Habits:
 - The more recent added habit is still shown underneath the old ones. We tried to fix how the list is displayed, but we ended up breaking the whole display.
 - Another minor limitatation is that the progress bar for each individual habit goes back to its initial state when the user refreshes the page or navigates away from the page. However, the counter for the number of times a habit is completed is stored correctly, so if the user clicks the green complete button again the progress bar fills to the correct amount. 
