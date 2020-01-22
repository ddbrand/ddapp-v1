function autologin(callback) {
    var username_cookie = localStorage.getItem("username");
    var password_cookie = localStorage.getItem("pass");
    var ajaxTime= new Date().getTime();
    $.ajax({
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        },
        url: "https://data-manager-1.dd-brain.com/api/login",
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
            "Pass": password_cookie,
            "CacheName": ""
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 60000,
        success: function (data) {
            var totalTime = new Date().getTime()-ajaxTime;
            debug_sql("AutoLogin Response for " + username_cookie, totalTime);
            if (data.success === false) {
                var toastCenter = app.toast.create({
                    text: translate_strings('failedlogin'),
                    position: 'top',
                    closeTimeout: 12000,
                });
                toastCenter.open();
                callback(false);
            } else {
                callback(true);
            }
        },
        error: function (errMsg) {
            /*localStorage.removeItem("username");
            localStorage.removeItem("pass");*/
            localStorage.setItem('theme', 'theme-dark');
            callback(false);
        }
    });
}

function debug_sql(key, value) {
    var sec = value / 1000;
    $.ajax({
        type: "GET",
        url: "https://ddrobotec.com/grafana/debugger.php?key=" + key + "&value=" + value,
        dataType: "html",
        success: function (data) {
        }
    });
}


function login(callback) {
    var username_cookie = $$('#my-login-screen [name="username"]').val();
    var password_cookie = $$('#my-login-screen [name="password"]').val();
    $.ajax({
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username_cookie + ':' + password_cookie));
        },
        url: "https://data-manager-1.dd-brain.com/api/login",
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
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
                app.init();
                callback(true);
            }
        },
        error: function (errMsg) {
            localStorage.removeItem("username");
            localStorage.removeItem("pass");
            callback(false);
        }
    });
}

function login_checker(callback) {
    var username_cookie = localStorage.getItem("username");
    var password_cookie = localStorage.getItem("pass");
    $.ajax({
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username_cookie + ':' + password_cookie));
        },
        url: "https://data-manager-1.dd-brain.com/api/login",
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
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
                callback(true);
            }
        },
        error: function (errMsg) {
            localStorage.removeItem("username");
            localStorage.removeItem("pass");
            callback(false);
        }
    });
}


function dev_autologin(callback) {
    var username_cookie = localStorage.getItem("dev_username");
    var password_cookie = localStorage.getItem("dev_pass");
    $.ajax({
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        },
        url: "https://data-manager-1-dev.dd-brain.com/api/login",
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
            "Pass": password_cookie,
            "CacheName": ""
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 25000,
        success: function (data) {
            if (data.success === false) {
                var toastCenter = app.toast.create({
                    text: translate_strings('faileddevlogin'),
                    position: 'top',
                    closeTimeout: 12000,
                    closeButton: true
                });
                toastCenter.open();
                callback(false);
            } else {
                callback(true);
            }
        },
        error: function (errMsg) {
            localStorage.removeItem("dev_username");
            localStorage.removeItem("dev_pass");
            callback(false);
        }
    });
}

function dev_login(callback) {
    var username_cookie = $$('#my-dev-login-screen [name="username"]').val();
    var password_cookie = $$('#my-dev-login-screen [name="password"]').val();
    $.ajax({
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username_cookie + ':' + password_cookie));
        },
        url: "https://data-manager-1-dev.dd-brain.com/api/login",
        data: JSON.stringify({
            "CompId": "",
            "Username": username_cookie,
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
                localStorage.setItem("dev_username", username_cookie);
                localStorage.setItem("dev_pass", password_cookie);
                localStorage.setItem("dev_login", 'ok');
                $$('li.devsettings .item-after span.badge').html('On');
                $$('li.devsettings .item-after span.badge').removeClass('color-red');
                $$('li.devsettings .item-after span.badge').addClass('color-green');
                callback(true);
            }
        },
        error: function (errMsg) {
            localStorage.removeItem("dev_username");
            localStorage.removeItem("dev_pass");
            callback(false);
        }
    });
}

function SortLocalStorage(){
    if(localStorage.length > 0){
        var localStorageArray = new Array();
        for (i=0;i<localStorage.length;i++){
            localStorageArray[i] = localStorage.key(i)+localStorage.getItem(localStorage.key(i));
        }
    }
    var sortedArray = localStorageArray.sort();
    return sortedArray;
}

function displayContents(err, text) {
    if (err) {
    } else {
        var urlParts = text.split("/?compid=");
        var compid = urlParts[1];
        if (compid !== undefined) {
            login_checker(function (callback) {
                if (callback === false) {
                    var toastCenter = app.toast.create({
                        text: 'Your credentials has been changed. Try logging in again.',
                        position: 'bottom',
                        closeButton: true,
                        closeTimeout: 30000,
                        on: {
                            close: function () {
                                $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").removeClass('nobg');
                                app.toolbar.show('.toolbar-bottom', true);
                                QRScanner.cancelScan();
                                QRScanner.destroy();
                                QRScanner.hide();
                                $('.toolbar-bottom').show();
                                app.tab.show("#view-user", true);
                                userView.router.navigate('/user/', {animate: true});
                            },
                        }
                    });
                    toastCenter.open();
                } else {
                    var username = localStorage.getItem("username");
                    var email = '';
                    var pass = localStorage.getItem("pass");
                    if (username !== null && pass !== null) {
                        var data = JSON.stringify({
                            "CompId": compid,
                            "UserName": username,
                            "Pass": pass,
                            "CacheName": ""
                        });
                        var xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.addEventListener("readystatechange", function () {
                            if (this.readyState == 4) {
                                QRScanner.cancelScan(function (status) {
                                    $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").removeClass('nobg');
                                    QRScanner.hide();
                                    $('.toolbar-bottom').show();
                                    app.toolbar.show('.toolbar-bottom', true);
                                    QRScanner.destroy();
                                    QRScanner.cancelScan();
                                    homeView.router.navigate('/', {reloadAll: true, animate: true});
                                });
                            }
                        });
                        xhr.open("POST", urlParts[0] + "/api/login/");
                        xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
                        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        xhr.setRequestHeader("Cache-Control", "no-cache");
                        xhr.send(data);
                        QRScanner.cancelScan(function (status) {
                        });
                        QRScanner.hide();
                        QRScanner.destroy();
                        app.popup.open('#success-scan-popup', true);
                        setTimeout(function () {
                            QRScanner.hide();
                            QRScanner.destroy();
                            $('.circle-loader').addClass('load-complete');
                            $('.checkmark').show();
                        }, 1000);
                        $$('.popup-close').on('click', function () {
                            $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").removeClass('nobg');
                            $('.toolbar-bottom').show();
                            app.toolbar.show('.toolbar-bottom', true);
                            $('.circle-loader').removeClass('load-complete');
                            $('.checkmark').hide();
                            homeView.router.navigate('/', {reloadAll: true, animate: true});
                        });
                    }
                }
                });
        } else {
            QRScanner.cancelScan(function (status) { });
            QRScanner.hide();
            QRScanner.destroy();
            app.popup.open('#failed-scan-popup', true);
            $$('.popup-close').on('click', function () {
                $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").removeClass('nobg');
                $('.toolbar-bottom').show();
                app.toolbar.show('.toolbar-bottom', true);
                homeView.router.navigate('/', {reloadAll: true, animate: true});
            });
        }
    }
}

function devcheck() {
    $('*[data-dev=true]').each(function () {
        if (localStorage.getItem('dev_login') === 'ok') {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    $('*[data-dev=false]').each(function () {
        if (localStorage.getItem('dev_login') === 'ok') {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function login_add(callback) {
    var username_cookie = localStorage.getItem("username");
    var password_cookie = localStorage.getItem("pass");
    var next_username_cookie = $$('#my-login-add-screen [name="username"]').val();
    var next_password_cookie = $$('#my-login-add-screen [name="password"]').val();
    $.ajax({
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username_cookie + ':' + password_cookie));
        },
        url: "https://data-manager-1.dd-brain.com/api/login",
        data: JSON.stringify({
            "CompId": "",
            "Username": next_username_cookie,
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
                var toastCenter = app.toast.create({
                    text: translate_strings('successaddeduser'),
                    position: 'top',
                    closeButton: true,
                    closeTimeout: 4000,
                });
                toastCenter.open();
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

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function savebase64AsImageFile(folderpath,filename,content,contentType){
    var DataBlob = b64toBlob(content,contentType);
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function(){
                console.log('Unable to save file in path '+ folderpath);
            });
        });
    });
}

function isplanselected(planid) {
    var currentplans = JSON.parse(localStorage.getItem("myplans"));
    var myplans = [];
    var finalplans = myplans.concat(currentplans);
    if ($.inArray(planid, finalplans) !== -1) {
        $('.planselecter[data-id="' + planid + '"]').prop('checked', true);
    } else {
        $('.planselecter[data-id="' + planid + '"]').prop('checked', false);
    }
}

function pullalltrainings() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response_obj = JSON.parse(this.responseText);
            if(response_obj.success == false) {
            } else {
                $$('.iwu ul').html('');
                var checkedcategories = [];
                var valuearray = {};
                var checkedsubcategories = [];
                var checkedplans = [];
                var checkedplantitles = [];
                var i;
                for (i = 0; i < response_obj.value.length; i++) {
                    var thiscategory = response_obj.value[i]['category'];
                    var thissubcategory = response_obj.value[i]['subcategory'];
                    var thisplan = response_obj.value[i]['id'];
                    var thisplanname = response_obj.value[i]['name'];
                    var thisplanauthor = response_obj.value[i]['author'];
                    var thisplanunits = response_obj.value[i]['numunits'];
                    var thisplandescription = response_obj.value[i]['description'];
                    if ($.inArray(thisplan, checkedplans) !== -1) {
                    } else {
                        $$('div.iwu ul').append('<li><div href="#" class="item-link item-checkbox item-content setplan" data-id="' + thisplan + '">\n' +
                            '<div class="item-inner needsclick">\n' +
                            '<div class="item-title-row">\n' +
                            '<label class="checkbox"><input class="planselecter color-lightblue" type="checkbox" data-id="' + thisplan + '">' +
                            '<i class="color-lightblue icon-checkbox"></i></label>&nbsp;' +
                            '<div class="item-title" data-id="' + thisplan + '">' + thisplanname + '</div>\n' +
                            '<div class="item-after">' + thisplanunits + ' ' + translate_strings('units') + '</div>\n' +
                            '</div>\n' +
                            '<div class="item-subtitle">by ' + thisplanauthor + '</div>\n' +
                            '<div class="item-text">' + thisplandescription + '</div>\n' +
                            '</div>\n' +
                            '</div></li>');
                        checkedplans.push(thisplan);
                        isplanselected(thisplan);
                    }
                }
                $('div.iwu ul input.planselecter').on('change', function(e) {
                    if (e.target.checked) {
                        $(this).prop('checked', true);
                        var planid = $(this).attr('data-id');
                        var currentplans = JSON.parse(localStorage.getItem("myplans"));
                        var myplans = [];
                        var finalplans = myplans.concat(currentplans);
                        if ($.inArray(planid, finalplans) !== -1) {
                            var toastCenter = app.toast.create({
                                text: translate_strings('selectedplan'),
                                position: 'top',
                                closeButton: true,
                                closeTimeout: 3000,
                            });
                            toastCenter.open();
                            var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                            $$('.myplansind i .badge').html(myplansindicator.length - 1);
                            sendplans();
                        } else {
                            finalplans.push(planid);
                            localStorage.setItem("myplans", JSON.stringify(finalplans));
                            var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                            $$('.myplansind i .badge').html(myplansindicator.length - 1);
                            sendplans();
                        }
                    } else {
                        var dataid = $$(this).attr('data-id');
                        var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                        removedIndx = myplansindicator.indexOf(dataid);
                        while(removedIndx > -1) {
                            myplansindicator.splice(removedIndx, 1);
                            removedIndx = myplansindicator.indexOf(dataid);
                        }
                        localStorage.setItem("myplans", JSON.stringify(myplansindicator));

                        $$('.myplansind i .badge').html(myplansindicator.length - 1);

                        $(this).prop('checked', false);
                        sendplans();
                    }
                });
            }
        }
    });
    xhr.withCredentials = true;
    if(localStorage.getItem('language') == 'de') {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    } else {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
}

function trainingplans() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response_obj = JSON.parse(this.responseText);
            if(response_obj.success == false) {
            } else {
                $$('ul.trainingplans').html('');
                var checkedcategories = [];
                var valuearray = {};
                var checkedsubcategories = [];
                var i;
                for (i = 0; i < response_obj.value.length; i++) {
                    var thiscategory = response_obj.value[i]['category'];
                    var thissubcategory = response_obj.value[i]['subcategory'];
                    var thisplan = response_obj.value[i]['id'];
                    if ($.inArray(thiscategory, checkedcategories) !== -1) {
                    } else {
                        $$('ul.trainingplans').append('<li>\n' +
                            '<div class="item-title" data-category="' + thiscategory + '"><a href="/plan_subcat/">' + thiscategory + '</a></div>\n' +
                            '</li>');
                        checkedcategories.push(thiscategory);
                    }
                    checkedsubcategories.push(thissubcategory);
                }
                $$('.item-title[data-category]').on('click', function() {
                    var thisid = $$(this).attr('data-category');
                    localStorage.setItem('category', thisid);
                    $$('.subplansbreadcrumb').html(localStorage.getItem('category'));
                });
            }
        }
    });
    xhr.withCredentials = true;
    if(localStorage.getItem('language') == 'de') {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    } else {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
}

function subcat() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response_obj = JSON.parse(this.responseText);
            if(response_obj.success == false) {
            } else {
                var checkedcategories = [];
                var valuearray = {};
                var checkedsubcategories = [];
                var checkedplans = [];
                var checkedplantitles = [];
                var i;
                for (i = 0; i < response_obj.value.length; i++) {
                    if(response_obj.value[i]['category'] === localStorage.getItem('category')) {
                    var thiscategory = response_obj.value[i]['category'];
                    var thissubcategory = response_obj.value[i]['subcategory'];
                    var thisplan = response_obj.value[i]['id'];
                    if ($.inArray(thissubcategory, checkedsubcategories) !== -1) {
                    } else {
                        $$('ul.subcat').append('<li>\n' +
                            '      <div class="item-title" data-subcategory="' + thissubcategory + '"><a href="/plan_choice/">' + thissubcategory + '</a></div>\n' +
                            '    </li>');
                        checkedsubcategories.push(thissubcategory);
                    }
                }
                $$('.item-title[data-subcategory]').on('click', function() {
                    var thisid = $$(this).attr('data-subcategory');
                    localStorage.setItem('subcategory', thisid);
                    $$('.plansbreadcrumb').html(localStorage.getItem('category') + ' > ' + localStorage.getItem('subcategory'));
                });
                }
            }
        }
    });
    xhr.withCredentials = true;
    if(localStorage.getItem('language') == 'de') {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    } else {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
}

function sendplans() {
    var localplans = JSON.parse(localStorage.getItem("myplans"));
    var filtered = localplans.filter(function (el) {
        return el != null;
    });
    if(localStorage.getItem('dev_login') === 'ok') {
        $.ajax({
            type: "POST",
            url: "https://data-manager-1-dev.dd-brain.com/api/workouts/selected",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
            },
            data: JSON.stringify({
                "ids": filtered,
                "username": localStorage.getItem('username'),
                "password": localStorage.getItem('pass'),
                "cachename": ""
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            timeout: 25000,
            success: function (data) {
                if (data.success === false) {
                    var toastCenter = app.toast.create({
                        text: JSON.stringify(data),
                        position: 'top',
                        closeTimeout: 12000,
                    });
                    toastCenter.open();
                    callback(false);
                } else { }
            },
            error: function (errMsg) {
                // alert(JSON.stringify(errMsg));
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "https://data-manager-1.dd-brain.com/api/workouts/selected",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
            },
            data: JSON.stringify({
                "ids": filtered,
                "username": localStorage.getItem('username'),
                "password": localStorage.getItem('pass'),
                "cachename": ""
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            timeout: 25000,
            success: function (data) {
                if (data.success === false) {
                    var toastCenter = app.toast.create({
                        text: JSON.stringify(data),
                        position: 'top',
                        closeTimeout: 12000,
                    });
                    toastCenter.open();
                    callback(false);
                } else { }
            },
            error: function (errMsg) {
                // alert(JSON.stringify(errMsg));
            }
        });
    }
}

function planchoice() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response_obj = JSON.parse(this.responseText);
            if(response_obj.success == false) {
                $('.question').append('<p>An error has occurred. Please try again or contact our support team.</p>');
            } else {
                var checkedcategories = [];
                var valuearray = {};
                var checkedsubcategories = [];
                var checkedplans = [];
                var checkedplantitles = [];
                var i;
                for (i = 0; i < response_obj.value.length; i++) {
                    if(response_obj.value[i]['subcategory'] === localStorage.getItem('subcategory')) {
                        var thiscategory = response_obj.value[i]['category'];
                        var thissubcategory = response_obj.value[i]['subcategory'];
                        var thisplan = response_obj.value[i]['id'];
                        var thisplanname = response_obj.value[i]['name'];
                        var thisplanauthor = response_obj.value[i]['author'];
                        var thisplanunits = response_obj.value[i]['numunits'];
                        var thisplandescription = response_obj.value[i]['description'];
                        if ($.inArray(thisplan, checkedplans) !== -1) {
                        } else {
                            $$('ul.planchoice').append('<li><div href="#" class="needsclick item-link item-checkbox item-content setplan" data-id="' + thisplan + '">\n' +
                                '<div class="item-inner needsclick">\n' +
                                '<div class="item-title-row">\n' +
                                '<label class="checkbox"><input class="planselecter needsclick color-lightblue" type="checkbox" data-id="' + thisplan + '">' +
                                '<i class="color-lightblue icon-checkbox"></i></label>&nbsp;' +
                                '<div class="item-title" data-id="' + thisplan + '">' + thisplanname + '</div>\n' +
                                '<div class="item-after">' + thisplanunits + ' ' + translate_strings('units') + '</div>\n' +
                                '</div>\n' +
                                '<div class="item-subtitle">by ' +  thisplanauthor + '</div>\n' +
                                '<div class="item-text">' + thisplandescription + '</div>\n' +
                                '</div>\n' +
                                '</div></li>');
                            checkedplans.push(thisplan);
                            isplanselected(thisplan);
                        }
                    }
                }
                $('input.planselecter').on('change', function(e) {
                    if (e.target.checked) {
                        $(this).prop('checked', true);
                        var planid = $(this).attr('data-id');
                        var currentplans = JSON.parse(localStorage.getItem("myplans"));
                        var myplans = [];
                        var finalplans = myplans.concat(currentplans);
                        if ($.inArray(planid, finalplans) !== -1) {
                            var toastCenter = app.toast.create({
                                text: translate_strings('selectedplan'),
                                position: 'top',
                                closeButton: true,
                                closeTimeout: 3000,
                            });
                            toastCenter.open();
                            var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                            $$('.myplansind i .badge').html(myplansindicator.length - 1);
                            sendplans();
                        } else {
                            finalplans.push(planid);
                            localStorage.setItem("myplans", JSON.stringify(finalplans));
                            var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                            $$('.myplansind i .badge').html(myplansindicator.length - 1);
                            sendplans();
                        }
                    } else {
                        var dataid = $$(this).attr('data-id');
                        var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                        removedIndx = myplansindicator.indexOf(dataid);
                        while(removedIndx > -1) {
                            myplansindicator.splice(removedIndx, 1);
                            removedIndx = myplansindicator.indexOf(dataid);
                        }
                        localStorage.setItem("myplans", JSON.stringify(myplansindicator));
                        $$('.myplansind i .badge').html(myplansindicator.length - 1);
                        $(this).prop('checked', false);
                        sendplans();
                    }
                });
            }
        }
    });
    xhr.withCredentials = true;
    if(localStorage.getItem('language') == 'de') {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    } else {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
}

function showmyplans() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response_obj = JSON.parse(this.responseText);
            if(response_obj.success == false) {
                $('.question').append('<p>An error has occurred. Please try again or contact our support team.</p>');
            } else {
                var checkedcategories = [];
                var valuearray = {};
                var checkedsubcategories = [];
                var checkedplans = [];
                var checkedplantitles = [];
                var i;
                if(localStorage.getItem("myplans") === '[null]' || localStorage.getItem("myplans") === null) {
                    $('.myworkouts').html('<p class="block text-align-center notfound">' + translate_strings('noplansselected') + '</p>')
                } else {
                    $('.myworkouts').html('<div class="list media-list chevron-center">\n' +
                        '                <div class="list-group">\n' +
                        '                    <ul class="myplanslist no-chevron">\n' +
                        '                    </ul>\n' +
                        '                </div>\n' +
                        '            </div>');
                }
                for (i = 0; i < response_obj.value.length; i++) {
                    console.log('MY PLANS ARRAY', localStorage.getItem("myplans"));
                    if($.inArray(response_obj.value[i]['id'], JSON.parse(localStorage.getItem("myplans"))) !== -1) {
                        var thiscategory = response_obj.value[i]['category'];
                        var thissubcategory = response_obj.value[i]['subcategory'];
                        var thisplan = response_obj.value[i]['id'];
                        var thisplanname = response_obj.value[i]['name'];
                        var thisplanauthor = response_obj.value[i]['author'];
                        var thisplanunits = response_obj.value[i]['numunits'];
                        var thisplandescription = response_obj.value[i]['description'];
                        $$('ul.myplanslist').append('<li class="swipeout"><a href="#" class="item-link item-content setplan swipeout-content" data-id="' + thisplan + '">\n' +
                            '<div class="item-inner">\n' +
                            '<div class="item-title-row">\n' +
                            '<div class="item-title" data-id="' + thisplan + '">' + thisplanname + '</div>\n' +
                            '<div class="item-after">' + thisplanunits + ' units</div>\n' +
                            '</div>\n' +
                            '<div class="item-subtitle">by ' +  thisplanauthor + '</div>\n' +
                            '<div class="item-text">' + thisplandescription + '</div>\n' +
                            '</div>\n' +
                            '</a><div class="swipeout-actions-right">\n' +
                            '<a href="#" class="swipeout-delete" data-id="' + thisplan + '">Delete</a>\n' +
                            '</div></li>');
                    }
                }
                $$('.swipeout-delete').on('click', function(e) {
                    var dataid = $$(this).attr('data-id');
                    $('input.checkbox[data-id="' + dataid + '"]').prop('checked', false);
                    var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                    removedIndx = myplansindicator.indexOf(dataid);
                    console.log('here it is ' + removedIndx);
                    while(removedIndx > -1) {
                        myplansindicator.splice(removedIndx, 1);
                        removedIndx = myplansindicator.indexOf(dataid);
                    }
                    localStorage.setItem("myplans", JSON.stringify(myplansindicator));
                    $$('.myplansind i .badge').html(myplansindicator.length - 1);
                    sendplans();
                    if(localStorage.getItem("myplans") === '[null]') {
                        $('.myworkouts').html('<p class="block text-align-center" style="font-size: 14px; opacity: 0.5;">' + translate_strings('noplansselected') + '</p>')
                    }
                    e.preventDefault();
                });
            }
        }
    });
    xhr.withCredentials = true;
    if(localStorage.getItem('language') === 'de') {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    } else {
        if(localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=en");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
}

/*function refresh_stats() {
    var username = localStorage.getItem('username');
    $.ajax({
        beforeSend: function() {
            $('.loader').fadeIn(300);
        },
        url: "https://ddrobotec.com/grafana/grafanapull.php?username=" + username + "&page=1",
    }).done(function (result) {
        if (result === '') {
            $('.loader').fadeOut(300);
            $$('.pullreport').html('<p class="block text-align-center" style="font-size: 14px; opacity: 0.5;">' + translate_strings('notrainingactivity') + '</p>')
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
                    url: "https://ddrobotec.com/grafana/grafanapull.php?username=" + username + "&trainingid=" + trainingid + "&score=" + score + "&page=2",
                    beforeSend: function() {
                        $('.loader').fadeIn(300);
                    },
                }).done(function (result) {
                    $('.loader').fadeOut(300);
                    if (result == 'true') {
                        $$('.highscore_' + rowid).html('<i class="icon f7-icons icon-ios-fill material-icons">graph_round_fill</i>&nbsp;&nbsp;');
                    }
                });
            });
        }
    });
}*/