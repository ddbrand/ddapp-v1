// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
    root: '#app', // App root element
    id: 'com.ddrobotec.ddios', // App bundle ID
    name: 'DD App', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes: routes,
    touch: {
        tapHold: true //enable tap hold events
    },
    dialog: {
        title: translate_strings('attention'),
        buttonOk: translate_strings('ok'),
        buttonCancel: translate_strings('cancel'),
    }
});

// Init/Create views
var homeView = app.views.create('#view-home', {
    url: '/',
    componentUrl: '/',
    domCache: false,
    reloadPages: true,
    reloadCurrent: true
});
var statsView = app.views.create('#view-stats', {
    url: '/stats/',
});
var plansView = app.views.create('#view-plans', {
    url: '/plans/',
});
var userView = app.views.create('#view-user', {
    url: '/user/'
});



// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
    login(function (callback) {
        if (callback === true) {
            var toastCenter = app.toast.create({
                text: translate_strings('successlogin'),
                position: 'top',
                closeTimeout: 4000,
            });
            toastCenter.open();
            $('.loginoptions').slideToggle(700);
            $('.navbar').slideToggle(700);
            app.tab.show("#view-home", true);
            app.toolbar.show('.toolbar-bottom', true);
            homeView.router.navigate('/', {
                reloadCurrent: true,
                ignoreCache: true
            });
        } else {
            var toastCenter = app.toast.create({
                text: translate_strings('failedlogin'),
                position: 'top',
                closeTimeout: 4000,
            });
            toastCenter.open();
        }
    });
    // Close login screen
    app.loginScreen.close('#my-login-screen');
});


$$('#my-dev-login-screen .login-button').on('click', function () {
    dev_login(function (callback) {
        if (callback === true) {
            var toastCenter = app.toast.create({
                text: translate_strings('successdevlogin'),
                position: 'top',
                closeTimeout: 5000,
            });
            toastCenter.open();
            $$('.devsettings .badge').html('On');
            $$('.devsettings .badge').removeClass('color-red');
            $$('.devsettings .badge').addClass('color-green');
            app.toolbar.show('.toolbar-bottom', true);
            userView.router.navigate('/user/', {
                reloadCurrent: true,
                ignoreCache: true
            });
        } else {
            var toastCenter = app.toast.create({
                text: translate_strings('failedlogin'),
                position: 'top',
                closeTimeout: 4000,
            });
            toastCenter.open();
        }
    });
    // Close login screen
    app.loginScreen.close('#my-dev-login-screen');
});

$$(document).on('page:init', function (e) {
    if (cordova.platformId == 'android') {
        StatusBar.show();
        StatusBar.styleLightContent();
    } else {
        StatusBar.styleDefault();
        StatusBar.backgroundColorByName("black");
    }
    devcheck();
    $("#view-stats").on('tab:show', function (event, ui) {
        // do whatever you want here, like alert a message!
        statsView.router.navigate('/stats/', {
            /*ignoreCache: true,
            reloadCurrent: true,*/
        })
    });

    $("#view-plans").on('tab:show', function (event, ui) {
        // do whatever you want here, like alert a message!
        plansView.router.navigate('/plans/', {
            /*ignoreCache: true,
            reloadCurrent: true,*/
        })
    });

    var current_username = localStorage.getItem("username");
    $('.insert-username').each(function () {
        $$(this).html(current_username);
    });
    var current_email = localStorage.getItem("email");
    $$('.insert-email').html(current_email);

    $$('.trainback').on('click', function () {
        statsView.router.back('/stats/', {reloadAll: true, animate: true});
    });

    $$('.leaderboardback').on('click', function () {
        var traintitle = localStorage.getItem('traintitle');
        var maintitle = traintitle.split('[')[0];
        var subtitle = traintitle.split('[').pop().split(']')[0]; // returns 'two'

        $('.traintitle').html(maintitle);
        if(traintitle !== subtitle) {
            $('.trainsubtitle').html(subtitle);
        }
        statsView.router.back('/training_detail/', {force: true, ignoreCache: true, animate: true})
    });
    $$('.showhome').on('click', function() {
        homeView.router.navigate('/', {
            reloadCurrent: true,
            ignoreCache: true
        });
    });
    $$('.showstats').on('click', function (e) {
        app.tab.show("#view-stats", true);
        e.preventDefault();
    });
    $$('.showsearch').on('click', function (e) {
        app.tab.show("#view-search", true);
        e.preventDefault();
    });
    $$('.showstories').on('click', function (e) {
        app.tab.show("#view-plans", true);
        e.preventDefault();
    });
    $$('.showplans').on('click', function (e) {
        app.tab.show("#view-plans", true);
        e.preventDefault();
    });
});