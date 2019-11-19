// Additional functions
function string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeiiiioooouuuunc------";

    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}
/** S generating first level HTML markup for Treeview menu **/
function html_fst_level( name ) {
    var markup = "<div class=\"treeview\">\n" +
        "            <div class=\"treeview-item\" data-slug=\"" + string_to_slug(name) + "\">\n" +
        "                <div class=\"treeview-item-root\">\n" +
        "                    <div class=\"treeview-toggle\"></div>\n" +
        "                    <div class=\"treeview-item-content\">\n" +
        "                        <label class=\"checkbox\">\n" +
        "                            <input type=\"checkbox\">\n" +
        "                            <i class=\"icon-checkbox\"></i>\n" +
        "                        </label>\n" +
        "                        <i class=\"icon f7-icons\">folder_fill</i>\n" +
        "                        <div class=\"treeview-item-label\">" + name + "</div>\n" +
        "                    </div>\n" +
        "                </div>" +
        "           </div>" +
        "       </div>";
    return markup;
}
/** E generating first level HTML markup for Treeview menu **/
/** S generating second level HTML markup for Treeview menu **/
function html_scd_level( name ) {
    var markup = "<div class=\"treeview-item\">\n" +
        "                        <div class=\"treeview-item-root\">\n" +
        "                            <div class=\"treeview-item-content\">\n" +
        "                                <label class=\"checkbox\">\n" +
        "                                    <input type=\"checkbox\">\n" +
        "                                    <i class=\"icon-checkbox\"></i>\n" +
        "                                </label>\n" +
        "                                <i class=\"icon f7-icons\">images_fill</i>\n" +
        "                                <div class=\"treeview-item-label\">" + name + "</div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>";
    return markup;
}
/** E generating first level HTML markup for Treeview menu **/


// MAIN FUNCTION
var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        var response_obj = JSON.parse(this.responseText);
        if (response_obj.success == false) {
        } else {
            $$('.workoutset').html('');
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
                var thisplandescription = response_obj.value[i]['description'];
                if (!allcats.includes(thiscategory)) {
                    // collected main category name in array
                    allcats.push(thiscategory);
                    $$('.workoutset').append(html_fst_level(thiscategory));
                    $$('.workoutset div.treeview-item[data-slug=' + string_to_slug(thiscategory) +']').append('<div class="treeview-item-children" data-children-slug="' + string_to_slug(thiscategory) + '"></div>');
                }
                if (!allsubcats.includes(thissubcategory)) {
                    // collected sub category name in array only for check reasons (don't use)
                    allsubcats.push(thissubcategory);
                    $$( '.workoutset div.treeview-item[data-slug=' + string_to_slug(thiscategory) +'] div.treeview-item-children[data-children-slug=' + string_to_slug(thiscategory) +']' ).append( html_scd_level( thissubcategory ) );
                }
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
