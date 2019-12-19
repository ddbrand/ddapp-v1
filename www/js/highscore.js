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
                console.log(data);
            } else {
                console.log(data.value.userList);
                for (i = 0; i < data.value.userList.length; i++) {
                    // check the first entry with the highest score from any user
                    if(i === 0) {
                        var circlefill = trainingscore / data.value.userList[i].score;
                        console.log('Currentscore Gauge is filled to ' + circlefill);
                        currentscore_gauge.update({
                            value: circlefill,
                            labelText: 'Highscore: ' + data.value.userList[i].score
                        });
                    }
                    // check if current user is in highscore ranking
                    if(data.value.userList[i].name === localStorage.getItem('username')) {

                    }
                }
                $('td.scores').html(trainingscore);

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
    gethighscores(thisunit, thisunitscore);
    console.log('afterclick ' + thisunit, thisunitscore);
    var maintitle = thisunit.split('[')[0];
    var subtitle = thisunit.split('[').pop().split(']')[0];
    $$('.actstoragetitle').html(maintitle);
});

$$(document).on('click', '.highscoreback', function() {
    localStorage.removeItem('thisactunit');
    statsView.router.back('/activities/', {animate: true});
});