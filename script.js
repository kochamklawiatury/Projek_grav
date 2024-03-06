
const canvas = document.getElementById("root");
const svgNS = "http://www.w3.org/2000/svg" ;
const offset = (()=>{
    canvasRect = canvas.getBoundingClientRect();
    return {x:canvasRect.x, y:canvasRect.y};
})();

let circles = []
let gravity = 1
let stoppingThreshold = 0.015
let onGroundThreshold = 50
let mass = 1

function rzut(){
    height = parseInt(document.getElementById("heightInput").value)||1
    let r = 10
    let position = {x:r, y:canvas.clientHeight - r - height};
    let circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute( "cx", position.x);
    circle.setAttribute( "cy", position.y);
    circle.setAttribute( "r", r);
    circle.setAttribute( "fill", "blue");
    degrees = parseInt(document.getElementById("angleInput").value)||0
    mass = 1
    velocity = parseInt(document.getElementById("forceInput").value) * mass;
    let rad = Math.PI/180*degrees
    circle.vx = Math.cos(rad)*velocity;
    circle.vy = -Math.sin(rad)*velocity; 
    
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
    gravity = planetGravity * 100.0
}

function updateCircle() {

    if(lastUpdate == undefined){
        lastUpdate = new Date ();
        return;
    }
    let currentTime = new Date();
    let deltaTime  = (currentTime - lastUpdate)/1000;
    lastUpdate = currentTime
    
    let airResistance = parseFloat(document.getElementById("airResistanceInput").value) || 0
    let groundResistance = parseFloat(document.getElementById("groundResistanceInput").value) || 0
    let dumping = parseFloat(document.getElementById("DumpingInput").value) || 0
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
        currentX = parseFloat(circle.getAttribute("cx")) + circle.vx*(deltaTime);
        y = parseFloat(circle.getAttribute("cy"))
        //console.log("y ",y)
        currentY = parseFloat(circle.getAttribute("cy")) + circle.vy*(deltaTime);
        r = parseFloat(circle.getAttribute("r"))
         
        if(currentX +  r > canvas.clientWidth){
             currentX = 2*canvas.clientWidth - 2*r-(currentX);
             circle.vx = -circle.vx * dumping
        }

        if(currentY  + r >= canvas.clientHeight){
            currentY = 2*canvas.clientHeight  - 2*r-(currentY);
            circle.vy = -circle.vy * dumping
            if (Math.abs(circle.vy)<onGroundThreshold) {
                circle.vy = 0
                currentY = canvas.clientHeight - r
                circle.onGround = true
                circle.setAttribute( "fill", "red");
            }
        }

        if(currentX - r < 0){
            currentX = - (currentX - r) + r;
            circle.vx = -circle.vx * dumping
        }

        if(currentY - r <0){
            currentY = - (currentY - r) + r;
            circle.vy = -circle.vy * dumping
        }

        let velocityMagnitude = Math.sqrt( circle.vx*circle.vx + circle.vy*circle.vy);
        let h = canvas.clientHeight-currentY
        let Ep = mass * gravity * h 
        let Ek = mass * velocityMagnitude * velocityMagnitude / 2
        //console.log("h", h,"   velocity ", velocityMagnitude, '   energy(potential, kinetic, total): ', Ep, Ek, Ep+ Ek);
        if(velocityMagnitude > 0){
            
            //air resistance ////////////////////////////
            let dragForce = airResistance * velocityMagnitude * velocityMagnitude //wspolczynnik * vel^2
            let dragX = dragForce * circle.vx/velocityMagnitude;
            let dragY = dragForce * circle.vy/velocityMagnitude;
        
            let accX = dragX / mass;
            let accY = dragY / mass;
            //tutaj przez słabość symulacji i rzadkie klatki wartość v może przekroczyć 0 i wektor zmienić zwrot. Jeśli tak jest należy ustawić 0 na sztywno;
            //console.log(currentX, currentY)
            if(Math.abs(accX * deltaTime) > Math.abs(circle.vx)){
                circle.vx = 0;
            } else{   
                circle.vx = circle.vx - accX * deltaTime;
            }
            if(Math.abs(accY * deltaTime) > Math.abs(circle.vy)){
                circle.vy = 0;
            } else{   
                circle.vy = circle.vy - accY * deltaTime;
            }
            ///////////////////////////////////////////////
        
    
            if (circle.onGround == false) {
                circle.vy = circle.vy + deltaTime * gravity
            } else {
                //ground resistance //////////////////////////
                let velocityMagnitude = Math.sqrt( circle.vx*circle.vx + circle.vy*circle.vy);
                let frictionForce = groundResistance* mass * gravity //wspolczynnik * sila_nacisku
                let frictionX = frictionForce * circle.vx/velocityMagnitude
                let frictionAcceleration = frictionX / mass;
                //tutaj przez słabość symulacji i rzadkie klatki wartość v może przekroczyć 0 i wektor zmienić zwrot. Jeśli tak jest należy ustawić 0 na sztywno;
                if(Math.abs(frictionAcceleration*deltaTime) > Math.abs(circle.vx)){
                    circle.vx = 0;
                } else {
                    circle.vx = circle.vx -frictionAcceleration*deltaTime;
                }
                ////////////////////////////////////////////////


                if (Math.abs(circle.vx)<stoppingThreshold) {
                    circle.vx = 0
                }
            }

            circle.setAttribute("cx", currentX);
            circle.setAttribute("cy", currentY);
            //console.log(currentX, currentY,circle.vx, circle.vy)
        }
        
        
    }
}

setInterval(updateCircle, 0.1);