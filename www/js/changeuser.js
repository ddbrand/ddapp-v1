
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
        $$('.back').on('click', function() {
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
