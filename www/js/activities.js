function pullunitmeta() {
    var username = localStorage.getItem('username');
    $.ajax({
        type: "GET",
        url: "https://data-manager-1-dev.dd-brain.com/api/json/highscores?name=" + username,
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
                console.log('show medals overfun');
                $('.actunit').each(function (index) {
                    for (i = 0; i < data.value.length; i++) {
                        console.log('show all medals prepare');
                        var currentname = $(this).attr('data-unitid');
                        var currentscore = $(this).attr('data-unitscore');
                        console.log('debug ' + currentname + ' ' + currentscore);
                            var unitname = data.value[i].name;
                            var unitscore = data.value[i].score;
                            var unitrank = data.value[i].rank;
                            if (currentname === unitname) {
                                console.log(unitscore + ' ' + currentscore + '; ' + unitname + ' ' + currentname + '; ' + unitrank);
                                if (unitrank === 1) {
                                    console.log('show gold medals', currentname);
                                    $('.actunit[data-unitid="' + unitname + '"][data-unitscore="' + unitscore + '"] .item-after').html('<img src="img/Gold.svg" alt="Gold" style="width: 32px;" />');
                                } else if (unitrank === 2) {
                                    $('.actunit[data-unitid="' + unitname + '"][data-unitscore="' + unitscore + '"] .item-after').html('<img src="img/Silber.svg" alt="Silver" style="width: 32px;" />');
                                } else if (unitrank === 3) {
                                    $('.actunit[data-unitid="' + unitname + '"][data-unitscore="' + unitscore + '"] .item-after').html('<img src="img/Bronze.svg" alt="Bronze" style="width: 32px;" />');
                                }
                            } else {
                                console.log('N');
                            }
                        }
                });
            }
        },
        error: function (errMsg) {
            console.log(JSON.stringify(errMsg));
        }
    });
}

function pullmytrainings() {
    var username = localStorage.getItem('username');
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
                for (i = 0; i < data.value.length; i++) {
                    var unitname = data.value[i].name;
                    var isodate = new Date(data.value[i].timeStampIso);
                    var thisscore = data.value[i].score;
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:  '2-digit', minute: '2-digit' };
                    $('.activitiesset .actlist ul').append('<li>\n' +
                        '      <a href="/activities/highscore/" class="actunit item-link item-content chevron-center"  data-unitscore="' + thisscore + '" data-unitid="' + unitname + '">\n' +
                        '        <div class="item-inner">\n' +
                        '          <div class="item-title">\n' +
                        '            <div class="item-header">' + isodate.toLocaleDateString('en-US', options) + '</div>' + data.value[i].name + '<div class="item-footer">Score: ' + data.value[i].score + '</div>' +
                        '            </div>\n' +
                        '        <div class="item-after"></div>' +
                        '        </div>\n' +
                        '      </a>\n' +
                        '    </li>');

                }
                pullunitmeta();
                console.log('medal pull fired');
            }
        },
        error: function (errMsg) {
            //alert(JSON.stringify(errMsg));
        }
    });
}

$$('.refreshstats').on('click', function() {
    pullmytrainings();
});