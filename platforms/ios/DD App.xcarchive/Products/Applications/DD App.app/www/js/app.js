// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'com.ddrobotec.ddios', // App bundle ID
  name: 'DD App', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
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
        text: 'Du wurdest erfolgreich eingeloggt.',
        position: 'bottom',
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
  var current_username = localStorage.getItem("username");
  $$('.insert-username').html(current_username);
  var current_email = localStorage.getItem("email");
  $$('.insert-email').html(current_email);

  $$('.trainback').on('click', function() {
    statsView.router.back('/stats/', {reloadAll: true, animate: true});

  });

  $('.search_bar').keyup(function() {
    var thato = $(this).val();
    $('.item-content[data-title*="'+ thato +'"]').hide();
  });

  //var deviceName = cordova.plugins.deviceName;

  // alert(deviceName.name);


// Start a scan. Scanning will continue until something is detected or
// `QRScanner.cancelScan()` is called.

// Be sure to make any opaque HTML elements transparent here to avoid
// covering the video.

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
$$(document).on('page:init', '.page[data-name="scan"]', function (e) {
  $$('.cameramode').click(function(e) {
    $('.toolbar-bottom').hide();

     // show the prompt
    homeView.router.navigate('/scan/', {reloadAll: true, animate: true});

  });

  $$(".scanback").on('click', function (e) {
    $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").removeClass('nobg');
    app.toolbar.show('.toolbar-bottom', true);
    QRScanner.cancelScan();
    QRScanner.destroy();
    QRScanner.hide();
    homeView.router.navigate('/', {reloadAll: true, animate: true});
    $('.toolbar-bottom').show();

    //app.tab.show("#view-home", true);
  });

});

$$(document).on('page:init', '.page[data-name="stats"]', function (e) {
var username = localStorage.getItem('username');
  $.ajax({
    url: "https://ddrobotec.com/grafana/pull_report.php?username=" + username,
  }).done(function(result) {
    $$('.pullreport').html('');
    $$( '.pullreport' ).append( result );
    $$('.detailreport').on('click', function() {
      var clicktitle = $(this).attr('data-title');
      var clickeditem = $(this).attr('data-id');
      localStorage.setItem('traintitle', clicktitle);
      localStorage.setItem('detail_train_id', clickeditem);
      app.tab.show("#view-stats", false);
      statsView.router.navigate('/training_detail/', {reloadAll: true, animate: true});

    })
  });
});

$$(document).on('page:init', '.page[data-name="trainingdetail"]', function (e) {
  var username = localStorage.getItem('username');
  var traintitle = localStorage.getItem('traintitle');
  var clickedid = localStorage.getItem('detail_train_id');
  $.ajax({
    url: "https://ddrobotec.com/grafana/detail_pull_report.php?username=" + username + "&title=" + traintitle + "&dataid=" + clickedid,
  }).done(function(result) {
    $('.traintitle').html(localStorage.getItem('traintitle'));
    $('.detailoverview').html(result);

    $.ajax({
      url: "https://ddrobotec.com/grafana/detail_topscore.php?title=" + traintitle,
    }).done(function(result) {
      $('.score').html(result);
      var myscore = $('.myscore').attr('data-score');
      var topscore = $('.topscore').attr('data-topscore');
      var realdez = myscore / topscore;
        var demoGauge = app.gauge.create({
            el: '.score',
            type: 'circle',
            value: realdez,
            size: 250,
            borderColor: '#82bec8',
            borderWidth: 10,
            valueText: myscore,
            valueFontSize: 41,
            valueTextColor: '#82bec8',
            labelText:  'Points from ' + topscore + ' topscore',
        });
    });
  });
});


/*
$$(document).on('page:init', '.page[data-name="trainingdetail"]', function (e) {
  var username = localStorage.getItem('username');
  var traintitle = localStorage.getItem('traintitle');
  $$('.traintitle').html(traintitle);
  $.ajax({
    url: "https://ddrobotec.com/grafana/pull_report.php?username=" + username,
  }).done(function(result) {
    $$('.pullreport').html('');
    $$( '.pullreport' ).append( result );
  });
});
*/

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
          '                        <div class="item-media" style="padding-left: 8px;">' +
          '                            <i class="icon f7-icons material-icons icon-ios-fill">person</i></div>\n' +
          '                        <div class="item-inner">\n' +
          '                            <div class="item-title-row">\n' +
          '                                <div class="item-title">' + localStorage.getItem('username_' + userkey[1]) + '</div>\n' +
          '                            </div>\n' +
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
    //
    userView.router.navigate('/user/', {reloadAll: true, animate: true});
    // app.tab.show("#view-stats", true);
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
          text: 'You have been successfully logged in.',
          position: 'bottom',
          closeTimeout: 4000,
        });
        toastCenter.open();
        userView.router.navigate('/user/', {reloadAll: true, animate: true});
      } else {
        var toastCenter = app.toast.create({
          text: 'You could not be successfully logged in. Please try again.',
          position: 'bottom',
          closeTimeout: 4000,
        });
        toastCenter.open();
      }
    });
    app.loginScreen.close('#my-login-add-screen');
  });
});

// TODO: change the storypull url after going live with the new website
$$(document).on('page:init', '.page[data-name="stories"]', function (e) {
  $.ajax({
    url: "https://dev2.ddrobotec.com/wp-content/themes/ddrobotec/api/laststories.php",
  }).done(function(result) {
    $( '.story_container' ).html( result );
  });
});
$$(document).on('page:init', '.page[data-name="timeline"]', function (e) {

  $$('.timelineback').on('click', function () {
    userView.router.navigate('/user/', {reloadAll: true, animate: true});
  });
});