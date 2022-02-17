<field class="sub-field" id="set.after">
	<p class="lead">After</p>
	<p><code>after</code> is key in <code>.set()</code> array which has function as value. In this function set code what you want to happen if ened trigger is not scrolled on element and is lower than element.</p>
	<p>General is used as fast scrolling protection. If someone scroll fast website <code>after</code> could set default "end_value" value e.g for css transform etc.</p>
	<p><code>Example</code> Somebody is scrolling fast website to down and get out of element's ened space and you set transform from <strong>0</strong> to <strong>10</strong> then by <code>after</code> function set the default (in this example default "end_value" is <strong>10</strong>) value for transform.</p>

<pre>
<code class="JavaScript">
$(your_element)
.ened()
.set({
	after: function(data){
		//Code ...
	}
})
.get();

</code>
</pre>
	<p>You can read about <code>data</code> going down below.</p>
</field>