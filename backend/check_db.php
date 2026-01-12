<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$hasColor = \Illuminate\Support\Facades\Schema::hasColumn('centers', 'background_color');
echo $hasColor ? "COLUMN_EXISTS" : "COLUMN_MISSING";
