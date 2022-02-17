<fieldset id="<?php echo getLink('Using pin'); ?>">
	<p class="lead"><code>Pin</code> helper function demo</p>
	<p>Click and <a href="docs/demos/demo/pin.html">See demo</a></p>

<field class="sub-field">
<p><code>html</code> code</p>
<?php 

$html = <<< EOT
<div class="space-02">
<div class="element-02">
	<h2 style="margin: 0;">My text in <code>.element</code></h2>
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
$('.space-02').ened()
.set({
  before: function(data){
	var helpers = data.helpers, pin = helpers.pin;

	pin.before({parent: $(data.this), item: '.element-02'}, 2000);
  },
  focusin: function(data){
	var helpers = data.helpers, pin = helpers.pin;

	pin.set({parent: $(data.this), item: '.element-02'}, 2000);
	$('.element-02').css({'width': '100%', 'text-align': 'center'});
  },
  after: function(data){
	var helpers = data.helpers, pin = helpers.pin;

	pin.after({parent: $(data.this), item: '.element-02'}, 2000);
  }
})
.get();
		
</code>
</pre>
<p><code>css</code> code</p>
<pre>
<code class="css">
.space-02{
	position: relative;
	text-align: center;
	height: 1300px;
}
.space-02 .element-02{
	position: relative;
	margin-left: auto;
	margin-right: auto;
}

</code>
</pre>
</field>
</fieldset>