<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Client;
use App\Models\Income;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    public function index(Request $request)
    {
        // Filter by Center using VALIDATED scope
        $query = Event::where('center_id', $request->validated_center_id)
                      ->with(['client', 'resource']); // Load resource

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has(['start_date', 'end_date'])) {
            $query->whereBetween('event_date', [$request->start_date, $request->end_date]);
        }

        return response()->json($query->orderBy('event_date', 'asc')->get());
    }

    // Public Read-Only Calendar
    public function publicCalendar(Request $request, $centerId)
    {
        $query = Event::where('center_id', $centerId)
                      ->select('id', 'event_date', 'start_time', 'end_time', 'event_type', 'status')
                      ->where('status', '!=', 'cancelled');

        if ($request->has(['start_date', 'end_date'])) {
            $query->whereBetween('event_date', [$request->start_date, $request->end_date]);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_name' => 'required',
            'client_phone' => 'nullable',
            'event_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'event_type' => 'required',
            'resource_id' => 'required|exists:resources,id',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $centerId = $request->validated_center_id;

        // Check for Conflicts (Scoped to Resource)
        if ($this->hasConflict($centerId, $request->resource_id, $request->event_date, $request->start_time, $request->end_time)) {
             return response()->json(['message' => 'Selected Hall is already booked for this time slot.'], 409);
        }

        return DB::transaction(function () use ($request, $centerId) {
            // Find or Create Client
            $client = Client::firstOrCreate(
                ['phone' => $request->client_phone, 'center_id' => $centerId],
                ['name' => $request->client_name, 'address' => $request->client_address]
            );

            // Create Event
            $event = Event::create([
                'center_id' => $centerId,
                'client_id' => $client->id,
                'resource_id' => $request->resource_id,
                'event_date' => $request->event_date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'event_type' => $request->event_type,
                'status' => $request->status ?? 'blocked',
                'booked_amount' => $request->booked_amount ?? 0,
                'advance_amount' => $request->advance_amount ?? 0,
                'discount' => $request->discount ?? 0,
                'created_by' => $request->user()->id,
            ]);

            // Auto-create Income for Advance Payment
            if ($request->advance_amount > 0) {
                Income::create([
                    'center_id' => $centerId,
                    'event_id' => $event->id,
                    'amount_received' => $request->advance_amount,
                    'received_date' => now(), // Assume received today
                    'payment_mode' => 'Cash', // Default to Cash for initial advance
                    'created_by' => $request->user()->id,
                ]);
            }

            // Notify Users in Center
            $users = \App\Models\User::whereHas('centers', function($q) use ($centerId) {
                $q->where('centers.id', $centerId);
            })->get();
            
            // Avoid notifying self if desired, but for now notify all
            \Illuminate\Support\Facades\Notification::send($users, new \App\Notifications\EventCreated($event));

            return response()->json($event, 201);
        });
    }

    public function update(Request $request, Event $event)
    {
        if ($event->center_id !== (int) $request->validated_center_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check Conflict if changing critical fields
        if ($request->has(['event_date', 'start_time', 'end_time', 'resource_id'])) {
            $date = $request->event_date ?? $event->event_date;
            $start = $request->start_time ?? $event->start_time;
            $end = $request->end_time ?? $event->end_time;
            $resId = $request->resource_id ?? $event->resource_id;

            if ($this->hasConflict($event->center_id, $resId, $date, $start, $end, $event->id)) {
                return response()->json(['message' => 'Time slot conflict for selected Hall.'], 409);
            }
        }

        $event->update($request->all());
        return response()->json($event);
    }

    private function hasConflict($centerId, $resourceId, $date, $start, $end, $excludeId = null)
    {
        $query = Event::where('center_id', $centerId)
                      ->where('resource_id', $resourceId) // Filter by Resource
                      ->where('event_date', $date)
                      ->where('status', '!=', 'cancelled')
                      ->where(function ($q) use ($start, $end) {
                          $q->whereBetween('start_time', [$start, $end])
                            ->orWhereBetween('end_time', [$start, $end])
                            ->orWhere(function ($q2) use ($start, $end) {
                                $q2->where('start_time', '<=', $start)
                                   ->where('end_time', '>=', $end);
                            });
                      });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
