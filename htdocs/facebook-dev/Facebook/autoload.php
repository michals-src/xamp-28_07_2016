<?php

spl_autoload_register(function ($class) {
    
    //require $class;

    // Namespace
    $prefix = 'Cameolon\\';
    $baseDir = __DIR__ . '/';

    $len = strlen($prefix);
    if(strncmp($prefix, $class, $len) !== 0 ){ return; }

    $name = substr($class, $len);
    $file = rtrim($baseDir, '/') . '/' . str_replace('\\', '/', $name) . '.php';

    if( file_exists($file) ){
        require_once $file;
    }
    
});
