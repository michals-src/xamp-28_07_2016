<?php

session_start();

require_once 'modules/core/Connection.php';
require_once 'modules/core/Database.php';
require_once 'modules/Authentication/Authentication.php';
require_once 'modules/Person/Person.php';
require_once 'modules/Graph/Graph.php';
require_once 'Stayapp.php';

$application = new stayapp\StayApp();