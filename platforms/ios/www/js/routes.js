routes = [
  {
    path: '/',
    url: './index.html',
    on: {
      pageInit: function (event, page) {
        autologin(function (callback) {
          if (callback === false) {

                homeView.router.navigate('/authbox/', {reloadCurrent: false, animate: false});


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
    path: '/catalog/',
    componentUrl: './pages/catalog.html',
  },
  {
    path: '/search/',
    componentUrl: './pages/search.html',
  },
  {
    path: '/scan/',
    url: './pages/scan.html',
    componentUrl: './pages/scan.html',
  },
  {
    path: '/stories/',
    componentUrl: './pages/stories.html',
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request

    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
