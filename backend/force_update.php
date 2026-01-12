<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo "Checking schema...\n";

if (!Schema::hasColumn('centers', 'background_color')) {
    echo "Adding background_color...\n";
    Schema::table('centers', function (Blueprint $table) {
        $table->string('background_color')->nullable()->default('#ffffff');
    });
} else {
    echo "background_color already exists.\n";
}

if (!Schema::hasColumn('centers', 'font_color')) {
     echo "Adding font_color...\n";
     Schema::table('centers', function (Blueprint $table) {
        $table->string('font_color')->nullable()->default('#111827');
     });
} else {
    echo "font_color already exists.\n";
}

// Mark as run to prevent future duplicate errors
DB::table('migrations')->updateOrInsert(
    ['migration' => '2026_01_12_085044_add_theme_colors_to_centers_table'],
    ['batch' => 99]
);

echo "Force update complete.\n";
