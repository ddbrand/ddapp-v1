var $$ = Dom7;

/*** Initialize Framework7 libraries.
 * @version 1.0.0 **/
var app = new Framework7({
    root: '#app',
    id: 'com.ddrobotec.ddios',
    name: 'DD App',
    theme: 'auto',
    routes: routes,
    touch: {
        tapHold: true,
        fastClicks: true
    },
    dialog: {
        title: translate_strings('attention'),
        buttonOk: translate_strings('ok'),
        buttonCancel: translate_strings('cancel'),
    }
});


/*** Initialize and create the webview for tab navigation
 * @version 1.0.0 **/
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


/*** Listen for click handler on loginform-button for submit the login request to the server via ajax.
 * @version 1.0.0 **/
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
    app.loginScreen.close('#my-login-screen');
});


/*** Listen for click handler on developer loginform-button for submit the developer-login request to the server
 * via ajax.
 * @version 1.2.1 **/
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
    app.loginScreen.close('#my-dev-login-screen');
});


$$(document).on('page:init', function () {
    /*** Check the current viewers platform (iOS or android) to append custom settings for the device specific
     * statusbar on top.
     * @plugin cordova-plugin-statusbar 2.4.3
     * @version 1.2.3 **/
    if (cordova.platformId == 'android') {
        StatusBar.show();
        // append style for light content types e.g. dark background.
        StatusBar.styleLightContent();
    } else {
        StatusBar.styleDefault();
        StatusBar.backgroundColorByName("black");
    }


    // check if the developermode currently active or inactive.
    devcheck();


    // reload router to the first page from tab for refreshed tabcontent after view is initilizing.
    $("#view-stats").on('tab:show', function (event, ui) {
        statsView.router.navigate('/stats/');
    });
    $("#view-plans").on('tab:show', function (event, ui) {
        plansView.router.navigate('/plans/');
        // load trainingplans on first planview load.
        trainingplans();
    });


    // apply the currently loggedin username to all elements with class .insert-username in html value.
    var current_username = localStorage.getItem("username");
    $('.insert-username').each(function () {
        $$(this).html(current_username);
    });


    // back arrow on statsview tab. Returns the user to the main page in statsview on click.
    $$('.trainback').on('click', function () {
        statsView.router.back('/stats/', {reloadAll: true, animate: true});
    });


    // edit the title on the leaderboard pages. It will be splitted, the level of difficulty is printed as subtitle.
    $$('.leaderboardback').on('click', function () {
        var traintitle = localStorage.getItem('traintitle');
        var maintitle = traintitle.split('[')[0];
        var subtitle = traintitle.split('[').pop().split(']')[0];
        $('.traintitle').html(maintitle);
        if(traintitle !== subtitle) {
            $('.trainsubtitle').html(subtitle);
        }
        statsView.router.back('/training_detail/', {force: true, ignoreCache: true, animate: true})
    });
});