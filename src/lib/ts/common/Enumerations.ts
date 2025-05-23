export enum T_Graph {
	radial = 'radial',
	tree   = 'tree',
}

export enum T_Report {
	selection = 'selection',
	focus	  = 'focus',
}

export enum T_Storage {
	import = 'import',
	export = 'export',
}

export enum T_Alteration {
	deleting = 'deleting',
	adding	 = 'adding',
}

export enum T_Hierarchy {
	children = 'children',
	parents	 = 'parents',
	related  = 'related',
}

export enum T_Create {
	isFromPersistent = 'isFrom',
	getPersistentID	 = 'getID',
	none			 = '',
}

export enum T_Widget {
	radial = 'radial',
	focus  = 'focus',
	tree   = 'tree',
}

export enum T_Curve {
	flat = 'flat',
	down = 'down',
	up	 = 'up',
}

export enum T_Banner {
	controls,
	crumbs,
	graph,
}

export enum T_Persistence {
    remote = 'remote',
    local  = 'local',
    none   = 'none',
}

export enum T_Details {	// order must not change
	storage,
	tools,
	display,
	info,
}

export enum T_Startup {
	start = 'start',
	fetch = 'fetch',
	empty = 'empty',
	ready = 'ready',
}

export enum T_RingZone {
	miss   = 'miss',
	resize = 'resize',
	rotate = 'rotate',
	paging = 'paging',
}

export enum T_Oblong {
	middle = 'middle',
	right  = 'right',
	left   = 'left',
	full   = 'full',
}

export enum T_Thing {
	externals = '^',	// list of bulks
	generic	  = '',
	found	  = '?',
	root	  = '!',
	bulk	  = '~',	// bulk alias
}

export enum T_Database {
    airtable = 'airtable',
    firebase = 'firebase',
    plugin   = 'plugin',
    local    = 'local',
    test     = 'test',
}

export enum T_Predicate {
	appreciates = 'appreciates',
	isRelated	= 'isRelated',
	contains	= 'contains',
	explains	= 'explains',
	requires	= 'requires',
	supports	= 'supports',
}

export enum T_Control {
	details	 = 'show details view',
	builds	 = 'show build notes',
	related	 = 'show related',
	smaller	 = 'smaller',
	bigger	 = 'bigger',
	import	 = 'import',
	help	 = '?',
}

export enum T_Browser  {
	explorer = 'explorer',
	unknown  = 'unknown',
	firefox	 = 'firefox',
	chrome	 = 'chrome',
	safari	 = 'safari',
	opera	 = 'opera',
	orion	 = 'orion',
}

export enum T_Persistable {
    relationships = 'Relationships',
    predicates    = 'Predicates',
    hierarchy     = 'Hierarchy',    // includes parent contains and relateds
    progeny       = 'Progeny',      // only child contains
    things        = 'Things',
    traits        = 'Traits',
    access        = 'Access',
    users         = 'Users',
}

export enum T_Info {
	segments,
	before_title,
	title,
	after_title,
	table,
	color,
	traits,
	consequence,
	quest
};

export enum T_Trait {
	consequence = 'consequence',
	hyperlink	= 'hyperlink',
	citation	= 'citation',
	generic		= 'generic',
	comment		= 'comment',
	money		= 'money',
	phone		= 'phone',
	quest		= 'quest',
	note		= 'note',
	date		= 'date',
	sum			= 'sum',
}

export enum T_Element {
	radial_focus = 'radial_focus',
	breadcrumb 	 = 'breadcrumb',
	control		 = 'control',
	storage		 = 'storage',
	reveal		 = 'reveal',
	title		 = 'title',
	widget		 = 'widget',
	focus		 = 'focus',
	drag		 = 'drag',
	info		 = 'info',
	none		 = 'none',
	tool		 = 'tool',
}

export enum T_Rebuild {		// design goal: replace all rebuilds counts?
	radial = 'radial',		// only this enum is used    (in Radial_Graph)
	reveal = 'reveal',
	widget = 'widget',
	crumbs = 'crumbs',
	crumb  = 'crumb',
	tools  = 'tools',
	panel  = 'panel',
	info   = 'info',
	tree   = 'tree',
	line   = 'line',
	drag   = 'drag',
}

export enum T_Layer {	// DO NOT change the order
	common,
	paging,
	rings,
	necklace,
	lines,
	widgets,
	dots,
	text,
	tools,
	tool_buttons,
	details,
	frontmost,
}

export enum T_Tool {
	delete_confirm = 'delete_confirm',
	delete_cancel  = 'delete_cancel',
	delete_parent  = 'delete_parent',
	confirmation   = 'confirmation',
	add_parent	   = 'add_parent',
	dismiss		   = 'dismiss',
	delete		   = 'delete',
	create    	   = 'create',
	next		   = 'next',
	more		   = 'more',
	none		   = 'none',
}

export enum T_SvelteComponent {
	banners	= 'banners',
	details	= 'details',
	rotate	= 'rotate',
	paging	= 'paging',
	widget	= 'widget',		// *
	button	= 'button',		// *
	reveal	= 'reveal',
	graph	= 'graph',
	thumb	= 'thumb',
	tools	= 'tools',
	title	= 'title',		// *
	drag	= 'drag',
	line	= 'line',
	app		= 'app',
}

export enum T_Preference {
	expanded_children = 'expanded_children',
	focus_forChildren = 'focus_forChildren',
	expanded_parents  = 'expanded_parents',
	focus_forParents  = 'focus_forParents',
	relationships	  = 'relationships',
	detail_types	  = 'detail_types',
	show_details	  = 'show_details',
	show_related	  = 'show_related',
	ring_radius		  = 'ring_radius',
	user_offset		  = 'user_offset',
	background		  = 'background',
	ring_angle  	  = 'ring_angle',
	countDots		  = 'countDots',
	font_size		  = 'font_size',
	base_id			  = 'base_id',
	grabbed			  = 'grabbed',
	paging 			  = 'paging',
	traits			  = 'traits',
	graph			  = 'graph',
	scale			  = 'scale',
	focus			  = 'focus',
	local			  = 'local',
	info	    	  = 'info',
	font			  = 'font',
	tree			  = 'tree',
	db				  = 'db',
}
