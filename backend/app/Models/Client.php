<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'center_id',
        'name',
        'phone',
        'address',
    ];

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
