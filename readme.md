# Official DD App
## Changelog
### 1.2.18 - 20.11.2019
- structural change of the workout plans, simplification of the layout
    - added /workouts/ route incl. workouts html template
    - added new structure for embedded javascript files
- Code customization for function-based separation of all views for non-rendering blocking
- Autologin function timeout increased from 25000ms to 60000ms after latency problems
- Added external fastclick library for preventing 300ms delay from WebKit Browsers on iOS

## Known fixes 
### Android
#### Plugin cordova-plugin-support-google-services
Since 01.11.2019 the is a new bug with the cordova plugin for google support services. There are new versions for 
gradle and the google library. 

In case of an error with gradle (build) check the following file:
`/platforms/android/cordova-plugin-support-google-services/ddios-build.gradle`

Replace `mavenCentral()` with 
`maven { url "https://maven.google.com" }`
`maven { url 'https://dl.bintray.com/kotlin/kotlin-eap' }`

This fixes the Jetbrains Kotlin bug. Additionally, the Google Service Library should be downgraded to prevent compatibility problems: 


##### Attention: This should be fixed. Stay by 4.2.0
Find `classpath 'com.google.gms:google-services:4.2.0'` and replace to
`classpath 'com.google.gms:google-services:4.1.0'`


#### Plugin cordova-plugin-fcm-with-dependecy-updated

After re-initializing or reinstalling the Android platform, the following code must be reinstalled in the plugin folder for 
a proper process. Open the following file in the structure, after your first build with gradle:

`/platforms/android/cordova-plugin-fcm-with-dependecy-updated/FCMPlugin.gradle`


search this line in the file `apply plugin: com.google.gms.googleservices.GoogleServicesPlugin`
and replace it with 
`ext.postBuildExtras = {
apply plugin: com.google.gms.googleservices.GoogleServicesPlugin
}`