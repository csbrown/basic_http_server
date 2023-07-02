const parser = new DOMParser();

const play_icon = `<img class="vidplay" src="static/play.png">`;
const img_template = `<img class="pic" src={{source}} width=0>`;
const vid_template = `<div class="vidcontainer"><video src={{source}} width=0></video>` + play_icon + `</div>`;
const imlink_template = `<a href={{source}} target="_blank">
` + img_template + `</a>
`;
const vidlink_template = `<a href={{source}} target="_blank">
` + vid_template + `</a>
`;
const img_cell_template = `<div class="img-cell">
` + imlink_template + `</div>
`;
const vid_cell_template = `<div class="img-cell">
` + vidlink_template + `</div>
`;

function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

function linmap(x1,y1,x2,y2) {
    var m = (y2-y1)/(x2-x1); 
    var b = y1 - m*x1; 
    return function(x) { return m*x + b; }
}

var MAXB = 30.001;
var MINB = 0.001;

function base_bounce(x) {
    return -Math.sin(x)/(x * Math.pow(1.07,x)) + 1
}

function* bounce(start, end, n) {
    var diff = end-start;
    var speed = linmap(1, MINB, n, MAXB);
    for (const i of range(1,n)) {
        var x = speed(i);
        yield start + base_bounce(x) * diff;
    }
}

function imgpop(img_el, start, end, sizetype, time, n=50) {
    var bouncer = bounce(start, end, n);
    function sizer() {
        var newsize = bouncer.next();
        if (!newsize.done) {
            var x = newsize.value;
            img_el.style.width = x.toString() + sizetype;
            setTimeout(sizer, time/n);
        } else {
            img_el.style.width = end.toString() + sizetype;
        }
    }
    sizer();
}

function delayed_imgpop(img_el, start, end, sizetype, time, n=50) {
    if (!img_el.complete) {
        setTimeout(() => delayed_imgpop(img_el, start, end, sizetype, time, n=n), 100);
    } else {
        imgpop(img_el, start, end, sizetype, time, n=n);
    }
}
function delayed_vidpop(img_el, start, end, sizetype, time, n=50) {
    if (img_el.readyState >= 3) {
        console.log("poppin");
        imgpop(img_el, start, end, sizetype, time, n=n);
    } else {
        setTimeout(() => delayed_vidpop(img_el, start, end, sizetype, time, n=n), 100);
    }
}

const FINAL_SIZE = 9; //TODO: pass this in somehow sane
const START_SIZE = 0.5;
const SIZE_TYPE = "vw";
const TIME = 3000;
function imgpop_in(src, parent_el) {
    var image = Mustache.render(img_cell_template, {source: src});
    var latest_img_cell = parser.parseFromString(image, "text/html").querySelector("div");
    parent_el.appendChild(latest_img_cell);
    var latest_img = latest_img_cell.querySelector("img");
    delayed_imgpop(latest_img, START_SIZE, FINAL_SIZE, SIZE_TYPE, TIME);
}
function vidpop_in(src, parent_el) {
    var vid = Mustache.render(vid_cell_template, {source: src});
    var latest_vid_cell = parser.parseFromString(vid, "text/html").querySelector("div");
    parent_el.appendChild(latest_vid_cell);
    var latest_vid = latest_vid_cell.querySelector("video");
    console.log(latest_vid);
    delayed_vidpop(latest_vid, START_SIZE, FINAL_SIZE, SIZE_TYPE, TIME);
}

function load_imgs_from_src(source_array, parent_el) {
    var rownode = document.createElement("div");
    for (const src of source_array) {
        if (src.endsWith("mp4"))
            vidpop_in(src, rownode);
        else
            imgpop_in(src, rownode);
    }
    parent_el.appendChild(rownode);
}

