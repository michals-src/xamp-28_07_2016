  </div>
  <div class="spinner">
	<field>
		<div class="page-spinner">
			<span></span>
			<span></span>
			<span></span>
		</div>
	</field>
  </div>
  <footer>
  	<div class="container">
  		<div class="row">
  			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 signature">
  				<p class="col-lg-8 col-md-8 hidden-sm hidden-xs">
  				
  					Witamy. 

					Firma nasza posiada wieloletnie doświadczenie w wykonywaniu izolacji termicznej oraz remonty i wykończenia wnętrz budynków  mieszkalnych i usługowych .

				</p>
  			</div>
  			<div class="col-lg-6 col-md-6 hidden-sm hidden-xs information">

				<div>
					
	  				<p class="fa">
	  					<i class="glyphicon glyphicon-earphone"></i>
						<span class="hidden-sm hidden-xs">Kontakt </span> <strong><?php echo RakantbudSettings::get('rb_st_phone'); ?></strong>
					</p>
					<p class="fa">
						<i class="glyphicon glyphicon-envelope"></i>
						<span class="hidden-sm hidden-xs">Email </span> <strong><?php echo RakantbudSettings::get('rb_st_email'); ?></strong>
					</p>
				
				</div>
  			</div>

  		<h5 class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:center;"><strong> Rakant-Bud &copy; <?php echo date('Y'); ?> </strong></h5>
	  </div>
  	</div>
  </footer>
  <?php wp_footer(); ?>
  </body>
</html>