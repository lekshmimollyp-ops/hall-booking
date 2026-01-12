<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Income;
use App\Models\Expense;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dashboard(Request $request)
    {
        $centerId = $request->validated_center_id;
        $currentMonth = now()->month;

        // REF: User requested Income based on Booking Date (Event Date), not Received Date
        $monthlyIncome = Income::join('events', 'incomes.event_id', '=', 'events.id')
                               ->where('incomes.center_id', $centerId)
                               ->whereMonth('events.event_date', $currentMonth)
                               ->sum('incomes.amount_received');

        $monthlyExpense = Expense::where('center_id', $centerId)
                                 ->whereMonth('expense_date', $currentMonth)
                                 ->sum('amount');

        $upcomingEvents = Event::where('center_id', $centerId)
                               ->where('event_date', '>=', now())
                               ->whereIn('status', ['booked', 'blocked'])
                               ->count();

        $totalEvents = Event::where('center_id', $centerId)->count();

        $recentEvents = Event::where('center_id', $centerId)
                             ->orderBy('created_at', 'desc')
                             ->take(5)
                             ->get();

        $eventsByType = Event::where('center_id', $centerId)
                             ->selectRaw('event_type, count(*) as count')
                             ->groupBy('event_type')
                             ->get();

        $center = \App\Models\Center::find($centerId);

        return response()->json([
            'center_name' => $center ? $center->name : 'Unknown Center',
            'center_id' => $centerId,
            'monthly_income' => $monthlyIncome,
            'monthly_expense' => $monthlyExpense,
            'profit' => $monthlyIncome - $monthlyExpense,
            'upcoming_events' => $upcomingEvents,
            'total_events' => $totalEvents,
            'recent_events' => $recentEvents,
            'events_by_type' => $eventsByType
        ]);
    }

    public function monthlyStats(Request $request) 
    {
        $centerId = $request->validated_center_id;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        // REF: Income now based on Event Date
        $incomeQuery = Income::join('events', 'incomes.event_id', '=', 'events.id')
                             ->where('incomes.center_id', $centerId);
        
        $expenseQuery = Expense::where('center_id', $centerId);

        if ($startDate && $endDate) {
            $incomeQuery->whereBetween('events.event_date', [$startDate, $endDate]);
            $expenseQuery->whereBetween('expense_date', [$startDate, $endDate]);
        }

        $income = $incomeQuery
            ->selectRaw("TO_CHAR(events.event_date, 'YYYY-MM') as month, SUM(incomes.amount_received) as total")
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->get()
            ->keyBy('month');
            
        $expense = $expenseQuery
            ->selectRaw("TO_CHAR(expense_date, 'YYYY-MM') as month, SUM(amount) as total")
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->get()
            ->keyBy('month');

        // Fetch Event Counts
        $eventCounts = Event::where('center_id', $centerId)
            ->whereIn('status', ['booked', 'completed']) // Count only valid events
            ->when($startDate && $endDate, function ($q) use ($startDate, $endDate) {
                return $q->whereBetween('event_date', [$startDate, $endDate]);
            })
            ->selectRaw("TO_CHAR(event_date, 'YYYY-MM') as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->get()
            ->keyBy('month');

        // Merge keys
        $months = $income->keys()
            ->merge($expense->keys())
            ->merge($eventCounts->keys())
            ->unique()
            ->sortDesc();
        
        $data = $months->map(function($month) use ($income, $expense, $eventCounts) {
            return [
                'month' => $month,
                'income' => $income[$month]->total ?? 0,
                'expense' => $expense[$month]->total ?? 0,
                'event_count' => $eventCounts[$month]->count ?? 0,
                'profit' => ($income[$month]->total ?? 0) - ($expense[$month]->total ?? 0)
            ];
        })->values();

        return response()->json($data);
    }

    public function categoryStats(Request $request)
    {
        $query = Expense::where('center_id', $request->validated_center_id);

        if ($request->has(['start_date', 'end_date'])) {
            $query->whereBetween('expense_date', [$request->start_date, $request->end_date]);
        }

        $stats = $query
            ->join('expense_categories', 'expenses.category_id', '=', 'expense_categories.id')
            ->selectRaw('expense_categories.name, SUM(expenses.amount) as total')
            ->groupBy('expense_categories.name')
            ->orderBy('total', 'desc')
            ->get();
            
        return response()->json($stats);
    }

    public function eventStats(Request $request)
    {
        $query = Event::where('center_id', $request->validated_center_id)
                          ->whereIn('status', ['booked', 'completed']); // Only count valid bookings for reporting

        if ($request->has(['start_date', 'end_date'])) {
            $query->whereBetween('event_date', [$request->start_date, $request->end_date]);
        }

        $stats = $query
            ->selectRaw('event_type, COUNT(*) as count, SUM(booked_amount) as total_revenue, AVG(booked_amount) as avg_revenue')
            ->groupBy('event_type')
            ->orderBy('total_revenue', 'desc')
            ->get();
            
        return response()->json($stats);
    }
}
