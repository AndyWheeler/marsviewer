$(function() {
    $("#roverSelect").change(function() {
        var $rover =  $(this).val();
        console.log($rover);
        if($rover == "none") { return }
        var url = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + $rover + "/?api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
        $.ajax({
            url:url, success: function(result) {
                var max_sol = result.max_sol;

                $("#reqObject").text(url);
                $("#returnObject").text(JSON.stringify(result, null, 4));
            }
        })
    })
})