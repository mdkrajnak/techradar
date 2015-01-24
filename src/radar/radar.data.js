// radar data module

//This is your raw data
//
// Key
//
// movement:
//   t = moved
//   c = stayed put
//
// blipSize: 
//  intValue; This is optional, if you omit this property, then your blip will be size 70.
//            This give you the ability to be able to indicate information by blip size too
//
// url:
// StringValue : This is optional, If you add it then your blips will be clickable to some URL
//
// pc: polar coordinates
//   r = distance away from origin ("radial coordinate")
//     - Each level is 100 points away from origin
//     t = angle of the point from origin ("angular coordinate")
//     - 0 degrees is due east
//
// Coarse-grained sectors
// - Techniques: elements of a software development process, such as experience design; and ways of structuring software, such micro-services.
// - Tools: components, such as databases, software development tools, such as versions control systems; or more generic categories of tools, such as the notion of polyglot persistance.
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

/*jslint white: true, vars: true */
/*global radar, $ */
radar.data = function () {
    'use strict';

    // New entries are given a default name of "New Tech " + newTechCounter.
    var newTechCounter = 1;

    //This is the concentric circles that want on your radar (currently not used).
    var radar_arcs = [
        {'r': 100, 'name': 'Adopt'},
        {'r': 200, 'name': 'Trial'},
        {'r': 300, 'name': 'Assess'},
        {'r': 400, 'name': 'Hold'}
        // ,{'r':500,'name':'Possible Extra if you want it'}
    ];

    var radar_data = {
        "title": "Title",
        "sectors": [
            {
                "quadrant": "Techniques",
                "items": [
                    {"name": "BDD", "pc": {"r": 230, "t": 150}},
                    {"name": "Scaled Agile Framework", "pc": {"r": 70, "t": 135}},
                    {"name": "Fastworks", "pc": {"r": 160, "t": 145}},
                    {"name": "CoE Tools", "pc": {"r": 120, "t": 120}},
                    {"name": "Agile DHF", "pc": {"r": 230, "t": 120}}
                ]
            },
            {
                "quadrant": "Connectivity",
                "items": [
                    {"name": "HL7 PCD", "pc": {"r": 70, "t": 60}},
                    {"name": "Sapphire", "pc": {"r": 70, "t": 20}},
                    {"name": "DDS", "pc": {"r": 130, "t": 30}},
                    {"name": "TLS", "pc": {"r": 130, "t": 50}},
                    {"name": "Predix Net (UMF)", "pc": {"r": 140, "t": 70}},
                    {"name": "Predix Connect", "pc": {"r": 180, "t": 55}},
                    {"name": "WS for Devices", "pc": {"r": 250, "t": 70}},
                    {"name": "HL7 FHIR", "pc": {"r": 320, "t": 70}},
                    {"name": "MQTT", "pc": {"r": 350, "t": 40}},
                    {"name": "CoAP", "pc": {"r": 350, "t": 30}}
                ]
            },
            {
                "quadrant": "Applications",
                "items": [
                    {"name": "QT", "pc": {"r": 80, "t": 200}},
                    {"name": "Predix Core", "pc": {"r": 100, "t": 230}},
                    {"name": "Predix V", "pc": {"r": 120, "t": 250}},
                    {"name": "Predix Reader", "pc": {"r": 140, "t": 210}},
                    {"name": "iOS & Android", "pc": {"r": 220, "t": 230}},
                    {"name": "Hypervisor", "pc": {"r": 220, "t": 205}},
                    {"name": "Node.js", "pc": {"r": 350, "t": 200}}
                ]
            },
            {
                "quadrant": "Analytics",
                "items": [
                    {"name": "NoSQL", "pc": {"r": 230, "t": 345}},
                    {"name": "Predix Insight", "pc": {"r": 250, "t": 325}},
                    {"name": "PRODAPS", "pc": {"r": 260, "t": 300}},
                    {"name": "Rules Engines", "pc": {"r": 260, "t": 290}}
                ]
            }
        ]
    };

    //This is the title for your window tab, and your Radar
    var title = function () {
        return radar_data.title;
    };

    // Returns quadrant number of entry based on its theta, -1 if not found.
    var chooseQuad = function (pc) {

        if (pc.t < 0) return -1;

        if (pc.t <= 90) return 0;
        if (pc.t <= 180) return 1;
        if (pc.t <= 270) return 2;
        if (pc.t <= 360) return 3;

        return -1;
    };

    // Find index of entry in quadrant by name.
    var indexOf = function (quad, name) {
        for (var nentry = 0; nentry < quad.length; nentry++) {
            if (quad[nentry].name == name) return nentry;
        }
        return -1;
    };

    // Search each quadrant looking for an entry with the matching name.
    // Return the quadrant number (not the index in the quadrant).
    var findQuad = function (name) {
        for (var nquad = 0; nquad < radar_data.length; nquad++) {
            if (indexOf(radar_data.sectors[nquad].items, name) != -1) {
                return nquad;
            }
        }
        return -1;
    };

    // Search each quadrant looking for an entry with the matching name.
    // Return the quadrant number (not the index in the quadrant).
    var findById = function (eid) {
        for (var nquad = 0; nquad < radar_data.sectors.length; nquad++) {
            var items = radar_data.sectors[nquad].items;
            for (var nitem = 0; nitem < items.length; nitem++) {
                if (items[nitem].id == eid) return items[nitem];
            }
        }

        return null;
    };

    // Check the entry's theta to see if it is in the right quadrant, if not move it.
    var updateEntry = function (entry) {
        var stored = findQuad(entry.name);
        var expected = chooseQuad(entry.pc);

        // Bail if not found or is in the right quadrant.
        if (stored < 0) return;
        if (expected < 0) return;
        if (stored == expected) return;

        // Remove from current quadrant and add to destination quadrant.
        radar_data.sectors[stored].items.splice(indexOf(radar_data.sectors[stored].items, entry.name), 1);
        radar_data.sectors[expected].items.push(entry);
    };

    var nextId = 1;

    var addEntry = function (pt) {
        var pc = radar.utils.cartesian_to_polar({x: pt.x, y: pt.y});

        var nquad = chooseQuad(pc);
        radar_data[nquad].items.push({name: 'New Tech ' + (newTechCounter++), id: 'tech-' + (nextId++), pc: pc});
    };

    var deleteEntry = function (name) {
        var nquad = findQuad(name);
        if (nquad < 0) {
            console.log("Tried to delete '" + name + "', but not found in data.");
            return;
        }
        console.log('delete ' + name);
        radar_data.sectors[nquad].items.splice(indexOf(radar_data.sectors[nquad].items, name), 1);
    };

    var update = function (eid, field, value) {
        var entry;

        if (field == 'name') {
            entry = findById(eid);
            if (entry == null) return;

            entry[field] = value;

            radar.view.update(
                radar.utils.mkid('trkey-', entry.id),
                'text',
                radar.utils.name2abbr(entry.name));
        }
        else if (field == 'qtitle') {
            radar_data.sectors[idnum(eid)].quadrant = value;
        }
        else if (field == 'title') {

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

    return {
        title: title,
        get: get,
        setIds: setIds,
        set: set,
        update: update,
        updateEntry: updateEntry,
        addEntry: addEntry,
        deleteEntry: deleteEntry
    };
}();
