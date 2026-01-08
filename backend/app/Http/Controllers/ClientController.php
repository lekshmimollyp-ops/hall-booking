<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::where('center_id', $request->validated_center_id);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $clients = $query->withCount('events')
                         ->withSum('events', 'booked_amount')
                         ->withMin('events as first_event_date', 'event_date')
                         ->withMax('events as last_event_date', 'event_date')
                         ->orderBy('events_count', 'desc')
                         ->get();
                         
        return response()->json($clients);
    }
}
