function pullblogentries() {
    $.ajax({
        url: "https://ddrobotec.com/wp-json/wp/v2/posts?per_page=10",
    }).done(function (result) {
        for (i = 0; i < result.length; i++) {
            var stampdate = new Date(result[i].date);
            const options = {
                month: 'short',
                day: 'numeric',
            };
            const insetoptions = {
                year: '2-digit',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            var readabledate = stampdate.toLocaleDateString(localStorage.getItem('language'), options);
            var insetdate = stampdate.toLocaleDateString(localStorage.getItem('language'), insetoptions);
            var bloglink = result[i].link;
            $('.blog.timeline').append('<div data-link="' + bloglink + '" class="timeline-item">\n' +
                '                <div class="timeline-item-date"><nobr>' + readabledate + '</nobr></div>\n' +
                '                <div class="timeline-item-divider"></div>\n' +
                '                <div class="timeline-item-content" data-id="' + result[i].featured_media + '">\n' +
                '                    <div class="timeline-item-inner">\n' +
                '                        <div class="timeline-item-time">' + insetdate + '</div>\n' +
                '                        <div class="block block-strong">' + result[i].title.rendered + '</div>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </div>');
            getblogpostthumbnail(result[i].featured_media);
        }
    });
}

function getblogpostthumbnail(id) {
    $.ajax({
        url: "https://ddrobotec.com/wp-json/wp/v2/media/" + id,
    }).done(function (result) {
        $('.timeline-item-content[data-id="' + id + '"] .timeline-item-inner').prepend('<img src="' + result.guid.rendered + '" class="blogthumb" />');
    });
}

pullblogentries();

$$(document).on('click', '.blog.timeline .timeline-item', function() {
   var bloglink = $$(this).attr('data-link');
    window.open(bloglink, '_system');
});