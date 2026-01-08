<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    public $timestamps = false; // Table only has created_at, not updated_at

    protected $fillable = [
        'center_id',
        'event_id',
        'amount_received',
        'received_date',
        'payment_mode',
        'created_by',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
