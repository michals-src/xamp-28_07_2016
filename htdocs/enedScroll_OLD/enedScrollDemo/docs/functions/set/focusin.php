<field class="sub-field" id="set.focusin">
	<p class="lead">Focusin</p>
	<p><code>focusin</code> is key in <code>.set()</code> array which has function as value. In this function set code what you want to happen if ened trigger is scrolled on element.</p>
	<p><code>Example</code> Somebody is scrolling website and get in on element's ened space and focusin's function is called.</p>

<pre>
<code class="JavaScript">
$(your_element)
.ened()
.set({
	focusin: function(data){
		//Code ...
	}
})
.get();

</code>
</pre>
	<p>You can read about <code>data</code> going down below.</p>
</field>