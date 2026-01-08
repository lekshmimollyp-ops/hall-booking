<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'center_id',
        'client_id',
        'resource_id', // Added
        'event_date',
        'start_time',
        'end_time',
        'event_type',
        'status',
        'advance_amount',
        'booked_amount',
        'booked_amount',
        'discount',
        'created_by',
    ];

    protected $appends = ['total_received', 'balance_pending', 'total_expenses'];

    // Relationships
    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function incomes()
    {
        return $this->hasMany(Income::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    // Accessors for Financials
    public function getTotalReceivedAttribute()
    {
        return $this->incomes()->sum('amount_received');
    }

    public function getBalancePendingAttribute()
    {
        $payable = $this->booked_amount - ($this->discount ?? 0);
        return $payable - $this->total_received;
    }

    public function getTotalExpensesAttribute()
    {
        return $this->expenses()->sum('amount');
    }

    public function getProfitAttribute()
    {
        return $this->total_received - $this->total_expenses;
    }
}
