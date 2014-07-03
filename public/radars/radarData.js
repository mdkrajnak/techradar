// radar data module
/* global radar */

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

radar.data = (function() {
    
    //This is the title for your window tab, and your Radar
    var title = "WWTP Technology Radar";

    //This is the concentic circles that want on your radar (currently not used).
    var radar_arcs = [
                       {'r':100,'name':'Adopt'},
                       {'r':200,'name':'Trial'},
                       {'r':300,'name':'Assess'},
                       {'r':400,'name':'Hold'}
                     // ,{'r':500,'name':'Possible Extra if you want it'}
                     ];

    var radar_data = [
        { "quadrant": "Techniques",
            "items" : [
                {"name":"Scaled Agile Framework", "pc":{"r":70,"t":135}},
                {"name":"Fastworks", "pc":{"r":160,"t":145}},
                {"name":"CoE Tools", "pc":{"r":120,"t":120}},
                {"name":"Agile DHF", "pc":{"r":230,"t":120}},
                {"name":"BDD", "pc":{"r":230,"t":150}},
            ]
        },
        { "quadrant": "Connectivity",
            "items" : [
                {"name":"HL7 PCD", "pc":{"r":70,"t":60}},
                {"name":"Sapphire", "pc":{"r":70,"t":20}},
                {"name":"DDS", "pc":{"r":130,"t":30}},
                {"name":"TLS", "pc":{"r":130,"t":50}},
                {"name":"Predix Net (UMF)", "pc":{"r":140,"t":70}},
                {"name":"Predix Connect", "pc":{"r":180,"t":55}},
                {"name":"WS for Devices", "pc":{"r":250,"t":70}},
                {"name":"HL7 FHIR", "pc":{"r":320,"t":70}},
                {"name":"MQTT", "pc":{"r":350,"t":40}},
                {"name":"CoAP", "pc":{"r":350,"t":30}}
            ]
        },
        { "quadrant": "Applications",
            "items" : [
                {"name":"QT", "pc":{"r":80,"t":200}},
                {"name":"Predix Core", "pc":{"r":100,"t":230}},
                {"name":"Predix V", "pc":{"r":120,"t":250}},
                {"name":"Predix Reader", "pc":{"r":140,"t":210}},
                {"name":"iOS & Android", "pc":{"r":220,"t":230}},
                {"name":"Hypervisor", "pc":{"r":220,"t":205}},
                {"name":"Node.js", "pc":{"r":350,"t":200}}
            ]
        },
        { "quadrant": "Analytics",
            "items" : [
                {"name":"NoSQL", "pc":{"r":230,"t":345}},
                {"name":"Predix Insight", "pc":{"r":250,"t":325}},
                {"name":"PRODAPS", "pc":{"r":260,"t":300}},
                {"name":"Rules Engines", "pc":{"r":260,"t":290}}
            ]
        }
    ];

    var update = function(data) {
        radar_data = data;
    };
    
    var get = function () {
        return radar_data;
    };
    
    return { title: title, get: get, update: update };
}());
