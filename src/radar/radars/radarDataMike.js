//This is the title for your window tab, and your Radar
document.title = "Mike's Technology Radar";


//This is the concentic circles that want on your radar
var radar_arcs = [
                   {'r':100,'name':'Adopt'}
                  ,{'r':200,'name':'Trial'}
                  ,{'r':300,'name':'Assess'}
                  ,{'r':400,'name':'Hold'}
                 // ,{'r':500,'name':'Possible Extra if you want it'}
                 ];

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
// Coarse-grained quadrants
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

var h = 1160;
var w = 1200;

var radar_data = [
    { "quadrant": "Techniques",
        "left" : 45,
        "top" : 18,
        "color" : "#8FA227",
        "items" : [ 
            {"name":"Automated V&V tests", "pc":{"r":180,"t":155},"movement":"c"},
            {"name":"Continuous integration", "pc":{"r":180,"t":100},"movement":"c"},
            {"name":"Visualisation and metrics", "pc":{"r":80,"t":150},"movement":"c"},
            {"name":"Web as platform", "pc":{"r":80,"t":110},"movement":"c"},
            {"name":"Behavior Driven Development", "pc":{"r":120,"t":110},"movement":"c"}
        ]
    },
    { "quadrant": "Tools",
        "left": w-200+30,
        "top" : 18,
        "color" : "#587486",
        "items" : [ 
            {"name":"Cross mobile platforms", "pc":{"r":280,"t":85},"movement":"c"},
            {"name":"Web IDE", "pc":{"r":280,"t":70},"movement":"c"},
            {"name":"NoSQL", "pc":{"r":180,"t":65},"movement":"c"},
            {"name":"mongoDB", "pc":{"r":130,"t":55},"movement":"c"},
            {"name":"Git", "pc":{"r":130,"t":15},"movement":"c"},
            {"name":"Subversion", "pc":{"r":30,"t":30},"movement":"c"},
            {"name":"IPython", "pc":{"r":120,"t":30},"movement":"c"},
            {"name":"Julia", "pc":{"r":120,"t":30},"movement":"c"},
            {"name":"slid.es", "pc":{"r":320,"t":30},"movement":"c"}
        ]
    },
    { "quadrant": "Platforms & Components",
        "left" :45,
         "top" : (h/2 + 18),
        "color" : "#DC6F1D",
        "items" : [
            {"name":"Single Page Web Applications", "pc":{"r":290,"t":265},"movement":"c"},
            {"name":"Node.js", "pc":{"r":290,"t":255},"movement":"c"},
            {"name":"App containers", "pc":{"r":250,"t":260},"movement":"c"},
            {"name":"Predix Apps (OSGi, Play)", "pc":{"r":80,"t":260},"movement":"c"},
            {"name":"iOS", "pc":{"r":130,"t":220},"movement":"c"},
            {"name":"Android", "pc":{"r":90,"t":190},"movement":"c"},
            {"name":"TLS", "pc":{"r":110,"t":220},"movement":"c"},
            {"name":"CoAP", "pc":{"r":210,"t":200},"movement":"c"},
            {"name":"DDS", "pc":{"r":110,"t":200},"movement":"c"},
            {"name":"STOMP", "pc":{"r":310,"t":200},"movement":"c"},
            {"name":"MQTT", "pc":{"r":350,"t":200},"movement":"c"}
        ]
    },
    { "quadrant": "Languages & Frameworks",
        "color" : "#B70062",
        "left"  : (w-200+30),
        "top" :   (h/2 + 18),
        "items" : [
            {"name":"Scala", "pc":{"r":290,"t":320},"movement":"c"},
            {"name":"HTML 5", "pc":{"r":250,"t":275},"movement":"c"},
            {"name":"DSLs", "pc":{"r":180,"t":340},"movement":"c"},
            {"name":"Lua", "pc":{"r":190,"t":330},"movement":"c"},
            {"name":"Groovy", "pc":{"r":190,"t":350},"movement":"c"},
            {"name":"C#", "pc":{"r":90,"t":355},"movement":"c"},
            {"name":"Javascript", "pc":{"r":90,"t":275},"movement":"c"},
            {"name":"D3.js", "pc":{"r":260,"t":310},"movement":"c"},
            {"name":"Angular.js", "pc":{"r":260,"t":310},"movement":"c"}
        ]
    }
];
