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

/** S generating first level HTML markup for Treeview menu **/
function html_fst_level(name) {
    var markup = "<div class=\"treeview-item\" data-slug=\"" + string_to_slug(name) + "\">\n" +
        "                <div class=\"treeview-item-root\">\n" +
        "                    <div class=\"treeview-toggle\"></div>\n" +
        "                    <div class=\"treeview-item-content\">\n" +
        "                        <div class=\"treeview-item-label treeview-item-toggle\">" + name + "</div>\n" +
        "                    </div>\n" +
        "                </div>" +
        "           </div>";
    return markup;
}

/** E generating first level HTML markup for Treeview menu **/

/** S generating third level HTML markup for Treeview menu **/
function html_thd_level(name, planid) {
    var markup = "<div class=\"treeview-item child-pace\" data-element-slug=\"" + string_to_slug(name) + "\" >\n" +
        "             <div class=\"treeview-item-root\">\n" +
        "                 <div class=\"treeview-item-content\">\n" +
        "                     <label class=\"needsclick checkbox\">\n" +
        "                         <input class=\"needsclick checkbox\" type=\"checkbox\"  data-id=\'" + planid + "'>\n" +
        "                         <i class=\"needsclick icon-checkbox\"></i>\n" +
        "                     </label>\n" +
        "                     <div class=\"sheet-open treeview-item-label\" data-sheet=\".sheet-" + string_to_slug(name) + "\">" + name + "</div>\n" +
        "                 </div>\n" +
        "             </div>\n" +
        "         </div>";
    return markup;
}

/** E generating third level HTML markup for Treeview menu **/
function sheet_markup(thisplanname, plandescription, planunits, planduration, planauthor, thisplan) {
    var minutesduration = planduration / 60;
    var roundedString = minutesduration.toFixed(2);
    var rounded = Number(roundedString);
    var markup = '<div class="sheet-modal sheet-' + string_to_slug(thisplanname) + ' my-sheet-swipe-to-step" style="height:auto;">\n' +
        '    <div class="sheet-modal-inner">\n' +
        '      <div class="sheet-modal-swipe-step">\n' +
        '        <div class="display-flex padding">\n' +
        '<label class=\"checkbox margin-top-half\">\n' +
        '                         <input class="needsclick checkbox" type=\"checkbox\"  data-id="' + thisplan + '">\n' +
        '                         <i class=\"icon-checkbox\"></i>\n' +
        '                     </label>\n' +
        '          <b class="padding-left-half display-inline-block align-content-center" style="padding: 8px; font-size: 16px;">' + thisplanname + '</b>' +
        '        </div><div class="display-flex padding-left padding-right justify-content-center"><div class="hey margin-right"><i class="icon material-icons" style="font-size: 16px; display: inline-block; margin-top: -5px;">info</i><b>&nbsp;' + planunits + ' units</b></div><div class="margin-left"><i class="icon material-icons" style="font-size: 16px; display: inline-block; margin-top: -5px;">access_time</i><b>&nbsp;' + rounded + ' minutes</b></div></div>\n' +
        '        <div class="padding-horizontal padding-bottom">\n' +
        '          <div class="margin-top text-align-center">Swipe up for more details</div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '       <div class="card">\n' +
        '  <div class="card-content card-content-padding">' + plandescription + '</div></div>' +
        '      <div class="block-title block-title padding-top padding-bottom-half padding-left-half margin-top">Created by</div>\n' +
        '       <div class="card">\n' +
        '  <div class="card-content card-content-padding">' + planauthor + '</div></div>' +
        '    </div>\n' +
        '  </div>';
    return markup;
}

// MAIN FUNCTION
$$(document).on('page:init', '.page[data-name="workouts"]', function (e) {
    $$('.toggletree').on('click', function () {
        $('.treeview-item').each(function (index) {
            app.treeview.toggle(this);
        });
    });
    var searchbar = app.searchbar.create({
        el: '.searchbar',
        searchContainer: '.treeview',
        searchIn: '.sheet-open',
        on: {
            search(sb, query, previousQuery) {
                $$('.sheet-open').each(function (index) {
                    var searchtitle = $(this).html();
                    if (searchtitle.search(query) !== -1) {
                    } else {
                        $(this).parents('.child-pace').hide();
                    }
                });
            },
            enable: function () {
                $('.treeview-item').each(function (index) {
                    app.treeview.open(this);
                });
            },
            disable: function () {
                $$('.sheet-open').each(function (index) {
                    $(this).parents('.child-pace').show();
                });
            }
        }
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
                var allsubcats = [];
                var i;
                for (i = 0; i < response_obj.value.length; i++) {
                    var thiscategory = response_obj.value[i]['category'];
                    var thissubcategory = response_obj.value[i]['subcategory'];
                    var thisplan = response_obj.value[i]['id'];
                    var thisplanname = response_obj.value[i]['name'];
                    var thisplanauthor = response_obj.value[i]['author'];
                    var thisplanunits = response_obj.value[i]['numunits'];
                    var thisplanduration = response_obj.value[i]['duration'];
                    var thisplandescription = response_obj.value[i]['description'];
                    if (!allcats.includes(thiscategory)) {
                        // collected main category name in array
                        allcats.push(thiscategory);
                        $('.workoutset .treeview').append(html_fst_level(thiscategory));
                        $('.workoutset .treeview div.treeview-item[data-slug=' + string_to_slug(thiscategory) + ']').append('<div class="treeview-item-children" data-children-slug="' + string_to_slug(thiscategory) + '"></div>');
                    }
                    $('.workoutset .treeview div.treeview-item[data-slug=' + string_to_slug(thiscategory) + '] div.treeview-item-children[data-children-slug=' + string_to_slug(thiscategory) + ']').append(html_thd_level(thisplanname, thisplan));

                    $('.modalsheets').append(sheet_markup(thisplanname, thisplandescription, thisplanunits, thisplanduration, thisplanauthor, thisplan));

                    $$('.dynamic-sheet').on('click', function () {

                        // Close inline sheet before
                        app.sheet.close('.sheet-' + string_to_slug(thisplanname));

                        // Open dynamic sheet
                        app.sheet.open('.sheet-' + string_to_slug(thisplanname));
                    });
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
            //xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa('mario' + ':' + 'test92'));

        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=de");
            //xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa('mario' + ':' + 'test92'));
        }
    } else {
        if (localStorage.getItem('dev_login') === 'ok') {
            xhr.open("GET", "https://data-manager-1-dev.dd-brain.com/api/json/workouts/list/2?lang=en");
            //xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem('dev_username') + ':' + localStorage.getItem('dev_pass')));
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa('mario' + ':' + 'test92'));
        } else {
            xhr.open("GET", "https://data-manager-1.dd-brain.com/api/json/workouts/list/2?lang=en");
            // xhr.setRequestHeader("Authorization", 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('pass')));
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa('mario' + ':' + 'test92'));
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
    setTimeout(function() {
        check_selected_boxes();
    }, 1000)
});