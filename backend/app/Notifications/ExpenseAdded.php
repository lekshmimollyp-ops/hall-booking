<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Expense;

class ExpenseAdded extends Notification
{
    use Queueable;

    public $expense;

    public function __construct(Expense $expense)
    {
        $this->expense = $expense;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'expense',
            'message' => "New expense: ₹" . $this->expense->amount . " - " . ($this->expense->category->name ?? 'Uncategorized'),
            'expense_id' => $this->expense->id,
            'center_id' => $this->expense->center_id,
        ];
    }
}
