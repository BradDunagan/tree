/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

	starting-nodes.js
*/

let startingNodes = (function() {

let nodes = {
	'1': {
		parent: null,
		data: {
			tag: '',
		},
		gate: 'expanded',
		text: 'Local Types',
		children: {
			'header': ['Name', 'Created By', 'Created In'],
			'2': {
				parent: '1',
				data: {
					tag: '',
				},
				gate: 'hidden',
				text: ['Type_1', 'Alfonso Smith', 'Ride It'],
				children: {}
			},
			'3': {
				parent: '1',
				data: {
					tag: '',
				},
				gate: 'hidden',
				text: ['Type_3', 'Jane Jackson', 'Medical'],
				children: {}
			},
		}
	},
	'4': {
		parent: null,
		data: {
			tag: '',
		},
		gate: 'expanded',
		text: 'Share Types',
		children: {
			'header': ['Name', 'Created By', 'Created In'],
			'5': {
				parent: '4',
				data: {
					tag: '',
				},
				gate: 'hidden',
				text: ['Type_5', 'Waldo', 'Metal Fab'],
				children: {}
			},
			'6': {
				parent: '4',
				data: {
					tag: '',
				},
				gate: 'expanded',
				text: ['Type_6', 'Roberto', 'Space'],
				children: {
					'header': ['Name', 'Created By', 'Created In'],
					'7': {
						parent: '6',
						data: {
							tag: '',
						},
						gate: 'hidden',
						text: ['Type_7', 'Ralph', 'Mega 3'],
						children: {}
					}
				}
			},
			'8': {
				parent: '4',
				data: {
					tag: '',
				},
				gate: 'hidden',
				text: ['Type_8', 'Brad Dunagan', 'Basics'],
				children: {}
			},
		},
	},
	'9': {
		parent: null,
		data: {
			tag: '',
		},
		gate: 'hidden',
		text: 'Empty Root',
		children: {}
	},
};

	return nodes;

} )();


//	starting-nodes.js

