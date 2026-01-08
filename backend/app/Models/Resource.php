<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'center_id',
        'name',
        'description',
        'capacity',
        'status',
    ];

    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
