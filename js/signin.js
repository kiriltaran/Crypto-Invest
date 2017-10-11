$(document).ready(function () {

  $("#phone").intlTelInput({
    initialCountry: "auto",
    autoPlaceholder: true,
    separateDialCode: false,
    autoHideDialCode: false,
    formatOnDisplay: false,
    nationalMode: false,
    geoIpLookup: function (callback) {
      $.get('https://ipinfo.io', function () {}, "jsonp").always(function (resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        callback(countryCode);
      });
    }
  });

  $("#signIn").click(function () {
    $(".first-step").hide();
    $(".step-signIn, #backward").show();
  });

  $("#registration").click(function () {
    $(".first-step").hide();
    $(".step-registretion, #backward").show();
  });

  $("#backward").click(function () {
    $(this).hide();
    $(".step-registretion, .step-signIn").hide();
    $(".first-step").show();
  });

  //get country phone codes
  $.getJSON('json/countries.json', function (json, textStatus) {
    $.each(json, function (index, val) {
      leadCountryId[val.id] = val.name;
      leadCountryId[val.id].dataCode = val.dataCode;
      $('#country-ru').append('<option value=' + val.id + '>' + val.name.ru + '</option>');
      $('#country-en').append('<option value=' + val.id + '>' + val.name.en + '</option>');
    });
  });
});