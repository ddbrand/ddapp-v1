function autologin(callback) {
    var username_cookie = localStorage.getItem("username");
    var password_cookie = localStorage.getItem("pass");
    var email_cookie = localStorage.getItem("email");
    $.ajax({
        type: "POST",
        url: "https://data-manager-1-dev.dd-brain.com/api/login",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
            "Email": email_cookie,
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
            localStorage.removeItem("email");
            callback(false);
        }

    });
}


function login(callback) {
    var username_cookie = $$('#my-login-screen [name="username"]').val();
    var password_cookie = $$('#my-login-screen [name="password"]').val();
    var email_cookie = $$('#my-login-screen [name="email"]').val();
    $.ajax({
        type: "POST",
        url: "https://data-manager-1-dev.dd-brain.com/api/login",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
            "Email": email_cookie,
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
                localStorage.setItem("email", email_cookie);
                callback(true);
            }
        },
        error: function (errMsg) {
            localStorage.removeItem("username");
            localStorage.removeItem("pass");
            localStorage.removeItem("email");
            callback(false);
        }
    });
}

