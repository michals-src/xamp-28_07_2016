<fieldset id="<?php echo getLink('Add class'); ?>">
	<p class="lead"><code>Pin</code> helper function demo</p>
	<p>Click and <a href="docs/demos/demo/addclass.html">See demo</a></p>

<field class="sub-field">
<p><code>html</code> code</p>
<?php 

$html = <<< EOT
<div class="space-04">
<div id="element-04">
	<h2>My text in <code>.element</code></h2>
</div>
</div>
<div class="container classes">
	<div class="class-01 inline"><p>Text color in <code>.class-01</code></p></div>
	<div class="class-02 inline"><p>Text color in <code>.class-01</code></p></div>
	<div class="class-03 inline"><p>Text color in <code>.class-01</code></p></div>
	<div class="class-active inline"><p>It is <code>.class-active</code></p></div>
</div>
EOT

?>
<pre>
<code class="JavaScript">
<?php echo htmlspecialchars($html); ?>
		
</code>
</pre>

<p><code>Javascript</code> code</p>
<pre>
<code class="JavaScript">
$('.space-04').ened([50,-20])
.set({
  before: function(data){
	$(data.this).find('#element-04').removeClass('class-01');
	$('.classes').find('.active').removeClass('active');
  },
  focusin: function(data){
	$(data.this).find('#element-04').attr('class', '').addClass('class-01');
	$('.classes').find('.active').removeClass('active');
	$('.classes').find('.class-01').addClass('active');
  },
  0.4: function(data){
	$(data.this).find('#element-04').attr('class', '').addClass('class-02');
	$('.classes').find('.active').removeClass('active');
	$('.classes').find('.class-02').addClass('active');
  },
  0.8: function(data){
	$(data.this).find('#element-04').attr('class', '').addClass('class-03');
	$('.classes').find('.active').removeClass('active');
	$('.classes').find('.class-03').addClass('active');
  },
  after: function(data){
	$(data.this).find('#element-04').attr('class', '').removeClass('class-03');
	$('.classes').find('.active').removeClass('active');
  }
})
.get();
		
</code>
</pre>
<p><code>css</code> code</p>
<pre>
<code class="css">
.space-04{
	position: relative;
	text-align: center;
	height: auto;
	padding-top: 80px;
	padding-bottom: 30px;
}
	.space-04 .element-04{
		position: relative;
		margin-left: auto;
		margin-right: auto;
	}

.inline{
	display: inline-block;
}
.classes{
	margin-top: 100px;
	margin-bottom: 30px;
	text-align: center;
	display: block;
}
.classes [class^="class-"]{
	padding: 3px 7px;
	border: 1px solid #aaa;
	border-radius:3px;
}
	[class^="class-"] p{
		margin: 0;
	}
	
.class-01{
	color: #1818ea;
}	
.class-02{
	color: #b514b5;
}	
.class-03{
	color: #188894;
}
.class-active,
[class^="class-"].active{
	font-weight: 700;
	background-color: #ffd100;
}

</code>
</pre>
</field>
</fieldset>