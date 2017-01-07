$(function() {
    var manifestCache = {};
    var photoCache = {};

    //When a Rover is selected:
    $("#roverSelect").change(function() {

        var $rover =  $(this).val();

        if($rover == "none") {
            $("#solSelect").empty();
            $("#camSelect").empty();
            $("#photoSelect").empty();
            addOption($("#solSelect"), "Choose a rover");
            addOption($("#camSelect"), "Choose a rover");
            addOption($("#photoSelect"), "Choose a rover");
        }
        else {
            if(!($rover in manifestCache)) {
                var url = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + $rover + "/?api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
                $.ajax({
                    url:url, success: function(result) {
                        manifestCache[$rover] = result;
                        fillSol(result);
                    }
                })
            }
            else {
                fillSol(manifestCache[$rover]);
            }
            function fillSol(result) {
                $("#solSelect").empty();
                $("#camSelect").empty();
                $("#photoSelect").empty();
                addOption($("#solSelect"), "Choose a sol");
                addOption($("#camSelect"), "Choose a sol");
                addOption($("#photoSelect"), "Choose a sol");
                var manifest = result.photo_manifest;
                var startSol = manifest.photos[0].sol;
                var endSol = manifest.max_sol;
                for (i = startSol; i < endSol; i++) {
                    addOption($("#solSelect"), i);
                }
            }
        }
    })

    //When a Sol is selected:
    $("#solSelect").change(function() {

        var $rover = $("#roverSelect").val();
        var $sol = $(this).val();

        var manifest = manifestCache[$rover].photo_manifest;
        var cams = [];
        //TODO: implement better search
        for(i = 0, len = manifest.photos.length; i < len; i++) {
        //for(i = 0; manifest.photos[i].sol <= $sol; i++){
            //console.log("i: " + i + ", latest sol: " + manifest.max_sol);
            console.log("i: " + i + ", Manifest sol: " + manifest.photos[i].sol + ", selected sol: " + $sol);
            if(manifest.photos[i].sol == $sol) {
                console.log("Cams: " + manifest.photos[i].cameras);
                cams = manifest.photos[i].cameras;
                break;
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

    })

    //When a Camera is selected:
    $("#camSelect").change(function() {

        var $rover = $("#roverSelect").val();
        var $sol = $("#solSelect").val();
        var $cam = $(this).val();

        var cacheKey = $rover + $sol + $cam;
        if(!(cacheKey in photoCache)) {
            $("#photoSelect").empty();
            addOption($("#photoSelect"), "Retrieving data...");
            var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + $rover +
                      "/photos?sol=" + $sol + "&camera=" + $cam + "&api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
            $.ajax({
                url:url,
                success: function(result) {
                    photoCache[cacheKey] = result;
                    fillPhotos(result);
                },
                error: function (err) {
                    $("#photoSelect").empty();
                    addOption($("#photoSelect"), err.responseText);
                }
            })
        }
        else {
            fillPhotos(photoCache[cacheKey]);
        }

        function fillPhotos(result) {
            $("#photoSelect").empty();
            addOption($("#photoSelect"), "Choose a photo");
            for(i = 0, len = result.photos.length; i < len; i++) {
                addOption($("#photoSelect"), i + " - " + result.photos[i].id);
            }
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
                    displayPhoto(result);
                }
            })
        }
        else {
            displayPhoto(photoCache[cacheKey]);
        }

        function displayPhoto(result) {
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
        }
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
