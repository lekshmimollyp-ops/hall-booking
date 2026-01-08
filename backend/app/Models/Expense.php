<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    public $timestamps = false; // Table only has created_at


    protected $fillable = [
        'center_id',
        'event_id',
        'category_id',
        'amount',
        'expense_date',
        'description',
        'created_by',
    ];

    public function category()
    {
        return $this->belongsTo(ExpenseCategory::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
