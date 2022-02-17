<fieldset id="<?php echo getLink('Pin'); ?>">
	<p class="lead">Pin</p>
	<p>Pin element after scrolled on <code>$(your_element)</code> using this function</p>
	<p>Pin minds set in css <code>position: fixed</code> and adjust to actual position.</p>

<p>Pin has 3 functions <code>before</code>, <code>after</code>, <code>set</code>.</p>
<div class="text-field">
	<p><code>before</code> is using in <code> before: function(data){ //code } </code>.</p>
	<p><code>after</code> is using in <code> after: function(data){ //code } </code>.</p>
	<p><code>set</code> is using in <code> focusin: function(data){ //code } </code>.</p>
</div>

<p>Element which you want pin must have parent element (as scene). </p>
<p><code>Html code</code></p>
<?php 

$html = <<< EOT
<div class="element-scene">
	<div class="element">
		<h2>Text</h2>
	</div>
</div>

EOT;

?>
<pre>
<code class="html">
<?php echo htmlspecialchars($html); ?>
		
</code>
</pre>
<p><code>JS code</code></p>

<pre>
<code class="JavaScript">
$('.element-scene')
.ened(array)
.set({
	before: function(data){
		var helpers = data.helpers,
			pin 	= helpers.pin;

		//pin.before({parent: '.element-scene', item: '.element'}, duration);
		pin.before({parent: $(e.this), item: '.element'}, 3000);
	},
	focusin: function(data){
		var helpers = data.helpers,
			pin 	= helpers.pin;

		//pin.set({parent: '.element-scene', item: '.element'}, duration);
		pin.set({parent: $(e.this), item: '.element'}, 3000);
	},
	after: function(data){
		var helpers = data.helpers,
			pin 	= helpers.pin;

		//pin.after({parent: '.element-scene', item: '.element'}, duration);
		pin.after({parent: $(e.this), item: '.element'}, 3000);
	}
})
.get();
		
</code>
</pre>

<p><strong>Function description</strong></p>
<div class="text-field">
	<p><code>parent</code> is <strong>'.element-scene'</strong></p>
	<p><code>item</code> is <strong>'.element'</strong></p>
	<p><code>duration</code> is <strong>(int)</strong> height which will be set for parent</p>
</div>
<p><code>Pin.before</code> and <code>Pin.after()</code> are required to <code>pin</code> properly work</p>



</fieldset>