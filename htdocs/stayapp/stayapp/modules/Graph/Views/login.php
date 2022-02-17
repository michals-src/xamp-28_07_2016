<div class="middle">
	
	<div class="middleIn">
		<div class="container">
			
				
				<form action="/login/login" method="post" class="formLogin">

					<header class="text-center">
						<h1>Logowanie</h1>
						<p>Stayfit Białystok aplikacja</p>
					</header>
					<?php 

					if(!empty($this->getException()['loginMSG']))
					{
						?>

						<div class="alert alert-danger" role="alert">
							<?php echo $this->getException()['loginMSG']; ?>
						</div>

						<?php
						unset($_SESSION['_exception']);
					}

					?>
					<div class="form-group">
						<label for="inputUser" >Nazwa użytkownika</label>
						<input type="text" class="form-control" id="inputUser" name="username" placeholder="Nazwa użytkownika">
					</div>
					<div class="form-group">
						<label for="inputPass">Hasło</label>
						<input type="password" class="form-control" id="inputPass" name="password" placeholder="Hasło">
					</div>
					<div class="form-group">
						<button class="btn btn-primary">Zaloguj się</button>
					</div>

				</form>


		</div>

	</div>

</div>