$(function() {
    //var manifestCache = {};
    var photoCache = {};

    //When a Rover is selected:
    $("#roverSelect").change(function() {

        var $rover =  $(this).val();

        $("#solSelect").empty();
        $("#camSelect").empty();
        $("#photoSelect").empty();

        if($rover == "none") {
            addOption($("#solSelect"), "Choose a rover");
            addOption($("#camSelect"), "Choose a rover");
            addOption($("#photoSelect"), "Choose a rover");
            return;
        }
        else {
            addOption($("#solSelect"), "Choose a sol");
            addOption($("#camSelect"), "Choose a sol");
            addOption($("#photoSelect"), "Choose a sol");
        }

        var url = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + $rover + "/?api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
        $.ajax({
            url:url, success: function(result) {
                var manifest = result.photo_manifest;
                var startSol = manifest.photos[0].sol;
                var endSol = manifest.max_sol;
                for (i = startSol; i <= endSol; i++) {
                    addOption($("#solSelect"), i);
                }
            }
        })
    })

    //When a Sol is selected:
    $("#solSelect").change(function() {

        var $rover = $("#roverSelect").val();
        var $sol = $(this).val();

        var url = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + $rover + "/?api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
        $.ajax({
            url:url, success: function(result) {
                var manifest = result.photo_manifest;
                var cams = [];
                //TODO: implement binary search instead of linear
                for(i = 0; manifest.photos[i].sol <= $sol; i++) {
                    console.log("i: " + i + ", Manifest sol: " + manifest.photos[i].sol + ", selected sol: " + $sol);
                    if(manifest.photos[i].sol == $sol) {
                        console.log("Cams: " + manifest.photos[i].cameras);
                        cams = manifest.photos[i].cameras;
                    }
                }
                if(cams.length == 0) {
                    $("#camSelect").empty();
                    addOption($("#camSelect"), "No photos today");
                }
                else {
                    $("#camSelect").empty();
                    addOption($("#camSelect"), "Choose a camera");
                    for (i = 0; i < cams.length; i++) {
                        addOption($("#camSelect"), cams[i]);
                    }
                }
                $("#photoSelect").empty();
                addOption($("#photoSelect"), "Choose a camera");

            }
        })
    })

    //When a Camera is selected:
    $("#camSelect").change(function() {

        var $rover = $("#roverSelect").val();
        var $sol = $("#solSelect").val();
        var $cam = $(this).val();

        var cacheKey = $rover + $sol + $cam;
        if(!(cacheKey in photoCache)) {
            var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + $rover +
                      "/photos?sol=" + $sol + "&camera=" + $cam + "&api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
            $.ajax({
                url:url, success: function(result) {
                    photoCache[cacheKey] = result;
                }
            })
        }
        var result = photoCache[cacheKey];
        $("#photoSelect").empty();
        addOption($("#photoSelect"), "Choose a photo");
        for(i = 0, len = result.photos.length; i < len; i++) {
            addOption($("#photoSelect"), i + " - " + result.photos[i].id);
        }
    })

    //When a Photo is selected:
    $("#photoSelect").change(function() {

        var $rover = $("#roverSelect").val();
        var $sol = $("#solSelect").val();
        var $cam = $("#camSelect").val();
        var $photo = $(this).val();

        var cacheKey = $rover + $sol + $cam;
        if(!(cacheKey in photoCache)) {
            var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + $rover +
                      "/photos?sol=" + $sol + "&camera=" + $cam + "&api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
            $.ajax({
                url:url, success: function(result) {
                    photoCache[cacheKey] = result;
                }
            })
        }
        var result = photoCache[cacheKey];

        var index = 0;
        for(i = 0; i < $photo.length; i++) {
            if($photo.charAt(i) === " ") {
                index = $photo.substring(0, i-2);
            }
        }
        var photo = result.photos[index];
        $("#marsImg").attr("src", photo.img_src);
        $("#marsRover").text(photo.rover.name);
        $("#marsSol").text(photo.sol);
        $("#marsCam").text(photo.camera.name);
        $("#marsPhotoID").text(photo.id);
    })
})
                /*
                <img id="marsImg"/><br>
                Rover: <p id="marsRover"></p>
                Sol: <p id="marsSol"></p>
                Camera: <p id="marsCam"></p>
                Photo ID: <p id="marsPhotoID"></p>
                */

function addOption(selectBox, option) {
    selectBox.append("<option>" + option + "</option>");
}

function getCams(rover) {
        var cams = [];
        if(rover == "spirit" || rover == "opportunity") {
            cams = ["FHAZ", "NAVCAM", "PANCAM", "MINITES", "RHAZ"];
        }
        else if(rover == "curiosity") {
            cams = ["FHAZ", "NAVCAM", "MAST", "CHEMCAM", "MAHLI", "MARDI", "RHAZ"];
        }
        return cams;
    }
