<field class="sub-field" id="<?php echo getLink('selectors'); ?>">
	<p class="lead">Selectors</p>
	<p>By this function you can manipulate selectors by change vars in array.</p>

<pre>
<code class="JavaScript">
$(your_element).ened([top_selector, bottom_selector]);

</code>
</pre>
	<p><code>+</code> value move selector to bottom, <code>-</code> value move selector to top.</p>
	<picture>
		<img src="../images/doc-img0201.png" alt="ened selectors" title="ened selectors">
	</picture>
	<p>Default is <code>[0,0]</code> that minds the selectors are on top and bottom of element.
	You can see selectors by change in <code>enedScroll.option</code> key <code>selectorsSetColor</code>. 
	</p>
	<p><a href="#<?php echo getLink('selectorsSetColor'); ?>">read more about selecotrs color</a></p>
</field>