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
  },
  {
    path: '/training_detail/',
    url: './pages/training_detail.html',
    componentUrl: './pages/training_detail.html',
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
      }
    }
  },
  {
    path: '/stories/',
    url: './pages/stories.html',
    componentUrl: './pages/stories.html',
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
    path: '/changeuser/',
    url: './pages/changeuser.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
