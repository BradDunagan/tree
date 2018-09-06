/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

	starting-nodes-2.js
*/

//  Test nodes for a list.  No node has children.

let startingNodes2 = (function() {

let nodes = {
	'1': {
		parent: null,
		data: {
			tag: '',
		},
		gate: 'expanded',
		text: 'Stacy',
		children: {
            '1001': {
                parent: '1',
                data: {
                    tag:    '',
                    bEdit:  true,
                },
                gate: 'hidden',
                text: '',
                children: {}
            },
            '1002': {
                parent: '1',
                data: {
                    tag: '',
                },
                gate: 'hidden',
                text: 'Irwin',
                children: {}
            },
            '1003': {
                parent: '1',
                data: {
                    tag: '',
                },
                gate: 'hidden',
                text: 'Thurman',
                children: {}
            },
        }
	},
};

	return nodes;

} )();

//	starting-nodes-2.js

