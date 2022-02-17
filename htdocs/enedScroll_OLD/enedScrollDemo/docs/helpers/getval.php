<fieldset id="<?php echo getLink('getVal'); ?>">
	<p class="lead">getVal</p>
	<p><code>.getVal( [start_value, end_value] )</code> function return value <strong>from - to</strong>.</p>

	<div class="text-field">
		<p><code>start_value</code> is <strong>(int)</strong> and is default value.</p>
		<p><code>end_value</code> is <strong>(int)</strong>.</p>
	</div>

	<p><code>Example</code></p>
	<p>You added css transform to element and you want to change <strong>Y</strong> position of element from 0 to 10px.When ened trigger will be into element's space <code>focusin</code> function and website will be scrolling then value 0 will be progressively change to 10.</p>

<pre>
<code class="JavaScript">
$(your_element)
.ened(array)
.set({
	focusin: function(data){
		var getVal = data.helpers.getVal;

		// progressively change 0 to 10
		$(data.this).css( { 'transform': 'translateY( ' + getVal(0,10) + ' ) ' } );
	}
})
.get();
		
</code>
</pre>
	
	<p><code>start_value</code> add by default in <code>before</code> function for <code>$(your_element)</code></p>
<pre>
<code class="JavaScript">
$(your_element)
.ened(array)
.set({
	before: function(data){
		$(data.this).css( { 'transform': 'translateY(0) ' } );
	},
	focusin: function(data){
		var getVal = data.helpers.getVal;

		// progressively change 0 to 10
		$(data.this).css( { 'transform': 'translateY( ' + getVal(0,10) + ' ) ' } );
	}
})
.get();
		
</code>
</pre>

	<p><code>end_value</code> add in <code>after</code> function for <code>$(your_element)</code></p>
<pre>
<code class="JavaScript">
$(your_element)
.ened(array)
.set({
	focusin: function(data){
		var getVal = data.helpers.getVal;

		// progressively change 0 to 10
		$(data.this).css( { 'transform': 'translateY( ' + getVal(0,10) + ' ) ' } );
	},
	after: function(data){
		$(data.this).css( { 'transform': 'translateY(10) ' } );
	}
})
.get();
		
</code>
</pre>

<p><code>Full build usage function</code></p>
<pre>
<code class="JavaScript">
$(your_element)
.ened(array)
.set({
	before: function(data){
		$(data.this).css( { 'transform': 'translateY(0) ' } );
	},
	focusin: function(data){
		var getVal = data.helpers.getVal;

		// progressively change 0 to 10
		$(data.this).css( { 'transform': 'translateY( ' + getVal(0,10) + ' ) ' } );
	},
	after: function(data){
		$(data.this).css( { 'transform': 'translateY(10px) ' } );
	}
})
.get();
		
</code>
</pre>
</fieldset>