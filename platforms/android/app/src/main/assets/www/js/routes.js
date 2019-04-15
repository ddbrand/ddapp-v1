routes = [
  {
    path: '/',
    url: './index.html',
    on: {
      pageInit: function (event, page) {
        autologin(function (callback) {
          if (callback === false) {
            homeView.router.navigate('/authbox/', {reloadAll: false, animate: false});
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
    path: '/search/',
    url: './pages/search.html',
    componentUrl: './pages/search.html',
  },
  {
    path: '/scan/',
    url: './pages/scan.html',
    componentUrl: './pages/scan.html',
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
