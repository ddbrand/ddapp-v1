// Additional functions
/** S convert string to url slug for better reading from jquery **/
function string_to_slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeiiiioooouuuunc------";

    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    return str;
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
                alert(JSON.stringify(errMsg));
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
                alert(JSON.stringify(errMsg));
            }
        });
    }
}
/** E convert string to url slug for better reading from jquery **/

function check_selected_boxes() {
    var localplans = JSON.parse(localStorage.getItem("myplans"));
    $('input.checkbox').prop('checked', false);
    $.each(localplans, function(index, item) {
        $('input.checkbox[data-id="' + item + '"]').prop('checked', true);
    });
}

/** S generating third level HTML markup for Treeview menu **/
function html_thd_level(name, planid, planauthor, planduration, plandescription, planunits, plancat) {
    var minutesduration = Math.floor(planduration / 60);
    var markup = '<li data-element-slug="' + string_to_slug(name) + '" data-show-cat="' + string_to_slug(plancat) + '" data-minutes="' + minutesduration + '" class="child-pace sheeter-open" data-sheet=".sheet-' + string_to_slug(name) + '">\n' +
        '<label class="needsclick item-checkbox item-content"><input class="needsclick checkbox" type="checkbox" data-id="' + planid + '">' +
        '        <i class="needsclick icon-checkbox"></i>' +
        '        <div class="item-inner">\n' +
        '          <div class="item-title-row">\n' +
        '            <div class="item-title">' +
        '        <div class="display-inline vertical-align-middle">' + name + '</div></div>\n' +
        '            <div class="item-after">' + planunits + ' units</div>\n' +
        '          </div>\n' +
        '        </label>\n' +
        '          <div class="item-subtitle">by ' + planauthor + '</div>\n' +
        '          <div class="item-text">' + plandescription + '</div>\n' +
        '        </div>\n' +
        '    </li>';
    return markup;
}

/** E generating third level HTML markup for Treeview menu **/
function sheet_markup(thisplanname, plandescription, planunits, planduration, planauthor, thisplan, thisgoals) {
    var minutesduration = Math.floor(planduration / 60);
    var seconds = planduration - minutesduration * 60;

    var markup = '<div class="sheet-modal sheet-' + string_to_slug(thisplanname) + ' my-sheet-swipe-to-step swipeout" style="height:auto;">\n' +
        '            <div class="sheet-modal-inner">\n' +
        '               <div class="sheet-modal-swipe-step">\n' +
        '                   <div class="display-flex padding">\n' +
        '                       <label class=\"checkbox margin-top-half\">\n' +
        '                           <input class="needsclick checkbox" type=\"checkbox\"  data-id="' + thisplan + '">\n' +
        '                           <i class=\"icon-checkbox\"></i>\n' +
        '                       </label>\n' +
        '                       <b class="padding-left-half display-inline-block align-content-center" style="padding: 8px; font-size: 16px;">' + thisplanname + '</b>' +
        '                   </div><div class="display-flex padding-left padding-right justify-content-center"><div class="hey margin-right"><i class="icon material-icons" style="font-size: 16px; display: inline-block; margin-top: -5px;">info</i><b>&nbsp;' + planunits + ' training units</b></div><div class="margin-left"><i class="icon material-icons" style="font-size: 16px; display: inline-block; margin-top: -5px;">access_time</i><b>&nbsp;' + minutesduration + ' mins &nbsp;' + seconds + ' secs</b></div></div>\n' +
        '           </div>\n' +
        '           <div class="card">\n' +
        '               <div class="card-content card-content-padding"><ul class="goals"></ul></div>' +
        '           </div>\n' +
        '           <div class="card">\n' +
        '               <div class="card-content card-content-padding">' + plandescription + '</div>' +
        '           </div></div>\n' +
        '       </div>';
    return markup;
}

function setgoals(thisplanname, goals) {
    var i;
    for (i = 0; i < goals.length; i++) {
        $('.sheet-' + string_to_slug(thisplanname) + ' ul.goals').append('<li>' + goals[i] + '</li>');
    }
}

// MAIN FUNCTION
function pullworkouts() {
    $$('.workoutset .list.media-list ul, .modalsheets, .categoriesfilter').html('');
        var searchbar = app.searchbar.create({
        el: '.searchbar',
        searchContainer: '.workoutset',
        searchIn: '.list ul .item-title .display-inline',
        on: {
            search(sb, query, previousQuery) {
                $$('.list ul .sheeter-open').each(function (index) {
                    var searchtitle = $$(this).html();
                    console.log(searchtitle, query);
                    if (searchtitle.toLowerCase().search(query.toLowerCase()) !== -1) {
                        console.log('found');
                        $$(this).show();
                    } else {
                        console.log('not found');
                        $$(this).hide();
                    }
                });
            },
            enable: function () {
            },
            disable: function () {
                $('.sheeter-open').each(function (index) {
                    $(this).parents('.child-pace').show();
                });
            }
        }
    });
    $$('.filter-open').on('click', function () {
        app.sheet.open('.sheet-modal-top');
        var countlist = $('.sheeter-open:visible').length;
        $('.workout_counter').html(countlist + ' ' + translate_strings('plansdisplayed'));
    });
    $$('body').on('change', 'input.checkbox', function(e) {
        if (e.target.checked) {
            $(this).prop('checked', true);
            var planid = $(this).attr('data-id');
            var currentplans = JSON.parse(localStorage.getItem("myplans"));
            var myplans = [];
            var finalplans = myplans.concat(currentplans);
            if ($.inArray(planid, finalplans) !== -1) {
                var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                $$('.myplansind i .badge').html(myplansindicator.length - 1);
                sendplans();
                check_selected_boxes();
            } else {
                finalplans.push(planid);
                localStorage.setItem("myplans", JSON.stringify(finalplans));
                var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
                $$('.myplansind i .badge').html(myplansindicator.length - 1);
                sendplans();
                check_selected_boxes();
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
            check_selected_boxes();
        }
        check_selected_boxes();
    });
    $(document).on("taphold", '.sheeter-open', function(e) {
        var sheetel = $(this).attr('data-sheet');
        app.sheet.open(sheetel);
        e.preventDefault();
    });
    $$('#price-filter').on('range:change', function (e) {
        var range = app.range.get(e.target);
        $('.sheeter-open').each(function(index) {
            var plandur = $(this).attr('data-minutes');
            var datacat = $(this).attr('data-show-cat');
            if(range.value[0] < plandur && range.value[1] > plandur) {
                filtercats = [];
                $('.categoriesfilter button.button-fill').each(function (index) {
                    var selected_cats = $(this).attr('data-cat');
                    filtercats.push(selected_cats);
                });
                if(filtercats.includes(datacat)) {
                    $(this).show();
                } else if(filtercats.length === 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else {
                $(this).hide();
            }
        });
        var countlist = $('.sheeter-open:visible').length;
        $('.workout_counter').html(countlist + ' ' + translate_strings('plansdisplayed'));
        $$('.price-value').text((range.value[0])+' min - '+(range.value[1]) + ' min');
    });
    $('.categoriesfilter').on('click', 'button', function() {
        $(this).toggleClass('button-fill');
        $(this).toggleClass('catchoice');
        var filtercats = [];
        var i6;
        var range = app.range.get('#price-filter');
            $('.button-fill').each(function(index) {
                var selected_cats = $(this).attr('data-cat');
                filtercats.push(selected_cats);
            });
            for (i6 = 0; i6 < filtercats.length; i6++) {
                $('.sheeter-open').each(function (index) {
                    if($(this).attr('data-show-cat') === filtercats[i6]) {
                        $(this).addClass('checker');
                    } else {
                    }
                });
            }
            $('.sheeter-open:not(.checker)').each(function() {
                $(this).hide();
            });
            $('.checker').each(function() {
                var plandur = $(this).attr('data-minutes');
                if (range.value[0] < plandur && range.value[1] > plandur) {
                    $(this).show();
                    $(this).removeClass('checker');
                } else {
                    $(this).hide();
                    $(this).removeClass('checker');
                }
            });
            $('.nopechecker').each(function() {
                $(this).hide();
                $(this).removeClass('nopechecker');
            });
        if(filtercats.length === 0) {
            $('.sheeter-open').each(function (index) {
                var plandur = $(this).attr('data-minutes');
                if (range.value[0] < plandur && range.value[1] > plandur) {
                    $(this).show();
                    $(this).removeClass('checker');
                }
            });
        }
        var countlist = $('.sheeter-open:visible').length;
        $('.workout_counter').html(countlist + ' ' + translate_strings('plansdisplayed'));
    });
    if (localStorage.getItem("myplans") === null) {
        $$('.myplansind i .badge').html('0');
    } else {
        var myplansindicator = JSON.parse(localStorage.getItem("myplans"));
        $$('.myplansind i .badge').html(myplansindicator.length - 1);
    }
    check_selected_boxes();
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response_obj = JSON.parse(this.responseText);
            if (response_obj.success == false) {
            } else {
                $$('.workoutset .treeview').html('');
                var allcats = [];
                var durations = [];
                var allsubcats = [];
                var i;
                for (i = 0; i < response_obj.value.length; i++) {
                    response_obj.value.sort(function(a, b){
                        if(a.name < b.name) { return -1; }
                        if(a.name > b.name) { return 1; }
                        return 0;
                    });
                    var thiscategory = response_obj.value[i]['category'];
                    var thissubcategory = response_obj.value[i]['subcategory'];
                    var thisplan = response_obj.value[i]['id'];
                    var thisplanname = response_obj.value[i]['name'];
                    var thisplanauthor = response_obj.value[i]['author'];
                    var thisplanunits = response_obj.value[i]['numunits'];
                    var thisplanduration = response_obj.value[i]['duration'];
                    var thisplandescription = response_obj.value[i]['description'];
                    var thisgoals = response_obj.value[i]['goals'];
                    durations.push(thisplanduration);
                    $('#test').html(thisgoals[0] + ' ' + thisgoals[1]);
                    if (!allcats.includes(thiscategory)) {
                        // collected main category name in array
                        allcats.push(thiscategory);
                        $('.workoutset .treeview div.treeview-item[data-slug=' + string_to_slug(thiscategory) + ']').append('<div class="treeview-item-children" data-children-slug="' + string_to_slug(thiscategory) + '"></div>');
                    }
                    $('.workoutset .list.media-list ul').append(html_thd_level(thisplanname, thisplan, thisplanauthor, thisplanduration, thisplandescription, thisplanunits, thiscategory));
                    $('.modalsheets').append(sheet_markup(thisplanname, thisplandescription, thisplanunits, thisplanduration, thisplanauthor, thisplan, thisgoals));
                    setgoals(thisplanname, thisgoals);
                    $$('.dynamic-sheet').on('click', function () {
                        // Close inline sheet before
                        app.sheet.close('.sheet-' + string_to_slug(thisplanname));
                        // Open dynamic sheet
                        app.sheet.open('.sheet-' + string_to_slug(thisplanname));
                    });
                }
                durations.sort(function(a, b){return a - b});
                setTimeout(function() {
                    console.log(durations);
                    var _r = app.range.get('#price-filter');
                    var min_mins = Math.floor(durations[0] / 60);
                    var max_mins = Math.floor(durations.slice(-1)[0] / 60);
                    $$('.price-value').html(min_mins + ' min - ' + max_mins + ' min');
                    _r.min = min_mins;
                    _r.max = max_mins;
                    console.log(_r.knobs);
                    console.log(allcats);
                    $('#price-filter').attr('data-value-left', '3').attr('data-value-right', '33');
                }, 1000);
                for (i4 = 0; i4 < allcats.length; i4++) {
                    $('.categoriesfilter').append('<button class="button button-outline display-inline-block width-auto catchoice" data-cat="' + string_to_slug(allcats[i4]) + '">' + allcats[i4] + '</button>');
                }
            }
        }
    });
    // END MAIN FUNCTION

    // CONNECTION POOL
    xhr.withCredentials = true;
    if (localStorage.getItem('language') == 'de') {
        if (localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=de");
            xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
        }
    } else {
        if (localStorage.getItem('dev_login') === 'ok') {
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
    setTimeout(function() {
        check_selected_boxes();
        var countlist = $('.workoutset .sheeter-open:visible').length;
        $('.workout_counter').html(countlist + ' ' + translate_strings('plansdisplayed'));
    }, 1000);
}