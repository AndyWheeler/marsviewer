$(function() {
    //When the value of the Rover select box is changed.
    $("#roverSelect").change(function() {
        var $rover =  $(this).val();
        $("#solSelect").empty();
        addOption($("#solSelect"), "Choose a sol");
        $("#camSelect").empty();
        addOption($("#camSelect"), "Choose a camera");
        $("#photoSelect").empty();
            addOption($("#photoSelect"), "Choose a sol & camera");
        if($rover == "none") { return; }
        var url = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + $rover + "/?api_key=WST7uBsYnZfuF98F3qoysnLaUnONazrtDKLs9xJ9";
        $.ajax({
            url:url, success: function(result) {
                var manifest = result.photo_manifest;
                var startSol = manifest.photos[0].sol;
                var endSol = manifest.max_sol;

                //fill Sol and Camera select boxes
                for (i = startSol; i <= endSol; i++) {
                    addOption($("#solSelect"), i);
                }
                var cams = getCams($rover);
                for (i = 0; i < cams.length; i++) {
                    addOption($("#camSelect"), cams[i]);
                }

                //$("#reqObject").text(url);
                //$("#returnObject").text(JSON.stringify(result, null, 4));
            }
        })
    })
})

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
