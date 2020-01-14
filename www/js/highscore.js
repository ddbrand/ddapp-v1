function gethighscores(trainingid, trainingscore, shortdate) {
    localStorage.removeItem('placedarray');
    $$('.lastsessioncontent .list ul.sessionoverview').html('');
    $$('.trainingfullname').html(trainingid);
    var username = localStorage.getItem('username');
    var currentscore_gauge = app.gauge.create({
        el: '.currentscore',
        type: 'circle',
        value: 0,
        size: 220,
        borderColor: '#2196f3',
        borderWidth: 10,
        valueText: trainingscore,
        valueFontSize: 32,
        valueTextColor: '#2196f3',
        labelText: translate_strings('calculating'),
    });
    $.ajax({
        type: "GET",
        url: "https://data-manager-1-dev.dd-brain.com/api/json/leaderboard?activity=" + trainingid,
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        },
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
            } else {
                for (i = 0; i < data.value.userList.length; i++) {
                    // check the first entry with the highest score from any user
                    if(i === 0) {
                        var currentscore_gauge = app.gauge.create({
                            el: '.currentscore',
                            type: 'circle',
                            value: 0,
                            size: 220,
                            borderColor: '#2196f3',
                            borderWidth: 10,
                            valueText: trainingscore,
                            valueFontSize: 32,
                            valueTextColor: '#2196f3',
                            labelText: translate_strings('calculating'),
                        });
                        var thisunit = trainingid;
                        $$('.trainingfullname').html(thisunit);
                        var maintitle = thisunit.split('[')[0];
                        var subtitle = thisunit.split('[').pop().split(']')[0];
                        $$('.actstoragetitle').html(maintitle);
                        $$('.levels').html(subtitle);
                        var circlefill = trainingscore / data.value.userList[i].score;
                        console.log('Currentscore Gauge is filled to ' + circlefill);
                        currentscore_gauge.update({
                            value: circlefill,
                            labelText: 'Highscore: ' + data.value.userList[i].score
                        });
                    }
                    // check if current user is in highscore ranking
                    if(data.value.userList[i].name == localStorage.getItem('username')) {
                        if(data.value.userList[i].rank === 1) {
                            $$('.ranks').html('<img src="img/Gold.svg" alt="Gold" class="inlinemedal" style="width: 32px;" />');
                            $('.ranks').append('<span class="frompart">&nbsp;/&nbsp;' + data.value.userList.length + '</span>');
                        } else if(data.value.userList[i].rank === 2) {
                            $$('.ranks').html('<img src="img/Silber.svg" alt="Silber" class="inlinemedal" style="width: 32px;" />');
                            $('.ranks').append('<span class="frompart">&nbsp;/&nbsp;' + data.value.userList.length + '</span>');
                        } else if(data.value.userList[i].rank === 3) {
                            $$('.ranks').html('<img src="img/Bronze.svg" alt="Bronze" class="inlinemedal" style="width: 32px;" />');
                            $('.ranks').append('<span class="frompart">&nbsp;/&nbsp;' + data.value.userList.length + '</span>');
                        } else {
                            $$('.ranks').html(JSON.stringify(data.value.userList[i].rank));
                            $('.ranks').append('<span class="frompartno">&nbsp;/&nbsp;' + data.value.userList.length + '</span>');
                        }
                    }
                }
                $$('td.scores').html(trainingscore);
                $$('td.times').html(shortdate);
                $$('.leaderboardentries').html('');
                var placedarray = [];
                for (i = 0; i < data.value.userList.length; i++) {
                    if(data.value.userList[i].name === username) {
                        placedarray.push(data.value.userList[i].score + ';' + data.value.userList[i].rank);
                    }
                    if(data.value.userList[i].rank == 1) {
                        var placer = '<img src="img/Gold.svg" alt="Gold" class="inlinemedal" style="width: 26px;" />';
                    } else if (data.value.userList[i].rank == 2) {
                        var placer = '<img src="img/Silber.svg" alt="Silver" class="inlinemedal" style="width: 26px;" />';
                    } else if (data.value.userList[i].rank == 3) {
                        var placer = '<img src="img/Bronze.svg" alt="Bronze" class="inlinemedal" style="width: 26px;" />';
                    } else {
                        var placer = '<span class="textranklead">' + data.value.userList[i].rank + '</span>';
                    }
                    $$('.leaderboardentries').append('<li>\n' +
                        '    <div class="item-content">\n' +
                        '        <div class="item-media">' + placer + '</div>\n' +
                        '        <div class="item-inner">\n' +
                        '            <div class="item-title">' + data.value.userList[i].name + '</div>\n' +
                        '            <div class="item-after">' + data.value.userList[i].score + '</div>\n' +
                        '        </div>\n' +
                        '    </div>\n' +
                        '</li>');
                }
                localStorage.setItem('placedarray', JSON.stringify(placedarray));
            }
        },
        error: function (errMsg) {
            //alert(JSON.stringify(errMsg));
        }
    });
    $.ajax({
        type: "GET",
        url: "https://data-manager-1-dev.dd-brain.com/api/json/activities?name=" + username,
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        },
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
                $$('.lastsessioncontent .list ul.sessionoverview').html('');
                for (i = 0; i < data.value.length; i++) {
                    var unitname = data.value[i].name;
                    var isodate = new Date(data.value[i].timeStampIso);
                    var thisscore = data.value[i].score;
                    const options = {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    };
                    if (data.value[i].name === trainingid) {
                        placed = JSON.parse(localStorage.getItem('placedarray'));
                        placed.push(data.value[i].score + ';' + data.value[i].rank);

                        for (i2 = 0; i2 < placed.length; i2++) {
                            function sessionhtml(medal) {
                                var mainscore = placed[i2].split(';')[0];

                                $$('.lastsessioncontent .links-list ul.sessionoverview').append('<li>\n' +
                                '      <a href="/activities/highscore/" data-animate="true" data-reload-current="true" class="actunit no-padding-left item-link item-content" data-shortdate="' + data.value[i].timeStampIso.split("T")[0] + '" data-unitscore="' + data.value[i].score + '" data-unitid="' + data.value[i].name + '">\n' +
                                    '      <div class="no-chevron actunit item-content" data-shortdate="' + data.value[i].timeStampIso.split("T")[0] + '" data-unitscore="' + data.value[i].score + '" data-unitid="' + data.value[i].name + '">\n' +
                                    '        <div class="item-inner">\n' +
                                    '          <div class="item-title">\n' +
                                    '            <div class="item-header">' + isodate.toLocaleDateString('en-US', options) + '</div>' + data.value[i].name + '<div class="item-footer">Score: ' + data.value[i].score + '</div>' +
                                    '            </div>\n' +
                                    '        <div class="item-after">' + medal + '</div>' +
                                    '        </div>\n' +
                                    '      </div>\n' +

                                    '      </a>\n' +
                                    '    </li>');
                            }
                            if(placed[i2] == data.value[i].score + ';' + 1) {
                                sessionhtml('<img src="img/Gold.svg" alt="Gold" class="inlinemedal" style="width: 32px;" />');
                                placed.splice( placed.indexOf(placed[i2]), 1 );
                            } else if (placed[i2] == data.value[i].score + ';' + 2) {
                                sessionhtml('<img src="img/Silber.svg" alt="Gold" class="inlinemedal" style="width: 32px;" />');
                                placed.splice( placed.indexOf(placed[i2]), 1 );
                            } else if (placed[i2] == data.value[i].score + ';' + 3) {
                                sessionhtml('<img src="img/Bronze.svg" alt="Gold" class="inlinemedal" style="width: 32px;" />');
                                placed.splice( placed.indexOf(placed[i2]), 1 );
                            } else {
                                if(data.value[i].score + ';' + 1 !== placed[i2] || data.value[i].score + ';' + 2 !== placed[i2] || data.value[i].score + ';' + 3 !== placed[i2]) {
                                    sessionhtml('');
                                    placed.splice( placed.indexOf(placed[i2]), 1 );
                                }
                            }
                        }
                    }
                }
            }
        },
        error: function (errMsg) {
            //alert(JSON.stringify(errMsg));
        }
    });
}

$$(document).on('click', '.actunit', function() {
    var thisunit = $(this).attr('data-unitid');
    var thisunitscore = $(this).attr('data-unitscore');
    var shortdate = $(this).attr('data-shortdate');
    var maintitle = thisunit.split('[')[0];
    var subtitle = thisunit.split('[').pop().split(']')[0];
    console.log('fired gethighscore(' + thisunit + ', ' + thisunitscore + ')');
    gethighscores(thisunit, thisunitscore, shortdate);
    $$('.actstoragetitle').html(maintitle);
    $$(document).on('click', '.nativeshare', function () {
        shareit(thisunit, 'supi');
    });
});

function shareit(traintitle,  circletext) {
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
}

$$(document).on('click', '.highscoreback', function() {
    localStorage.removeItem('thisactunit');
    statsView.router.back('/activities/', {animate: true});
});