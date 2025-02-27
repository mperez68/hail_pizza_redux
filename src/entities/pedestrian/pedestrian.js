// Pedestrian Entity
class Pedestrian extends Entity {
	constructor(game, x, y, direction, width, height) {
		// Initialize parent
		super(game, x, y, direction, 1, width, height, 
			new Animator(ASSET_MANAGER.getAsset("./sprites/npcs.png"), 0, height,
				width, height, 12, 0.2, 0, direction, false, true));
		// Constants
		this.RUN_SPEED = 1;
		this.pivotSpeed = 3;
		// Assign Object Variables
		Object.assign(this, { game });
		
		// Default Animations
		let spritesheet = ASSET_MANAGER.getAsset("./sprites/npcs.png");

		this.standing = new Animator(spritesheet, 0, height,
			width, height, 12, 0.2, 0, direction, false, true);	// Standing
		this.walking = new Animator(spritesheet, 228, height,
			width, height, 8, 0.08, 0, direction, false, true);	// Walking
		this.walkingBack = new Animator(spritesheet, 228, height,
			width, height, 8, 0.10, 0, direction, true, true);	// Walking Backward
	};

	getTurnRadius() {
		return this.RUN_SPEED / getRad(this.pivotSpeed);
	};

	damage(dmg) {
		if (super.damage(dmg)) this.game.addBackground(new Splatter(this.game, this.x, this.y, this.direction, this.width, this.height, 0));
		super.damage(dmg);
	};

	setup() {
		this.walkingVector = 0;
		
		super.setup();
	};
	
	update() {
		// Pathfinding
		if (this.goal) this.pathfind();

		// Parent Method
		super.update();
	};

	pathfind(){
		// Determine Distance/Angle
		let d = this.getDistanceToGoal();
		let a = this.getAngleToGoal();

		let diff = a - this.direction;
		while (diff < 0) diff += 360;
		diff = diff % 360;

		// Align direction
		if ( diff >= 0 && diff < 180 ) this.right(1);
		if ( diff >= 180 && diff < 360 ) this.left(1);
		if ( Math.abs(this.direction - a) <= 2 * this.pivotSpeed ) this.direction = a;
		// Move closer
		if ( (d < this.getTurnRadius()) && diff > 30 && diff < 330 ) {
			this.backward(0.2);
		} else {
			this.forward(1);
		}
	};

	forward() {
		this.walkingVector = 1;

		this.addForce(this.direction, this.RUN_SPEED);
	};

	backward() {	
		this.walkingVector = -0.5;

		this.addForce(this.direction, -this.RUN_SPEED / 2);
	};

	left() {
		this.direction -= this.pivotSpeed;
	};

	right() {
		this.direction += this.pivotSpeed;
	};

	getDistanceToGoal() {
		let d = 9999;
		if (this.goal) d = Point.distance(this, this.goal);
		return d;
	};

	getAngleToGoal() {
		let a = 0;
		if (this.goal) a = Point.angle(this, this.goal);
		return a;
	};

	draw(ctx) {
		// Update animation
		this.animation = this.standing;	// init
		if (this.walkingVector > 0) this.animation = this.walking;
		if (this.walkingVector < 0) this.animation = this.walkingBack;
		// Parent
		super.draw(ctx);
	};
};
