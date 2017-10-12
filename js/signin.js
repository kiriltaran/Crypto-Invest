$(document).ready(function () {

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
});