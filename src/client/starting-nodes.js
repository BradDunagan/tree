/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

	starting-nodes.js
*/

let startingNodes = {
	'1': {
		parent: null,
		gate: 'expanded',
		text: 'Local Types',
		children: {
			'header': [
				{ text: 'Name',
				  minWidth: '40px',
				  maxWidth: '120px' },
				{ text: 'Created By',
				  minWidth: '40px',
				  maxWidth: '120px' },
				{ text: 'Created In',
				  minWidth: '40px',
				  maxWidth: '120px' },
			],
			'2': {
				parent: '1',
				gate: 'hidden',
				text: ['Type_1', 'Alfonso Smith', 'Ride It'],
				children: {}
			},
			'3': {
				parent: '1',
				gate: 'hidden',
				text: ['Type_3', 'Jane Jackson', 'Medical'],
				children: {}
			},
		}
	},
	'4': {
		parent: null,
		gate: 'expanded',
		text: 'Share Types',
		children: {
			'header': [
				{ text: 'Name',
				  minWidth: '40px',
				  maxWidth: '120px' },
				{ text: 'Created By',
				  minWidth: '40px',
				  maxWidth: '120px' },
				{ text: 'Created In',
				  minWidth: '40px',
				  maxWidth: '120px' },
			],
			'5': {
				parent: '4',
				gate: 'hidden',
				text: ['Type_5', 'Waldo', 'Metal Fab'],
				children: {}
			},
			'6': {
				parent: '4',
				gate: 'expanded',
				text: ['Type_6', 'Roberto', 'Space'],
				children: {
					'header': [
						{ text: 'Name',
						  minWidth: '40px',
						  maxWidth: '120px' },
						{ text: 'Created By',
						  minWidth: '40px',
						  maxWidth: '120px' },
						{ text: 'Created In',
						  minWidth: '40px',
						  maxWidth: '120px' },
					],
					'7': {
						parent: '6',
						gate: 'hidden',
						text: ['Type_7', 'Ralph', 'Mega 3'],
						children: {}
					}
				}
			},
			'8': {
				parent: '4',
				gate: 'hidden',
				text: ['Type_8', 'Brad Dunagan', 'Basics'],
				children: {}
			},
		},
	},
};

