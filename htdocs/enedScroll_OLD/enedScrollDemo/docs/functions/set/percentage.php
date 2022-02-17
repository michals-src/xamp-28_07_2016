<field class="sub-field" id="set.percentage">
	<p class="lead">percentage</p>
	<p><code>percentage</code> is (int) key (from 0.01 to 0.99) in <code>.set()</code> array which has function as value. In this function set code what you want to happen if ened trigger is scrolled on element's percentage.</p>
	<p>If you want that code will called by scrolled on center of the component the key will be looks as <code>0.5</code></p>

<pre>
<code class="JavaScript">
$(your_element)
.ened()
.set({
	(int) percentage: function(data){
		//Code ...
	}
})
.get();

</code>
</pre>
	<p><code>Example</code></p>
<pre>
<code class="JavaScript">
$(your_element)
.ened()
.set({
	0.2: function(data){
		//Code ...
	},
	0.25: function(data){
		//Code ...
	},
	0.5: function(data){
		//Code ...
	},
	0.7: function(data){
		//Code ...
	}
})
.get();

</code>
</pre>
	<p>You can read about <code>data</code> going down below.</p>
</field>