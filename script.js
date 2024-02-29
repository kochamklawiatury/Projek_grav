
const canvas = document.getElementById("root");
const svgNS = "http://www.w3.org/2000/svg" ;
const offset = (()=>{
    canvasRect = canvas.getBoundingClientRect();
    return {x:canvasRect.x, y:canvasRect.y};
})();

let circles = []
let gravity = 1


function rzut(){
    let r = 10
    let position = {x:r, y:canvas.clientHeight - r};
    let circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute( "cx", position.x);
    circle.setAttribute( "cy", position.y);
    circle.setAttribute( "r", r);
    circle.setAttribute( "fill", "black");
    degrees = parseInt(document.getElementById("angleInput").value)||0
    mass = 1
    velocity = parseInt(document.getElementById("forceInput").value) * mass;
    let rad = Math.PI/180*degrees
    circle.vx = Math.cos(rad)*velocity;
    circle.vy = Math.sin(rad)*velocity; 
    circle.onGround = false;
    circles.push(circle);
    canvas.appendChild(circle);
}

// canvas.onclick = event => {
//     let position = {x:event.x, y:event.y};
//     let circle = document.createElementNS(svgNS, "circle");
//     circle.setAttribute( "cx", position.x-offset.x);
//     circle.setAttribute( "cy", position.y-offset.y);
//     circle.setAttribute( "r", 10);
//     circle.setAttribute( "fill", "red");
//     circle.vx = (Math.random()-0.5)*200;
//     circle.vy = (Math.random()-0.5)*200;
//     circle.onGround = false
//     circles.push(circle);
//     canvas.appendChild(circle);
// }
let predkosc = 20
let lastUpdate;
function selectPlanet (planetGravity){
    gravity = planetGravity
}

function updateCircle() {

    if(lastUpdate == undefined){
        lastUpdate = new Date ();
        return;
    }
    let currentTime = new Date();
    let deltaTime  = currentTime - lastUpdate;
    lastUpdate = currentTime
    
    AirDumping = 0.0005
    dumping = parseFloat(document.getElementById("DumpingInput").value) || 0
    // for (ball of circles) {
    //     ball.fx = 0
    //     ball.fy = 0 
    // }

    // for (ball of circles) {
    //     for (other of circles){
    //         dx = other.x - currentX
    //         dy = other.y - currentY
    //         d2 = dx^2 + dy^2
    //         d = Math.sqrt(d2)
    //         F = G/d2
    //         Fx = F * (dx/d)
    //         Fy = F * (dy/d)
    //         ball.fx += Fx
    //         ball.fy += Fy 
    //     }
    // }
    
    // for (ball of circles){
    //         ax = ball.fx
    //         vx = ax * deltaTime
            
    // }

    for(let circle of circles){
        currentX = parseFloat(circle.getAttribute("cx")) + circle.vx*(deltaTime/1000);
        currentY = parseFloat(circle.getAttribute("cy")) + circle.vy*(deltaTime/1000);
        r = parseFloat(circle.getAttribute("r"))
         
        if(currentX +  r > canvas.clientWidth){
             currentX = 2*canvas.clientWidth - 2*r-(currentX);
             circle.vx = -circle.vx * dumping
        }

        if(currentY  + r >= canvas.clientHeight){
            currentY = 2*canvas.clientHeight  - 2*r-(currentY);
            circle.vy = -circle.vy * dumping
            if (Math.abs(circle.vy)<10) {
                circle.vy = 0
                currentY = canvas.clientHeight - r
                circle.onGround = true
            }
        }

        if(currentX - r < 0){
            currentX = - (currentX - r) + r;
            circle.vx = -circle.vx
        }

        if(currentY - r <0){
            currentY = - (currentY - r) + r;
            circle.vy = -circle.vy
        }

  
        if (circle.onGround == false) {
            circle.vy = circle.vy + deltaTime * gravity * 0.3
            circle.vx = circle.vx * (1 - AirDumping)
        } else {
            circle.vx = circle.vx * (1 - gravity*0.005)
            if (Math.abs(circle.vx)<0.015) {
                circle.vx = 0
            }
        }
        
        //circle.vx = circle.vx + deltaTime * gravity + circle.fy

        circle.setAttribute("cx", currentX);
        circle.setAttribute("cy", currentY);
        //console.log(circle.vx, circle.vy)
    }
}

setInterval(updateCircle, 1);