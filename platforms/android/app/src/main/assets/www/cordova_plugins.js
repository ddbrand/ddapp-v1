cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-qrscanner.QRScanner",
      "file": "plugins/cordova-plugin-qrscanner/www/www.min.js",
      "pluginId": "cordova-plugin-qrscanner",
      "clobbers": [
        "QRScanner"
      ]
    },
    {
      "id": "cordova-plugin-device-name.DeviceName",
      "file": "plugins/cordova-plugin-device-name/www/device-name.js",
      "pluginId": "cordova-plugin-device-name",
      "clobbers": [
        "cordova.plugins.deviceName"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-add-swift-support": "2.0.2",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-qrscanner": "3.0.1",
    "cordova-plugin-device-name": "1.3.5"
  };
});