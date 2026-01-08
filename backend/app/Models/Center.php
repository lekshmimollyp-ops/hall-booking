<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Center extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo_url',
        'primary_color',
        'address',
        'contact_phone',
        'status',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_centers');
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
