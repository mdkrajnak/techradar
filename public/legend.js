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