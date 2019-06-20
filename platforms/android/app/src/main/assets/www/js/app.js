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
});

// Init/Create views
var homeView = app.views.create('#view-home', {
    url: '/',
    componentUrl: '/',
    domCache: false,
    reloadPages: true
});
var statsView = app.views.create('#view-stats', {
    url: '/stats/',
});
// TODO: devmode für 1.2.0a beenden
if (localStorage.getItem('dev_login') === 'ok') {
    var plansView = app.views.create('#view-plans', {
        url: '/plans/',
    });
} else {
    var plansView = app.views.create('#view-plans', {
        url: '/stories/',
    });
}
var userView = app.views.create('#view-user', {
    url: '/user/'
});



// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
    login(function (callback) {
        if (callback === true) {
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
            homeView.router.navigate('/', {
                reloadCurrent: true,
                ignoreCache: true
            });
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


$$('#my-dev-login-screen .login-button').on('click', function () {
    dev_login(function (callback) {
        if (callback === true) {
            var toastCenter = app.toast.create({
                text: 'You have been successfully logged in as a developer.',
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
                text: 'They could not be successfully logged in. Please try again.',
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
    devcheck();
    $("#view-stats").on('tab:show', function (event, ui) {
        // do whatever you want here, like alert a message!
        statsView.router.navigate('/stats/', {
            /*ignoreCache: true,
            reloadCurrent: true,*/
        })
    });

    var $ptrContent = $$('.ptr-content');
// Add 'refresh' listener on it
    $ptrContent.on('ptr:refresh', function (e) {
        // Emulate 2s loading
        statsView.router.navigate('/stats/', {
            ignoreCache: true,
            reloadCurrent: true,
        });
        setTimeout(function () {

            app.ptr.done(); // or e.detail();
        }, 2000);
    });

    $$('.resettrainingplans').on('click', function () {
        localStorage.removeItem("myplans");
        var toastCenter = app.toast.create({
            text: 'Trainingplans were successfully reseted',
            position: 'top',
            closeButton: true,
            closeTimeout: 3000,
        });
        toastCenter.open();
        $$('.myplansind i .badge').html(0);
        sendplans();
    });

    var current_username = localStorage.getItem("username");
    $$('.insert-username').html(current_username);
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

$$(document).on('page:init', '.page[data-name="user"]', function (e) {
    $$('.pushy').on('change', function () {
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
    $$('.darkmode').on('change', function () {
        if ($(this).prop('checked')) {
            localStorage.setItem('theme', 'theme-dark');
            $('body').addClass('theme-dark');
        } else {
            localStorage.removeItem('theme');
            $('body').removeClass('theme-dark');
        }

    });
});

// TODO: change the storypull url after going live with the new website
$$(document).on('page:init', '.page[data-name="stories"]', function (e) {

});
