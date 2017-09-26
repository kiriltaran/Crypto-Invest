// particles.js
particlesJS.load('particles-js', 'libs/particles/particles.json', function () {
  console.log('callback - particles.js config loaded');
});
particlesJS.load('particles-js-bot', 'libs/particles/particles.json', function () {
  console.log('callback - particles.js config loaded');
});

$(document).ready(function () {
  // validation
  $("form").validate({
    // submitHandler: function () {},
    rules: {
      name: {
        required: true,
        minLength: 3,
        maxLength: 30
      },
      email: {
        required: true,
        email: true,
      },
      phone: {
        required: true,
        minLength: 9,
        maxLength: 20
      }
    }
  });

  // intl-tel-input
  $('#phone').intlTelInput({
    initialCountry: "auto",
    autoPlaceholder: true,
    separateDialCode: false,
    autoHideDialCode: false,
    formatOnDisplay: false,
    nationalMode: false,
    geoIpLookup: function (callback) { // phonecode by IP
      $.get('https://ipinfo.io', function () {}, "jsonp").always(function (resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        callback(countryCode);
      });
    }
  });

  // slider for comments
  $('.slider').slick({
    dots: true,
    autoplay: true,
    autoplaySpeed: 15000,
  });

  //scroll animation for links and buttons
  $('.btn, .link').click(function () {
    var scroll_el = $(this).attr('href');
    if ($(scroll_el).length != 0) {
      $('html, body').animate({
        scrollTop: $(scroll_el).offset().top - 70 //move to element minus height of header
      }, 800);
    }
    return false;
  });

  var leadCountryId = {};

  //getting country phone codes
  if ($('#country').length) {
    $.getJSON('json/countries.json', function (json, textStatus) {
      $.each(json, function (index, val) {
        leadCountryId[val.id] = val.name;
        leadCountryId[val.id].dataCode = val.dataCode;
        $('#country').append('<option value="' + val.id + '">' + val.name.ru + '</option>');
      });
    });

    //select current country
    $.getJSON("https://freegeoip.net/json/", function (data) {
      var current_country;
      $.each(leadCountryId, function (index, val) {
        if (val.en == data.country_name) {
          current_country = index;
          ourLeadCountry = current_country;
        }
      });
      $('#country').val(current_country);
      $('#country').trigger('change');
    })
  };
});