<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Event;
use App\Models\User;
use App\Notifications\BalanceReminder;
use Illuminate\Support\Facades\Notification;

class SendBalanceReminders extends Command
{
    protected $signature = 'reminders:balance';
    protected $description = 'Send reminders for events with pending balance happening in 2 days';

    public function handle()
    {
        $targetDate = now()->addDays(2)->format('Y-m-d');
        
        $events = Event::where('event_date', $targetDate)
                       ->where('status', 'booked')
                       ->with(['incomes'])
                       ->get();

        foreach ($events as $event) {
            $paid = $event->advance_amount + $event->incomes->sum('amount_received');
            $balance = $event->booked_amount - $paid;

            if ($balance > 0) {
                // Notify Center Admins
                $users = User::whereHas('centers', function($q) use ($event) {
                    $q->where('centers.id', $event->center_id);
                })->get();

                Notification::send($users, new BalanceReminder($event));
                $this->info("Sent reminder for Event ID {$event->id}");
            }
        }
    }
}
