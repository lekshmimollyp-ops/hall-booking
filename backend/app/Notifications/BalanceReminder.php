<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Event;

class BalanceReminder extends Notification
{
    use Queueable;

    public $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $paid = $this->event->advance_amount + $this->event->incomes()->sum('amount_received');
        $balance = $this->event->booked_amount - $paid;

        return [
            'type' => 'balance_reminder',
            'message' => "Payment Pending: ₹{$balance} for " . $this->event->event_type . " on " . $this->event->event_date,
            'event_id' => $this->event->id,
            'center_id' => $this->event->center_id,
        ];
    }
}
