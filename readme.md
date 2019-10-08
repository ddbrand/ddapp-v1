# Official DD App

## Known fixes 
### Add other Platform
To add a new platform, enter the following code in any terminal in relation to the project
`cordova platform add PLATFORMNAME`

### Android Re-Init
After re-initializing or reinstalling the Android platform, the following code must be reinstalled in the plugin folder for a proper process:

`/platforms/android/cordova-plugin-fcm-with-dependecy-updated/FCMPlugin.gradle`

search this line in the file
`apply plugin: com.google.gms.googleservices.GoogleServicesPlugin`

and replace it with 
`ext.postBuildExtras = {
apply plugin: com.google.gms.googleservices.GoogleServicesPlugin
}`