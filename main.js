// Width and height of map
let window_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
window.addEventListener('resize', () => {
  window_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}, true);
// let width = (window_width >= 1000) ? 375 : 300;
// let height = (window_width >= 1000) ? 625 : 500;
let width = 300;
let height = 500;
let radius = 15;

// D3 Projection
let projection = d3.geoAlbers()
  .center([100.0, 13.5])
  .rotate([0, 24])
  .parallels([5, 21])
  .scale(1200 * 2)
  .translate([-100, 200]);

// Define linear scale for output
let color = d3.scaleLinear().clamp(true)
  .domain([0, 1])
  .range(["#e4e5e6", "#14E6C8"]);

//Create and append canvas
let canvas = d3.select("#result").append("canvas")
  .attr("id", "map")
  .attr("width", width)
  .attr("height", height);
let ctx = document.getElementById("map").getContext("2d");
ctx.imageSmoothingEnabled = false;

// //For downloading canvas from https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
// function download_canvas(el) {
//   let url = document.getElementById("map").toDataURL("image/png");

//   url = url.replace("image/png", "image/octet-stream");
//   // url = url.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
//   // url = url.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');

//   el.href = url;
// };

// Append div for tooltip
let status = d3.select("#result").append("div")
  .attr("class", "tooltip status")
  .style("opacity", 1);
let tooltip = d3.select("#result").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// adapted from d3 hexbin
let hex = function ([x0, y0], radius, xscale) {
  const thirdPi = Math.PI / 6;
  const angles = [thirdPi, thirdPi * 3, thirdPi * 5, thirdPi * 7, thirdPi * 9, thirdPi * 11];

  let corners = angles.map(function (angle) {
    let x1 = Math.cos(angle) * radius * xscale;
    let y1 = Math.sin(angle) * radius;
    return [x0 + x1, y0 + y1];
  });
  return corners;
}
const thaiHexMap = [
  { id: 57, y: 0, x: 2 },

  { id: 50, y: 1, x: 0 },
  { id: 52, y: 1, x: 1 },
  { id: 56, y: 1, x: 2 },

  { id: 58, y: 2, x: 0 },
  { id: 51, y: 2, x: 1 },
  { id: 53, y: 2, x: 2 },
  { id: 55, y: 2, x: 3 },

  { id: 54, y: 3, x: 0 },
  { id: 64, y: 3, x: 1 },
  { id: 65, y: 3, x: 2 },
  { id: 67, y: 3, x: 3 },
  { id: 43, y: 3, x: 5 },
  { id: 38, y: 3, x: 6 },
  { id: 48, y: 3, x: 7 },

  { id: 63, y: 4, x: 1 },
  { id: 62, y: 4, x: 2 },
  { id: 66, y: 4, x: 3 },
  { id: 42, y: 4, x: 4 },
  { id: 39, y: 4, x: 5 },
  { id: 41, y: 4, x: 6 },
  { id: 47, y: 4, x: 7 },
  { id: 49, y: 4, x: 8 },

  { id: 61, y: 5, x: 1 },
  { id: 18, y: 5, x: 2 },
  { id: 60, y: 5, x: 3 },
  { id: 36, y: 5, x: 4 },
  { id: 40, y: 5, x: 5 },
  { id: 46, y: 5, x: 6 },
  { id: 35, y: 5, x: 7 },

  { id: 71, y: 6, x: 1 },
  { id: 15, y: 6, x: 2 },
  { id: 17, y: 6, x: 3 },
  { id: 16, y: 6, x: 4 },
  { id: 30, y: 6, x: 5 },
  { id: 44, y: 6, x: 6 },
  { id: 45, y: 6, x: 7 },
  { id: 37, y: 6, x: 8 },

  { id: 72, y: 7, x: 1 },
  { id: 14, y: 7, x: 2 },
  { id: 13, y: 7, x: 3 },
  { id: 19, y: 7, x: 4 },
  { id: 31, y: 7, x: 5 },
  { id: 32, y: 7, x: 6 },
  { id: 33, y: 7, x: 7 },
  { id: 34, y: 7, x: 8 },

  { id: 70, y: 8, x: 1 },
  { id: 12, y: 8, x: 2 },
  { id: 10, y: 8, x: 3 },
  { id: 26, y: 8, x: 4 },
  { id: 25, y: 8, x: 5 },

  { id: 73, y: 9, x: 1 },
  { id: 74, y: 9, x: 2 },
  { id: 11, y: 9, x: 3 },
  { id: 24, y: 9, x: 4 },
  { id: 27, y: 9, x: 5 },

  { id: 76, y: 10, x: 1 },
  { id: 75, y: 10, x: 2 },
  { id: 20, y: 10, x: 4 },
  { id: 21, y: 10, x: 5 },
  { id: 22, y: 10, x: 6 },

  { id: 77, y: 11, x: 1 },
  { id: 23, y: 11, x: 6 },

  { id: 86, y: 12, x: 1 },

  { id: 85, y: 13, x: 0 },

  { id: 84, y: 14, x: 1 },

  { id: 82, y: 15, x: 0 },
  { id: 80, y: 15, x: 1 },

  { id: 83, y: 16, x: 0 },
  { id: 81, y: 16, x: 1 },

  { id: 92, y: 17, x: 1 },
  { id: 93, y: 17, x: 2 },

  { id: 91, y: 18, x: 2 },
  { id: 90, y: 18, x: 3 },
  { id: 94, y: 18, x: 4 },

  { id: 95, y: 19, x: 3 },
  { id: 96, y: 19, x: 4 },
];

let geo;
const frame_count_max = 20;
let frame_count = 0;
const fps_interval = 1000/60;
let now, then, elapsed;
let updateMap = function () {
  now = Date.now();
  elapsed = now - then;

  if (elapsed > fps_interval) {
    then = now - (elapsed % fps_interval);

    ctx.clearRect(0, 0, width, height);
    let toAnimate = false;

    let hexCoords = [];
    for (let i = 0; i < geo.length; i++) {
      let ratio = (geo[i].properties.firsttime * firsttime_turnout / 100) / (geo[i].properties.number1 - geo[i].properties.number2);
      let flip_condition = (ratio >= 1 && !hexCenters[i].flipped) || (!(ratio >= 1) && hexCenters[i].flipped); //ratio > 1 - small_num && ratio < 1 + small_num;
      if (flip_condition) {
        toAnimate = true;
      }

      hexCoords.push(hex([hexCenters[i].cx, hexCenters[i].cy], radius, Math.min(1, flip_condition ? parabola(frame_count, [0, frame_count_max], [0, 1]) : 1)));
      drawCoords(hexCoords[i]);

      // fill
      ctx.fillStyle = color(ratio >= 1); //d.properties.visited ? color(d.properties.visited) : color.range()[0];
      ctx.fill();
    }
    for (let i = 0; i < geo.length; i++) {
      let ratio = (geo[i].properties.firsttime * firsttime_turnout / 100) / (geo[i].properties.number1 - geo[i].properties.number2);
      drawCoords(hexCoords[i]);

      // stroke
      if (ratio >= 1) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.stroke();
      }
    }

    if (toAnimate || frame_count > 0) {
      if (frame_count <= frame_count_max) {
        frame_count++;
        requestAnimationFrame(updateMap);
      } else {
        toAnimate = false;
        frame_count = 0;

        for (let i = 0; i < geo.length; i++) {
          let ratio = (geo[i].properties.firsttime * firsttime_turnout / 100) / (geo[i].properties.number1 - geo[i].properties.number2);
          let flip_condition = (ratio >= 1 && !hexCenters[i].flipped) || (!(ratio >= 1) && hexCenters[i].flipped); //ratio > 1 - small_num && ratio < 1 + small_num;
          if (flip_condition) {
            hexCenters[i].flipped = !hexCenters[i].flipped;
          }
        }
      }
    }
  } else {
    requestAnimationFrame(updateMap);
  }

  let affected_provinces = hexCenters.filter(h => h.flipped);
  status.html(`เปลี่ยนแปลงใน ${affected_provinces.length} จังหวัด<br />คิดเป็น ส.ส. ${affected_provinces.reduce((a, p) => a + p.mpnumber, 0)} คน`);
}

let hexCenters = [];
d3.csv("data/votes_by_province.csv").then(function(data) {
  // Load GeoJSON data and merge with states data
  d3.json("data/thailand-topo.json").then(function(json) {
    geo = topojson.feature(json, json.objects.thailand).features;

    // Loop through each province in the .csv file
    data.forEach(function(d) {
      for (let i = 0; i < geo.length; i++) {
        if (d.province === geo[i].properties.NL_NAME_1) {
          geo[i].properties.number1 = d.number1;
          geo[i].properties.number2 = d.number2;
          geo[i].properties.firsttime = d.firsttime;
          geo[i].properties.mpnumber = d.mpnumber;
          break;
        }
      }
    });

    for (let i = 0; i < geo.length; i++) {
      let hexCenter = thaiHexMap.find(h => h.id === +geo[i].properties.ISO);
      let c = [(hexCenter.x - ((hexCenter.y % 2 === 0) ? 0.5 : 0)) * radius * Math.sqrt(3) + 50, hexCenter.y * radius * 3 / 2 + (radius * 2)];

      hexCenters.push({
        id: hexCenter.id,
        cx: c[0],
        cy: c[1],
        name: geo[i].properties.NAME_1,
        name_th: geo[i].properties.NL_NAME_1,
        flipped: false,
        mpnumber: +geo[i].properties.mpnumber
      });
    }

    let red;
    let closest_hex;
    canvas.on("mousemove", function() {
      let mouseX = (d3.event.layerX || d3.event.offsetX) * ((window_width >= 1000) ? 0.8 : 1);
      let mouseY = (d3.event.layerY || d3.event.offsety) * ((window_width >= 1000) ? 0.8 : 1);

      // tooltip off first
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);

      red = ctx.getImageData(mouseX, mouseY, 1, 1).data[0]; // check red color
      if (red > 0) { // map area
        let closest_dist = Number.MAX_SAFE_INTEGER;
        hexCenters.forEach(hex => {
          let dist = Math.abs((hex.cx - mouseX) * (hex.cx - mouseX) + (hex.cy - mouseY) * (hex.cy - mouseY));
          if (dist < closest_dist) {
            closest_dist = dist;
            closest_hex = hex;
          }
        });

        for (let i = 0; i < geo.length; i++) {
          if (closest_hex.name_th === geo[i].properties.NL_NAME_1) {
            closest_hex.diff = geo[i].properties.number1 - geo[i].properties.number2;
            closest_hex.firsttime = +geo[i].properties.firsttime;
            break;
          }
        }

        // tooltip on in the map
        tooltip.transition()
          .duration(100)
          .style("opacity", 0.8);
        tooltip.html(`<b>${closest_hex.name_th}</b> (ส.ส. ${closest_hex.mpnumber} คน)<br />จำนวนคนรุ่นใหม่: <b>${closest_hex.firsttime.toLocaleString()}</b><br />ความต่างคะแนน: <b>${closest_hex.diff.toLocaleString()}</b>`);
      }
    });

    then = Date.now();
    updateMap();
  });
});

let firsttime_turnout = 0;
let range_number = d3.select(".range-number");
function sliderUpdate(value) {
  range_number
    .style("left", (((window_width >= 1000) ? 375 : 300) -40-40)*value/100)
    .text(value);

  firsttime_turnout = value;

  then = Date.now();
  updateMap();
}

function drawCoords(coords) {
  ctx.beginPath();
  for (let i = 0; i < coords.length; i++) {
    if (i === 0) {
      ctx.moveTo(coords[i][0], coords[i][1]);
    } else {
      ctx.lineTo(coords[i][0], coords[i][1]);
    }
  }
  ctx.closePath();
}

function parabola(x, [x_min, x_max], [y_min, y_max]) {
  let x_mid = (x_min + x_max) / 2;
  return (x - x_mid)*(x - x_mid)/x_mid/x_mid*y_max + y_min;
}

// Animation
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 0, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
});
document.addEventListener('aos:in:1-percent', e => {
  console.log(1);
  console.log(e.detail);
});
document.addEventListener('aos:in:25-percent', e => {
  console.log(25);
  console.log(e.detail);
});
document.addEventListener('aos:in:50-percent', e => {
  console.log(50);
  console.log(e.detail);
});
document.addEventListener('aos:in:100-percent', e => {
  console.log(100);
  console.log(e.detail);
});

document.addEventListener('aos:out', e => {
});
