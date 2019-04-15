// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'com.ddrobotec.dd', // App bundle ID
  name: 'DD App', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      }
    };
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/',
});
var catalogView = app.views.create('#view-catalog', {
  url: '/catalog/'
});
var searchView = app.views.create('#view-search', {
  url: '/search/'
});
var storiesView = app.views.create('#view-stories', {
  url: '/stories/'
});
var scanView = app.views.create('#view-scan', {
  url: '/scan/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  login(function(callback){

    if(callback === true) {
      var toastCenter = app.toast.create({
        text: 'Du wurdest erfolgreich eingeloggt.',
        position: 'bottom',
        closeTimeout: 4000,
      });
      toastCenter.open();
      homeView.router.navigate('/', {reloadCurrent: true, animate: true});
      $('.loginoptions').slideToggle(700);
      app.toolbar.show('.toolbar-bottom', true);
    } else {
      var toastCenter = app.toast.create({
        text: 'Sie konnten nicht erfolgreich eingeloggt werden. Bitte versuchen Sie es erneut.',
        position: 'bottom',
        closeTimeout: 4000,
      });
      toastCenter.open();
    }
  });

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});


$$(document).on('page:init', function (e) {
  var current_username = localStorage.getItem("username");
  $$('.insert-username').html(current_username);


  QRScanner.scan(displayContents);

  function displayContents(err, text){
    if(err){
      // an error occurred, or the scan was canceled (error code `6`)
    } else {
      // The scan completed, display the contents of the QR code:
      alert(text);
    }
  }

// Make the webview transparent so the video preview is visible behind it.
  QRScanner.show();
// Be sure to make any opaque HTML elements transparent here to avoid
// covering the video.
});

$$(document).on('page:init', '.page[data-name="scan"]', function (e) {
  QRScanner.show();
  QRScanner.scan(displayContents);
});

$$(document).on('page:init', '.page[data-name="authbox"]', function (e) {
  $$('.login-close').on('click', function() {
    app.loginScreen.close('#my-login-screen');
  });
  $$('.login_screen_open').on('click', function () {
    app.loginScreen.open('#my-login-screen');
  });
  $$('.abouter').on('click', function() {
    localStorage.removeItem("username");
    localStorage.removeItem("pass");
    localStorage.removeItem("email");
    homeView.router.navigate('/', {reloadCurrent: true, animate: true});
  });
  setTimeout(function() {
    var swiper = app.swiper.get('.swiper-container');
    swiper.autoplay.start();
  }, 1000);
});

$$(document).on('page:init', '.page[data-name="settings"]', function (e) {
  $$('.logout').on('click', function() {
    localStorage.removeItem("username");
    localStorage.removeItem("pass");
    localStorage.removeItem("email");
    var toastCenter = app.toast.create({
      text: 'Logout was successfull. See you later!',
      position: 'bottom',
      closeTimeout: 4000,
    });
    toastCenter.open();
    settingsView.router.navigate('/authbox/', {reloadCurrent: true, animate: true});
  });
});