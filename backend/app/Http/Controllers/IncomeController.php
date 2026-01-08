<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Income;
use App\Models\Event;
use Illuminate\Support\Facades\DB;

class IncomeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'amount_received' => 'required|numeric',
            'received_date' => 'required|date',
            'payment_mode' => 'required',
        ]);

        return DB::transaction(function () use ($request) {
            $event = Event::findOrFail($request->event_id);

            // Authorization
            if ($event->center_id !== (int) $request->validated_center_id) {
                return response()->json(['message' => 'Unauthorized: Event not in current scope'], 403);
            }

            $income = Income::create([
                'center_id' => $event->center_id,
                'event_id' => $event->id,
                'amount_received' => $request->amount_received,
                'received_date' => $request->received_date,
                'payment_mode' => $request->payment_mode,
                'created_by' => $request->user()->id,
            ]);

            // Check if fully paid (optional logic)
            // if ($event->balance_pending <= 0) { $event->update(['status' => 'booked']); }

            return response()->json($income, 201);
        });
    }

    public function index(Request $request)
    {
        $incomes = Income::where('center_id', $request->validated_center_id)
                         ->with('event:id,event_date,event_type')
                         ->orderBy('received_date', 'desc')
                         ->get();
        return response()->json($incomes);
    }
}
