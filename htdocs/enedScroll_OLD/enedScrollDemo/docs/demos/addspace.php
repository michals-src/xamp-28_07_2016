<fieldset id="<?php echo getLink('Using addSpace'); ?>">
	<p class="lead"><code>Add space</code> function - demo</p>
	<p>Click and <a href="docs/demos/demo/addSpace.html">See demo</a></p>

<field class="sub-field">
<p><code>html</code> code</p>
<?php 

$html = <<< EOT
<div class="space-01">
	<div class="spaces-container"></div>
	<div class="element-01">
		<h2>My text in <code>.element</code></h2>
	</div>

</div>
EOT

?>
<pre>
<code class="JavaScript">
<?php echo htmlspecialchars($html); ?>
		
</code>
</pre>

<p><code>Javascript</code> code</p>
<pre>
<code class="JavaScript">
$('.element-01').ened()
.addSpace(['.spaces-container', 'vspace-001', [0,0], {'height': '20px' /* Other values are in .css file */ }], {
	before: function(data){
		$(data.this).css({'background': 'transparent'});
	},
	focusin: function(data){
		$(data.this).css({'background': 'red'});
	},
	after: function(data){
		$(data.this).css({'background': 'red'});
	}
})
.addSpace(['.spaces-container', 'vspace-002', [0,0], {'height': '50px' /* Other values are in .css file */ }], {
	before: function(data){
		$(data.this).css({'margin-top': '0'});
	},
	focusin: function(data){
		var helpers = data.helpers,
			getVal	= helpers.getVal;

		$(data.this).css({'margin-top': getVal([0, 55]) +'px'});
	},
	after: function(data){
		$(data.this).css({'margin-top': '55px'});
	}
})
.addSpace(['.spaces-container', 'vspace-003', [0,0], {'height': '50px' /* Other values are in .css file */ }], {
	before: function(data){
		$(data.this).css({'transform': 'translateX(0px)', '-moz-transform': 'translateX(0px)','-ms-transform': 'translateX(0px)', '-o-transform': 'translateX(0px)'});
	},
	focusin: function(data){
		var helpers = data.helpers,
			getVal	= helpers.getVal;

		$(data.this).css({'transform': 'translateX('+ getVal([0, -55]) +'px)'});
	}
})
.addSpace(['.spaces-container', 'vspace-004', [0,0], {'height': '50px' /* Other values are in .css file */ }], {
	focusin: function(data){
		var helpers = data.helpers,
			getVal	= helpers.getVal;

		$(data.this).css({'transform': 'translateX('+ getVal([-55, 55]) +'px)'});
	}
})
.addSpace(['.spaces-container', 'vspace-005', [0,0], {'height': '50px' /* Other values are in .css file */ }], {
	focusin: function(data){
		var helpers = data.helpers,
			getVal	= helpers.getVal;

		$(data.this).css({'transform': 'translateX('+ getVal([55, 0]) +'px)'});
	},
	after: function(data){
		$(data.this).css({'transform': 'translateX(0)'});
	}
})
.get();
		
</code>
</pre>
<p><code>css</code> code</p>
<pre>
<code class="css">
[class^="vspace-"]{
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 15px;
	background: #e9f2fd;
}

</code>
</pre>
</field>
</fieldset>