// The current legend is single ordered list, which we use to get the correct 1..N numbering for each entry.
// List placement is controlled by CSS styles.
// Note there are <p> elements embedded in the list which subset it based on the sectors.

$(document).ready(function() {
        var legend = $("<ol/>");
        
        $.each(radar_data, function(index, quad) {
            legend.append("<p><b>" + quad.quadrant + "</b></p>");
            $.each(quad.items, function(index, val) {
                legend.append("<li>" + val.name + "</li>");
            });
        });
        
        legend.appendTo("#legend");
    });