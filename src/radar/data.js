// radar data module

// Radar data is stored in 4 sectors.
// Each sector has a name and a list of items.
// Each item has a name and pc (polar coordinates) object with r (radius) and t (theta) values.
// r is normallized to a value of 0..400 where each ring is 100 units wide.
//
// Standard sectors
// - Techniques: elements of a software development process, such as experience design; and ways of structuring software, such micro-services.
// - Tools: components, such as databases, software development tools, versions control systems; or more generic categories of tools, such as the notion of polyglot persistance.
// - Platforms: things that we build software on top of: mobile technologies like Android, virtual platforms like the JVM, or generic kinds of platforms like hybrid clouds
// - Programming Languages and Frameworks
//
// Rings:
// - Adopt: blips you should be using now; proven and mature for use
// - Trial: blips ready for use, but not as completely proven as those in the adopt ring; use on a trial basis, to decide whether they should be part of your toolkit
// - Assess: things that you should look at closely, but not necessarily trial yet - unless you think they would be a particularly good fit for you
// - Hold: things that are getting attention in the industry, but not ready for use; sometimes they are not mature enough yet, sometimes they are irredeemably flawed
//      Note: there's no "avoid" ring, but throw things in the hold ring that people shouldn't use.

// Valid t coordinate values by quaderant:
//   Techniques:     90-180
//   Platforms:     180-270
//   Tools:           0- 90
//   Languages:     270-360

/*jslint browser: true, white: true, vars: true, plusplus: true */
/*global $, console, radar */

radar.data = (function () {
    'use strict';

    //This is the concentric circles that want on your radar (currently not used).
    var radar_arcs = [
        {'r': 100, 'name': 'Adopt'},
        {'r': 200, 'name': 'Trial'},
        {'r': 300, 'name': 'Assess'},
        {'r': 400, 'name': 'Hold'}
        // ,{'r':500,'name':'Possible Extra if you want it'}
    ];

    // Default data.
    var radar_data = {
        "title": "Technology Radar",
        "sectors": [
            {
                "quadrant": "Techniques",
                "items": [
                    {"name": "BDD", "pc": {"r": 230, "t": 150}},
                    {"name": "Scaled Agile Framework", "pc": {"r": 70, "t": 135}}
                ]
            },
            {
                "quadrant": "Connectivity",
                "items": [
                    {"name": "MQTT", "pc": {"r": 350, "t": 40}},
                    {"name": "CoAP", "pc": {"r": 350, "t": 30}}
                ]
            },
            {
                "quadrant": "Applications",
                "items": [
                    {"name": "Hypervisor", "pc": {"r": 220, "t": 205}},
                    {"name": "Node.js", "pc": {"r": 350, "t": 200}}
                ]
            },
            {
                "quadrant": "Analytics",
                "items": [
                    {"name": "PRODAPS", "pc": {"r": 260, "t": 300}},
                    {"name": "Rules Engines", "pc": {"r": 260, "t": 290}}
                ]
            }
        ]
    };

        var default_data = {
        "title": "Technology Radar",
        "sectors": [
            {
                "quadrant": "Techniques",
                "items": []
            },
            {
                "quadrant": "Platforms",
                "items": []
            },
            {
                "quadrant": "Tools",
                "items": []
            },
            {
                "quadrant": "Languages",
                "items": []
            }
        ]
    };

    
    // Get the title.
    var title = function () {
        return radar_data.title;
    };

    // Returns quadrant number of entry based on its theta, -1 if not found.
    var chooseQuad = function (pc) {
        if (pc.t < 0) { return -1; }

        if (pc.t <= 90) { return 0; }
        if (pc.t <= 180) { return 1; }
        if (pc.t <= 270) { return 2; }
        if (pc.t <= 360) { return 3; }

        return -1;
    };

    // Find index of entry in quadrant by name.
    var indexOf = function (quad, eid) {
        var nentry;
        for (nentry = 0; nentry < quad.length; nentry++) {
            if (quad[nentry].id == eid) { return nentry; }
        }
        return -1;
    };

    // Search each quadrant looking for an entry with the matching name.
    // Return the quadrant number (not the index in the quadrant).

    // @todo refactoring *may* have made this identical to findById, check before deleting.
    var findQuad = function (eid) {
        var nquad;
        for (nquad = 0; nquad < radar_data.sectors.length; nquad++) {
            if (indexOf(radar_data.sectors[nquad].items, eid) != -1) {
                return nquad;
            }
        }
        return -1;
    };

    // @todo delete
    var findById = function (eid) {
        var nquad;
        var items;
        var nitem;
        
        for (nquad = 0; nquad < radar_data.sectors.length; nquad++) {
            items = radar_data.sectors[nquad].items;
            for (nitem = 0; nitem < items.length; nitem++) {
                if (items[nitem].id == eid) { return items[nitem]; }
            }
        }

        return null;
    };

    // Check the entry's theta to see if it is in the right quadrant, if not move it.
    var updateEntry = function (entry) {
        var stored = findQuad(entry.id);
        var expected = chooseQuad(entry.pc);

        // Bail if not found or is in the right quadrant.
        if (stored < 0) { return; }
        if (expected < 0) { return; }
        if (stored == expected) { return; }

        // Remove from current quadrant and add to destination quadrant.
        radar_data.sectors[stored].items.splice(indexOf(radar_data.sectors[stored].items, entry.id), 1);
        radar_data.sectors[expected].items.push(entry);
    };

    // Counter for assigning technology entry "id" attributes.
    var nextId = 1;

    var addEntry = function (pt) {
        var pc = radar.utils.cartesian_to_polar(pt);

        var nquad = chooseQuad(pc);
        radar_data.sectors[nquad].items.push({name: 'New Tech', id: 'tech-' + (nextId++), pc: pc});
    };

    var deleteEntry = function (eid) {
        var nquad = findQuad(eid);
        if (nquad < 0) {
            console.log("Tried to delete '" + eid + "', but not found in data.");
            return;
        }
        radar_data.sectors[nquad].items.splice(indexOf(radar_data.sectors[nquad].items, eid), 1);
    };

    var update = function (eid, field, value) {
        var entry;

        if (field == 'name') {
            entry = findById(eid);
            if (entry === null) { return; }

            entry[field] = value;
            
            radar.view.update(
                radar.utils.mkid('trkey-', entry.id),
                'text',
                radar.utils.name2abbr(entry.name));
        }
        else if (field == 'qtitle') {
            radar_data.sectors[radar.utils.idnum(eid)].quadrant = value;
        }
        else if (field == 'title') {
            radar_data.title = value;
        }
    };

    // Set new id values on the specified data set.
    var setIds = function (data) {

        $.each(data, function (index, quad) {
            $.each(quad.items, function (index, val) {
                val.id = 'tech-' + (nextId++);
            });
        });

        return data;
    };

    // Set the data.
    var set = function (data) {
        radar_data = data;
    };

    // Get the data.
    var get = function () {
        return radar_data;
    };
    
    var getDefault = function() {
        return default_data;
    };

    return {
        title: title,
        get: get,
        setIds: setIds,
        set: set,
        update: update,
        updateEntry: updateEntry,
        addEntry: addEntry,
        deleteEntry: deleteEntry,
        getDefault: getDefault
    };
}());
