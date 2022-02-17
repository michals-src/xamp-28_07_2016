<fieldset id="set">
	<p class="lead">set</p>
	<p>When you want to use ened for element you have to firstly set ened function.</p>
<pre>
<code class="JavaScript">
$(your_element)
.ened()
.set(array)
.get();
		
</code>
</pre>
<p>In array add: <code>before</code> <code>focusin</code> <code>after</code> <code>(int) percentage</code></p>
	<div class="text-field">
		<p><strong>After <code>.set()</code> add <code>.get()</code> function.</strong></p>
		<p>You can read about these functions going down below.</p>
	</div>

	<?php include 'set/before.php'; ?>
	<?php include 'set/after.php'; ?>
	<?php include 'set/focusin.php'; ?>
	<?php include 'set/percentage.php'; ?>
	<?php include 'set/data.php'; ?>

</fieldset>