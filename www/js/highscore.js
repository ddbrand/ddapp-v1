$$(document).on('page:init', function () {
    var infos = { id: '402' };

    var template = $$('script#catwalk').html();

    var compiledTemplate = Template7.compile(template);
    var html = compiledTemplate(infos);

// compile it with Template7
    $('.contentwrap').html(html);
});