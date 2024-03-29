routes = [
    {
        path: '/',
        url: './index.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                if(window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                    StatusBar.overlaysWebView(false);
                    StatusBar.styleLightContent();
                    StatusBar.backgroundColorByName("black");
                }
                navigator.globalization.getPreferredLanguage(
                    function (language) {
                        var lang = language.value;
                        if (localStorage.getItem('languages_i') === null) {
                            localStorage.setItem('language', lang.slice(0, 2));
                        } else {
                            localStorage.setItem('language', localStorage.getItem('languages_i'));
                        }
                    },
                    function () {
                        localStorage.setItem('language', 'en');
                    }
                );
                translate_strings();
                FCMPlugin.getToken(function (token) {
                    var deviceName = cordova.plugins.deviceName;
                    // save this server-side and use it to push notifications to this device
                    $.ajax({
                        method: 'POST',
                        url: "https://ddrobotec.com/fcm/insertToken.php",
                        data: {
                            regToken: token,
                            deviceName: deviceName.name,
                            deviceID: device.uuid
                        }
                    }).done(function (result) {
                    });
                }, function (error) {
                    console.error(error);
                });
                setTimeout(function() {
                    StatusBar.overlaysWebView(false);
                    StatusBar.styleLightContent();
                    StatusBar.backgroundColorByName("black");
                }, 2000);
                app.init();
                pullworkouts();
                pullmytrainings();
                autologin(function (callback) {
                    if (callback === false) {
                        localStorage.setItem('theme', 'theme-dark');
                        $('body').addClass('theme-dark');
                        homeView.router.navigate('/authbox/', {
                            reloadCurrent: true,
                            ignoreCache: true
                        });
                    } else {
                        $('.navbar').slideDown(700);
                    }
                });
                if (localStorage.getItem('devmode') === true) {
                    dev_autologin(function (callback) {
                        if (callback === false) {
                            localStorage.setItem('dev_login', 'ups');
                            homeView.router.navigate('/user/', {
                                reloadCurrent: true,
                                ignoreCache: true
                            });
                        } else {
                            $$('.devsettings .badge').html('On').removeClass('color-red').addClass('color-green');
                        }
                    });
                }
                $$('.showhome').on('click', function(e) {
                    app.tab.show("#view-home", true);
                    homeView.router.navigate('/');
                    $$('.page-previous').remove();
                    e.preventDefault();
                });
                $$('.showstats').on('click', function (e) {
                    app.tab.show("#view-stats", true);
                    statsView.router.navigate('/activities/');
                    $$('.page-previous').remove();
                    e.preventDefault();
                });
                $$('.showplans').on('click', function (e) {
                    app.tab.show("#view-plans", true);
                    plansView.router.navigate('/workouts/');
                    $$('.page-previous').remove();
                    e.preventDefault();
                });
                $$('.showuser').on('click', function (e) {
                    app.tab.show("#view-user", true);
                    userView.router.navigate('/user/');
                    $$('.page-previous').remove();
                    e.preventDefault();
                });
            }
        }
    },
    {
        path: '/authbox/',
        url: './pages/authbox.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageAfterIn: function (event, page) {
                trainingplans();
                translate_strings();
                var weightrange = app.range.create({
                    el: '.weightslider',
                    label: true,
                    on: {
                        change: function () {
                        }
                    }
                });
                var heightrange = app.range.create({
                    el: '.heightslider',
                    label: true,
                    on: {
                        change: function () {
                        }
                    }
                });
                $$('#registerusername').blur(function () {
                    var username = $('#registerusername').val();
                    $.ajax({
                        method: "GET",
                        url: "https://ddrobotec.com/wp-content/themes/dd-trainings/api/ajax.php?function=exist&getname=" + username,
                        cache: false
                    }).done(function (msg) {
                        if (JSON.parse(msg).success === true) {
                            $('#registerusername').next('.item-input-error-message').html('Please choose a different username.');
                            $('#registerusername').parents('.item-input').addClass('item-input-with-error-message').addClass('item-input-invalid');
                            $('#registerusername').addClass('input-invalid');
                        } else {
                        }
                    });
                });
                $('input[name="registerrepassword"]').blur(function () {
                    var password = $('input[name="registerpassword"]').val();
                    var repassword = $('input[name="registerrepassword"]').val();
                    if (password !== repassword) {
                        $('input[name="registerrepassword"]').next('.item-input-error-message').html('Your passwords don\'t match.');
                        $('input[name="registerrepassword"]').parents('.item-input').addClass('item-input-with-error-message').addClass('item-input-invalid');
                        $('input[name="registerrepassword"]').addClass('input-invalid');
                    }
                });
                $(".register-form").submit(function (e) {
                    var username = $('#registerusername').val();
                    var email = $('input[name="registeremail"]').val();
                    var pass = $('input[name="registerpassword"]').val();
                    var repass = $('input[name="registerrepassword"]').val();
                    var gender = $('select[name="gender"]').val();
                    var weight = $('.weightslider .weight').val();
                    var height = $('.heightslider .height').val();
                    var birthdate = $('input[name="birthdate"]').val() + "z";
                    if (username != null && pass != null) {
                        $.ajax({
                            method: "POST",
                            url: "https://ddrobotec.com/wp-content/themes/dd-trainings/api/ajax.php?function=register",
                            data: {
                                "UserName": username,
                                "Email": email,
                                "Pass": pass,
                                "Weight": weight,
                                "Height": height,
                                "BirthDate": birthdate,
                                "Gender": gender,
                                "CacheName": ""
                            }
                        }).done(function (msg) {
                            var response_obj = JSON.parse(msg);

                            if (response_obj.success == false || pass !== repass) {
                                var toastCenter = app.toast.create({
                                    text: 'Please correct the register form errors.',
                                    position: 'top',
                                    closeButton: true,
                                    closeTimeout: 8000,
                                });
                                toastCenter.open();
                            } else {
                                var toastCenter = app.toast.create({
                                    text: 'Thank you for your registration. Please check your inbox to activate your account. Follow the instructions in the email.',
                                    position: 'top',
                                    closeButton: true,
                                    closeTimeout: 3000,
                                });
                                toastCenter.open();
                                app.loginScreen.close('#my-register-screen');
                            }
                            console.log(msg);
                        });
                    }
                    e.preventDefault();
                });
                $(".forget-form").submit(function (e) {
                    var Username = $('input[name="forgetusername"]').val();
                    var Email = $('input[name="forgetemail"]').val();
                    if (Username != null && Email != null) {
                        $.ajax({
                            method: "POST",
                            url: "https://ddrobotec.com/wp-content/themes/dd-trainings/api/ajax.php?function=password_forget",
                            data: {
                                "Username": Username, "Email": Email
                            }
                        }).done(function (msg) {
                            var response_obj = JSON.parse(msg);
                            if (response_obj.success == false) {
                                var toastCenter = app.toast.create({
                                    text: 'Your user could not be reset. Please check your details and try again.',
                                    position: 'top',
                                    closeButton: true,
                                    closeTimeout: 6000,
                                });
                                toastCenter.open();
                            } else {
                                var toastCenter = app.toast.create({
                                    text: 'We have sent you an e-mail with all informations. Activate the link to set a new password for your account.',
                                    position: 'top',
                                    closeButton: true,
                                    closeTimeout: 6000,
                                });
                                toastCenter.open();
                                app.loginScreen.close('#my-forget-screen');
                            }
                            console.log(msg);
                        });
                    }
                    e.preventDefault();
                });
                $$('.weightslider').on('range:change', function (e, range) {
                    $$('.user-weight').text((range.value) + ' kg');
                });
                $$('.heightslider').on('range:change', function (e, range) {
                    $$('.user-height').text((range.value) + ' cm');
                });
                $$('.login-close').on('click', function () {
                    app.loginScreen.close('#my-login-screen');
                });
                $$('.register-close').on('click', function () {
                    app.loginScreen.close('#my-register-screen');
                });
                $$('.forget-close').on('click', function () {
                    app.loginScreen.close('#my-forget-screen');
                });
                $$('.login_screen_open').on('click', function () {
                    app.loginScreen.close('#my-forget-screen');
                    app.loginScreen.close('#my-register-screen');
                    app.loginScreen.close('#my-login-add-screen');
                    app.loginScreen.open('#my-login-screen');
                });
                $$('.register_screen_open').on('click', function () {
                    app.loginScreen.close('#my-forget-screen');
                    app.loginScreen.close('#my-login-screen');
                    app.loginScreen.close('#my-login-add-screen');
                    app.loginScreen.open('#my-register-screen');
                });
                $$('.forget_screen_open').on('click', function () {
                    app.loginScreen.close('#my-register-screen');
                    app.loginScreen.close('#my-login-screen');
                    app.loginScreen.close('#my-login-add-screen');
                    app.loginScreen.open('#my-forget-screen');
                });
                setTimeout(function () {
                    var swiper = app.swiper.get('.swiper-container');
                    swiper.autoplay.start();
                }, 1000);
                app.toolbar.hide('.toolbar-bottom', false);
                $('.navbar').slideToggle(700);
                setTimeout(function () {
                    $('.loginoptions').slideToggle(700);
                }, 2000);
            }
        }
    },
    {
        path: '/training_detail/',
        url: './pages/training_detail.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                translate_strings();
                var username = localStorage.getItem('username');
                var traintitle = localStorage.getItem('traintitle');
                var clickedid = localStorage.getItem('detail_train_id');
                var clickedscore = localStorage.getItem('detail_train_score');

                $.ajax({
                    url: "https://ddrobotec.com/grafana/detail_pull_report.php?username=" + username + "&title=" + traintitle + "&dataid=" + clickedid,
                }).done(function (result) {
                    var traintitle = localStorage.getItem('traintitle');
                    var maintitle = traintitle.split('[')[0];
                    var subtitle = traintitle.split('[').pop().split(']')[0]; // returns 'two'
                    $('.traintitle').html(maintitle);
                    if (traintitle !== subtitle) {
                        $('.trainsubtitle').html(subtitle);
                    }
                    $('.detailoverview').html(result);
                    $.ajax({
                        url: "https://ddrobotec.com/grafana/detail_topscore.php?title=" + traintitle,
                    }).done(function (result) {
                        $('.score').html(result);
                        var score = $('.myscore').attr('data-score');
                        var topscore = $('.topscore').attr('data-topscore');
                        var realdez = clickedscore / topscore;
                        if (localStorage.getItem('theme') === 'theme-dark') {
                            var bigbordercolor = '#d7d760';
                            var bigbgbordercolor = 'rgba(215, 215, 96, 0.3)';
                        } else {
                            var bigbordercolor = '#58595b';
                            var bigbgbordercolor = 'rgba(88, 89, 91, 0.3)';
                        }

                        var labelvalue = translate_strings('biggaugelabel', topscore);
                        var demoGauge = app.gauge.create({
                            el: '.score',
                            type: 'circle',
                            value: realdez,
                            size: 250,
                            borderColor: bigbordercolor,
                            borderBgColor: bigbgbordercolor,
                            borderWidth: 10,
                            valueText: clickedscore,
                            valueFontSize: 41,
                            valueTextColor: bigbordercolor,
                            labelText: labelvalue,
                        });
                        var trainingid = localStorage.getItem('traintitle');
                        $.ajax({
                            url: "https://ddrobotec.com/grafana/grafanapull.php?username=" + username + "&trainingid=" + trainingid + "&score=" + score + "&page=3",
                        }).done(function (result) {
                            $$('.detailoverview').append(result);
                            var myrank = $$('.rank').attr('data-myrank');
                            var places = $$('.rank').attr('data-places');
                            var circletext = myrank + ' / ' + places;
                            var circleprevalue = 1 / places;
                            var betvar = myrank - 1;
                            var circlevalue = (places - betvar) * circleprevalue;
                            var leftgaugelabel = translate_strings('leftgaugelabel');
                            var leftGauge = app.gauge.create({
                                el: '.leftgauge',
                                type: 'semicircle',
                                value: circlevalue,
                                borderWidth: 10,
                                borderColor: '#97d3cc',
                                borderBgColor: 'rgba(151,211,204,0.3)',
                                valueText: circletext,
                                valueFontSize: 28,
                                valueTextColor: '#97d3cc',
                                labelText: leftgaugelabel,
                            });
                            var mybestscore = $$('.rank').attr('data-bestscore');
                            var scorevalue = 1 / topscore * mybestscore;
                            var rightgaugelabel = translate_strings('rightgaugelabel');
                            var rightGauge = app.gauge.create({
                                el: '.rightgauge',
                                type: 'semicircle',
                                value: scorevalue,
                                borderWidth: 10,
                                borderColor: '#ef763e',
                                borderBgColor: 'rgba(239,118,62,0.3)',
                                valueText: mybestscore,
                                valueFontSize: 28,
                                valueTextColor: '#ef763e',
                                labelText: rightgaugelabel,
                            });

                        });
                    });
                });
                $$('.leaderboardlink').on('click', function () {
                    var fetcher = $(this).attr('data-fetch');
                    localStorage.setItem('leaderboardfetch', fetcher);
                    statsView.router.navigate('/leaderboard/', {force: true, animate: true});
                });
                // back arrow on statsview tab. Returns the user to the main page in statsview on click.
                $$('.trainback').on('click', function () {
                    statsView.router.back('/stats/', {reloadAll: true, animate: true});
                });
            }
        }
    },
    {
        path: '/leaderboard/',
        url: './pages/leaderboard.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                translate_strings();
                var username = localStorage.getItem('username');
                var traintitle = localStorage.getItem('traintitle');
                var maintitle = traintitle.split('[')[0];
                var subtitle = traintitle.split('[').pop().split(']')[0]; // returns 'two'
                var leaderboardfetch = localStorage.getItem('leaderboardfetch');
                $('.traintitle').html(maintitle + ' ' + leaderboardfetch);
                if (traintitle !== subtitle) {
                    $('.trainsubtitle').html(subtitle);
                }
                $.ajax({
                    url: "https://ddrobotec.com/grafana/grafanapull.php?trainingid=" + traintitle + "&username=" + username + "&fetch=" + leaderboardfetch + "&page=4",
                }).done(function (result) {
                    $$('.leaderboard').html(result);
                });
                $$('.back').on('click', function() {
                    statsView.router.navigate('/training_detail/', {reloadCurrent: true, ignoreCache: true});
                });
            }
        }
    },
    {
        path: '/scan/',
        url: './pages/scan.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                translate_strings();
                setTimeout(function() {
                    $$('.page-previous').hide();
                    $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").addClass('nobg');
                    $('.downunder').slideToggle();
                }, 800);
                $$('.cameramode').click(function () {
                    $('.toolbar-bottom').hide();
                });
                $('.toolbar-bottom').hide();
                QRScanner.prepare(onDone);

                function onDone(err, status) {
                    if (err) {
                        console.error(err);
                    }
                    if (status.authorized) {
                        QRScanner.show();
                        QRScanner.scan(displayContents);

                    } else if (status.denied) {
                        QRScanner.openSettings();
                        alert(translate_strings('enablecamerasupport'));
                    } else {
                    }
                }
                $$(document).on('click', '.scanback', function (e) {
                    $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").removeClass('nobg');
                    app.toolbar.show('.toolbar-bottom', true);
                    QRScanner.cancelScan();
                    QRScanner.destroy();
                    QRScanner.hide();
                    $('.toolbar-bottom').show();
                    $$('.page-previous').show();
                    app.router.navigate('/', {animate: true});
                });
            }
        }
    },
    {
        path: '/blog/',
        url: './pages/blog.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                /*$.ajax({
                    url: "https://dev2.ddrobotec.com/wp-content/themes/ddrobotec/api/laststories.php",
                }).done(function (result) {
                    $('.story_container').html(result);
                });*/
                translate_strings();
                pullblogentries();
            }
        }
    },
    {
        path: '/user/',
        url: './pages/user.html',
        options: {
            transition: 'f7-dive',
        },
        routes:  [
            {
                path: 'changeuser/',
                url: './pages/changeuser.html',
                options: {
                    transition: 'f7-dive',
                },
                on: {
                    pageInit: function (event, page) {
                        translate_strings();
                        $$(document).on('click', '.changeuserback', function() {
                            $('.page-previous[data-name="user"]').show();
                            $('.page-previous[data-name="user"]').css('visibility', 'visible');
                            userView.router.navigate('/user/', {animate: true});
                        });
                        var weightrange = app.range.create({
                            el: '.weightslider',
                            label: true,
                            on: {
                                change: function () {
                                }
                            }
                        });
                        var heightrange = app.range.create({
                            el: '.heightslider',
                            label: true,
                            on: {
                                change: function () {
                                }
                            }
                        });
                        $$('#registerusername').blur(function () {
                            var username = $('#registerusername').val();
                            $.ajax({
                                method: "GET",
                                url: "https://ddrobotec.com/wp-content/themes/dd-trainings/api/ajax.php?function=exist&getname=" + username,
                                cache: false
                            }).done(function (msg) {
                                if (JSON.parse(msg).success === true) {
                                    $('#registerusername').next('.item-input-error-message').html('Please choose a different username.');
                                    $('#registerusername').parents('.item-input').addClass('item-input-with-error-message').addClass('item-input-invalid');
                                    $('#registerusername').addClass('input-invalid');
                                } else {
                                }
                            });
                        });
                        $('input[name="registerrepassword"]').blur(function () {
                            var password = $('input[name="registerpassword"]').val();
                            var repassword = $('input[name="registerrepassword"]').val();
                            if (password !== repassword) {
                                $('input[name="registerrepassword"]').next('.item-input-error-message').html('Your passwords don\'t match.');
                                $('input[name="registerrepassword"]').parents('.item-input').addClass('item-input-with-error-message').addClass('item-input-invalid');
                                $('input[name="registerrepassword"]').addClass('input-invalid');
                            }
                        });
                        $(".register-form").submit(function (e) {
                            if ($('.item-input-error-message').is(':visible')) {
                                alert('hihi');
                            } else {
                                var username = $('#registerusername').val();
                                var email = $('input[name="registeremail"]').val();
                                var pass = $('input[name="registerpassword"]').val();
                                var repass = $('input[name="registerrepassword"]').val();
                                var gender = $('select[name="gender"]').val();
                                var weight = $('.weightslider .weight').val();
                                var height = $('.heightslider .height').val();
                                var birthdate = $('input[name="birthdate"]').val() + "z";
                                if (username != null && pass != null) {
                                    $.ajax({
                                        method: "POST",
                                        url: "https://ddrobotec.com/wp-content/themes/dd-trainings/api/ajax.php?function=register",
                                        data: {
                                            "UserName": username,
                                            "Email": email,
                                            "Pass": pass,
                                            "Weight": weight,
                                            "Height": height,
                                            "BirthDate": birthdate,
                                            "Gender": gender,
                                            "CacheName": ""
                                        }
                                    }).done(function (msg) {
                                        var response_obj = JSON.parse(msg);
                                        if (response_obj.success == false || pass !== repass) {
                                            var toastCenter = app.toast.create({
                                                text: 'Please correct the register form errors.',
                                                position: 'top',
                                                closeButton: true,
                                                closeTimeout: 8000,
                                            });
                                            toastCenter.open();
                                        } else {
                                            var toastCenter = app.toast.create({
                                                text: 'Thank you for your registration. Please check your inbox to activate your account. Follow the instructions in the email.',
                                                position: 'top',
                                                closeButton: true,
                                                closeTimeout: 3000,
                                            });
                                            toastCenter.open();
                                            app.loginScreen.close('#my-register-screen');
                                        }
                                        console.log(msg);
                                    });
                                } else if (/ /.test(username)) {
                                    console.log('Space detected');
                                }
                            }
                            e.preventDefault();
                        });
                        $(".forget-form").submit(function (e) {
                            var Username = $('input[name="forgetusername"]').val();
                            var Email = $('input[name="forgetemail"]').val();
                            if (Username != null && Email != null) {
                                $.ajax({
                                    method: "POST",
                                    url: "https://ddrobotec.com/wp-content/themes/dd-trainings/api/ajax.php?function=password_forget",
                                    data: {
                                        "Username": Username, "Email": Email
                                    }
                                }).done(function (msg) {
                                    var response_obj = JSON.parse(msg);
                                    if (response_obj.success == false) {
                                        var toastCenter = app.toast.create({
                                            text: 'Your user could not be reset. Please check your details and try again.',
                                            position: 'top',
                                            closeButton: true,
                                            closeTimeout: 6000,
                                        });
                                        toastCenter.open();
                                    } else {
                                        var toastCenter = app.toast.create({
                                            text: 'We have sent you an e-mail with all informations. Activate the link to set a new password for your account.',
                                            position: 'top',
                                            closeButton: true,
                                            closeTimeout: 6000,
                                        });
                                        toastCenter.open();
                                        app.loginScreen.close('#my-forget-screen');
                                    }
                                    console.log(msg);
                                });
                            }
                            e.preventDefault();
                        });
                        $$(document).on('click', '.changeuserback', function() {
                            $('.page-previous[data-name="user"]').show();
                            $('.page-previous[data-name="user"]').css('visibility', 'visible');
                            userView.router.navigate('/user/', {animate: true});
                        });
                        $$('.weightslider').on('range:change', function (e, range) {
                            $$('.user-weight').text((range.value) + ' kg');
                        });
                        $$('.heightslider').on('range:change', function (e, range) {
                            $$('.user-height').text((range.value) + ' cm');
                        });
                        $$('.login-close').on('click', function () {
                            app.loginScreen.close('#my-login-screen');
                        });
                        $$('.register-close').on('click', function () {
                            app.loginScreen.close('#my-register-screen');
                        });
                        $$('.forget-close').on('click', function () {
                            app.loginScreen.close('#my-forget-screen');
                        });
                        $$('.login_screen_open').on('click', function () {
                            app.loginScreen.close('#my-forget-screen');
                            app.loginScreen.close('#my-register-screen');
                            app.loginScreen.close('#my-login-add-screen');
                            app.loginScreen.open('#my-login-screen');
                        });
                        $$('.register_screen_open').on('click', function () {
                            app.loginScreen.close('#my-forget-screen');
                            app.loginScreen.close('#my-login-screen');
                            app.loginScreen.close('#my-login-add-screen');
                            app.loginScreen.open('#my-register-screen');
                        });
                        $$('.forget_screen_open').on('click', function () {
                            app.loginScreen.close('#my-register-screen');
                            app.loginScreen.close('#my-login-screen');
                            app.loginScreen.close('#my-login-add-screen');
                            app.loginScreen.open('#my-forget-screen');
                        });
                        var sortedlocal = [];
                        for (var i = 0; i < localStorage.length; i++) {
                            if (localStorage.key(i).startsWith("username_")) {
                                var userkey = localStorage.key(i).substr(localStorage.key(i).indexOf('_')+1);
                                //var userkey = localStorage.key(i).split(/_(.+)/, 1);
                                // sortedlocal[userkey] = localStorage.getItem('username_' + userkey[1]);
                                sortedlocal.push(localStorage.getItem('username_' + userkey));
                            }
                        }
                        sortedlocal.sort(function (a, b) {
                            if ( a.toLowerCase() < b.toLowerCase() ) {
                                return -1;
                            } else if ( a.toLowerCase() > b.toLowerCase() ) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        for (var i = 0; i < sortedlocal.length; i++) {
                            var userkey = localStorage.key(i).split("_");
                            $('.userchanger.list.media-list ul').append('<li class="swipeout">\n' +
                                '<a href="#" class="item-link item-content swipeout-content changeme" data-user="' + sortedlocal[i] + '">\n' +
                                '<div class="item-media" style="padding-left: 8px;">' +
                                '<i class="icon f7-icons material-icons icon-ios-fill">person</i></div>\n' +
                                '<div class="item-inner">\n' +
                                '<div class="item-title-row">\n' +
                                '<div class="item-title">' + sortedlocal[i] + '</div>\n' +
                                '</div>\n' +
                                '</div>\n' +
                                '</a><div class="swipeout-actions-right">\n' +
                                '<a href="#" data-storageattr="' + sortedlocal[i] + '" class="userremove swipeout-delete">' + translate_strings('remove') + '</a>\n' +
                                '</div>\n' +
                                '</li>');
                        }
                        $$('.userremove').on('click', function () {
                            var storageattr = $(this).attr('data-storageattr');
                            localStorage.removeItem('username_' + storageattr);
                            localStorage.removeItem('email_' + storageattr);
                            localStorage.removeItem('pass_' + storageattr);
                            var toastCenter = app.toast.create({
                                text: translate_strings('successremoveuser'),
                                position: 'top',
                                closeTimeout: 4000,
                            });
                            toastCenter.open();
                            userView.router.navigate('/user/', {reloadCurrent: true, animate: true});
                        });
                        $$('.changeme').on('click', function () {
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
                            localStorage.setItem('username_' + olduser, olduser);
                            localStorage.setItem('pass_' + olduser, oldpass);
                            localStorage.setItem('email_' + olduser, oldemail);
                            // Remove old Userstorage for changed User
                            localStorage.removeItem('username_' + datakey);
                            localStorage.removeItem('email_' + datakey);
                            localStorage.removeItem('pass_' + datakey);
                            var toastCenter = app.toast.create({
                                text: translate_strings('userchanged'),
                                position: 'top',
                                closeTimeout: 4000,
                                closeButton: true
                            });
                            toastCenter.open();
                            pullmytrainings();
                            userView.router.navigate('/user/', {reloadAll: true, animate: true});
                        });
                        $$('.login_add_screen_open').on('click', function () {
                            app.loginScreen.open('#my-login-add-screen');
                        });
                        $$('.login-add-close').on('click', function () {
                            app.loginScreen.close('#my-login-add-screen');
                        });
                        $$('.login-add-button').on('click', function () {
                            login_add(function (callback) {
                                if (callback === true) {
                                } else {
                                    var toastCenter = app.toast.create({
                                        text: translate_strings('failedlogin'),
                                        position: 'top',
                                        closeTimeout: 4000,
                                    });
                                    toastCenter.open();
                                }
                            });
                            app.loginScreen.close('#my-login-add-screen');
                            userView.router.navigate('/user/', {reloadCurrent: true, animate: true});
                        });
                    }
                }
            },
        ],
        on: {
            pageInit: function (event, page) {
                translate_strings();
                $$('select[name=languages]').on('change', function () {
                    localStorage.setItem('languages_i', this.value);
                    app.smartSelect.close();
                    app.dialog.preloader();
                    setTimeout(function () {
                        app.tab.show("#view-home", true);
                        translate_strings();
                        var toastCenter = app.toast.create({
                            text: translate_strings('languageswitched'),
                            position: 'top',
                            closeTimeout: 4000,
                        });
                        toastCenter.open();
                        app.dialog.close();
                        $$('.pullreport').html('<p class="block text-align-center" style="font-size: 14px; opacity: 0.5;">' + translate_strings('notrainingactivity') + '</p>');
                    }, 1200);
                    homeView.router.navigate('/', {reloadAll: true, animate: true});
                    homeView.router.refreshPage();
                });
                $$('select[name=languages]').val(localStorage.getItem('language'));
                $$('.open-confirm-logout').on('click', function () {
                    app.dialog.confirm(translate_strings('confirmlogout'), function () {
                        app.dialog.close();
                        localStorage.clear();
                        var toastCenter = app.toast.create({
                            text: translate_strings('successlogout'),
                            position: 'top',
                            closeTimeout: 4000,
                        });
                        toastCenter.open();
                        app.tab.show("#view-home", false);
                        homeView.router.navigate('/authbox/', {reloadAll: true, animate: true});
                    });
                    if (localStorage.getItem('theme') === 'theme-dark') {
                        $('.dialog').addClass('bg-color-black');
                        $('.dialog-title').addClass('text-color-gray');
                    }
                });

                $$('.open-confirm-resetplans').on('click', function () {
                    app.dialog.confirm(translate_strings('confirmresetplans'), function () {
                        app.dialog.close();
                        localStorage.removeItem("myplans");
                        var toastCenter = app.toast.create({
                            text: translate_strings('resetedworkouts'),
                            position: 'top',
                            closeButton: true,
                            closeTimeout: 3000,
                        });
                        toastCenter.open();
                        $$('.myplansind i .badge').html(0);
                        sendplans();
                    });
                    if (localStorage.getItem('theme') === 'theme-dark') {
                        $('.dialog').addClass('bg-color-black');
                        $('.dialog-title').addClass('text-color-gray');
                    }
                    sendplans();
                });

                $$('.devmode').on('taphold', function () {
                    if (localStorage.getItem('devmode') === 'true') {
                    } else {
                        var toastCenter = app.toast.create({
                            text: translate_strings('enableddevmode'),
                            closeTimeout: 12000,
                            closeButton: true
                        });
                        toastCenter.open();
                        $$('.toplist ul').prepend('<li class="swipeout devsettings">\n' +
                            '<div class="swipeout-content">' +
                            '<a href="#" class="dev_login_screen_open item-content item-link" data-login-screen=".dev-login-screen">' +
                            '<div class="item-title">' + translate_strings('developermode') + '</div>\n' +
                            '<div class="item-after"> <span class="badge color-red">Off</span></div>\n' +
                            '</a>' +
                            '</div>' +
                            '<div class="swipeout-actions-right">\n' +
                            '<a href="#" class="swipeout-delete no-chevron disabledev">' + translate_strings('disable') + '</a>\n' +
                            '</div>' +
                            '</li>');
                        localStorage.setItem('devmode', 'true');
                        $$('.dev-login-close').on('click', function () {
                            app.loginScreen.close('#my-dev-login-screen');
                        });
                        $$('.dev_login_screen_open').on('click', function () {
                            app.loginScreen.open('#my-dev-login-screen');
                        });
                    }
                });
                if (localStorage.getItem('devmode') === 'true') {
                    if (localStorage.getItem('dev_login') === 'ok') {
                        var dev_username = localStorage.getItem('dev_username');
                        var badger = '<span class="badge color-green">Online</span>&nbsp;&nbsp;&nbsp;as ' + dev_username + '';
                    } else {
                        var badger = '<span class="badge color-red">Off</span>';
                    }
                    $$('.toplist ul').prepend('<li class="swipeout devsettings">\n' +
                        '<div class="swipeout-content">' +
                        '<a href="#" class="dev_login_screen_open item-content item-link" data-login-screen=".dev-login-screen">' +
                        '<div class="item-title">' + translate_strings('developermode') + '</div>\n' +
                        '<div class="item-after">' + badger + '</div>\n' +
                        '</a>' +
                        '</div>' +
                        '<div class="swipeout-actions-right">\n' +
                        '<a href="#" class="swipeout-delete no-chevron disabledev">' + translate_strings('disable') + '</a>\n' +
                        '</div>' +
                        '</li>');
                }
                $$('.pushy').on('change', function () {
                    if ($(this).prop('checked')) {
                        var toastCenter = app.toast.create({
                            text: translate_strings('pushenabled'),
                            position: 'top',
                            closeButton: true,
                            closeTimeout: 5000,
                        });
                        toastCenter.open();
                        localStorage.setItem('pushy', 'true');
                    } else {
                        localStorage.removeItem('pushy');
                    }
                });
                $$('.darkmode').on('change', function () {
                    if ($(this).prop('checked')) {
                        localStorage.setItem('theme', 'theme-dark');
                        $('body').addClass('theme-dark');
                        setTimeout(function() {
                            StatusBar.overlaysWebView(false);
                            StatusBar.styleLightContent();
                            StatusBar.backgroundColorByName("black");
                        }, 500);
                    } else {
                        localStorage.removeItem('theme');
                        $('body').removeClass('theme-dark');
                    }
                });
                $$('.dev-login-close').on('click', function () {
                    app.loginScreen.close('#my-dev-login-screen');
                });
                $$('.dev_login_screen_open').on('click', function () {
                    app.loginScreen.open('#my-dev-login-screen');
                });
                if (localStorage.getItem('theme') === 'theme-dark') {
                    $('body').addClass('theme-dark');
                    $('.darkmode').attr('checked', 'checked');
                }
                if (localStorage.getItem('pushy') === 'true') {
                    $('.pushy').attr('checked', 'checked');
                }
                $$('.disabledev').on('click', function () {
                    localStorage.removeItem('devmode');
                    localStorage.removeItem('dev_login');
                    localStorage.removeItem('dev_username');
                    localStorage.removeItem('dev_pass');
                    $$('.toplist ul .devsettings').remove();
                    var toastCenter = app.toast.create({
                        text: translate_strings('disableddevmode'),
                        closeTimeout: 6000,
                        closeButton: true
                    });
                    toastCenter.open();
                    devcheck();
                });
            }
        }
    },
    {
        path: '/register/',
        url: './pages/register.html',
    },
    {
        path: '/plans/',
        url: './pages/plan.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                var searchbar = app.searchbar.create({
                    el: '.searchbar',
                    searchContainer: '.iwu',
                    searchIn: '.item-title',
                    on: {
                        search(sb, query, previousQuery) {
                            console.log(query, previousQuery);
                        }
                    }
                });
                trainingplans();
                app.init();
                $('.searchbar input').on('change', function () {
                    if ($$('.searchbar input').val() === '') {
                        $$('.iwu ul').html('');
                        $('.iwu').hide();
                    } else {
                        $$('.iwu ul').html('');
                        pullalltrainings();
                        $('.iwu').show();
                    }
                });
                $$('.searchbar input').focus(function () {
                    $$('.iwu ul').html('');
                    pullalltrainings();
                    $('.iwu').show();
                });
                $$('.searchbar input').blur(function () {
                    if ($$('.searchbar input').val() === '') {
                        $$('.iwu ul').html('');
                        $('.iwu').hide();
                    }
                });
                $$('.plansbreadcrumb').html(localStorage.getItem('category') + ' > ' + localStorage.getItem('subcategory'));
                $$('.subplansbreadcrumb').html(localStorage.getItem('category'));
                if (localStorage.getItem("myplans") === null) {
                    $$('.myplansind i .badge').html('0');
                } else {
                    var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                    $$('.myplansind i .badge').html(myplansindicator.length - 1);
                }
            }
        }
    },
    {
        path: '/activities/',
        url: './pages/activities.html',

        options: {
            transition: 'f7-circle',
        },
        on: {
            pageInit: function (event, page) {
                translate_strings();
                pullmytrainings();
            }
        }
    },
    {
        path: '/activities/highscore/',
        url: './pages/activities/highscore.html',
        options: {
            transition: 'f7-circle',
        },
        on: {
            pageInit: function (event, page) {
                translate_strings();
            }
        }
    },
    {
        path: '/workouts/',
        url: './pages/workouts.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                translate_strings();
                pullworkouts();
            }
        }
    },
    {
        path: '/plan_choice/',
        url: './pages/plan_choice.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                $$('.plansbreadcrumb').html(localStorage.getItem('category') + ' > ' + localStorage.getItem('subcategory'));
                $$('.subplansbreadcrumb').html(localStorage.getItem('category'));
                if (localStorage.getItem("myplans") === null) {
                    $$('.myplansind i .badge').html('0');
                } else {
                    var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                    $$('.myplansind i .badge').html(myplansindicator.length - 1);
                }
                planchoice();
                $$('.back').on('click', function() {
                    plansView.router.navigate('/workouts/', { animate: true});
                });
            }
        }
    },
    {
        path: '/myplans/',
        url: './pages/myplans.html',
        options: {
            transition: 'f7-dive',
        },
        on: {
            pageInit: function (event, page) {
                translate_strings();
                if (localStorage.getItem("myplans") === null) {
                    $$('.myplansind i .badge').html('0');
                } else {
                    var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                    $$('.myplansind i .badge').html(myplansindicator.length - 1);
                }
                showmyplans();
                $$('.back').on('click', function() {
                    $('.page-previous[data-name="workouts"]').show();
                    $('.page-previous[data-name="workouts"]').css('visibility', 'visible');
                    plansView.router.navigate('/workouts/', {animate: true});
                });
            }
        }
    },

    // Default route (404 page). MUST BE THE LAST
    {
        path: '(.*)',
        url: './pages/404.html',
    },
];
