/*
         1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

	tree.js
*/

let tree = startingNodes;

function setGatedHtml ( ele, node ) {
	const htmlGated  = 
		'<i class = "far {{fa}} tree-gate" onclick="clickGate(event)"></i>'
	+   '<span class = "tree-item">{{text}}</span>';
	ele.innerHTML = htmlGated.replace ( '{{fa}}', node.gate === 'expanded' 
												  ? 'fa-minus-square'
												  : 'fa-plus-square'       )
							 .replace ( '{{text}}', node.text );
}	//	setGatedHtml();

function appendNodes ( nodes, ele ) {
	function headerHtml ( ele, node ) {
		let htmlStart = 
			'<i class = "tree-empty-gate"></i>'
		+	'<div class = "tree-header">';
		let htmlColumn = 
			'<div class = "tree-column" '
		+	'style = "min-width: {{min-w}}; max-width: {{max-w}};">'
		+	'{{text}}</div>'
		let htmlEnd = '</div>';
		let html = htmlStart;
		let hdr = node.header;
		for ( let i = 0; i < hdr.length; i++ ) {
			html += htmlColumn.replace ( '{{min-w}}', hdr[i].minWidth )
							  .replace ( '{{max-w}}', hdr[i].maxWidth )
							  .replace ( '{{text}}',  hdr[i].text ); }
		html += htmlEnd;
		return html;
	}
	function noGate ( ele, node ) {
		const htmlText = 
			'<i class = "tree-empty-gate"></i>'
		+   '<span class = "tree-item">{{text}}</span>';
		if ( node.header ) {
			ele.innerHTML = headerHtml ( ele, node );
		} else {
			ele.innerHTML = htmlText.replace ( '{{text}}', node.text ); } 
	}
	for ( let handle in nodes ) {
		if ( ! nodes.hasOwnProperty ( handle ) ) {
			continue; }
		let node = nodes[handle];	//	node of the child we are creating here
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
			setGatedHtml ( child, node ); }

		if ( node.gate === 'expanded' ) {
			appendNodes ( node.children, child ); }

		ele.appendChild ( child );
	}
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
		node = findNode ( nodes[hc].children, handle );
		if ( node ) {
			return node; }
	}
	return null;
}

function clickGate ( evt ) {
	const sW = 'clickGate()';
	console.log ( sW );
	//	evt.target is the <i> element of the node. The parent element of <i> 
	//	is the <div> of the node whose handle, among other things, is what we 
	//	want.
	let nodeDiv = evt.target.parentElement; 
	let handle  = nodeDiv.dataset.handle;
	let node = findNode ( tree, handle );
	if ( ! node ) {
		console.log ( sW + ' ERROR: failed to find node with handle ' 
						 + handle );
		return; }
	if ( node.gate === 'expanded' ) {
		while ( nodeDiv.childElementCount > 0 ) {
			nodeDiv.removeChild ( nodeDiv.children[0] ); }
		node.gate = 'collapsed';
		setGatedHtml ( nodeDiv, node );
	} else {
		node.gate = 'expanded';
		setGatedHtml ( nodeDiv, node );
		appendNodes ( node.children, nodeDiv  );
	}
}	//	clickGate()

//	tree.js
