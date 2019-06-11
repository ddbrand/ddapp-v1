// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'com.ddrobotec.ddios', // App bundle ID
  name: 'DD App', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/',
  componentUrl: '/',
  domCache: false,
  reloadPages: true
});
var statsView = app.views.create('#view-stats', {
  reloadPages: true,
  url: '/stats/',
  domCache: false
});
/*
var searchView = app.views.create('#view-search', {
  url: '/search/'
});*/
var storiesView = app.views.create('#view-stories', {
  url: '/stories/'
});
/*var scanView = app.views.create('#view-scan', {
  url: '/scan/',
  reloadPages: true,
  domCache: false
});*/
var userView = app.views.create('#view-user', {
  url: '/user/'
});

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  login(function(callback){

    if(callback === true) {
      var toastCenter = app.toast.create({
        text: 'You have been successfully logged in.',
        position: 'top',
        closeTimeout: 4000,
      });
      toastCenter.open();
      $('.loginoptions').slideToggle(700);
      $('.navbar').slideToggle(700);
      app.tab.show("#view-home", true);
      app.toolbar.show('.toolbar-bottom', true);
      homeView.router.navigate('/', {reloadCurrent: true,
        ignoreCache: true});
    } else {
      var toastCenter = app.toast.create({
        text: 'They could not be successfully logged in. Please try again.',
        position: 'top',
        closeTimeout: 4000,
      });
      toastCenter.open();
    }
  });

  // Close login screen
  app.loginScreen.close('#my-login-screen');
});


$$(document).on('page:init', function (e) {


  /*window.FirebasePlugin.onNotificationOpen(function(notification) {
  }, function(error) {
    alert(error);
  });*/
  $("#view-stats" ).on('tab:show', function( event, ui ) {
    // do whatever you want here, like alert a message!
    statsView.router.navigate('/stats/', {
      ignoreCache:true,
      reloadCurrent:true,
    })
  });

  if(localStorage.getItem('theme') === 'theme-dark') {
    $('body').addClass('theme-dark');
    $('.darkmode').attr('checked', 'checked');
  }

  if(localStorage.getItem('pushy') === 'true') {
    $('.pushy').attr('checked', 'checked');
  }

  var current_username = localStorage.getItem("username");
  $$('.insert-username').html(current_username);
  var current_email = localStorage.getItem("email");
  $$('.insert-email').html(current_email);

  $$('.trainback').on('click', function() {
    statsView.router.back('/stats/', {reloadAll: true, animate: true});
  });

  $$('.leaderboardback').on('click', function() {
    statsView.router.back('/training_detail/', {force: true, ignoreCache: true, animate: true})
  });



  $$('.showstats').on('click', function(e) {
    app.tab.show("#view-stats", true);
    e.preventDefault();
  });
  $$('.showsearch').on('click', function(e) {
    app.tab.show("#view-search", true);
    e.preventDefault();
  });
  $$('.showstories').on('click', function(e) {
    app.tab.show("#view-stories", true);
    e.preventDefault();
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
  $$('.pushy').on('change', function() {
    if ($(this).prop('checked')) {
      var notificationFull = app.notification.create({
        icon: '<img src="img/ic_silhouette.png" style="max-width: 20px;" />',
        title: 'DD App',
        titleRightText: 'now',
        subtitle: 'Push notification enabled',
        text: 'You have push notifications enabled.',
        closeTimeout: 5000,
      });
      notificationFull.open();
      localStorage.setItem('pushy', 'true');
    } else {
      localStorage.removeItem('pushy');
      var toastCenter = app.toast.create({
        text: 'Push notifications were successfully disabled.',
        position: 'top',
        closeTimeout: 4000,
      });
      toastCenter.open();
    }
  });
  $$('.darkmode').on('change', function() {
    if($(this).prop('checked')) {
      localStorage.setItem('theme', 'theme-dark');
      $('body').addClass('theme-dark');
    } else {
      localStorage.removeItem('theme');
      $('body').removeClass('theme-dark');
    }

  });
  $$('.logout').on('click', function() {
    localStorage.clear();
    var toastCenter = app.toast.create({
      text: 'Logout was successfull. See you later!',
      position: 'top',
      closeTimeout: 4000,
    });
    toastCenter.open();
    app.tab.show("#view-home", false);
    homeView.router.navigate('/authbox/', {reloadAll: true, animate: true});
  });
});

// TODO: change the storypull url after going live with the new website
$$(document).on('page:init', '.page[data-name="stories"]', function (e) {

});
