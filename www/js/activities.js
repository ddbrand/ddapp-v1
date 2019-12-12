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
        data: JSON.stringify({
            "name": localStorage.getItem('username'),
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
                for (i = 0; i < data.value.length; i++) {
                    var unitname = data.value[i].name;
                    $('.activitiesset').append(data.value[i].name);
                }
            }
        },
        error: function (errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
}

pullmytrainings();