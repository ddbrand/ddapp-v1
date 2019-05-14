function autologin(callback) {
    var username_cookie = localStorage.getItem("username");
    var password_cookie = localStorage.getItem("pass");
    // var email_cookie = localStorage.getItem("email");
    $.ajax({
        type: "POST",
        url: "https://data-manager-1.dd-brain.com/api/login",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
            // "Email": email_cookie,
            "Pass": password_cookie,
            "CacheName": ""
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 25000,
        success: function (data) {
            if (data.success === false) {
                var toastCenter = app.toast.create({
                    text: 'Sie konnten nicht erfolgreich eingeloggt werden. Bitte versuchen Sie es erneut.',
                    position: 'bottom',
                    closeTimeout: 12000,
                });
                toastCenter.open();
                callback(false);
            } else {
                callback(true);
            }
        },
        error: function (errMsg) {
            localStorage.removeItem("username");
            localStorage.removeItem("pass");
            // localStorage.removeItem("email");
            callback(false);
        }

    });
}


function login(callback) {
    var username_cookie = $$('#my-login-screen [name="username"]').val();
    var password_cookie = $$('#my-login-screen [name="password"]').val();
    // var email_cookie = $$('#my-login-screen [name="email"]').val();
    $.ajax({
        type: "POST",
        url: "https://data-manager-1.dd-brain.com/api/login",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
            // "Email": email_cookie,
            "Pass": password_cookie,
            "CacheName": ""
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 25000,
        success: function (data) {
            if (data.success === false) {
                callback(false);
            } else {
                localStorage.setItem("username", username_cookie);
                localStorage.setItem("pass", password_cookie);
                // localStorage.setItem("email", email_cookie);
                callback(true);
            }
        },
        error: function (errMsg) {
            localStorage.removeItem("username");
            localStorage.removeItem("pass");
            // localStorage.removeItem("email");
            callback(false);
        }
    });
}

function displayContents(err, text) {
    if (err) {
        //alert(err);
    } else {
        var urlParts = text.split("/?compid=");
        var compid = urlParts[1];
        // Proceed only if compid could be retrieved
        if (compid !== undefined) {
            var username = localStorage.getItem("username");
            var email = '';
            var pass = localStorage.getItem("pass");
            if (username !== null && pass !== null) {
                // JSONify the payload
                var data = JSON.stringify({
                    "CompId": compid,
                    "UserName": username,
                    //"Email": email,
                    "Pass": pass,
                    "CacheName": ""
                });
                // Create Http POST request
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState == 4) {
                        //app.popup.open('#failed-scan-popup', true);
                        QRScanner.destroy(function(status){
                          $$(".page, .page-content, .page-current, #scan-view, .view, #app, body, html").removeClass('nobg');
                          app.tab.show("#view-home", true);
                          app.toolbar.show('.toolbar-bottom', true);
                        });
                    }
                });
                // Set http request method and url
                xhr.open("POST", urlParts[0] + "/api/login/");
                // Set headers
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.setRequestHeader("Cache-Control", "no-cache");
                // Send payload
                xhr.send(data);
                var toastCenter = app.toast.create({
                    text: 'You are successfully logged in.',
                    position: 'bottom',
                    closeTimeout: 4000,
                });
                toastCenter.open();
                QRScanner.cancelScan(function (status) {
                    $$(".page, .page-content, .page-current, #scan-view, .view, #app, body, html").removeClass('nobg');
                    app.toolbar.show('.toolbar-bottom', true);
                    this.QRScanner.hide();
                    this.QRScanner.destroy();
                });
                app.tab.show("#view-stats", true);
                statsView.router.navigate('/stats/', {reloadAll: true, animate: true});

            }
        } else {
            QRScanner.cancelScan(function (status) {
                this.QRScanner.hide();
                this.QRScanner.destroy();
            });


            app.popup.open('#failed-scan-popup', true);

            $$('.popup-close').on('click', function () {
                QRScanner.scan(displayContents);
                QRScanner.show();
            });
            /*var toastCenter = app.toast.create({
              text: 'The code you scanned is invalid. Please try another.',
              position: 'bottom',
              closeTimeout: 6000,
            });
            toastCenter.open();*/
        }
    }
}

function login_add(callback) {
    var next_username_cookie = $$('#my-login-add-screen [name="username"]').val();
    var next_password_cookie = $$('#my-login-add-screen [name="password"]').val();
    //var next_email_cookie = $$('#my-login-add-screen [name="email"]').val();
    $.ajax({
        type: "POST",
        url: "https://data-manager-1.dd-brain.com/api/login",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({
            "CompId": "",
            "Username": next_username_cookie,
            //"Email": "",
            "Pass": next_password_cookie,
            "CacheName": ""
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 25000,
        success: function (data) {
            if (data.success === false) {
                callback(false);
            } else {
                localStorage.setItem("username_" + next_username_cookie, next_username_cookie);
                localStorage.setItem("pass_" + next_username_cookie, next_password_cookie);
                localStorage.setItem("email_" + next_username_cookie, next_email_cookie);
                callback(true);
            }
        },
        error: function (errMsg) {
            callback(false);
        }
    });
}

