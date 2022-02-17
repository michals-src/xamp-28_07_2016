<field class="sub-field" id="defaults.selectorsSetColor">
	<p class="lead">selectorsSetColor</p>
	<div class="text-field">
		<p>Selectors are border of element which you edit by $().ened() function.</p>
		<p>Selectors define space for creating animatons. Ened trigger after passing top selector refers to <code>.set()</code> function.</p>
	</div>
	<p><code>selectorsSetColor</code> shows or hides element's selectors.</p>
	<picture>
		<img src="../images/doc-img0101.png" title="selectorsSetColor" alt="selectorsSetColor">
	</picture>
	<p>if is <code>true</code> then selectors are visible.</p>
<pre>
<code class="JavaScript">
enedscroll.option({
	'selectorsSetColor': true, //Selectors are visible.
});

</code>
</pre>
<p>if is <code>false</code> then selectors are hidden.</p>
<pre>
<code class="JavaScript">
enedscroll.option({
	'selectorsSetColor': false, //Selectors are hidden.
});

</code>
</pre>

</field>