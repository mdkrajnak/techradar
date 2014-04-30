//This is the title for your window tab, and your Radar
document.title = "ARC Technology Radar";


//This is the concentic circles that want on your radar
var radar_arcs = [
                   {'r':100,'name':'Adopt'},
                   {'r':200,'name':'Trial'},
                   {'r':300,'name':'Assess'},
                   {'r':400,'name':'Hold'}
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

var h = 1160;
var w = 1200;

// Valid t coordinate values by quaderant:
//   Techniques:     90-180
//   Platforms:     180-270
//   Tools:           0- 90
//   Languages:     270-360

var radar_data = [
    { "quadrant": "Techniques",
        "left" : 45,
        "top" : 18,
        "color" : "#8FA227",
        "items" : [
            {"name":"Agile Metrics", "pc":{"r":70,"t":135},"movement":"c", "blipSize":140},
            {"name":"Continuous Integration", "pc":{"r":110,"t":120},"movement":"c"},
            {"name":"Automated V&V Tests", "pc":{"r":140,"t":110},"movement":"c", "blipSize":140},
            {"name":"Fastworks", "pc":{"r":160,"t":150},"movement":"c", "blipSize":140},
            {"name":"Behavior Driven Development", "pc":{"r":210,"t":140},"movement":"c"}
        ]
    },
    { "quadrant": "Tools",
        "left": w-200+30,
        "top" : 18,
        "color" : "#587486",
        "items" : [
            {"name":"Git", "pc":{"r":130,"t":15},"movement":"c", "blipSize":140},
            {"name":"Perforce", "pc":{"r":130,"t":30},"movement":"c", "blipSize":140},
            {"name":"Typesafe Activator", "pc":{"r":150,"t":40},"movement":"c"},
            {"name":"NoSQL", "pc":{"r":170,"t":60},"movement":"c"},
            {"name":"MongoDB", "pc":{"r":170,"t":80},"movement":"c"},
            {"name":"Cross Mobile Platforms", "pc":{"r":280,"t":70},"movement":"c"},
            {"name":"Web IDE", "pc":{"r":280,"t":40},"movement":"c"},
            {"name":"IPython", "pc":{"r":310,"t":40},"movement":"c"}
        ]
    },
    { "quadrant": "Platforms & Components",
        "left" :45,
         "top" : (h/2 + 18),
        "color" : "#DC6F1D",
        "items" : [
            {"name":"QT", "pc":{"r":100,"t":190},"movement":"c"},
            {"name":"Predix Apps (OSGi, Play)", "pc":{"r":110,"t":225},"movement":"c", "blipSize":140},
            {"name":"Predix Net (TLS, DDS)", "pc":{"r":110,"t":245},"movement":"c", "blipSize":140},
            {"name":"Linux", "pc":{"r":130,"t":200},"movement":"c"},
            {"name":"Single Page Web Applications", "pc":{"r":140,"t":255},"movement":"c"},
            {"name":"iOS", "pc":{"r":210,"t":230},"movement":"c"},
            {"name":"Android", "pc":{"r":210,"t":240},"movement":"c"},
            {"name":"Software Defined Machines", "pc":{"r":230,"t":205},"movement":"c"},
            {"name":"Node.js", "pc":{"r":310,"t":235},"movement":"c"},
            {"name":"IoT Protocols (CoAP, MQTT)", "pc":{"r":350,"t":200},"movement":"c"}
        ]
    },
    { "quadrant": "Languages & Frameworks",
        "color" : "#B70062",
        "left"  : (w-200+30),
        "top" :   (h/2 + 18),
        "items" : [
            {"name":"HTML 5", "pc":{"r":110,"t":300},"movement":"c"},
            {"name":"Java Script", "pc":{"r":110,"t":315},"movement":"c"},
            {"name":"Lua", "pc":{"r":190,"t":320},"movement":"c"},
            {"name":"Groovy", "pc":{"r":190,"t":340},"movement":"c"},
            {"name":"C#", "pc":{"r":250,"t":345},"movement":"c"},
            {"name":"D3.js", "pc":{"r":260,"t":300},"movement":"c"},
            {"name":"Angular.js", "pc":{"r":260,"t":290},"movement":"c"},
            {"name":"Scala", "pc":{"r":290,"t":310},"movement":"c"}
        ]
    }
];
