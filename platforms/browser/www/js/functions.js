function autologin(callback) {
    var username_cookie = localStorage.getItem("username");
    var password_cookie = localStorage.getItem("pass");
    // var email_cookie = localStorage.getItem("email");
    $.ajax({
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        },
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
            localStorage.removeItem("username");
            localStorage.removeItem("pass");
            // localStorage.removeItem("email");
            localStorage.setItem('theme', 'theme-dark');
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
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username_cookie + ':' + password_cookie));
        },
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
                        QRScanner.cancelScan(function(status){
                            $$(".page, .page-content, .page-current, #home-view, .view, #app, body, html").removeClass('nobg');
                            //app.tab.show("#view-home", true);
                            homeView.router.navigate('/', {reloadAll: true, animate: true});
                            $('.toolbar-bottom').show();
                            QRScanner.destroy();
                            QRScanner.cancelScan();
                            QRScanner.hide();
                        });
                    }
                });
                // Set http request method and url
                xhr.open("POST", urlParts[0] + "/api/login/");
                // Set headers
                xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.setRequestHeader("Cache-Control", "no-cache");
                // Send payload
                xhr.send(data);
                var toastCenter = app.toast.create({
                    text: 'You are successfully logged in.',
                    position: 'top',
                    closeTimeout: 4000,
                });
                toastCenter.open();
                QRScanner.cancelScan(function (status) {
                    $$(".page, .page-content, .page-current, #scan-view, .view, #app, body, html").removeClass('nobg');
                    // app.tab.show("#view-home", true);
                    homeView.router.navigate('/', {reloadAll: true, animate: true});

                    $('.toolbar-bottom').show();
                    QRScanner.destroy();
                    QRScanner.cancelScan();
                    QRScanner.hide();
                });
                app.tab.show("#view-stats", true);
                statsView.router.navigate('/stats/', {reloadAll: true, animate: true});

            }
        } else {
            QRScanner.cancelScan(function (status) {

            });
            QRScanner.hide();
            QRScanner.destroy();

            app.popup.open('#failed-scan-popup', true);

            $$('.popup-close').on('click', function () {
                QRScanner.scan(displayContents);
                QRScanner.show();
            });
            /*var toastCenter = app.toast.create({
              text: 'The code you scanned is invalid. Please try another.',
              position: 'top',
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
                var toastCenter = app.toast.create({
                    text: 'You have successfully added another account.',
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

/**
 * Create a Image file according to its database64 content only.
 *
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
 */
function savebase64AsImageFile(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
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

function pullalltrainings() {
    var xhr = new XMLHttpRequest();
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
                        var thiscategory = response_obj.value[i]['category'];
                        var thissubcategory = response_obj.value[i]['subcategory'];
                        var thisplan = response_obj.value[i]['id'];
                        var thisplanname = response_obj.value[i]['name'];
                        var thisplanauthor = response_obj.value[i]['author'];
                        var thisplanunits = response_obj.value[i]['numunits'];
                        var thisplandescription = response_obj.value[i]['description'];
                        if ($.inArray(thisplan, checkedplans) !== -1) {

                        } else {

                            $$('div.iwu ul').append('<li><a href="#" class="item-link item-content setplan" data-id="' + thisplan + '">\n' +
                                '                                <div class="item-inner">\n' +
                                '                                <div class="item-title-row">\n' +
                                '                                <div class="item-title" data-id="' + thisplan + '">' + thisplanname + '</div>\n' +
                                '                                <div class="item-after">' + thisplanunits + ' units</div>\n' +
                                '                            </div>\n' +
                                '                            <div class="item-subtitle">' +  thisplanauthor + '</div>\n' +
                                '                            <div class="item-text">' + thisplandescription + '</div>\n' +
                                '                            </div>\n' +
                                '                            </a></li>');
                            checkedplans.push(thisplan);

                        }



                }

                $$('div.iwu ul a').on('click', function() {
                    var planid = $(this).attr('data-id');
                    var currentplans = JSON.parse(localStorage.getItem("myplans"));
                    var myplans = [];

                    //var myplans = JSON.parse(localStorage.getItem("myplans"));

                    var finalplans = myplans.concat(currentplans);
                    if ($.inArray(planid, finalplans) !== -1) {
                        var toastCenter = app.toast.create({
                            text: 'You have already selected this plan.',
                            position: 'top',
                            closeButton: true,
                            closeTimeout: 3000,
                        });
                        toastCenter.open();
                        var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                        $$('.myplansind i .badge').html(myplansindicator.length - 1);
                    } else {
                        finalplans.push(planid);
                        localStorage.setItem("myplans", JSON.stringify(finalplans));
                        var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                        $$('.myplansind i .badge').html(myplansindicator.length - 1);
                        sendplans();
                    }

                });
            }
        }
    });
    // Set http request method and url
    xhr.withCredentials = true;
    xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
    xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
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
                $('.question').append('<p>An error has occurred. Please try again or contact our support team.</p>');
            } else {
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
                            '      <div class="item-title" data-category="' + thiscategory + '"><a href="/plan_subcat/">' + thiscategory + '</a></div>\n' +
                            '    </li>');
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
    // Set http request method and url
    xhr.withCredentials = true;
    xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
    xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
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
                $('.question').append('<p>An error has occurred. Please try again or contact our support team.</p>');
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
    // Set http request method and url
    xhr.withCredentials = true;
    xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
    xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();

}
function sendplans() {
    var localplans = JSON.parse(localStorage.getItem("myplans"));
    var filtered = localplans.filter(function (el) {
        return el != null;
    });
    
    
    $.ajax({
        type: "POST",
        url: "https://data-manager-1-dev.dd-brain.com/api/workouts/selected",
        // The key needs to match your method's input parameter (case-sensitive).
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
            } else {
                /*var toastCenter = app.toast.create({
                    text: 'Erfolg :)',
                    position: 'top',
                    closeTimeout: 12000,
                });
                toastCenter.open();
                callback(true);*/
            }
        },
        error: function (errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
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

                            $$('ul.planchoice').append('<li><a href="#" class="item-link item-content setplan" data-id="' + thisplan + '">\n' +
                                '                                <div class="item-inner">\n' +
                                '                                <div class="item-title-row">\n' +
                                '                                <div class="item-title" data-id="' + thisplan + '">' + thisplanname + '</div>\n' +
                                '                                <div class="item-after">' + thisplanunits + ' units</div>\n' +
                                '                            </div>\n' +
                                '                            <div class="item-subtitle">' +  thisplanauthor + '</div>\n' +
                                '                            <div class="item-text">' + thisplandescription + '</div>\n' +
                                '                            </div>\n' +
                                '                            </a></li>');
                            checkedplans.push(thisplan);
                        }
                    }
                }

                $$('ul.planchoice a').on('click', function() {
                    $$('subplansbreadcrumb').html(localStorage.getItem('category'));
                    var planid = $(this).attr('data-id');
                    var currentplans = JSON.parse(localStorage.getItem("myplans"));
                    var myplans = [];

                    //var myplans = JSON.parse(localStorage.getItem("myplans"));

                    var finalplans = myplans.concat(currentplans);
                    if ($.inArray(planid, finalplans) !== -1) {
                        var toastCenter = app.toast.create({
                            text: 'You have already selected this plan.',
                            position: 'top',
                            closeButton: true,
                            closeTimeout: 3000,
                        });
                        toastCenter.open();
                        var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                        $$('.myplansind i .badge').html(myplansindicator.length - 1);
                    } else {
                        finalplans.push(planid);
                        localStorage.setItem("myplans", JSON.stringify(finalplans));
                        var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                        $$('.myplansind i .badge').html(myplansindicator.length - 1);
                        sendplans();
                    }

                });
            }
        }
    });
    // Set http request method and url
    xhr.withCredentials = true;
    xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
    xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
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
                for (i = 0; i < response_obj.value.length; i++) {
                    if($.inArray(response_obj.value[i]['id'], JSON.parse(localStorage.getItem("myplans"))) !== -1) {

                        var thiscategory = response_obj.value[i]['category'];
                        var thissubcategory = response_obj.value[i]['subcategory'];
                        var thisplan = response_obj.value[i]['id'];
                        var thisplanname = response_obj.value[i]['name'];
                        var thisplanauthor = response_obj.value[i]['author'];
                        var thisplanunits = response_obj.value[i]['numunits'];
                        var thisplandescription = response_obj.value[i]['description'];
                        $$('ul.myplanslist').append('<li class="swipeout"><a href="#" class="item-link item-content setplan swipeout-content" data-id="' + thisplan + '">\n' +
                            '                                <div class="item-inner">\n' +
                            '                                <div class="item-title-row">\n' +
                            '                                <div class="item-title" data-id="' + thisplan + '">' + thisplanname + '</div>\n' +
                            '                                <div class="item-after">' + thisplanunits + ' units</div>\n' +
                            '                            </div>\n' +
                            '                            <div class="item-subtitle">' +  thisplanauthor + '</div>\n' +
                            '                            <div class="item-text">' + thisplandescription + '</div>\n' +
                            '                            </div>\n' +
                            '                            </a><div class="swipeout-actions-right">\n' +
                            '                        <a href="#" class="swipeout-delete" data-id="' + thisplan + '">Delete</a>\n' +
                            '                    </div></li>');

                    }
                }
                $$('.swipeout-delete').on('click', function() {
                    var dataid = $$(this).attr('data-id');
                    var myplansindicator = JSON.parse(localStorage.getItem("myplans"));

                    removedIndx = myplansindicator.indexOf(dataid);
                    while(removedIndx > -1) {
                        myplansindicator.splice(removedIndx, 1);
                        removedIndx = myplansindicator.indexOf(dataid);
                    }
                    sendplans();
                    localStorage.setItem("myplans", JSON.stringify(myplansindicator));

                    $$('.myplansind i .badge').html(myplansindicator.length - 1);
                });
            }
        }
    });
    // Set http request method and url
    xhr.withCredentials = true;
    xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
    xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
}


/* funktion für subcat */