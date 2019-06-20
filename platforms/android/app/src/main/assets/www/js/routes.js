routes = [
    {
        path: '/',
        url: './index.html',
        on: {
            pageInit: function (event, page) {
                navigator.globalization.getPreferredLanguage(
                    function (language) {/*alert(language.value);*/
                        var lang = language.value;
                        if(localStorage.getItem('languages_i') === null){
                            localStorage.setItem('language', lang.slice(0, 2));
                        } else {
                            localStorage.setItem('language', localStorage.getItem('languages_i'));
                        }
                        },
                    function () { localStorage.setItem('language', 'en'); }
                );
                translate_strings();
                // Firebase plugin after fatal error deinstalled
                /*window.FirebasePlugin.grantPermission();
                window.FirebasePlugin.getToken(function (token) {
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
                });*/
                autologin(function (callback) {
                    if (callback === false) {
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
            }
        }
    },
    {
        path: '/about/',
        url: './pages/about.html',
    },
    {
        path: '/authbox/',
        url: './pages/authbox.html',
        on: {
            pageAfterIn: function (event, page) {
                translate_strings();
                $$('.login-close').on('click', function () {
                    app.loginScreen.close('#my-login-screen');
                });
                $$('.login_screen_open').on('click', function () {
                    app.loginScreen.open('#my-login-screen');
                });
                setTimeout(function () {
                    var swiper = app.swiper.get('.swiper-container');
                    swiper.autoplay.start();
                }, 1000);
                app.toolbar.hide('.toolbar-bottom', false);
                $('.navbar').slideToggle(700);
                setTimeout(function () {
                    $('.loginoptions').slideToggle(700);
                }, 6000);
            }
        }
    },
    {
        path: '/stats/',
        url: './pages/stats.html',
        on: {
            pageAfterIn: function (event, page) {
                translate_strings();
                var username = localStorage.getItem('username');
                $.ajax({
                    url: "https://ddrobotec.com/grafana/testy.php?username=" + username + "&page=1",
                }).done(function (result) {
                    if (result === '') {
                        $$('.pullreport').html('<p style="padding: 25px;">' + translate_strings('notrainingactivity') + '</p>')
                    } else {
                        $$('.pullreport').html('');
                        $$('.pullreport').html(result);
                        $('.detailreport').each(function () {
                            var trainingid = $(this).attr('data-title');
                            var rowid = $(this).attr('data-id');
                            var score = $(this).attr('data-score');
                            $$(this).on('click', function () {
                                var clicktitle = $(this).attr('data-title');
                                var clickeditem = $(this).attr('data-id');
                                var clickedscore = $(this).attr('data-score');
                                localStorage.setItem('traintitle', clicktitle);
                                localStorage.setItem('detail_train_id', clickeditem);
                                localStorage.setItem('detail_train_score', clickedscore);
                                statsView.router.navigate('/training_detail/', {reloadAll: true, animate: true});
                            });
                            $.ajax({
                                url: "https://ddrobotec.com/grafana/testy.php?username=" + username + "&trainingid=" + trainingid + "&score=" + score + "&page=2",
                            }).done(function (result) {
                                if (result == 'true') {
                                    $$('.highscore_' + rowid).html('<i class="icon f7-icons icon-ios-fill material-icons">graph_round_fill</i>&nbsp;&nbsp;');
                                }
                            });

                        });
                    }
                });

            }
        }
    },
    {
        path: '/training_detail/',
        url: './pages/training_detail.html',
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
                    if(traintitle !== subtitle) {
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
                            url: "https://ddrobotec.com/grafana/testy.php?username=" + username + "&trainingid=" + trainingid + "&score=" + score + "&page=3",
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

                            $$('.nativeshare').on('click', function () {

                                navigator.screenshot.URI(function (error, res) {
                                    if (error) {
                                        // alert(error);
                                    } else {
                                        var myBaseString = res.URI;
                                        var block = myBaseString.split(";");
                                        var dataType = block[0].split(":")[1];// In this case "image/png"
                                        var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."
                                        var folderpath = cordova.file.dataDirectory;
                                        var filename = "myimage.png";

                                        savebase64AsImageFile(folderpath, filename, realData, dataType);
                                        var options = {
                                            message: translate_strings('sharetext', traintitle, circletext),  // not supported on some apps (Facebook, Instagram)
                                            subject: '#ddrobotec', // fi. for email
                                            files: [folderpath + filename], // an array of filenames either locally or remotely
                                        };

                                        var onSuccess = function (result) {
                                            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                                            console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                                        };

                                        var onError = function (msg) {
                                            alert("Sharing failed with message: " + msg);
                                        };
                                        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
                                    }
                                }, 'png', 60);
                            });
                        });
                    });
                });
                $$('.leaderboardlink').on('click', function () {
                    var fetcher = $(this).attr('data-fetch');
                    localStorage.setItem('leaderboardfetch', fetcher);
                    statsView.router.navigate('/leaderboard/', {force: true, animate: true});
                });
            }
        }
    },
    {
        path: '/leaderboard/',
        url: './pages/leaderboard.html',
        on: {
            pageInit: function (event, page) {
                translate_strings();
                var username = localStorage.getItem('username');
                var traintitle = localStorage.getItem('traintitle');
                var maintitle = traintitle.split('[')[0];
                var subtitle = traintitle.split('[').pop().split(']')[0]; // returns 'two'
                var leaderboardfetch = localStorage.getItem('leaderboardfetch');

                $('.traintitle').html(maintitle + ' ' + leaderboardfetch);
                if(traintitle !== subtitle) {
                    $('.trainsubtitle').html(subtitle);
                }

                $.ajax({
                    url: "https://ddrobotec.com/grafana/testy.php?trainingid=" + traintitle + "&username=" + username + "&fetch=" + leaderboardfetch + "&page=4",
                }).done(function (result) {
                    $$('.leaderboard').html(result);
                });
            }
        }
    },
    {
        path: '/search/',
        url: './pages/search.html',
        componentUrl: './pages/search.html',
    },
    {
        path: '/scan/',
        url: './pages/scan.html',
        on: {
            pageInit: function (event, page) {
                translate_strings();
                $('.downunder').delay(800).slideToggle();
                $$('.cameramode').click(function () {
                    $('.toolbar-bottom').hide();
                    //homeView.router.navigate({url: '/scan/'}, {reloadAll: true, animate: true});
                });
                $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").addClass('nobg');
                // $$('.toolbar-bottom').fadeOut();$
                $('.toolbar-bottom').hide();
                QRScanner.prepare(onDone);

                function onDone(err, status) {
                    if (err) {
                        // here we can handle errors and clean up any loose ends.
                        console.error(err);
                        //alert(err);
                        //alert(status);
                    }
                    if (status.authorized) {
                        QRScanner.show();
                        QRScanner.scan(displayContents);

                    } else if (status.denied) {
                        QRScanner.openSettings();
                        alert(translate_strings('enablecamerasupport'));
                        // The video preview will remain black, and scanning is disabled. We can
                        // try to ask the user to change their mind, but we'll have to send them
                        // to their device settings with ``.
                    } else {
                        // we didn't get permission, but we didn't get permanently denied. (On
                        // Android, a denial isn't permanent unless the user checks the "Don't
                        // ask again" box.) We can ask again at the next relevant opportunity.
                    }

                }

                $$(".scanback").on('click', function (e) {
                    $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").removeClass('nobg');
                    app.toolbar.show('.toolbar-bottom', true);
                    QRScanner.cancelScan();
                    QRScanner.destroy();
                    QRScanner.hide();

                    $('.toolbar-bottom').show();
                    homeView.router.back('/', {force: true, animate: true});
                });
            }
        }
    },
    {
        path: '/stories/',
        url: './pages/stories.html',
        on: {
            pageInit: function (event, page) {
                $.ajax({
                    url: "https://dev2.ddrobotec.com/wp-content/themes/ddrobotec/api/laststories.php",
                }).done(function (result) {
                    $('.story_container').html(result);
                });
            }
        }
    },
    {
        path: '/user/',
        url: './pages/user.html',
        on: {
            pageInit: function (event, page) {
                translate_strings();
                $$('select[name=languages]').on('change', function() {
                    localStorage.setItem('languages_i', this.value);
                    translate_strings();
                    var initialHref = window.location.href;
                    function restartApplication() {
                        // Show splash screen (useful if your app takes time to load)
                        // Reload original app url (ie your index.html file)
                        window.location = initialHref;
                    }
                    restartApplication();
                });
                $$('select[name=languages]').val(localStorage.getItem('language'));
                $$('.logout').on('click', function () {
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

                $$('.devmode').on('taphold', function () {
                    if (localStorage.getItem('devmode') === 'true') {
                        // when devmode is enabled, don't do anything :)
                    } else {
                        // when devmode is disabled, fire this toast and the function
                        var toastCenter = app.toast.create({
                            text: translate_strings('enableddevmode'),
                            closeTimeout: 12000,
                            closeButton: true
                        });
                        toastCenter.open();
                        $$('.toplist ul').prepend('<li class="swipeout devsettings">\n' +
                            '<div class="swipeout-content">' +
                            '<a href="#" class="dev_login_screen_open item-content item-link" data-login-screen=".dev-login-screen">' +
                            '          <div class="item-title">' + translate_strings('developermode') + '</div>\n' +
                            '          <div class="item-after"> <span class="badge color-red">Off</span></div>\n' +
                            '</a>' +
                            '</div>' +
                            '<div class="swipeout-actions-right">\n' +
                            '    <a href="#" class="swipeout-delete no-chevron disabledev">' + translate_strings('disable') + '</a>\n' +
                            '  </div>' +
                            '    </li>');
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
                        '          <div class="item-title">' + translate_strings('developermode') + '</div>\n' +
                        '          <div class="item-after">' + badger + '</div>\n' +
                        '</a>' +
                        '</div>' +
                        '<div class="swipeout-actions-right">\n' +
                        '    <a href="#" class="swipeout-delete no-chevron disabledev">' + translate_strings('disable') + '</a>\n' +
                        '  </div>' +
                        '    </li>');
                }

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
        path: '/settings/',
        url: './pages/settings.html',
    },
    {
        path: '/timeline/',
        url: './pages/timeline.html',
    },
    {
        path: '/plans/',
        url: './pages/plan.html',
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
                $$('.searchbar input').focus(function () {
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
                trainingplans();
            }
        }
    },
    {
        path: '/plan_subcat/',
        url: './pages/plan_subcat.html',
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
                subcat();
            }
        }
    },
    {
        path: '/plan_choice/',
        url: './pages/plan_choice.html',
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
            }
        }
    },
    {
        path: '/myplans/',
        url: './pages/myplans.html',
        on: {
            pageInit: function (event, page) {

                if (localStorage.getItem("myplans") === null) {
                    $$('.myplansind i .badge').html('0');
                } else {
                    var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                    $$('.myplansind i .badge').html(myplansindicator.length - 1);
                }
                showmyplans();
            }
        }
    },
    {
        path: '/changeuser/',
        url: './pages/changeuser.html',
        on: {
            pageInit: function (event, page) {
                translate_strings();
                for (var i = 0; i < localStorage.length; i++) {
                    if (localStorage.key(i).startsWith("username_")) {
                        let userkey = localStorage.key(i).split("_");
                        $('.userchanger.list.media-list ul').append('<li class="swipeout">\n' +
                            '                    <a href="#" class="item-link item-content swipeout-content changeme" data-user="' + userkey[1] + '">\n' +
                            '                        <div class="item-media" style="padding-left: 8px;">' +
                            '                            <i class="icon f7-icons material-icons icon-ios-fill">person</i></div>\n' +
                            '                        <div class="item-inner">\n' +
                            '                            <div class="item-title-row">\n' +
                            '                                <div class="item-title">' + localStorage.getItem('username_' + userkey[1]) + '</div>\n' +
                            '                            </div>\n' +
                            '                        </div>\n' +
                            '                    </a><div class="swipeout-actions-right">\n' +
                            '        <a href="#" data-storageattr="' + userkey[1] + '" class="userremove swipeout-delete">' + translate_strings('remove') + '</a>\n' +
                            '      </div>\n' +
                            '                </li>');
                    }
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
                    localStorage.setItem('username_' + datakey, olduser);
                    localStorage.setItem('pass_' + datakey, oldpass);
                    localStorage.setItem('email_' + datakey, oldemail);
                    var toastCenter = app.toast.create({
                        text: translate_strings('userchanged'),
                        position: 'top',
                        closeTimeout: 4000,
                        closeButton: true
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
    // Default route (404 page). MUST BE THE LAST
    {
        path: '(.*)',
        url: './pages/404.html',
    },
];
