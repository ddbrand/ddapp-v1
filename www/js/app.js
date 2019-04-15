// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'com.ddrobotec.dd', // App bundle ID
  name: 'DD App', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/',
  domCache: false
});
var statsView = app.views.create('#view-stats', {
  url: '/stats/'
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
var userView = app.views.create('#view-user', {
  url: '/user/'
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
      app.tab.show("#view-home", true);
      homeView.router.navigate('/', {reloadAll: true, animate: true});
      $('.loginoptions').slideToggle(700);
      $('.navbar').slideToggle(700);
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
});




$$(document).on('page:init', function (e) {

  var current_username = localStorage.getItem("username");
  $$('.insert-username').html(current_username);
  var current_email = localStorage.getItem("email");
  $$('.insert-email').html(current_email);




// Start a scan. Scanning will continue until something is detected or
// `QRScanner.cancelScan()` is called.

// Be sure to make any opaque HTML elements transparent here to avoid
// covering the video.
  QRScanner.prepare(onDone); // show the prompt

  function onDone(err, status){
    if (err) {
      // here we can handle errors and clean up any loose ends.
      console.error(err);
      //alert(err);
      //alert(status);
    }
    if (status.authorized) {

    } else if (status.denied) {
      // The video preview will remain black, and scanning is disabled. We can
      // try to ask the user to change their mind, but we'll have to send them
      // to their device settings with `QRScanner.openSettings()`.
    } else {
      // we didn't get permission, but we didn't get permanently denied. (On
      // Android, a denial isn't permanent unless the user checks the "Don't
      // ask again" box.) We can ask again at the next relevant opportunity.
    }
  }
});






  $$('.cameramode').on('click', function() {
    app.toolbar.hide('.toolbar-bottom', true);


    app.tab.show("#view-scan");


      QRScanner.scan(displayContents);

      function displayContents(err, text){
        if(err){
          //alert(err);
        } else {
          var urlParts = text.split("/?compid=");
          var compid = urlParts[1];
          // Proceed only if compid could be retrieved
          if (compid !== undefined) {
            var username = localStorage.getItem("username");
            var email = localStorage.getItem("email");
            var pass = localStorage.getItem("pass");
            if (username !== null && pass !== null) {
              // JSONify the payload
              var data = JSON.stringify({
                "CompId": compid,
                "UserName": username,
                "Email": email,
                "Pass": pass,
                "CacheName": ""
              });
              // Create Http POST request
              var xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                  app.popup.open('#my-popup', true);
                  QRScanner.destroy(function(status){
                    $$(".page, .page-content, .page-current, #scan-view, .view, #app, body, html").removeClass('nobg');
                    app.tab.show("#view-home", true);
                    app.toolbar.show('.toolbar-bottom', true);
                  });
                }
              });
              // Set http request method and url
              xhr.open("POST", urlParts[0] + "/api/login/");
              // Set headers
              xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
              xhr.setRequestHeader("Cache-Control", "no-cache");
              // Send payload
              xhr.send(data);
              var toastCenter = app.toast.create({
                text: 'You are successfully logged in.',
                position: 'bottom',
                closeTimeout: 4000,
              });
              toastCenter.open();
              QRScanner.destroy(function(status){ });
              app.tab.show("#view-stats", true);
              statsView.router.navigate('/stats/', {reloadAll: true, animate: true});
            }
          } else {
            QRScanner.destroy(function(status){ });

            app.popup.open('#failed-scan-popup', true);

            $$('.popup-close').on('click', function() {
              QRScanner.scan(displayContents);
              QRScanner.show();
            });
            /*var toastCenter = app.toast.create({
              text: 'The code you scanned is invalid. Please try another.',
              position: 'bottom',
              closeTimeout: 6000,
            });
            toastCenter.open();*/
          }
        }
      }
      QRScanner.show();
      $$(".page, .page-content, .page-current, #scan-view, .view, #app, body, html").addClass('nobg');

    $$(".scanback").on('click', function() {
      QRScanner.destroy(function(status){
        $$(".page, .page-content, .page-current, #scan-view, .view, #app, body, html").removeClass('nobg');
        app.tab.show("#view-home", true);
        app.toolbar.show('.toolbar-bottom', true);
      });

    });

    });




$$(document).on('page:init', '.page[data-name="authbox"]', function (e) {
  $$('.login-close').on('click', function() {
    app.loginScreen.close('#my-login-screen');
  });
  $$('.login_screen_open').on('click', function () {
    app.loginScreen.open('#my-login-screen');
  });
  setTimeout(function() {
    var swiper = app.swiper.get('.swiper-container');
    swiper.autoplay.start();
  }, 1000);
});

$$(document).on('page:init', '.page[data-name="user"]', function (e) {
  $$('.logout').on('click', function() {
    localStorage.clear();
    var toastCenter = app.toast.create({
      text: 'Logout was successfull. See you later!',
      position: 'bottom',
      closeTimeout: 4000,
    });
    toastCenter.open();
    app.tab.show("#view-home", false);
    homeView.router.navigate('/authbox/', {reloadAll: true, animate: true});
  });
});

$$(document).on('page:init', '.page[data-name="changeuser"]', function (e) {
  for (var i = 0; i < localStorage.length; i++){
    if(localStorage.key(i).startsWith("username_")) {
      let userkey = localStorage.key(i).split("_");
      $('.list.media-list ul').append('<li>\n' +
          '                    <a href="#" class="item-link item-content changeme" data-user="'+ userkey[1] +'">\n' +
          '                        <div class="item-media"><img src="img/baseline-person-24px.svg" width="44"/></div>\n' +
          '                        <div class="item-inner">\n' +
          '                            <div class="item-title-row">\n' +
          '                                <div class="item-title">' + localStorage.getItem('username_' + userkey[1]) + '</div>\n' +
          '                            </div>\n' +
          '                            <div class="item-subtitle">' + localStorage.getItem('email_' + userkey[1]) + '</div>\n' +
          '                        </div>\n' +
          '                    </a>\n' +
          '                </li>');
    }
  }
  $$('.changeme').on('click', function() {
    let datakey = $(this).attr('data-user');
    let newuser = localStorage.getItem('username_' + datakey);
    let newemail = localStorage.getItem('email_' + datakey);
    let newpass = localStorage.getItem('pass_' + datakey);
    let olduser = localStorage.getItem('username');
    let oldpass = localStorage.getItem('pass');
    let oldemail = localStorage.getItem('email');

    localStorage.setItem('username', newuser);
    localStorage.setItem('pass', newpass);
    localStorage.setItem('email', newemail);
    localStorage.setItem('username_' + datakey, olduser);
    localStorage.setItem('pass_' + datakey, oldpass);
    localStorage.setItem('email_' + datakey, oldemail);
    var toastCenter = app.toast.create({
      text: 'Login was changed successfully.',
      position: 'bottom',
      closeTimeout: 4000,
    });
    toastCenter.open();
    userView.router.navigate('/timeline/', {reloadAll: true, animate: true});

  });

  $$('.login_add_screen_open').on('click', function () {
    app.loginScreen.open('#my-login-add-screen');
  });
  $$('.login-add-close').on('click', function () {
    app.loginScreen.close('#my-login-add-screen');
  });
  $$('.login-add-button').on('click', function () {
    login_add(function(callback){

      if(callback === true) {
        var toastCenter = app.toast.create({
          text: 'Du wurdest erfolgreich eingeloggt.',
          position: 'bottom',
          closeTimeout: 4000,
        });
        toastCenter.open();
        userView.router.navigate('/timeline/', {reloadAll: true, animate: true});
      } else {
        var toastCenter = app.toast.create({
          text: 'Sie konnten nicht erfolgreich eingeloggt werden. Bitte versuchen Sie es erneut.',
          position: 'bottom',
          closeTimeout: 4000,
        });
        toastCenter.open();
      }
    });
    app.loginScreen.close('#my-login-add-screen');
  });
});

$$(document).on('page:init', '.page[data-name="stories"]', function (e) {
  $.ajax({
    url: "https://ddrobotec.com/app/stories.php",
  }).done(function(result) {
    $( '.story_container' ).html( result );
  });
});
$$(document).on('page:init', '.page[data-name="timeline"]', function (e) {

  $$('.timelineback').on('click', function () {
    userView.router.navigate('/user/', {reloadAll: true, animate: true});
  });
});