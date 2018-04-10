_w.onload = function(){
	init();
	main();
	event();
	
	// prototype
	setInterval(main, fps); // start main loop of the game
};

function init(){
    size = _d.getElementById('size');
    canv = _d.getElementById('drawArea');
    cont = canv.getContext('2d');

    set_size();
    clear();

    // debug status
    _debug = {
        hitbox: false,
		screen: false,
		talk: 0,
		
		key_buffer: {
			main: 0,
			talk: 0,
			puzzle: 0,
			hitbox : 0
		},
		
		label_index: null,
		grid_line: false
    };
	
	// controll object
	game_controller = {
		puzzle: {
			mode: false,
			
			reverse: {
				id: -1
			},
			
			rotation: {
				id: -1,
				interval: 0
			}
		},
		
		scroll: {
			x: 0,
			y: 0
		},
		
		pause: {
			mode: false,
			interval: 0
		},
		
		talk: {
			mode: false,
			window: {
				index: 0,
				width: 800,
				height: 500
			}
		},
		
		respawn: false,
		screen_mode: 'Title',
		
		// now playing auido parameter
		play_audio: {
			change_speed: 30,
			max_volume: 1,
			volume: 0,
			index: 0,
			pause: 0,
			play: 1
		},
		
		// feed mask & flash mask & talk_window's index
		feed_index: -1,
		flash_index: -1,
		talk_window_index: -1,
		
		map_id: 0
	};

	// reset mapchips array
	mapchips = [];

    // Player's detailed information
    player = {
        x: 0,
        y: 0,
        reverse: 0,
		
		frame: 0,
		frame_speed: 6,
		
        accel: {
            x: 0,
            y: 0,
            gravity: 0
        },
		
		hit: false,
        standing: false,
		
		index: 0,
		hitbox: 0,
		
		save: {
			x: 0,
			y: 0
		}
	};

	// Mouse positions
	mouse = {
		x: 0,
		y: 0,
		drag: -1,
		down: false,
		last_drag_index: -1
	};

    gui = [];
	const canvas = canv;
    const context = cont;

    // Add the background image to use for game area
    gui.push(new canvasEx({
		canvas, context, type: img, x: 0, y: 0, w: fit, h: fit, alpha: 1,
		src: 'Image/Screen/background.png',
		label: ['Background', 'All']
	}));

	// mapchip.json からマップチップデータを読み込む
	init_mapchip(canvas, context);

	// タイトルテストここから

	gui.push(new canvasEx({
		canvas, context, type: txt, x: center, y: center + -200, size: 200, text: '七変化風林火山', align: center, reverse: 1,
		label: ['Title']
	}));

	gui.push(new canvasEx({
		canvas, context, type: txt, x: center, y: center + -150, size: 110, text: '鳳凰物語', align: center, reverse: 1,
		label: ['Title']
	}));

	gui.push(new canvasEx({
		canvas, context, type: txt, x: center, y: center + 180, size: 90, text: 'スペースキーで開始', align: center,
		label: ['Title']
	}));

	//ここまで
	
	//talk_window
	let talk_window_width = game_controller.talk.window.width;
	let talk_window_height = game_controller.talk.window.height;
	
    gui.push(new canvasEx({
		canvas, context, type: img, x: center, y: maximum + -talk_window_height / 4, w: talk_window_width, h: talk_window_height, alpha: 0, center: true,
		src: 'Image/Screen/talk_window.png', label: ['Talkwindow', 'Game']
	}));

    gui.push(new canvasEx({
		canvas, context, type: img, x: 0, y: 0, w: fit, h: fit, alpha: 0, // 0.3 ~ 0.4
		src: 'Image/Screen/puzzle_mask.png', max_alpha: 0.4,
		label: ['Mask', 'Game']
	}));

	gui.push(new canvasEx({ // center + -200 を maximum + -700 に変更
		canvas, context, type: img, x: -75, y: maximum + -280, w: 500, h: 500, alpha: 0,
		src: 'Image/Screen/debug_label.png',
		label: ['Label', 'All']
	}));

	// パズルピース
	let puzzle_positions = [
		{x: 397, y: 353}, // 0
		{x: 469, y: 334}, // 1
		{x: 398, y: 258}, // 2
		{x: 433, y: 334}, // 3
		{x: 453, y: 240}, // 4
		{x: 469, y: 278}, // 5
		{x: 416, y: 314}, // 6
	];

	let dx = -430;
	let dy = -300;
	puzzle_positions.forEach(function(e){
		e.x += dx;
		e.y += dy;
	});

	for(var i = 0; i < 7; i ++){
		gui.push(new canvasEx({
			canvas, context, type: img, x: center + puzzle_positions[i].x, y: center + puzzle_positions[i].y, w: 150, h: 150, alpha: 0, center: true,
			src: `Image/Puzzle/board_0${i + 1}.png`, drag: 1, max_alpha: 1, reverse: 0, direction: 0,
			label: ['Puzzle', 'Mask', 'Selector', 'Game']
		}));
	}

	// 回転ボタン
	gui.push(new canvasEx({
		canvas, context, type: img, x: center + -300, y: center + 300, w: 130, h: 130, alpha: 0, center: true,
		src: 'Image/Puzzle/button_rotation.png', max_alpha: 0.92, reverse: 0, direction: 0,
		label: ['Puzzle', 'Mask', 'Rot', 'Game']
	}));

	// 反転ボタン
	gui.push(new canvasEx({
		canvas, context, type: img, x: center + -300, y: center + 200, w: 130, h: 130, alpha: 0, center: true,
		src: 'Image/Puzzle/button_reverse.png', max_alpha: 0.92, reverse: 0, direction: 0,
		label: ['Puzzle', 'Mask', 'Rev', 'Game']
	}));

	// スクロールバー
	gui.push(new canvasEx({
		canvas, context, type: pth, x: center + -100, y: center + 300, bold: 2, color: '#222', mode: stroke, alpha: 0,
		pos: [{x: -100, y: 0}, {x: 100, y:0}], max_alpha: 0.92,
		label: ['Mask', 'Game']
	}));

	// スクロールボタン
	gui.push(new canvasEx({
		canvas, context, type: img, x: center + -200, y: center + 300, w: 30, h: 30, alpha: 0, center: true,
		src: 'Image/Puzzle/button_scroll.png', max_alpha: 0.92, reverse: 0, direction: 0, pinY: true, drag: true,
		label: ['Mask', 'Game'],
	}));
	
	// for an object (Prototype)
	gui.push(new canvasEx({
		canvas, context, type: img, x: center, y: center + 100, w: 200, h: 200, center: true, alpha: 0, direction: 0,
		src: 'Image/Screen/Effect/leaf.png', switch: 'Audio 0',switch_frame: [7.1, 21.4, 41.4, 64.2],
	    animation: [
            'Image/Screen/Effect/leaf.png',
            'Image/Character/mouse_0_0.png'
        ],
		label: ['Animation', 'Effect', 'Title'],
		pattern: [
			{
				type: 'Feedin',
				parameter: {
					time: 60
				}
			},
			{
				type: 'moveY',
				parameter: {
					center,
					start: -200,
					end: 0,
					time: 90
				}
			},
			{
				type: 'rotation',
				parameter: {
					delta: 0.7,
					time: Infinity // 無限ループ(って怖くね?)
				}
			}
		] 
	}));
	
	// Add the character of player
	gui.push(new canvasEx({
	    canvas, context, type: img, x: center, y: center, w: 90, h: 90, center: true, reverse: 0, direction: 0,
	    src: 'Image/Character/mouse_0_0.png',
	    animation: [
            'Image/Character/mouse_0_0.png',
            'Image/Character/mouse_0_1.png'
        ],
        label: 'Player'
	}));
	
	// Add the hitbox of player
	gui.push(new canvasEx({
		canvas, context, type: pth, x: center, y: center, bold: 2, color: '#D00', mode: stroke,
		pos: [
			{x: -35, y: 15}, {x: 35, y: 15}, {x: 35, y: -15}, {x: -35, y: -15}
		],
		label: ['Player', 'Hitbox']
	}));	
	
	// 画面全体を覆うオブジェクトは最上層レイヤーで追加
	gui.push(new canvasEx({
		canvas, context, type: img, x: 0, y: 0, w: fit, h: fit, alpha: 1,
		src: 'Image/Screen/feed_mask.png',
		label: ['Feedmask', 'All']
	}));
	
	gui.push(new canvasEx({
		canvas, context, type: img, x: 0, y: 0, w: fit, h: fit, alpha: 0,
		src: 'Image/Screen/flash_mask.png',
		label: ['Flashmask', 'All']
	}));
	
	// Settings
	gui.push(new canvasEx({
		canvas, context, type: txt, x: center, y: center + -180, size: 200, text: 'ポーズ', align: center, alpha: 0,
		label: ['Setting', 'All']
	}));

	// オープニングデータのリセット
	init_opening(canvas, context);

	// Init sounds
	const soundname = [
		{src: 'Sound/Test/U18-13(1).mp3', volume: 1, loop: 1},
		{src: 'Sound/Test/U18-8(1).mp3', volume: 1, loop: 1},
		{src: 'Sound/Test/SE-7(1)_remix.mp3', volume: 0.6, loop: 0},
	];

	soundset = new Array(soundname.length).fill(0);

	soundset.forEach(function(e, i){
		let _this = soundname[i];
		soundset[i] = new sound({src: _this.src});
		soundset[i].volume(_this.volume);
		soundset[i].loop(_this.loop);
	});

	// setup _animation object
	_animation = {
		bgm_start: 1,
		load_finished: 30,
		first_interval: 10,
		title: 1
	}

	pressed_keys = []; // Reset the array for stack pressed keys
	pressed_keys[37] = pressed_keys[38] = pressed_keys[39] = pressed_keys[40] = 0; // Measures against NaN

    // Make group with add objects
	grounds = new group();

	// create new gui
	gui.map(function(e, i){
		let label = e.label;
		if(check_include_label(label, 'Mapchip')){
			mapchips.push(
				{
					x: e.mapchip_data.x,
					y: e.mapchip_data.y,
					index: i
				}
			);
		}
		if(check_include_label(label, 'Ground')){
			grounds.add(e);
		}
		if(check_include_label(label, 'Label')){
			_debug.label_index = i;
		}
		if(check_include_label(label, 'Feedmask')){
			game_controller.feed_index = i;
		}
		if(check_include_label(label, 'Flashmask')){
			game_controller.flash_index = i;
		}
		if(check_include_label(label, 'Talkwindow')){
			game_controller.talk.window.index = i;
		}
	});

	// setup index of somethings
	gui.map(function(e, i){
		let label = e.label;
		if(check_include_label(label, 'Puzzle') && (check_include_label(label, 'Rot') || check_include_label(label, 'Rev'))){
			if(check_include_label(label, 'Rot')){
				game_controller.puzzle.rotation.id = i;
			} else {
				game_controller.puzzle.reverse.id = i;
			}
		}
	});
	
	// setup effects
	gui.map(function(e_0, i_0){
		if(check_include_label(e_0.label, 'Effect')){
			e_0.pattern.map(function(e_1, i_1){
				if(e_1.parameter.log === void(0)){
					gui[i_0].pattern[i_1].parameter.log = e_1.parameter.time;
				}
			});
		}
	});
	
	// playerと当たり判定のindex
	gui.map(function(e, i){
		let label = e.label;
		if(check_include_label(label, 'Player')){
			if(check_include_label(label, 'Hitbox')){
				player.hitbox = i;
			} else {
				player.index = i;
			}
		}
	});
	
	// Init effect array
	effects = new Array(32).fill(0);
	for(let i in effects){
		let size = random(50, 70);
		effects[i] = {
			object: new canvasEx({
				canvas, context, type: img, x: random(-width / 4, width), y: -random(20, 120), w: size, h: size, alpha: rand() * 0.5 + 0.5,
				center: true, direction: random(0, 360), src: 'Image/Screen/Effect/leaf.png', label: ['Effect', 'Title']
			}),
			dx: rand() * (size / 40),
			dy: rand() * (size / 40),
			dDir: rand() * 2.5 + 0.5,
			mAlp: rand() * 0.3 + 0.5,
			sAlp: rand() * 1 + 0.5,
			frame: 0
		}
	}
	
	anime_index = [];
	gui.map(function(e, i){
		if(check_include_label(e.label, 'Animation'), check_include_label(e.label, 'Effect')){
			anime_index.push(i);
		}
	});
	
	// test
	//_debug.hitbox = true;
}

function init_mapchip(canvas, context){
	let keys = Object.keys(json_mapchip);
	keys.map(function(e){
		let data = json_mapchip[e];
		let hitbox = data.hitbox;
		let chip = data.chip;

		if(hitbox !== void(0)){
			// Map chip hitbox source
			gui.push(new canvasEx({
				canvas, context, type: pth, x: center + hitbox.x, y: center + hitbox.y, bold: 2, color: data.color || '#07E',
				pos: hitbox.pos, mapchip_data: {x: hitbox.x, y: hitbox.y}, map_id: data.map_id,
				label: ['Ground', 'Hitbox', 'Mapchip', 'Game']
			}));
		}
		
		// Map chip image soruce
		gui.push(new canvasEx({
			canvas, context, type: img, x: center + chip.x, y: center + chip.y, w: chip.w, h: chip.h, center: true, alpha: 1,
			src: chip.src, mapchip_data: {x: chip.x, y: chip.y}, map_id: data.map_id,
			label: ['Mapchip', 'Game']
		}));
	});
}

function init_opening(canvas, context){
	// オープニングオブジェクトの追加
	gui.push(new canvasEx({
		canvas, context, type: txt, x: center, y: center, size: 90, text: '下の方では地球の者たちが緊張気味に固まれり。', mode: 1, align: center,
		label: ['Opening']
	}));
}

// Start main
function main(){
    //requestAnimationFrame(main); // FPSが不安定なためsetIntervalに変更
    if(_loaded_images === _max_images){
		if(!_animation.first_interval){
			draw();
			update();
		} else {
			_animation.first_interval --;
		}
	}
	
	// Pause control
	if(!game_controller.pause.interval && pressed_keys[80] && !_animation.title && !game_controller.respawn){
		game_controller.pause.mode = !game_controller.pause.mode;
		game_controller.pause.interval = 15;
		soundset[2].play(1);
		
		_c.log(`Switched pause mode : ${game_controller.pause.mode}`);
	}
	
	game_controller.pause.interval -= (game_controller.pause.interval > 0);
}

function update(){
	audio_update();
	
	gui.map(function(e, i){
		if(check_include_label(e.label, 'Setting')){
			gui[i].alpha += (game_controller.pause.mode - gui[i].alpha) / 4;
		}
	});
	
	key_events();
	
	if(!game_controller.pause.mode && !game_controller.talk.mode){
		if(player.frame > player.frame_speed){
			player.frame = 0;
		}
		
		control_effects();
		// controlAnime();

		if(game_controller.puzzle.mode){
			puzzleEvent();
		}

		if(!_animation.title){
			if(!game_controller.respawn){
				player_control();
			}

			drag_objects();
			scroll_mapchips();
		}
		
		draw_debug_label();
	}
	
	// Talk window
	if(game_controller.screen_mode === 'Game'){
		let index = game_controller.talk.window.index;
		gui[index].alpha += (game_controller.talk.mode - gui[index].alpha) / 3;	

	}

	// Mask alpha
	gui.forEach(function(e){
		if(check_include_label(e.label, 'Mask')){
			e.alpha += ((e.max_alpha || 0.27) * game_controller.puzzle.mode - e.alpha) / 4;
		}
	});

	_animation.load_finished -= (_animation.load_finished > 0);

	switch(_animation.title){
		case 0:
			if(!game_controller.respawn){
				gui[game_controller.flash_index].alpha += (false * 1.0 - gui[game_controller.flash_index].alpha) / 4;
				gui[game_controller.feed_index].alpha += (game_controller.pause.mode * 0.7 - gui[game_controller.feed_index].alpha) / 6;
				game_controller.play_audio.max_volume = abs(1 - gui[game_controller.feed_index].alpha);
				game_controller.play_audio.change_speed = 3;
			}
		break;

		case 1:
			gui[game_controller.feed_index].alpha = _animation.load_finished / 30;
			if(pressed_keys[32] && _animation.title && !_animation.load_finished){
				game_controller.play_audio.change_speed = 6;
				game_controller.play_audio.max_volume = 0;
				_animation.title = 2;
			}
		break;

		case 2:
			gui[game_controller.feed_index].alpha += (1 - gui[game_controller.feed_index].alpha) / 6;
			if(soundset[game_controller.play_audio.index].audio.volume < 0.01){
				gui[game_controller.feed_index].alpha = 1;
				game_controller.play_audio.pause = 1;
				_animation.title = 3;
				
				_c.log(gui[game_controller.feed_index].alpha);
			}
		break;

		case 3:
			setTimeout(function(){
				if(false){ // 此処から先には行かせない… 俺が食い止める…!
					game_controller.play_audio.change_speed = 6;
					game_controller.play_audio.max_volume = 1;
					game_controller.play_audio.index = 1;
					game_controller.play_audio.pause = 1;
					game_controller.play_audio.play = 1;
					
					game_controller.screen_mode = 'Game';
					_animation.title = 0; // 終焉 - バッドエンド（オープニング的な意味で）
				} else { // 今のうちに逃げろ…!
					game_controller.screen_mode = 'Opening'; // 天空は轟き、雷槌は龍の様に地面を這う
					_animation.title = 4; // 誕生 - グッドエンド（オープニング的な意味で）
				}
			}, 400);
		break;
			
		case 4:
			// オープニングを付ける予定
			gui[game_controller.feed_index].alpha += (0.3 - gui[game_controller.feed_index].alpha) / 16; // とりあえず画面明るくしておけ
		
			if(pressed_keys[32]){
				game_controller.play_audio.change_speed = 6;
				game_controller.play_audio.max_volume = 1;
				game_controller.play_audio.index = 1;
				game_controller.play_audio.pause = 1;
				game_controller.play_audio.play = 1;
					
				game_controller.screen_mode = 'Game';
				_animation.title = 0;
			}
		break;
	}
}

function audio_update(){
	let index = game_controller.play_audio.index;
	
	if(game_controller.play_audio.pause){
		soundset[index].pause(1);
		game_controller.play_audio.pause = 0;
	}
	if(game_controller.play_audio.play){
		soundset[index].volume(game_controller.play_audio.volume);
		soundset[index].play(1);
		game_controller.play_audio.play = 0;
	}

	soundset[index].audio.volume += (game_controller.play_audio.max_volume - soundset[index].audio.volume) / game_controller.play_audio.change_speed;
}

function draw(){
	clear();

	let mode = game_controller.screen_mode;
	
	gui.map(function(e){
		let label = e.label;
		
		switch(mode){
			case 'Opening':
				if(check_include_label(label, 'Opening')){
					//e.draw(e.switch_frame.indexOf(e.frame) > -1 || e.switch_frame.inside(e.switchElement, 0.01) > -1);
					e.draw();
				}
			break;
				
			case 'Title':
				if(check_include_label(label, 'Title')){
					e.draw();
				}
			break;
				
			case 'Game':
				if(check_include_label(label, 'Game')){
					if(check_include_label(label, 'Mapchip')){
						if(e.map_id === game_controller.map_id){
							e.draw();
						}
					} else {
						e.draw();
					}
				}
			break;
		}
		
		if(check_include_label(label, 'All')){ //　全場面描画
			e.draw();
		}
		
		if(check_include_label(label, 'Player') && mode === 'Game'){ // 特殊条件発火
			if(label === 'Player'){
				e.draw(player.frame > player.frame_speed);
			} else {
				e.draw();
			}
		}

	});

	if(!game_controller.pause.mode && !game_controller.talk.mode){
		draw_last_drag_object();

		// assistant grid line
		if(_debug.grid_line){
			cont.beginPath();
			cont.lineWidth = 3;
			cont.strokeStyle = '#121212';

			cont.moveTo(0, height / 2);
			cont.lineTo(width, height / 2);

			cont.moveTo(width / 2, 0);
			cont.lineTo(width / 2, height);

			cont.stroke();
		}
	}
	
	if(_animation.title){
		draw_effects();
	}
	
	if(!game_controller.pause.mode){
		draw_talk_window();
	}
}

function event(){
	_d.addEventListener('mousemove', function(e){
		let rect = e.target.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
	});

	_d.addEventListener('mousedown', function(e){
		mouse.down = true;
	});

	_d.addEventListener('mouseup', function(e){
		mouse.down = false;
	});

    _d.addEventListener('keydown', function(e){
		pressed_keys[e.keyCode] = 1;
	});

    _d.addEventListener('keyup', function(e){
        pressed_keys[e.keyCode] = 0;
    });

    _w.addEventListener('resize', function(){
        requestAnimationFrame ? set_size() : requestAnimationFrame(set_size);
    });
}

function clear(){
    cont.clearRect(0, 0, width, height); // Refresh the screen
}

function set_size(){
	canv.height = size.offsetHeight;
	canv.width = size.offsetWidth;
	height = canv.height;
	width = canv.width;
}

function check_include_label(base, search){
	if(base === void(0)){
		return false;
	}

	return (base === search || base.indexOf(search) > -1);
}

function key_events(){
	if(pressed_keys[16] && pressed_keys[68] && !_debug.key_buffer.main){ // shift + D switch debug mode
		_debug.key_buffer.main = 15; // 30(fps) * 15 = 1500ms (1.5s) = interval
		_debug.screen = !_debug.screen;
		_c.log(`User switched _debug.screen : ${_debug.screen}`);
	}

	if(_debug.screen){
		if(pressed_keys[48] || pressed_keys[96] && !_debug.key_buffer.puzzle){
			_debug.key_buffer.puzzle = 15;
			game_controller.puzzle.mode = !game_controller.puzzle.mode;
			_c.log(`User switched game_controller.puzzle.mode : ${game_controller.puzzle.mode}`);
			
			pressed_keys[48] = pressed_keys[96] = 0; // キー入力をクリア
		}
		
		if(pressed_keys[49] || pressed_keys[97] && !_debug.key_buffer.hitbox){
			_debug.key_buffer.hitbox = 10;
			_debug.hitbox = !_debug.hitbox;
			_c.log(`User switched _debug.hitbox : ${_debug.hitbox}`);
			
			pressed_keys[49] = pressed_keys[97] = 0; // キー入力をクリア
		}
		
		if(pressed_keys[50] || pressed_keys[98] && !_debug.key_buffer.talk){
			_debug.key_buffer.talk = 10;
			game_controller.talk.mode = !game_controller.talk.mode;
			_c.log(`User switched game_controller.talk.mode : ${game_controller.talk.mode}`);
			
			pressed_keys[50] = pressed_keys[98] = 0; // キー入力をクリア
		}
	}

	Object.keys(_debug.key_buffer).map(function(e){
		_debug.key_buffer[e] -= (_debug.key_buffer[e] > 0);
	});
}

function player_control(){
	let clear_case = (_debug.screen || !game_controller.puzzle.mode);

	// Deceleration according to law of inertia
	player.accel.x += (pressed_keys[39] - pressed_keys[37]) * accelSpeed * clear_case; // Rigth and Left arrow keys
	var pre_player_x = player.x;
	var pre_player_y = player.y;
	player.x = 0;
	player.y = 0;
    
	player.accel.x *= lowAccel;
	player.x += player.accel.x;

	player.y += player.accel.y + player.accel.gravity;

	// Move player's coordinates
	gui[player.index].x = gui[player.hitbox].x = center + player.x;
	gui[player.index].y = gui[player.hitbox].y = center + player.y;

	// Set player's direction
	if((pressed_keys[37] || pressed_keys[39]) && clear_case){
		player.reverse = pressed_keys[39] + 0;
        	gui[player.index].reverse = player.reverse;
   	}

	// Frame for Character animation
	player.frame += (pressed_keys[37] || pressed_keys[39]) * player.standing * clear_case;

	// Your code here. (gravity, 当たり判定完成後)
	player.accel.gravity += 0.5;
	player.y += 5;

	gui[player.hitbox].y = center + player.y;
	gui[player.hitbox].draw();
	player.standing = false;
	player.hit = false;

	if(grounds.check_hit(gui[player.hitbox])){ // Done!!
		var count = 300;
		var step = 0.1;
		player.standing = true;
		player.hit = true;

		var result = moveUntilNotHit(player.hitbox, 3, count, step, player.x, player.y, 0, -1);
		if(result[2]){
			var result = moveUntilNotHit(player.hitbox, 3, count, step, player.x, player.y, 0, 1);
			if(result[2]){
				player.y -= 5
				count = 15;
				step = 2;
				result = moveUntilNotHit(player.hitbox, 3, count, step, player.x, player.y - 15, 1, 0);
				result[1] += 15;

				if(result[2]){
					result = moveUntilNotHit(player.hitbox, 3, count, step, player.x, player.y - 15, -1, 0);
					result[1] += 15;
				}
				player.y += 5;
				gui[player.hitbox].y = center + player.y;
				gui[player.hitbox].draw();
				player.standing = grounds.check_hit(gui[player.hitbox]);
				player.accel.x = 0;
			}else{
				player.standing = false;
				player.hit = false;
				player.accel.y = 0;
				player.accel.gravity = 0;
			}
		} else {
			player.hit = false;
			player.accel.y = 0;
			player.accel.gravity = 0;
			player.accel.y += (pressed_keys[38] * -jumpPower) * clear_case; //ジャンプを有効化する
		}
		player.x = result[0];
		player.y = result[1];
		gui[player.index].x = gui[player.hitbox].x = center + player.x;
		gui[player.index].y = gui[player.hitbox].y = center + player.y;
	}else{
		player.y -= 5;
		gui[player.hitbox].y = center + player.y;
	}
    
	game_controller.scroll.x -= player.x;
	game_controller.scroll.y -= player.y;
	player.x = pre_player_x;
	player.y = pre_player_y;
	
	gui[player.index].x = gui[player.hitbox].x = center + player.x;
	gui[player.index].y = gui[player.hitbox].y = center + player.y;

	// if the player went void, set y to scratch.
	if(height < -game_controller.scroll.y || game_controller.respawn){		
		if(!game_controller.respawn){
			game_controller.play_audio.change_speed = 6;
			game_controller.play_audio.max_volume = 0;			
			
			game_controller.respawn = true;
			gui[player.index].alpha = 0;
			player.accel.gravity = 0;
			player.accel.y = 0;
			player.y = 0;
			
			let respawn = setInterval(function(){
				gui[game_controller.feed_index].alpha += (1 - gui[game_controller.feed_index].alpha) / 6; // フェードアウト
				game_controller.scroll.x += (player.save.x - game_controller.scroll.x) / 4; // save.x が リスポーン x
                game_controller.scroll.y += (player.save.y - game_controller.scroll.y) / 4; // save.y が リスポーン y
	
				if(abs(player.save.x - game_controller.scroll.x) + (1 - gui[game_controller.feed_index].alpha) < 0.1){
					setTimeout(function(){
						game_controller.scroll.x = 0;
						gui[player.index].alpha = 1;
						player.accel.gravity = 0;

						game_controller.respawn = false;
						clearInterval(respawn);
					}, 800);
				}
			}, fps);
		}
	}
}

function moveUntilNotHit(obj_1, obj_2, count, step, x, y, changeX, changeY){
	var isHit = true;
	var tentativeX = x;
	var tentativeY = y;

	gui[obj_1].x = center + tentativeX;
	gui[obj_1].y = center + tentativeY;
	gui[obj_1].draw();

	for(var i = 0; i < count && isHit; i++){
		isHit = grounds.check_hit(gui[player.hitbox]);

		tentativeX += step * changeX;
		tentativeY += step * changeY;
		gui[obj_1].x = center + tentativeX;
		gui[obj_1].y = center + tentativeY;
		gui[obj_1].draw();
	}

	if(isHit){
		tentativeX = x;
		tentativeY = y;

		gui[obj_1].x = center + x;
		gui[obj_1].y = center + y;
		gui[obj_1].draw();
	}
	return [tentativeX, tentativeY, isHit];
}

function scroll_mapchips(){
	mapchips.map(function(e){
		gui[e.index].x = center + (gui[e.index].mapchip_data.x + game_controller.scroll.x);
		gui[e.index].y = center + (gui[e.index].mapchip_data.y + game_controller.scroll.y);
		
		if(!check_include_label(e.label, 'Hitbox')){
			let x = convert_position(gui[e.index].x, 'x', canv);
			let y = convert_position(gui[e.index].y, 'y', canv);
			
			let alpha = distance(width / 2, height / 2, x, y) / ((width + height) / 2);
			alpha = (1 - alpha * 1.1) < 0 ? 0 : 1 - alpha * 1.025;
			gui[e.index].alpha = alpha;
		}
	});
}

function draw_debug_label(){
	gui[_debug.label_index].alpha += (_debug.screen - gui[_debug.label_index].alpha) / 3;
}

function drag_objects(){
	let drag = mouse.drag;
	let down = mouse.down;

	if(drag > -1){
		if(!gui[drag].pinX){
			gui[drag].x = center + (mouse.x - width / 2);
		}

		if(!gui[drag].pinY){
			gui[drag].y = center + (mouse.y - height / 2);
		}

		if(check_include_label(gui[drag].label, 'Puzzle') && !game_controller.puzzle.mode){
			mouse.drag = -1;
		}
	}

	if(down){
		if(drag === -1){
			// search index
			let max = 170 / 2;
			gui.map(function(e, i){
				if(e.drag){

					if(check_include_label(e.label, 'Puzzle') && !game_controller.puzzle.mode){
						return false;
					} else {
						if((distance(e.x, e.y, mouse.x, mouse.y, canv) < max) && drag === -1){
							max = distance(e.x, e.y, mouse.x, mouse.y, canv);
							mouse.drag = i;

							if(check_include_label(e.label, 'Selector')){
								mouse.last_drag_index = mouse.drag;
							}
						}
					}
				}
			});
		}
	} else {
		if(drag > -1){
			mouse.drag = -1;
		}
	}
}

function draw_last_drag_object(){
	if(mouse.last_drag_index > -1 && game_controller.puzzle.mode){
		let obj = gui[mouse.last_drag_index];
		let h = obj.h || obj.height;
		let w = obj.w || obj.width;
		let x = obj.x;
		let y = obj.y;

		if(isNaN(x)){
			x = convert_position(x, 'x', canv);
		}

		if(isNaN(y)){
			y = convert_position(y, 'y', canv);
		}

		cont.beginPath();

		if(_debug.screen){
			let yScale = h / 2;
			let xScale = w / 2;

			cont.lineWidth = 2;
			cont.strokeStyle = '#C00';

			cont.moveTo(x - xScale, y - yScale);


			cont.lineTo(x - xScale, y + yScale);
			cont.lineTo(x + xScale, y + yScale);
			cont.lineTo(x + xScale, y - yScale);
			cont.lineTo(x - xScale, y - yScale);
			cont.stroke();
		} else {
			cont.fillStyle = 'rgba(0, 0, 0, 0.5)';
			cont.arc(x, y, 50, 0, PI * 2, false);
			cont.fill();
		}
	}
}

function puzzleEvent(){
	let rot = gui[game_controller.puzzle.rotation.id];
	let rev = gui[game_controller.puzzle.reverse.id];

	if(distance(convert_position(rot.x, 'x', canv), convert_position(rot.y, 'y', canv), mouse.x, mouse.y) < rot.w / 2 && mouse.down){

	}
	if(distance(convert_position(rev.x, 'x', canv), convert_position(rev.y, 'y', canv), mouse.x, mouse.y) < rev.w / 2 && mouse.down){
		if(!game_controller.puzzle.reverse.interval && mouse.last_drag_index > -1){
			gui[mouse.last_drag_index].reverse = !gui[mouse.last_drag_index].reverse;
			game_controller.puzzle.reverse.interval = 7;
		}
	}

	game_controller.puzzle.reverse.interval -= (game_controller.puzzle.reverse.interval > 0);
}

function controlAnime(){
	gui.map(function(e, i){
		let label = e.label;
		if(check_include_label(label, 'Animation')){
			if(check_include_label(label, 'Animation')){
				if(e.switch !== void(0)){
					switchElement = e.switch.split(' ');
					switch(switchElement[0]){
						case 'Audio':
							gui[i].switchElement = soundset[switchElement[1]].audio.currentTime;
						break;
					}
				}
				if(e.frame){
					gui[i].frame = (gui[i].frame % gui[i].maxFrame) + 1;
				}
			}
		}
	});
}

function control_effects(){
	gui.map(function(e_0, i_0){
		if(check_include_label(e_0.label, 'Effect')){
			e_0.pattern.map(function(e_1, i_1){
				let parameter = e_1.parameter;
				
				if(parameter.log){
					let value = (parameter.time - parameter.log);
					gui[i_0].pattern[i_1].parameter.log -= (gui[i_0].pattern[i_1].parameter.log > 0); // decriment
					
					switch(e_1.type){
						case 'Feedin':
							gui[i_0].alpha = (1 / parameter.time) * value;
						break;

						case 'moveX':
							if(parameter.time === Infinity){
								gui[i_0].x = parameter.center + parameter.delta;
								gui[i_0].pattern[i_1].parameter.delta += parameter.accelDelta;
							} else {
								gui[i_0].x = parameter.center + (parameter.start + (abs(parameter.start - parameter.end) / parameter.time) * value);
							}
						break;
							
						case 'moveY':
							if(parameter.time === Infinity){
								gui[i_0].y = parameter.center + parameter.delta;
								gui[i_0].pattern[i_1].parameter.delta += parameter.accelDelta;
							} else {
								gui[i_0].y = parameter.center + (parameter.start + (abs(parameter.start - parameter.end) / parameter.time) * value);
							}
						break;
							
						case 'rotation':
							if(parameter.time === Infinity){
								gui[i_0].direction += parameter.delta;
							} else {
								let maxDirection = parameter.start || 0;
								gui[i_0].direction = maxDirection + (abs(maxDirection - parameter.end) / parameter.time) * value;
							}
						break;
					}
				}
			});
		}
	})
}

function draw_effects(){
	let mode = game_controller.screen_mode;
	
	effects.map(function(e, i){
		let label = e.object.label;

		switch(mode){
			case 'Opening':
				if(check_include_label(label, 'Opening')){
					e.object.draw();
				}
			break;
				
			case 'Title':
				if(check_include_label(label, 'Title')){
					e.object.draw();
				}
			break;
				
			case 'Game':
				if(check_include_label(label, 'Game')){
					e.object.draw();
				}
			break;
		}
		
		if(check_include_label(label, 'All')){ //　全場面描画
			e.object.draw();
		}
		

		// ここから描画
		effects[i].object.x += e.dx;
		effects[i].object.y += e.dy;
		effects[i].object.direction += e.dDir;
		effects[i].object.alpha = abs(sin(e.frame * PI / 180) - (1 - e.mAlp));

		effects[i].frame += e.sAlp;
		
		if(width < e.object.x || height < e.object.y){
			effects[i].object.x = random(-width / 4, width);
			effects[i].object.y = -random(10, 30);
		}
	});
}

function draw_talk_window(){
	//game_controller.talk.mode
}
