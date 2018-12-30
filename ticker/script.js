(function() {
    // var elem = document.getElementById("headlines");
    var elem = $('#headlines');
    // var links = elem.getElementsByTagName("A");
    var links = $('A');
    var animId;

    // var left = elem.offsetLeft;
    var left = elem.offset().left;

    $.ajax({
        url: "data.json",
        method: "GET",

        success: function(data){
            console.log(data);
            var html = "";
            var url;
            var headline;

            for (var i = 0; i < data.length; i++) {
                url = data[i].url;
                headline = data[i].headline;
                html += "<a href=" + url + ">" +  headline + "</a>";
            }
            $("#headlines").html(html);
        }

    });

    function moveHeadLines() {
        left--;
        elem.css('left', left + "px");

        if (left <= 0 - links.eq(0).outerWidth()) {

            left += links.eq(0).outerWidth();
            elem.append(links.eq(0));
            elem.css('left', left + "px");
            links = $('a');
        }


        animId = requestAnimationFrame(moveHeadLines);
    }
    moveHeadLines();

    $(document).on("mouseover", 'a', function() {
        cancelAnimationFrame(animId);
        $(this).css('color', 'blue');
        $(this).css('textDecoration', 'underline');

    });

    $(document).on("mouseout", 'a', function() {
        moveHeadLines();
        $(this).css('color', 'black');
        $(this).css('textDecoration', 'underline');
    });


})();
