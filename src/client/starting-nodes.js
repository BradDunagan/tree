/*
         1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

	starting-nodes.js
*/

let startingNodes = {
	'1': {
		parent: null,
		gate: 'expanded',
		text: 'root',
		children: {
			'2': {
				parent: '1',
				gate: 'hidden',
				text: 'item 1',
				children: {}
			},
			'3': {
				parent: '1',
				gate: 'hidden',
				text: 'item 3',
				children: {}
			},
		}
	},
	'4': {
		parent: null,
		gate: 'expanded',
		text: 'root',
		children: {
			'5': {
				parent: '4',
				gate: 'hidden',
				text: 'item 5',
                header: [
                    { text: 'col-0',
                      minWidth: '40px',
                      maxWidth: '120px' },
                    { text: 'col-1',
                      minWidth: '40px',
                      maxWidth: '120px' },
                    { text: 'col-2',
                      minWidth: '40px',
                      maxWidth: '120px' },
                ],
				children: {}
			},
			'6': {
				parent: '4',
				gate: 'expanded',
				text: 'item 6',
				children: {
					'7': {
						parent: '6',
						gate: 'hidden',
						text: 'item 7',
						children: {}
					}
				}
			},
			'8': {
				parent: '4',
				gate: 'hidden',
				text: 'item 8',
				children: {}
			},
		},
	},
};

