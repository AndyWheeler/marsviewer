$(function() {
    //When the value of the Rover select box is changed.
    $("#roverSelect").change(function() {
        var $rover =  $(this).val();
        if($rover == "none") {
             $("#solSelect").empty();
             $("#camSelect").empty();
        }
        var url = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + $rover + "/?api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
        $.ajax({
            url:url, success: function(result) {
                var manifest = result.photo_manifest;
                var startSol = manifest.photos[0].sol;
                var endSol = manifest.max_sol;

                //fill Sol and Camera select boxes
                $("#solSelect").empty();
                console.log("Start: " + startSol + ", End: " + endSol);
                for (i = startSol; i <= endSol; i++) {
                    $("#solSelect").append("<option>" + i + "</option>");
                }
                //
                $("#camSelect")


                $("#reqObject").text(url);
                $("#returnObject").text(JSON.stringify(result, null, 4));
            }
        })
    })
})