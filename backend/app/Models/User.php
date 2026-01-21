<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function centers()
    {
        return $this->belongsToMany(Center::class, 'user_centers');
    }

    /**
     * Get the resources (halls) assigned to this user
     */
    public function resources()
    {
        return $this->belongsToMany(Resource::class, 'resource_user')
                    ->withTimestamps();
    }

    /**
     * Check if user has access to a specific resource (hall)
     * Admins always have access to all resources
     */
    public function hasAccessToResource($resourceId)
    {
        if ($this->role === 'admin') {
            return true; // Admins have access to all halls
        }
        return $this->resources()->where('resources.id', $resourceId)->exists();
    }

    /**
     * Get IDs of all resources (halls) this user can access
     * Admins get all resources in their centers
     */
    public function getAccessibleResourceIds()
    {
        if ($this->role === 'admin') {
            // Get all resources in user's centers (load centers if not loaded)
            $centerIds = $this->centers()->pluck('centers.id');
            return Resource::whereIn('center_id', $centerIds)->pluck('id');
        }
        return $this->resources()->pluck('resources.id');
    }
}
