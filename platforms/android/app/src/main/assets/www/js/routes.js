routes = [
  {
    path: '/',
    url: './index.html',
    on: {
      pageInit: function (event, page) {
        window.FirebasePlugin.grantPermission();
        window.FirebasePlugin.getToken(function(token) {
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
          }).done(function(result) {
          });
        }, function(error) {
          console.error(error);
        });


        autologin(function (callback) {
          if (callback === false) {
            homeView.router.navigate('/authbox/', {reloadCurrent: true,
              ignoreCache: true});
          } else {
            $('.navbar').slideDown(700);
          }
        });
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
            app.toolbar.hide('.toolbar-bottom', false);
        $('.navbar').slideToggle(700);
        setTimeout(function() {
          $('.loginoptions').slideToggle(700);
        }, 6000);
      }
    }
  },
  {
    path: '/stats/',
    url: './pages/stats.html',
    componentUrl: './pages/stats.html',
    on: {
      pageAfterIn: function(event, page) {
        var username = localStorage.getItem('username');
        $.ajax({
          url: "https://ddrobotec.com/grafana/testy.php?username=" + username + "&page=1",
        }).done(function(result) {
          $$('.pullreport').html('');
          $$( '.pullreport' ).html( result );
          $('.detailreport').each(function() {
            var trainingid = $(this).attr('data-title');
            var rowid = $(this).attr('data-id');
            var score = $(this).attr('data-score');
            $$(this).on('click', function() {
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
              if(result == 'true') {
                $$('.highscore_' + rowid).html('<i class="icon f7-icons icon-ios-fill material-icons">graph_round_fill</i>&nbsp;&nbsp;');
              }
            });

          });
          /*$$('.detailreport').on('click', function() {
            var clicktitle = $(this).attr('data-title');
            var clickeditem = $(this).attr('data-id');
            localStorage.setItem('traintitle', clicktitle);
            localStorage.setItem('detail_train_id', clickeditem);
            app.tab.show("#view-stats", false);
            statsView.router.navigate('/training_detail/', {reloadAll: true, animate: true});

          })*/
        });
      }
    }
  },
  {
    path: '/training_detail/',
    url: './pages/training_detail.html',
    on: {
      pageInit: function (event, page) {
        var username = localStorage.getItem('username');
        var traintitle = localStorage.getItem('traintitle');
        var clickedid = localStorage.getItem('detail_train_id');
        var clickedscore = localStorage.getItem('detail_train_score');
        $.ajax({
          url: "https://ddrobotec.com/grafana/detail_pull_report.php?username=" + username + "&title=" + traintitle + "&dataid=" + clickedid,
        }).done(function(result) {
          $('.traintitle').html(localStorage.getItem('traintitle'));
          $('.detailoverview').html(result);
          $.ajax({
            url: "https://ddrobotec.com/grafana/detail_topscore.php?title=" + traintitle,
          }).done(function(result) {
            $('.score').html(result);
            var score = $('.myscore').attr('data-score');
            var topscore = $('.topscore').attr('data-topscore');
            var realdez = clickedscore / topscore;
            var demoGauge = app.gauge.create({
              el: '.score',
              type: 'circle',
              value: realdez,
              size: 250,
              borderColor: '#fcfabb',
              borderWidth: 10,
              valueText: clickedscore,
              valueFontSize: 41,
              valueTextColor: '#fcfabb',
              labelText:  'Points from ' + topscore + ' topscore',
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
              var leftGauge = app.gauge.create({
                el: '.leftgauge',
                type: 'semicircle',
                value: circlevalue,
                borderWidth: 7,
                borderColor: '#e1ffca',
                valueText: circletext,
                valueFontSize: 22,
                valueTextColor: '#e1ffca',
                labelText:  'your rank',
              });
              var mybestscore = $$('.rank').attr('data-bestscore');
              var scorevalue = 1 / topscore * mybestscore;
              var rightGauge = app.gauge.create({
                el: '.rightgauge',
                type: 'semicircle',
                value: scorevalue,
                borderWidth: 7,
                borderColor: '#ccd7c5',
                valueText: mybestscore,
                valueFontSize: 22,
                valueTextColor: '#ccd7c5',
                labelText:  'your personal best',
              });

              $$('.nativeshare').on('click', function() {

                navigator.screenshot.URI(function(error,res){
                  if(error){
                    // alert(error);
                  } else {
                    var myBaseString = res.URI;
                    var block = myBaseString.split(";");
                    var dataType = block[0].split(":")[1];// In this case "image/png"
                    var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."
                    var folderpath = cordova.file.dataDirectory;
                    var filename = "myimage.png";

                    savebase64AsImageFile(folderpath,filename,realData,dataType);
                    var options = {
                      message: 'My rank in ' + traintitle + ' is ' + circletext + '! Can you beat me?', // not supported on some apps (Facebook, Instagram)
                      subject: '#ddrobotec', // fi. for email
                      files: [ folderpath + filename ], // an array of filenames either locally or remotely
                    };

                    var onSuccess = function(result) {
                      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                      console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                    };

                    var onError = function(msg) {
                      alert("Sharing failed with message: " + msg);
                    };

                    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

                  }
                },'png',60);

                //var appfiles = "data:image/png;base64,R0lGODlhDAAMALMBAP8AAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAUKAAEALAAAAAAMAAwAQAQZMMhJK7iY4p3nlZ8XgmNlnibXdVqolmhcRQA7";



                // window.plugins.socialsharing.share('My rank in ' + traintitle + ' is ' + circletext + '! Can you beat me?', '#ddrobotec', appfiles, 'https://ddrobotec.com');

                /*var options = {
                  message: 'share this', // not supported on some apps (Facebook, Instagram)
                  subject: 'the subject', // fi. for email
                  files: ['', ''], // an array of filenames either locally or remotely
                  url: 'https://www.website.com/foo/#bar?a=b',
                  chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title,
                  appPackageName: 'com.ddrobotec.ddios' // Android only, you can provide id of the App you want to share with
                };

                var onSuccess = function(result) {
                  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                  console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                };

                var onError = function(msg) {
                  alert("Sharing failed with message: " + msg);
                };

                window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);*/
                /*navigator.screenshot.save(function(error,response){
                  if(error){
                    console.error(error);
                    return;
                  }

                  // Something like: /storage/emulated/0/Pictures/myScreenShot.jpg
                  console.log(response.filePath);
                },'jpg',50,'myScreenShot');
                navigator.share('My rank in ' + traintitle + ' is ' + circletext + '! Can you beat me? https://ddrobotec.com', 'Share');*/

              });
            });
          });

        });

        $$('.leaderboardlink').on('click', function() {
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
          var traintitle = localStorage.getItem('traintitle');
          var leaderboardfetch = localStorage.getItem('leaderboardfetch');
          $$('h2.traintitle').html(traintitle + ' ' + leaderboardfetch);
          $.ajax({
            url: "https://ddrobotec.com/grafana/testy.php?trainingid=" + traintitle + "&fetch=" + leaderboardfetch + "&page=4",
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
        $('.downunder').delay(800).slideToggle();
        $$('.cameramode').click(function() {
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
              alert('Please enable camera support in your settings for the DD App.');
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
      pageInit: function(event, page) {
        $.ajax({
          url: "https://dev2.ddrobotec.com/wp-content/themes/ddrobotec/api/laststories.php",
        }).done(function(result) {
          $( '.story_container' ).html( result );
        });
      }
    }
  },
  {
    path: '/user/',
    url: './pages/user.html',
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
        trainingplans();
      }
    }
  },
  {
    path: '/changeuser/',
    url: './pages/changeuser.html',
    on: {
      pageInit: function (event, page) {
        for (var i = 0; i < localStorage.length; i++){
          if(localStorage.key(i).startsWith("username_")) {
            let userkey = localStorage.key(i).split("_");
            $('.list.media-list ul').append('<li class="swipeout">\n' +
                '                    <a href="#" class="item-link item-content swipeout-content changeme" data-user="'+ userkey[1] +'">\n' +
                '                        <div class="item-media" style="padding-left: 8px;">' +
                '                            <i class="icon f7-icons material-icons icon-ios-fill">person</i></div>\n' +
                '                        <div class="item-inner">\n' +
                '                            <div class="item-title-row">\n' +
                '                                <div class="item-title">' + localStorage.getItem('username_' + userkey[1]) + '</div>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                    </a><div class="swipeout-actions-right">\n' +
                '        <a href="#" data-storageattr="' + userkey[1] + '" class="userremove swipeout-delete">Remove</a>\n' +
                '      </div>\n' +
                '                </li>');
          }
        }
        $$('.userremove').on('click', function() {
          var storageattr = $(this).attr('data-storageattr');
          localStorage.removeItem('username_' + storageattr);
          localStorage.removeItem('email_' + storageattr);
          localStorage.removeItem('pass_' + storageattr);
          var toastCenter = app.toast.create({
            text: 'User was successfully removed from your device.',
            position: 'top',
            closeTimeout: 4000,
          });
          toastCenter.open();
          userView.router.navigate('/user/', {reloadCurrent: true, animate: true});

        });
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
            position: 'top',
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

            } else {
              var toastCenter = app.toast.create({
                text: 'You could not be successfully logged in. Please try again.',
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
