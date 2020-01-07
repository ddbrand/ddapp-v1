$$(document).on('page:init', '.page[data-name="highscore"]', function (event, page) {

});

function gethighscores(trainingid, trainingscore) {
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
                console.log('get highscore failed: ', data);
            } else {
                console.log(data.value.userList);
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
                    console.log(data.value.userList[i].name + ' ' + localStorage.getItem('username') + ' / ' + data.value.userList[i].score + ' ' + trainingscore);
                    if(data.value.userList[i].name === localStorage.getItem('username') && data.value.userList[i].score == trainingscore) {
                        if(data.value.userList[i].rank === 1) {
                            $$('.ranks').html('<img src="img/Gold.svg" alt="Gold" class="inlinemedal" style="width: 32px;" />');
                        } else if(data.value.userList[i].rank === 2) {
                            $$('.ranks').html('<img src="img/Silber.svg" alt="Silber" class="inlinemedal" style="width: 32px;" />');
                        } else if(data.value.userList[i].rank === 3) {
                            $$('.ranks').html('<img src="img/Bronze.svg" alt="Bronze" class="inlinemedal" style="width: 32px;" />');
                        } else {

                            $$('.ranks').html(JSON.stringify(data.value.userList[i].rank));
                        }
                    }
                }
                $$('td.scores').html(trainingscore);
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
    var maintitle = thisunit.split('[')[0];
    var subtitle = thisunit.split('[').pop().split(']')[0];
    console.log('fired gethighscore(' + thisunit + ', ' + thisunitscore + ')');
    gethighscores(thisunit, thisunitscore);
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