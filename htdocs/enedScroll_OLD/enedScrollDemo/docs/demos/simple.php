<fieldset id="<?php echo getLink('Simple transform animation'); ?>">
	<p class="lead">Simple transform animation demo</p>
	<p>Click and <a href="docs/demos/demo/simple.html">See demo</a></p>

<field class="sub-field">
<p><code>html</code> code</p>
<?php 

$html = <<< EOT
<div class="space-03">
<div class="element-03">
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
$('.element-03').ened()
.set({
  before: function(data){
	$(data.this).css({'transform': 'scale(1)' });
  },
  focusin: function(data){
	var helpers = data.helpers, getVal = helpers.getVal;

	$(data.this).css({'transform': 'scale('+ getVal([1,1.5]) +')' });
  },
  after: function(data){
	$(data.this).css({'transform': 'scale(1.5)' });
  }
})
.get();
		
</code>
</pre>
<p><code>css</code> code</p>
<pre>
<code class="css">
.space-03{
	position: relative;
	text-align: center;
	height: auto;
	padding-top: 80px;
	padding-bottom: 30px;
	overflow: hidden;
}
.space-03 .element-03{
	position: relative;
	margin-left: auto;
	margin-right: auto;
}

</code>
</pre>
</field>
</fieldset>