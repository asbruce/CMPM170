title = "PHILOSOPHY BOX";

description = `trolley problem:the game`;

characters = [
	`
YYYYYY
YyYyYy
rrrrrr
 l  l

	`,
	`
	  cc
	 cccc
	  cc  
	 c c  
	 c c  


	`,
	` cc
	 rrc
	rryycc
	 yyyy
	r yyc
	ry y
	 y y

   
	`,
	`
	llllll

	llllll
	`
];

const G = {
	WIDTH: 149,
	HEIGHT: 100,
	ENEMY_SPEED: 1
};

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	theme: "dark",
	isReplayEnabled: true
};


/**
 * @typedef {{
 * pos: Vector
 * }} Player
 */

/**
 * @type { Player }
 */
let player;


/**
 * @typedef {{
* pos: Vector
* }} Enemy
*/

/**
 * @type { Enemy [] }
 */
let track1;
let track2;
let enemies;
let obstacles;
let hasClicked = false;



function update() {
	if (!ticks) {
		hasClicked = false;
		player = {
			pos: vec(G.WIDTH * 0.33, G.HEIGHT * 0.66),
		};

		track1 = [];
		track2 = [];
		enemies = [];
		obstacles = [];
	}
	
	if (track1.length === 0) {
		for (let i = 0; i < 25; i++) {
			const posX = 6*i;
			const posY = G.HEIGHT*0.66+1;
			track1.push({
				pos: vec(posX, posY),
			 })
		}
	}

	if (track2.length === 0) {
		for (let i = 0; i < 25; i++) {
			const posX = 6*i;
			const posY = G.HEIGHT*0.74+1;
			track2.push({
				pos: vec(posX, posY),
			 })
		}
	}

	if (enemies.length === 0) {
		for (let i = 0; i < 2; i++) {
			const posX = G.WIDTH + 6*rnd(0,24);
			const posY = G.HEIGHT*(0.66+(i*0.08));
			enemies.push({
				pos: vec(posX, posY),
			 })
		}
	}
	if (obstacles.length === 0) {
		for (let i = 0; i < 1; i++) {
			const posX = G.WIDTH + 6*rnd(0,24);
			const posY = G.HEIGHT*(0.66+(i*0.08));
			obstacles.push({
				pos: vec(posX, posY),
			 })
		}
	}
	

	if (input.isJustPressed) {
		switch(player.pos.y){
			case G.HEIGHT * 0.66:
				player.pos.y = G.HEIGHT * 0.74;
				if(!hasClicked){
					hasClicked = true;
				}
				break;
			case G.HEIGHT * 0.74:
				player.pos.y = G.HEIGHT * 0.66;
				break;
			default:
				player.pos.y = G.HEIGHT * 0.66;
				break;
		}
		
	}

	remove(track1, (e) => {
		e.pos.x -= G.ENEMY_SPEED;
		if(e.pos.x<0){
			e.pos.x = G.WIDTH;
		}
		color("black");

		char("d", e.pos);
		return (e.pos.x < 0);
	});

	remove(track2, (e) => {
		e.pos.x -= G.ENEMY_SPEED;
		if(e.pos.x<0){
			e.pos.x = G.WIDTH;
		}
		color("black");

		char("d", e.pos);
		return (e.pos.x < 0);
	});
	char("a", player.pos);
	remove(enemies, (e) => {
		e.pos.x -= G.ENEMY_SPEED;
		if(e.pos.x<0){
			addScore(1, player.pos);
			play("coin");
			e.pos.x = G.WIDTH + 6*rnd(0,24);
		}
		color("black");

		const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;

		if (isCollidingWithPlayer){
		play('hit');
		color("light_red");
        // Generate particles
        particle(
            e.pos.x, // x coordinate
            e.pos.y, // y coordinate
            10, // The number of particles
            1, // The speed of the particles
            PI, // The emitting angle
            PI/2  // The emitting width
        );
		e.pos.x = G.WIDTH + 6*rnd(0,24);
		}
		return (e.pos.x < 0);
	});
	remove(obstacles, (o) => {
		o.pos.x -= G.ENEMY_SPEED;
		if(o.pos.x<0){
			o.pos.x = G.WIDTH + 6*rnd(0,24);
			if(rnd(0,10)>5){
				o.pos.y = G.HEIGHT * 0.74;
			}else{
				o.pos.y = G.HEIGHT * 0.66;
			}
		}
		color("black");

		const isCollidingWithPlayer = char("c", o.pos).isColliding.char.a;

		if (isCollidingWithPlayer){
			play('hit');
			if(hasClicked){
				end();
			}else{
				color("light_red")
				particle(
					o.pos.x, // x coordinate
					o.pos.y, // y coordinate
					20, // The number of particles
					1, // The speed of the particles
					PI, // The emitting angle
					1.5*PI  // The emitting width
				);
				o.pos.x = G.WIDTH + 6*rnd(0,24) + o.pos.y;
			}
		}
		return (o.pos.x < 0);
	});
	if (obstacles.length < score/20) {
		for (let i = 0; i < score/20-obstacles.length; i++) {
			const posX = G.WIDTH + 6*rnd(0,24);
			const posY = G.HEIGHT*(0.66+(i*0.08));
			obstacles.push({
				pos: vec(posX, posY),
			 })
		}
	}
	// player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
	
}