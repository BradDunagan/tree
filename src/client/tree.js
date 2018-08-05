/*
         1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

	tree.js
*/

let tree = startingNodes;

function setGatedHtmlColumns ( node, columns ) {
	let htmlStart = 
		(  '<div class = "tree-table-gated-row">'
		 + '<i class = "tree-gate-2 far {{fa}}" '
		 +  'onclick="clickGate(event)"></i>')
		.replace ( '{{fa}}', node.gate === 'expanded' 
							 ? 'fa-minus-square'
							 : 'fa-plus-square'       );
	let htmlColumn = 
		'<div class = "tree-gated-column">{{text}}</div>'
	let htmlEnd = '</div>';
	let html = htmlStart;
	for ( let i = 0; i < columns.length; i++ ) {
		html += htmlColumn.replace ( '{{text}}',  columns[i] ); }
	html += htmlEnd;
	return html;
}	//	setGatedHtmlColumns()

function setGatedHtml ( ele, node, nodes ) {
	if ( nodes && nodes.header ) {
		ele.innerHTML = setGatedHtmlColumns ( node, node.text );
		return; }
	const htmlGated  = 
		'<i class = "far {{fa}} tree-gate" onclick="clickGate(event)"></i>'
	+   '<span class = "tree-item">{{text}}</span>';
	ele.innerHTML = htmlGated.replace ( '{{fa}}', node.gate === 'expanded' 
												  ? 'fa-minus-square'
												  : 'fa-plus-square'       )
							 .replace ( '{{text}}', node.text );
}	//	setGatedHtml();

function appendNodes ( nodes, ele ) {
	function headerHtml ( hdr ) {
		let htmlStart = 
			'<i class = "tree-empty-gate"></i>'
		+	'<div class = "tree-table-header">';
		let htmlColumn = 
			'<div class = "tree-column">{{text}}</div>'
		let htmlEnd = '</div>';
		let html = htmlStart;
		for ( let i = 0; i < hdr.length; i++ ) {
			html += htmlColumn.replace ( '{{text}}',  hdr[i].text ); }
		html += htmlEnd;
		return html;
	}
	function noGateColumns ( hdr, columns ) {
		let htmlStart = 
			'<i class = "tree-empty-gate"></i>'
		+	'<div class = "tree-table-row">';
		let htmlColumn = 
			'<div class = "tree-column">{{text}}</div>'
		let htmlEnd = '</div>';
		let html = htmlStart;
		for ( let i = 0; i < hdr.length; i++ ) {
			html += htmlColumn.replace ( '{{text}}',  columns[i] ); }
		html += htmlEnd;
		return html;
	}
	function noGate ( ele, node ) {
		if ( nodes.header ) {
			ele.innerHTML = noGateColumns ( nodes.header, node.text );
			return; }
		const htmlText = 
			'<i class = "tree-empty-gate"></i>'
		+   '<span class = "tree-item">{{text}}</span>';
		ele.innerHTML = htmlText.replace ( '{{text}}', node.text );
	}
	if ( nodes.header ) {
		console.log ( 'header: ' + JSON.stringify ( nodes.header ) );
		let child = document.createElement ( "div" );
		child.className = 'tree-node';
		child.innerHTML = headerHtml ( nodes.header ); 
		ele.appendChild ( child );
	}
	function renderNode ( handle ) {
		let node = nodes[handle];	//	node of child we are creating here
		console.log ( 'handle: ' + handle 
					+ ' node: ' + JSON.stringify ( node ) );
		let child = document.createElement ( "div" );
		child.dataset.handle = handle;
		if ( ! node.parent ) {
			child.className = 'tree-root-node'; }
		else {
			child.className = 'tree-node'; }
		if ( Object.values ( node.children ).length === 0 ) {
			noGate ( child, node ); }
		else {
			setGatedHtml ( child, node, nodes ); }
		if ( node.gate === 'expanded' ) {
			appendNodes ( node.children, child ); }
		ele.appendChild ( child );
	}
	function notSorted() {
		for ( let handle in nodes ) {
			if ( ! nodes.hasOwnProperty ( handle ) ) {
				continue; }
			if ( handle === 'header' ) {
				continue; }
			renderNode ( handle );
		}
	}
	function sorted() {
		let keys = Object.keys ( nodes );
		let iHdr = keys.findIndex ( e => { return e === 'header' } );
		if ( iHdr >= 0 ) {
			keys.splice ( iHdr, 1 ); }
		keys.sort ( ( sa, sb ) => {
			let nAC = Object.values ( nodes[sa].children ).length > 0;
			let nBC = Object.values ( nodes[sb].children ).length > 0;
			if ( (! nAC) && nBC ) {
				return -1; }
			if ( nAC && (! nBC) ) {
				return  1; }
			let a = parseInt ( sa );
			let b = parseInt ( sb );
			if ( a < b ) {
				return -1; }
			if ( a > b ) {
				return  1; }
			return 0;
		} )
		for ( let i = 0; i < keys.length; i++ ) {
			renderNode ( keys[i] ); }
	}
//	notSorted();
	sorted();
}	//	appendNodes()

function displayTree() {
	let ele = document.getElementsByClassName ( 'tree' )[0];
	while ( ele.childElementCount > 0 ) {
		ele.removeChild ( ele.children[0] ); }
	appendNodes ( tree, ele );
}	//	displayTree()

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
}

function getNodeDiv ( upCnt, ele ) {
	if (   (ele.className === 'tree-root-node')
		|| (ele.className === 'tree-node')      ) {
		return ele; }
	if ( upCnt > 3 ) {
		return null; }
	ele = ele.parentElement;
	if ( ! ele ) {
		return null; }
	return getNodeDiv ( ++upCnt, ele );
}

function clickGate ( evt ) {
	const sW = 'clickGate()';
	console.log ( sW );
	//	evt.target is the <i> element of the node. The parent element of <i> 
	//	is the <div> of the node whose handle, among other things, is what we 
	//	want.
	let nodeDiv = getNodeDiv ( 1, evt.target.parentElement );
	if ( ! nodeDiv ) {
		console.log ( sW + ' ERROR: failed to find node div' );
		return; }
	let handle  = nodeDiv.dataset.handle;
	let node = findNode ( tree, handle );
	if ( ! node ) {
		console.log ( sW + ' ERROR: failed to find node with handle ' 
						 + handle );
		return; }
	let nodes = null;
	if ( node.parent ) {
		let parent = findNode ( tree, node.parent );
		if ( ! node ) {
			console.log ( sW + ' ERROR: failed to find parent with handle ' 
							 + node.parent );
			return; }
		nodes = parent.children; }
	if ( node.gate === 'expanded' ) {
		while ( nodeDiv.childElementCount > 0 ) {
			nodeDiv.removeChild ( nodeDiv.children[0] ); }
		node.gate = 'collapsed';
		setGatedHtml ( nodeDiv, node, nodes );
	} else {
		node.gate = 'expanded';
		setGatedHtml ( nodeDiv, node, nodes );
		appendNodes ( node.children, nodeDiv  );
	}
}	//	clickGate()

//	tree.js
