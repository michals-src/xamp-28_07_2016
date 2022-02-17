<div id="fb-root"></div>
<div class="tigner"></div>

<div class="pre-container">
 <div class="container">
  <div class="pre-content">
    <header>
      <h2></h2>
      <div class="pre-close">
        <i class="glyphicon glyphicon-remove"></i>
      </div>
    </header>
    <div class="pre-body">
      <p></p>
    </div>
  </div>
 </div>
</div>

<footer>
  <div class="container">
    <div class="row">
      <div class="text-center col-xs-12">
        &copy; StayFit <?php echo date('Y'); ?>
      </div>
    </div>
  </div>
</footer>
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1727715354148258',
      xfbml      : true,
      version    : 'v2.7'
    });
  };

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/pl_PL/sdk.js#xfbml=1&version=v2.7&appId=778031182254267";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
</script>
<?php wp_footer(); ?>
</div>
</body>
</html>