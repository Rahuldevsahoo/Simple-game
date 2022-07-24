
const canvas = document.querySelector('Canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext('2d');

const scoreEl = document.querySelector('#scoreEl')
const startGame = document.querySelector('#startGame')
const modalG = document.querySelector('#modalG')
const bigScoreEl = document.querySelector('#bigScoreEl')


class Player{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        // this.position.x = x
        // this.position.y = y
        this.velocity = {
            x: 0,
            y: 0
        }
    }
     draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        
           
    }
     update(){
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
     }
    

}

class Projectile{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
     }

     update(){
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

     }

}


class Enemy{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
     }

     update(){
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

     }

}

const friction = 0.99;
class Particle{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw(){
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
     }

     update(){
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;

     }

}

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, 'white');
//player.draw();

//const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {x: 1, y: 1});
//const projectile2 = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'green', {x: -1, y: -1});

let projectiles = [];
let enemies = [];
let particles = [];

function init(){
    player = new Player(x, y, 10, 'white');
    //player.draw();
    
    //const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {x: 1, y: 1});
    //const projectile2 = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'green', {x: -1, y: -1});
    
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
     
}

function spwanEnemies(){
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4;
        let x;
        let y;
        if(Math.random() < 0.5){
           x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
           y = Math.random() * canvas.height; 
         
        }
        else{
           x = Math.random() * canvas.width;
           y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        // const velocity = {
        //     x: 1,
        //     y: 1
        // }

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        const velocity = {
        x: 2 * Math.cos(angle), 
        y: 2 * Math.sin(angle)
        }
        
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000)
}
let animationid;
let score = 0;
function animate(){
    animationid = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    //player.draw();
    player.update();

    if(keys.a.pressed && player.x - 4 > 0){
        player.velocity.x = -4
    }
    else if(keys.d.pressed && player.x + player.radius + 4 < canvas.width){
        player.velocity.x = 4  
    }
    else if(keys.w.pressed && player.y - 4 > 0){
        player.velocity.y = -4
    }
    else if(keys.s.pressed && player.y + 4 < canvas.height){
        player.velocity.y = 4
    }
    else{
        player.velocity.x = 0
        player.velocity.y = 0
    }
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0 ){
            particles.splice(index, 1)
        }
        else{
            particle.update()
        }
        
    });
    projectiles.forEach((projectile, index) => {
        projectile.update();
        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height){
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0)
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        //END GAME
        if(dist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationid);
            modalG.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            //when projectiles touch enemy

            if(dist - enemy.radius - projectile.radius < 1){
                

            
                for(let i=0; i < enemy.radius * 2; i++){
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 8), y: (Math.random() - 0.5) * (Math.random() * 8)}))
                }
                 
                if(enemy.radius - 10 > 5){
                    //.radius -= 10;
                    score += 100;
                    scoreEl.innerHTML = score;

                    gsap.to(enemy, {
                        radius: enemy.radius  - 10
                    })
                    setTimeout(() =>{
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                }
                else{
                    score += 250;
                    scoreEl.innerHTML = score;
                    setTimeout(() =>{
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                }
                
                
            }
        })
    })
    // projectile.draw();
    // projectile.update();
}
const color = `hsl(${Math.random() * 360}, 80%, 80%)`;

addEventListener('click', (event) =>
 {
    const angle = Math.atan2(event.clientY - player.y , event.clientX  - player.x)
    const velocity = {
        x: Math.cos(angle) * 5, 
        y: Math.sin(angle) * 5
    }

    projectiles.push(new Projectile(player.x, player.y, 5, color, velocity))
   
    // projectile.draw();
    // projectile.update();
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    }
}
addEventListener('keydown', ({key}) => {
    switch(key){
        case 'a':
            player.velocity.x = -5
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case 'w':
            keys.w.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        
    }
})

addEventListener('keyup', ({key}) => {
    switch(key){
        case 'a':
            //player.velocity.x = -5
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        
    }
})

startGame.addEventListener('click', () => 
{
    init()
    animate()
    spwanEnemies()
    modalG.style.display = 'none'
})