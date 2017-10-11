$(document).ready(function () {

    $("#videos img").click(function () {
        var src = $(this).attr('alt');
        console.log(src);
        $(".player").find("iframe").attr("src",src);
    });


    $(".arrow").click(function () {
       $(".player").toggleClass("playerHide");
    });

});
