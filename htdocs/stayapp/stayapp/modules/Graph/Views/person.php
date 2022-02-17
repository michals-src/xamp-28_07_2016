<div class="container personContainer">

		<form action="/person/get" method="get">
			<?php 
				$nazwa = $this->q;
			?>
			<div class="row">
			 <div class="col-lg-12 text-right link">
			 	<a href="/person/create">Dodaj osobę</a>
			 </div>
			 <div class="col-lg-12">
			    <div class="input-group">
			      <input type="text" class="form-control input-lg" placeholder="Imię i nazwisko" name="q" value="<?php echo $nazwa; ?>">
			      <span class="input-group-btn">
			        <button class="btn btn-default btn-lg">Szukaj</button>
			      </span>
			    </div><!-- /input-group -->
			  </div><!-- /.col-lg-6 -->
			</div><!-- /.row -->

		</form>

		<div class="block">
			<?php

				if(count($this->person->getPersons()) > 1)
				{
					foreach ($this->person->getPersons() as $key => $value) {
					?>						

					<a href="/person/get?q=<?php echo $nazwa; ?>&id=<?php echo $value['person_id']; ?>&k=<?php echo $key + 1; ?>"><strong><?php echo $nazwa; ?></strong> (<?php echo $key + 1; ?>) </a>

					<?php					
					}
				}

				if(count($this->person->getPersons()) > 1 && !empty($this->k) || count($this->person->getPersons()) < 2):
			?>
			<form action="/person/save<?php echo $this->uri(); ?>" method="post">
				<header class="text-center">
					<h2>Panel zarządzania</h2>
					<p>StayFit Białystok</p>
				</header>
				<div class="row">
					<div class="form-group col-md-8 col-xs-12">
						<label for="pn">Imię</label>
						<input type="text" name="pn" id="pn" class="form-control" value="<?php echo $this->person->getValue('person_name'); ?>">
					</div>
					<div class="form-group col-md-4 col-xs-12">
						<label for="pd">Data dodania</label>
						<input type="date" name="pdshow" id="pdshow" class="form-control" value="<?php echo $this->person->getValue('person_date'); ?>" disabled>
						<input type="hidden" name="pd" id="pd" class="form-control" value="<?php echo $this->person->getValue('person_date'); ?>">
					</div>
				</div>
				<div class="form-group">
					<label for="psn">Nazwisko</label>
					<input type="text" name="psn" id="psn" class="form-control" value="<?php echo $this->person->getValue('person_surname'); ?>">
				</div>
				<div class="row">
					<div class="form-group col-md-4 col-xs-12">
						<label for="pp">Telefon</label>
						<input type="phone" name="pp" id="pp" class="form-control" value="<?php echo $this->person->getValue('person_phone'); ?>">
					</div>
					<div class="form-group col-md-4 col-xs-12">
						<label for="pc">Liczba wejść</label>
						<input type="number" name="pc" id="pc" class="form-control" value="<?php echo $this->person->getValue('person_count'); ?>">
					</div>
					<div class="form-group col-md-4 col-xs-12">
						<label for="pcd">Data ważności karnetu</label>
						<input type="date" name="pcd" id="pcd" class="form-control" value="<?php echo $this->person->getValue('person_card_date'); ?>">
					</div>
				</div>
				<div class="form-group">
					<label for="pat">Wejścia</label>
					<div class="tags-content">
						<div class="tags">
							<?php 

								$tags = array_filter(explode(',', $this->person->getValue('person_admittance')));

								foreach($tags as $key => $value)
								{
									echo '<span>'.$value.'</span>';
								}

							?>
						</div>
						<input type="text" name="tagsIn" id="pat" class="form-control tag-input" autocomplete="off">
						<input type="hidden" name="pat" id="pn" class="form-control hidden" value="<?php echo $this->person->getValue('person_admittance'); ?>">
					</div>
				</div>
				<div class="form-group">
					<button class="btn btn-primary" name="sp">Zapisz zmiany</button>
				</div>
			</form>
			<?php endif; ?>
		</div>

</div>