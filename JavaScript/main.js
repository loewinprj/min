/*

// 雛形
{
	"ナンバリング : {
		"map_id": マップの番号（山、城、etc）
		"chip" : {
			"x" : 任意 描画 x
			"y" : 任意 描画 y
			"w" : 任意 描画 width
			"h" : 任意 描画 height
			"dir" : 任意 描画 角度 direction
			"src" : 任意 描画 画像 ソースリンク
			"center" : 1 か 0 中心描画か否か
		},
		// 当たり判定は付けなくても動く
		"hitbox"{
			"x" : 当たり判定 x
			"y" : 当たり判定 y
			"pos" : 当たり判定 頂点座標 配列
		}
	}
}

*/

var json_mapchip = {
	
	// chip 01 - cliff
	"01_0" : {
		"map_id": 0,
		"chip": {
			"x" : 5,
			"y" : 138,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_01.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 0,
			"y" : 103,
			"pos" : [
				{
					"x" : -80,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -80,
					"y" : 100
				}
			]
		}
	},
	
	// chip 02 - Flat
	
	"02_0" : {
		"map_id": 0,
		"chip": {
			"x" : 180,
			"y" : 73,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_02.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 180,
			"y" : 103,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	"02_1" : {
		"map_id": 0,
		"chip": {
			"x" : 280,
			"y" : 73,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_02.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 280,
			"y" : 103,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},

	"02_2" : {
		"map_id": 0,
		"chip": {
			"x" : 660,
			"y" : 105,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_02.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 660,
			"y" : 135,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	"02_3" : {
		"map_id": 0,
		"chip": {
			"x" : 760,
			"y" : 105,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_02.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 760,
			"y" : 135,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	"02_4" : {
		"map_id": 0,
		"chip": {
			"x" : 1140,
			"y" : 73,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_02.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 1140,
			"y" : 103,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	// chip 03 - Slope L to R
	
	"03_0" : {
		"map_id": 0,
		"chip": {
			"x" : 470,
			"y" : 90,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_03.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 470,
			"y" : 103,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 7
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	"03_1" : {
		"map_id": 0,
		"chip": {
			"x" : 1330,
			"y" : 90,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_03.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 1330,
			"y" : 103,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 7
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	"03_2" : {
		"map_id": 0,
		"chip": {
			"x" : 1520,
			"y" : 125,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_03.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 1520,
			"y" : 138,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 7
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	"03_3" : {
		"map_id": 0,
		"chip": {
			"x" : 1710,
			"y" : 160,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_03.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 1710,
			"y" : 173,
			"pos" : [
				{
					"x" : -100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 7
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	// chip 04 - Slop R to L
	
	"04_0" : {
		"map_id": 0,
		"chip": {
			"x" : 950,
			"y" : 90,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_04.png",
			"dir" : 0,
			"center" : 1
		},
		"hitbox": {
			"x" : 950,
			"y" : 103,
			"pos" : [
                {
					"x" : -100,
					"y" : 7
				},
				{
					"x" : 100,
					"y" : -30
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : 100,
					"y" : 100
				},
				{
					"x" : -100,
					"y" : 100
				}
			]
		}
	},
	
	// chip 05 - Stem
	
	"05_0" : {
		"map_id": 0,
		"chip": {
			"x" : 250,
			"y" : -27,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_05.png",
			"dir" : 0,
			"center" : 1
		}
	},
	
	// chip 06 - Head
	
	"06_0" : {
		"map_id": 0,
		"chip": {
			"x" : 250,
			"y" : -212,
			"w" : 200,
			"h" : 200,
			"src" : "Image/Screen/Mapchip/chip_06.png",
			"dir" : 0,
			"center" : 1
		}
	},
	
	// chip 07 - Grass
	
	"07_0" : {
		"map_id": 0,
		"chip": {
			"x" : 150,
			"y" : 60,
			"w" : 110,
			"h" : 110,
			"src" : "Image/Screen/Mapchip/chip_07.png",
			"dir" : 0,
			"center" : 1
		}
	},
	
	"07_1" : {
		"map_id": 0,
		"chip": {
			"x" : 650,
			"y" : 95,
			"w" : 110,
			"h" : 110,
			"src" : "Image/Screen/Mapchip/chip_07.png",
			"dir" : 0,
			"center" : 1
		}
	},
}
