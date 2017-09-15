(function (document, window, $) {
  $(document).ready(function(){
    ajaxifyContactForm();
    $(window).on('hashchange', showOrHideDeveloperMenu)
      .trigger('hashchange');
  });

  function ajaxifyContactForm () {
    var contactForm = $('#contact'),
        originalUrl = contactForm.attr('action');
        contactBtn  = $('.contact [type=submit]'),
        alert       = $('#contact-alert');

    contactBtn.on('click', function (e) {
      e.preventDefault();
      var url = [originalUrl, contactForm.serialize()].join('?'),
          img = $('<img></img');

      img.on('error', function (e) {
        console.log('known error', e);
      });

      contactBtn.val('Thank you');
      contactBtn.attr('disabled', true);
      img.attr('src', url);

    });
  }

  function showOrHideDeveloperMenu() {
    var devMenu = $('#dev-menu');
    if (/devmode/.test(window.location.hash)) {
      devMenu.fadeIn();
    } else {
      devMenu.fadeOut();
    }
  }
})(document, window, $);
