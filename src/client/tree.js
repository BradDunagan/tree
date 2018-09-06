/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

	tree-2.js

	Initially developed in -
		D:\dign\OT\tree\tree-a
	and pushed to -
		https://github.com/BradDunagan/tree-a
*/


let tree2 = ( function() {

let O = {
	TVI_ROOT: 				1,
	HTREE_ITEM_FIRST:		1001,
	newTree: 				newTree,
	findNode: 				findNode,
	getSortedChildrenKeys:	getSortedChildrenKeys,
};

let lastTreeId = 0;

function setGatedHtmlColumns ( ele, node, columns, tree ) {
	let htmlStart = 
		(  '<div class = "tree-table-gated-row">'
		 + '<i class = "tree-gate-2 far {{fa}}"></i>')
		.replace ( '{{fa}}', node.gate === 'expanded' 
							 ? 'fa-minus-square'
							 : 'fa-plus-square'       );
	let htmlColumn = 
		'<div class = "tree-gated-column">{{text}}</div>'
	let htmlEnd = '</div>';
	let html = htmlStart;
	for ( let i = 0; i < columns.length; i++ ) {
		html += htmlColumn.replace ( '{{text}}',  columns[i] ); }
	ele.innerHTML = html + htmlEnd;
	ele.getElementsByTagName ( 'i' )[0].onclick = tree.clickGate;
}	//	setGatedHtmlColumns()

function setGatedHtml ( ele, node, nodes, tree ) {
	if ( Array.isArray ( node.text ) ) {
		setGatedHtmlColumns ( ele, node, node.text, tree );
		return; }
	const htmlGated  = 
		'<i class = "{{nodisplay}} far {{fa}} tree-gate"></i>'
	+   '<span class = "{{nodisplay}}">{{text}}</span>';
	ele.innerHTML = htmlGated
		.replace ( '{{fa}}', node.gate === 'expanded' ? 'fa-minus-square'
													  : 'fa-plus-square' )
		.replace ( '{{text}}', node.text )
		.replace ( /{{nodisplay}}/g, 
			((! node.parent) && tree.opts.bHideRootNode) ? 'tree-no-display' 
							   							 : '' );
	ele.getElementsByTagName ( 'i' )[0].onclick = tree.clickGate;
}	//	setGatedHtml();

function sortedKeys ( nodes ) {
	let keys = Object.keys ( nodes );
	//	Remove the header from the keys.
	let iHdr = keys.findIndex ( e => { return e === 'header' } );
	if ( iHdr >= 0 ) {
		keys.splice ( iHdr, 1 ); }
	keys.sort ( ( sa, sb ) => {
		let nodeA = nodes[sa];
		let nodeB = nodes[sb];
		//	Nodes with children are > those without.
		let nAC = Object.values ( nodeA.children ).length > 0;
		let nBC = Object.values ( nodeB.children ).length > 0;
		if ( nAC && (! nBC) ) {
			return  1; }
		if ( (! nAC) && nBC ) {
			return -1; }
		//	A node with an editor goes at the top (is < others).
		if ( nodeA.data.bEdit ) {
			return -1; }
		if ( nodeB.data.bEdit ) {
			return  1; }
		//	Try to sort by text first.
		let sA = Array.isArray ( nodeA.text ) ? nodeA.text[0] : nodeA.text;
		let sB = Array.isArray ( nodeB.text ) ? nodeB.text[0] : nodeB.text;
		if ( sA < sB ) {
			return -1; }
		if ( sA > sB ) {
			return  1; }
		let a = parseInt ( sa );
		let b = parseInt ( sb );
		if ( a < b ) {
			return -1; }
		if ( a > b ) {
			return  1; }
		return 0;
	} )
	return keys;
}	//	sortedKeys()

function noGateColumns ( columns, tree ) {
	let htmlStart = 
		'<i class = "tree-empty-gate"></i>'
	+	'<div class = "' + (tree.opts.bAsList ? 'tree-table-row-in-list'
											  : 'tree-table-row') + '">';
	let htmlColumn = 
		'<div class = "tree-column">{{text}}</div>'
	let htmlEnd = '</div>';
	let html = htmlStart;
	for ( let i = 0; i < columns.length; i++ ) {
		html += htmlColumn.replace ( '{{text}}',  columns[i] ); }
	html += htmlEnd;
	return html;
}

function noGate ( ele, node, clickItem, tree ) {
	if ( Array.isArray ( node.text ) ) {
		ele.innerHTML = noGateColumns ( node.text, tree ); }
	else {
		const htmlText = 
			'<i class = "tree-empty-gate"></i>'
	//	+   '<span class = "tree-item">{{text}}</span>';
		+	'<div class = "' + (tree.opts.bAsList ? 'tree-table-row-in-list'
									 			  : 'tree-table-row') + '">' 
		+   	'<span>{{text}}</span>'
		+ 	'</div>';
		if ( node.data.bEdit ) {
			const htmlEdit = '<input class = "tree-input"/>';
			ele.innerHTML = htmlText.replace ( '{{text}}', htmlEdit );
		} else {
			ele.innerHTML = htmlText.replace ( '{{text}}', node.text ); }
	}
	let selector = tree.opts.bAsList ? '.tree-table-row-in-list'
									 : '.tree-table-row' 
				 + ' > .tree-column:first-child';
	let div = ele.querySelectorAll ( selector )[0];
	if ( div ) {
		div.onclick = clickItem; }
	let input = ele.querySelectorAll ( 'input' )[0];
	if ( input ) {
		input.onkeydown 	= tree.inputKeydown;
		input.onkeypress 	= tree.inputKeypress;
		input.oninput 		= tree.inputItem; 
		input.onchange 		= tree.inputChange;
		input.onfocus 		= tree.inputFocus; 
		input.onblur 		= tree.inputBlur; }
}

function appendNodes ( parent, nodes, ele, tree ) {
	function headerHtml ( hdr ) {		//	Render a header.
		let htmlStart = 
			'<i class = "tree-empty-gate"></i>'
		+	'<div class = "tree-table-header">';
		let htmlColumn = 
			'<div class = "tree-column">{{text}}</div>'
		let htmlEnd = '</div>';
		let html = htmlStart;
		for ( let i = 0; i < hdr.length; i++ ) {
			html += htmlColumn.replace ( '{{text}}',  hdr[i] ); }
		html += htmlEnd;
		return html;
	}
	function hasChildren ( node ) {
		return (Object.values ( node.children ).length !== 0);
	}
	function renderNode ( handle ) {
		let node = nodes[handle];	//	node of child we are creating here
		console.log ( 'handle: ' + handle 
					+ ' node: ' + JSON.stringify ( node ) );
		let child = document.createElement ( "div" );
		child.dataset.handle = handle;
		if ( ! parent ) {
			child.className = 'tree-root-node'; }
		else {
			child.className = 	 
				(tree.opts.bHideRootNode && (parent.data.tag === 'root-type'))
				? 'tree-node-no-display-parent'
				: tree.opts.bAsList ? 'tree-node-in-list'
									: 'tree-node'; }
		if ( hasChildren ( node ) ) {
			setGatedHtml ( child, node, nodes, tree ); }
		else {
			noGate ( child, node, tree.clickItem, tree ); }
		if ( node.gate === 'expanded' ) {
			appendNodes ( node, node.children, child, tree ); }
		child.id = 'rr-tn-' + tree.treeId + '-' + handle;
		ele.appendChild ( child );
	}
	function notSorted() {
		let handles = [];
		for ( let handle in nodes ) {
			if ( ! nodes.hasOwnProperty ( handle ) ) {
				continue; }
			if ( handle === 'header' ) {
				continue; }
			handles.push ( handle );
			renderNode ( handle );
		}
		return handles;
	}
	function sorted() {
		let handles = [];
		let keys = sortedKeys ( nodes );
		for ( let i = 0; i < keys.length; i++ ) {
			handles.push ( keys[i] );
			renderNode ( keys[i] ); }
		return handles;
	}
	if ( nodes.header ) {	//	If there is a header, naturally, it is first.
		console.log ( 'header: ' + JSON.stringify ( nodes.header ) );
		let child = document.createElement ( "div" );
		child.className = 	 
			(tree.opts.bHideRootNode && (parent.data.tag === 'root-type'))
			? 'tree-node-no-display-parent'
			: tree.opts.bAsList ? 'tree-node-in-list'
								: 'tree-node';
		child.innerHTML = headerHtml ( nodes.header ); 
		ele.appendChild ( child );
	}
//	return notSorted();
	return sorted();
}	//	appendNodes()

function getNodeDiv ( upCnt, ele ) {
	if (   (ele.className === 'tree-root-node')
		|| (ele.className === 'tree-node')
		|| (ele.className === 'tree-node-in-list')
		|| (ele.className === 'tree-node-no-display-parent') ) {
		return ele; }
	if ( upCnt > 3 ) {
		return null; }
	ele = ele.parentElement;
	if ( ! ele ) {
		return null; }
	return getNodeDiv ( ++upCnt, ele );
}

function getEventNode ( sW, tree, evt ) {
	let nodeDiv = getNodeDiv ( 1, evt.target.parentElement );
	if ( ! nodeDiv ) {
		console.log ( sW + ' ERROR: failed to find node div' );
		return null; }
	let handle  = nodeDiv.dataset.handle;
	let node = findNode ( tree, handle );
	if ( ! node ) {
		console.log ( sW + ' ERROR: failed to find node with handle ' 
						 + handle );
		return null; }
	return { handle: handle, node: node };
}	//	getEventNode()

function Tree ( id, opts ) {
	this.treeId = id;
	this.opts   = Object.assign ( {}, opts );
	this.tree   = {};

	this.onClickItem = null;
	this.onInput = null;

	//	Each new item's handle = ++hLast;
	this.hLast = O.HTREE_ITEM_FIRST - 1;	
	//	A callback when an item inserted.
	this.cbInsertItem = null;
	//	A list of child handles (keys) of a particular node. getChildItem()
	//	populate this list, set iChildHandle to 0, and return the first
	//	child's handle (if no children, returns 0). subsequent calls to 
	//	getNextSiblingItem() will return the next child after that returned
	//	by getChildItem() (or a previous call to getNextSiblingItem()).
	this.childHandleList = [];
	this.iChildHandle = 0;			//	Is this necessary/used?

	let self = this;

	this.clickGate = function ( evt ) {
		const sW = 'Tree clickGate()';
		console.log ( sW );
		//	evt.target is the <i> element of the node. The parent element of <i> 
		//	is the <div> of the node whose handle, among other things, is what we 
		//	want.
		let nodeDiv = getNodeDiv ( 1, evt.target.parentElement );
		if ( ! nodeDiv ) {
			console.log ( sW + ' ERROR: failed to find node div' );
			return; }
		let handle  = nodeDiv.dataset.handle;
		let node = findNode ( self.tree, handle );
		if ( ! node ) {
			console.log ( sW + ' ERROR: failed to find node with handle ' 
							+ handle );
			return; }
		let nodes = null;
		if ( node.parent ) {
			let parent = findNode ( self.tree, node.parent );
			if ( ! node ) {
				console.log ( sW + ' ERROR: failed to find parent with handle ' 
								+ node.parent );
				return; }
			nodes = parent.children; }
		if ( node.gate === 'expanded' ) {
			while ( nodeDiv.childElementCount > 0 ) {
				nodeDiv.removeChild ( nodeDiv.children[0] ); }
			node.gate = 'collapsed';
			setGatedHtml ( nodeDiv, node, nodes, self );
		} else {
			node.gate = 'expanded';
			setGatedHtml ( nodeDiv, node, nodes, self );
			appendNodes ( node, node.children, nodeDiv, self  );
		}
	}	//	clickGate()


	this.clickItem = function ( evt ) {
		const sW = 'Tree clickItem()';
		console.log ( sW );
		if ( ! self.onClickItem ) {
			return; }
	//	let nodeDiv = getNodeDiv ( 1, evt.target.parentElement );
	//	if ( ! nodeDiv ) {
	//		console.log ( sW + ' ERROR: failed to find node div' );
	//		return; }
	//	let handle  = nodeDiv.dataset.handle;
	//	let node = findNode ( self.tree, handle );
	//	if ( ! node ) {
	//		console.log ( sW + ' ERROR: failed to find node with handle ' 
	//						+ handle );
	//		return; }
		let en = getEventNode ( sW, self.tree, evt );
		if ( ! en ) {
			return; }
		self.onClickItem ( evt.target, en.handle, en.node );
	}	//	clickItem()

	this.inputKeydown = function ( evt ) {
		const sW = 'Tree inputKeydown()';
		console.log ( sW );
		let en = getEventNode ( sW, self.tree, evt );
		if ( ! en ) {
			return; }
		if ( evt.code === 'Escape' ) {
			self.onInput ( { do: 		'escape', 
							 handle: 	en.handle, 
							 node: 		en.node } );
			evt.stopPropagation();
			return; }
		if ( evt.code === 'Enter' ) {
			self.onInput ( { do: 		'enter', 
							 handle: 	en.handle, 
							 node: 		en.node,
							 text: 		evt.target.value } );
			evt.stopPropagation();
			return; }
	}

	this.inputKeypress = function ( evt ) {
		const sW = 'Tree inputKeypress()';
		console.log ( sW );
		if ( ! self.onInput ) {
			return; }
	}

	this.inputItem = function ( evt ) {
		const sW = 'Tree inputItem()';
		console.log ( sW );
	}

	this.inputChange = function ( evt ) {
		const sW = 'Tree inputChange()';
		console.log ( sW );
	}

	this.inputFocus = function ( evt ) {
		const sW = 'Tree inputFocus()';
		console.log ( sW );
	}

	this.inputBlur = function ( evt ) {
		const sW = 'Tree inputBlur()';
		console.log ( sW );
		let en = getEventNode ( sW, self.tree, evt );
		if ( ! en ) {
			return; }
		self.onInput ( { do: 		'blur', 
						 handle: 	en.handle, 
						 node: 		en.node } );
		evt.stopPropagation();
	}

	this.getTree = function () {
		return self.tree;
	}	//	getTree()

	this.setOnClickItem = function ( fnc ) {
		self.onClickItem = fnc;
	}	//	setOnClickItem()

	this.setOnInput = function ( fnc ) {
		self.onInput = fnc;
	}	//	setOnInput()

	this.clearTree = function () {
		self.tree = {};
	}	//	clearTree()

	this.expand = function ( node, handle ) {
		const sW = 'Tree expand()';
		if ( node.gate === 'expanded' ) {
			console.log ( sW + ' node is already expanded' );
			return true; }
		let nodes = null;
		if ( node.parent ) {			//	Somewhat like clickGate().
			let parent = findNode ( self.tree, node.parent );
			if ( ! node ) {
				console.log ( sW + ' ERROR: failed to find parent with handle ' 
								+ node.parent );
				return false; }
			nodes = parent.children; }
		else {
			nodes = self.tree; }
		let nodeDiv = document.getElementById ( 'rr-tn-' + self.treeId + '-' 
														 + handle );
		if ( ! nodeDiv ) {
			console.log ( sW + ' ERROR: failed to find nodeDiv' );
			return false; }
		node.gate = 'expanded';
		setGatedHtml ( nodeDiv, node, nodes, self );
		appendNodes ( node, node.children, nodeDiv, self  );
		return true;
	}	//	expand()

	this.deleteNode = function ( node, handle ) {
		let parent = node.parent ? findNode ( self.tree, node.parent ) 
								 : self.tree;
		let nodeDiv = document.getElementById ( 'rr-tn-' + self.treeId + '-' 
														 + handle );
		if ( ! nodeDiv ) {
			return false; }
		if ( ! parent ) {
			return false; }
		nodeDiv.remove();
		delete parent.children[handle];
		return true;
	}	//	deleteNode()

	this.displayNewNode = function ( handle ) {
		const sW = 'Tree displayNewNode()';
		let node = findNode ( self.tree, handle );
		if ( ! node ) {
			console.log ( sW + ' ERROR: new node not found' ); 
			return; }
		let parent = findNode ( self.tree, node.parent );
		if ( ! parent ) {
			console.log ( sW + ' ERROR: new node parent not found' ); 
			return; }
		let keys = sortedKeys ( parent.children );
		let iNew = keys.indexOf ( '' + handle );
		if ( iNew < 0 ) {
			console.log ( sW + ' ERROR: new node key not found' ); 
			return; }
		let nextDiv = null;
		if ( iNew < keys.length -1 ) {
			const hNext = keys[iNew + 1];
			nextDiv = document.getElementById ( 'rr-tn-' + self.treeId + '-' 
														 + self.hNext ); }
		let parentDiv = document.getElementById ( 'rr-tn-' + self.treeId + '-' 
														   + node.parent );
		if ( ! parentDiv ) {
			console.log ( sW + ' ERROR: parent div not found' );
			return; }
		let child = document.createElement ( 'div' );
		child.dataset.handle = handle;
		child.className = 	 
			(self.opts.bHideRootNode && (parent.data.tag === 'root-type'))
			? 'tree-node-no-display-parent'
			: self.opts.bAsList ? 'tree-node-in-list'
								: 'tree-node';
		noGate ( child, node, self.clickItem, this );
		child.id = 'rr-tn-' + self.treeId + '-' + handle;
		parentDiv.insertBefore ( child, nextDiv );
		return { ele: child, node: node };
	}	//	displayNewNode()

	this.displayTree = function ( ele, start ) {
	//	let ele = document.getElementsByClassName ( 'tree' )[0];
		while ( ele.childElementCount > 0 ) {
			ele.removeChild ( ele.children[0] ); }
		if ( start ) {
			self.tree = start; }
		return appendNodes ( null, self.tree, ele, self ); 
	}	//	displayTree()

	this.setInsertItemCallback = function ( fnc ) {
		self.cbInsertItem = fnc; 
	}	//	setInsertItemCallback()

	this.getNodeElement = function ( handle ) {
		return document.getElementById ( 'rr-tn-' + self.treeId + '-'
												  + handle );
	}	//	getNodeElement()

	this.tt_insertItem = function ( a ) {
		const sW = 'Tree insertItem()';
		let nodes = null;
		let hParent = null;
		if ( (a.hParent <= 0) || (a.hParent > self.hLast) ) {
			console.log ( sW + ' ERROR: bad a.hParent' );
			return 0; }
		if ( a.hParent === O.TVI_ROOT ) {		//	Parent is the root?
			nodes = self.tree;
		} else
		if ( a.hParent >= O.HTREE_ITEM_FIRST ) {	//	Is an existing item?
			let parent = findNode ( self.tree, a.hParent );
			if ( ! parent ) {
				console.log ( sW + ' ERROR: parent not found' );
				return 0; }
			nodes = parent.children;
			hParent = a.hParent;
		} else {
			console.log ( sW + ' ERROR: unrecognized a.hParent' );
			return 0;
		}
	//	if ( a.hInsertAfter === 2 ) {	//	First?
	//
	//	} else
	//	if ( a.hInsertAfter === 3 ) {	//	Last?
	//
	//	} else
	//	if ( a.hInsertAfter === 2 ) {	//	Sort?
	//
	//	} else {
	//		let a = findItemIndex ( tree, a.hInsertAfter );
	//	}
		nodes[++self.hLast] = {
			parent:		hParent,
			gate: 		'hidden',
			text: 		a.text,		//	[<name>, <created-by>, <created-in>]
			children: 	{}
		}
		if ( self.cbInsertItem ) {
			self.cbInsertItem ( a, self.hLast, nodes[self.hLast] ); }
		return self.hLast;
	}	//	insertItem()

	this.tt_setItemData = function ( a ) {	
		const sW = 'Tree setItemData()';
		if ( (a.hItem <= 0) || (a.hItem > self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return 0; }
		let node = findNode ( self.tree, a.hItem );
		if ( ! node ) {
			console.log ( sW + ' ERROR: item not found' );
			return false; }
		let data = null;
		try {
			data = JSON.parse ( a.json );
		} catch ( e ) {
			console.log ( sW + ' ERROR: ' + e );
			return false;
		}
		if ( data.tag === 'header' ) {
			if ( ! node.parent ) {
				console.log ( sW + ' ERROR: header but node has no parent' );
				return false; }
			let parent = findNode ( self.tree, node.parent );
			if ( ! parent ) {
				console.log ( sW + ' ERROR: parent node not found' );
				return false; }
			if ( parent.children[a.hItem] ) {
				delete parent.children[a.hItem]; }
			parent.children['header'] = data.header; }
		else {
			if ( (data.tag === 'type') && Array.isArray ( data.columns ) ) {
				node.text = data.columns; }
			node.data = data;
			node.data.pD = a.pD; }
		return true;
	}	//	setItemData()

	this.tt_getItemData = function ( a ) {	
		const sW = 'Tree getItemData()';
		if ( (a.hItem <= 0) || (a.hItem > self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return 0; }
		let node = findNode ( self.tree, a.hItem );
		if ( ! node ) {
			console.log ( sW + ' ERROR: item not found' );
			return 0; }
		if ( (! node.data) || (! node.data.pD) ) {
			console.log ( sW + ' ERROR: item data is not set' );
			return 0; }
		return node.data.pD;
	}	//	getItemData()

	this.tt_getParentItem = function ( a ) {
		const sW = 'Tree getParentItem()';
		if ( (a.hItem <= 0) || (a.hItem > self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return 0; }
		let node = findNode ( self.tree, a.hItem );
		if ( ! node ) {
			console.log ( sW + ' ERROR: item not found' );
			return 0; }
		if ( ! node.hParent ) {
			return 0; }
		return node.hParent;
	}	//	getParentItem()

	this.tt_itemHasChildren = function ( a ) {
		const sW = 'Tree itemHasChildren()';
		if ( (a.hItem <= 0) || (a.hItem > self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return 0; }
		let node = findNode ( self.tree, a.hItem );
		if ( ! node ) {
			console.log ( sW + ' ERROR: item not found' );
			return 0; }
		return Object.values ( node.children ).length > 0;
	}	//	itemHasChildren()

	this.tt_getChildItem = function ( a ) {
		const sW = 'Tree getChildItem()';
		let nodes = null;
		let hParent = null;
		if ( (a.hParent <= 0) || (a.hParent > self.hLast) ) {
			console.log ( sW + ' ERROR: bad a.hParent' );
			return 0; }
		if ( a.hParent === 1 ) {		//	Parent is the root?
			nodes = self.tree;
		} else
		if ( a.hParent > 1000 ) {		//	Parent is an existing item?
			let parent = findNode ( self.tree, a.hParent );
			if ( ! parent ) {
				console.log ( sW + ' ERROR: parent not found' );
				return 0; }
			nodes = parent.children;
			hParent = a.hParent;
		} else {
			console.log ( sW + ' ERROR: unrecognized a.hParent' );
			return 0;
		}
		let keys = Object.keys ( nodes );
		let iHdr = keys.findIndex ( e => { return e === 'header' } );
		if ( iHdr >= 0 ) {
			keys.splice ( iHdr, 1 ); }
		self.childHandleList = keys;
		self.iChildHandle = 0;
		if ( keys.length > 0 ) {
			return parseInt ( keys[0] ); }
		return 0;
	}	//	getChildItem()

	this.tt_getNextSiblingItem = function ( a ) {
		const sW = 'Tree getNextSiblingItem()';
		if ( (a.hItem <= 0) || (a.hItem > self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return 0; }
		let shItem = a.hItem.toString();
		let iItem  = self.childHandleList.findIndex ( e => { 
			return e === shItem } );
		if ( iItem < 0 ) {
			console.log ( sW + ' ERROR: a.hItem not found in child list' );
			return 0; }
		iItem += 1;
		if ( iItem >= self.childHandleList.length ) {
			return 0; }
		return parseInt ( self.childHandleList[iItem] );
	}	//	getNextSiblingItem()

	this.tt_getItemText = function ( a ) {
		const sW = 'Tree getItemText()';
		if ( (a.hItem <= 0) || (a.hItem > self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return 0; }
		let node = findNode ( self.tree, a.hItem );
		if ( ! node ) {
			console.log ( sW + ' ERROR: node not found' );
			return 0; }
		if ( typeof node.text === 'array' ) {
			return node.text[0]; }
		return node.text;
	}	//	getItemText()

	this.tt_getNextItem = function ( a ) {
		const sW = 'Tree getNextItem()';
		if ( (a.hItem <= 0) || (a.hItem > self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return 0; }
		let node = findNode ( self.tree, a.hItem );
		if ( ! node ) {
			console.log ( sW + ' ERROR: item not found' );
			return 0; }
		if ( a.what === 21 ) {		//	Get first child.
			let childrenKeys = sortedKeys ( node.children );
			if ( childrenKeys.length === 0 ) {
				return 0; }
			return childrenKeys[0];
		}
		console.log ( sW + ' ERROR: unrecognized/unimplemented a.what ' 
						+ a.what );
		return 0;
	}	//	getNextItem()

	this.tt_expand = function ( a ) {
		const sW = 'Tree expand()';
		if ( (a.hItem <= 0) || (a.hItem > self.self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return false; }
		let node = findNode ( self.tree, a.hItem );
		if ( ! node ) {
			console.log ( sW + ' ERROR: item not found' );
			return false; }
		if ( a.what === 22 ) {		//	Expand node.
			return self.expand ( node, a.hItem ); }
		console.log ( sW + ' ERROR: unrecognized/unimplemented a.what ' 
							+ a.what );
		return false;
	}	//	expand()

	this.tt_deleteItem = function ( a ) {
		const sW = 'Tree deleteItem()';
		if ( (a.hItem <= 0) || (a.hItem > self.hLast) ) {
			console.log ( sW + ' ERROR: bad hItem' );
			return false; }
		let node = findNode ( self.tree, a.hItem );
		if ( ! node ) {
			console.log ( sW + ' ERROR: item not found' );
			return false; }
		return self.deleteNode ( node, a.hItem );
	}	//	deleteItem()

	this.ttFncs = {
		'TT_InsertItem': 			this.tt_insertItem,
		'TT_SetItemData':			this.tt_setItemData, 
		'TT_GetItemData':			this.tt_getItemData, 
		'TT_GetParentItem':			this.tt_getParentItem, 
		'TT_ItemHasChildren':		this.tt_itemHasChildren, 
		'TT_GetChildItem':			this.tt_getChildItem, 
		'TT_GetNextSiblingItem':	this.tt_getNextSiblingItem,
		'TT_GetItemText':			this.tt_getItemText,
		'TT_GetNextItem':			this.tt_getNextItem, 
		'TT_Expand':				this.tt_expand, 
		'TT_DeleteItem':			this.tt_deleteItem, };

	this.execTypeTree = function ( sCmd, a ) {
		//	switch ( sCmd ) {
		//		case 'TT_InsertItem':
		//			insertItem ( a )
		//	}
		return self.ttFncs[sCmd] ( a );
	}   //  execTypeTree()


}	//	Tree()

	function newTree ( opts ) {
		return new Tree ( ++lastTreeId, opts );
	}	//	newTree()

	function findNode ( nodes, handle ) {
		let node = nodes[handle];
		if ( typeof node !== 'undefined' ) {
			return node; }
		for ( let hc in nodes ) {
			if ( ! nodes.hasOwnProperty ( hc ) ) {
				continue; }
			if ( hc === 'header' ) {
				continue; }
			node = findNode ( nodes[hc].children, handle );
			if ( node ) {
				return node; }
		}
		return null;
	}	//	findNode()

	function getSortedChildrenKeys ( node ) {
		return sortedKeys ( node.children );
	}	//	getSortedChildrenKeys()

	return O;

} )();

//	tree-2.js
