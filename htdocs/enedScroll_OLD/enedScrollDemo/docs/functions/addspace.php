<fieldset id="<?php echo getLink('add Space'); ?>">
	<p class="lead">add Space</p>
	<p>Function is used to create new html element to change ened element's space. You can control element using space created by this function. It is similar to <code>.set()</code> function.</p>
	<p><code>Full build function</code></p>
<pre>
<code class="JavaScript">
$(your_element)
.ened()
.addSpace([ (string) @parent, (string) @element_class_name, (array) @selectors_position, (array) @css], (array) @functions{
	before: function(data){ //code },
	after: function(data){ //code },
	focusin: function(data){ //code },
	(int) percentage: function(data){ //code }
})
.set(array)
.get();
		
</code>
</pre>

	<p>You can create 15 spaces by add 15 functions <code>.addSpace()</code>.</p>
	<p><strong>Function description</strong></p>
	<div class="text-field">
		<p><code>(string) @parent</code> element's class name e.g <strong>'.class'</strong> where the element will be create.</p>
		<p><code>(string) @element_class_name</code> element's class name e.g  <strong>'class'</strong>.</p>
		<p><code>(array) @selectors_position</code> position of selectors. Default is <strong>[0,0]</strong>. <a href="#<?php echo getLink('selectors'); ?>">Read about selectors</a></p>
		<p><code>(array) @css</code> style for element e.g { position:relative, background:white } . Default is null.</p>
		<p><code>(array) @functions</code> array with function to create actions.</p>
		<p style="padding: 5px;">Click to read about <a href="#<?php echo getLink('before'); ?>">before</a>, <a href="#<?php echo getLink('after'); ?>">after</a>, <a href="#<?php echo getLink('focusin'); ?>">focusin</a>, <a href="#<?php echo getLink('percentage'); ?>">percentage</a> </p>
	</div>


	<div class="text-field">
		<p><strong>After <code>.addSpace()</code> you can add next <code>.addSpace()</code> or <code>.set()</code> function.</strong></p>
		<p>You can read about these functions going down below.</p>
	</div>

</fieldset>