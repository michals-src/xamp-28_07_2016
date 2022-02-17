<div class="container personContainer">

		<form action="/person/get" method="get">

			<div class="row">
			 <div class="col-lg-12 text-right link">
			 	<a href="/person/create">Dodaj osobę</a>
			 </div>
			 <div class="col-lg-12">
			    <div class="input-group">
			      <input type="text" class="form-control input-lg" placeholder="Imię i nazwisko" name="q">
			      <span class="input-group-btn">
			        <button class="btn btn-default btn-lg">Szukaj</button>
			      </span>
			    </div><!-- /input-group -->
			  </div><!-- /.col-lg-6 -->
			</div><!-- /.row -->

		</form>

		<div class="block">
			<form action="/person/create" method="post">
				<header class="text-center">
					<h2>Panel zarządzania</h2>
					<p>StayFit Białystok</p>
				</header>
				<div class="row">
					<div class="form-group col-md-8 col-xs-12">
						<label for="pn">Imię</label>
						<input type="text" name="pn" minlength="2" maxlength="50" id="pn" class="form-control" placeholder="Imię" required>
					</div>
					<div class="form-group col-md-4 col-xs-12">
						<label for="pd">Data dodania</label>
						<input type="date" name="pdshow" id="pdshow" class="form-control" value="<?php echo date("Y-m-d"); ?>" disabled>
						<input type="hidden" name="pd" id="pd" class="form-control"  value="<?php echo date("Y-m-d"); ?>">
					</div>
				</div>
				<div class="form-group">
					<label for="psn">Nazwisko</label>
					<input type="text" name="psn" id="psn" minlength="3" maxlength="200" class="form-control" placeholder="Nazwisko" required>
				</div>
				<div class="row">
					<div class="form-group col-md-4 col-xs-12">
						<label for="pp">Telefon</label>
						<input type="phone" name="pp" id="pp" minlength="5" maxlength="80" class="form-control" placeholder="Numer tel." required>
					</div>
					<div class="form-group col-md-4 col-xs-12">
						<label for="pc">Liczba wejść</label>
						<input type="number" name="pc" id="pc" class="form-control" value="0">
					</div>
					<div class="form-group col-md-4 col-xs-12">
						<label for="pcd">Data ważności karnetu</label>
						<input type="date" name="pcd" id="pcd" class="form-control" required>
					</div>
				</div>
				<div class="form-group">
					<label for="pat">Wejścia</label>
					<textarea type="text" name="pat" id="pn" class="form-control" disabled="disabled"></textarea>
				</div>
				<div class="form-group">
					<button class="btn btn-primary" name="sp">Zapisz zmiany</button>
				</div>
			</form>
		</div>

</div>