<field class="sub-field" id="set.data">
	<p class="lead">Data</p>
	<div class="text-field">
		<p><code>data</code> is array.</p>
		<p>In data there are <code><strong>(array)</strong> helpers</code>, <code><strong>(object)</strong> this</code>, <code><strong>(int)</strong> num</code></p>
	</div>
	<div class="text-field">
		<p><code>helpers</code> are amenities to creation animations.</p>
		<p><code>this</code> is <code>your_element</code>.</p>
		<p><code>num</code> is actually percentage position of trigger in current element's ened space.</p>
	</div>
	<p><code>ened space</code> is space between top and bottom selector.</p>

<pre>
<code class="JavaScript">
$(your_element)
.ened()
.set({
	focusin: function(data){
		var your_element = data.this;

		console.log( $(your_element) );
	}
})
.get();

</code>
</pre>

	<p>You can read about <code>helpers</code> going down below.</p>
</field>