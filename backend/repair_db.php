<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Deleting migration record...\n";
\Illuminate\Support\Facades\DB::table('migrations')
    ->where('migration', '2026_01_12_085044_add_theme_colors_to_centers_table')
    ->delete();
echo "Done.\n";
