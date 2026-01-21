<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric',
            'expense_date' => 'required|date',
            'resource_id' => 'nullable|exists:resources,id',
        ]);

        $centerId = $request->validated_center_id;

        // Validate user has access to the selected hall if provided
        if ($request->resource_id && !$request->user()->hasAccessToResource($request->resource_id)) {
            return response()->json(['message' => 'You do not have access to this hall.'], 403);
        }

        $expense = Expense::create([
            'center_id' => $centerId,
            'resource_id' => $request->resource_id, // Nullable - hall-specific
            'event_id' => $request->event_id, // Nullable
            'category_id' => $request->category_id,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'description' => $request->description,
            'created_by' => $request->user()->id,
        ]);

        // Notify Users
        $users = \App\Models\User::whereHas('centers', function($q) use ($centerId) {
            $q->where('centers.id', $centerId);
        })->get();

        \Illuminate\Support\Facades\Notification::send($users, new \App\Notifications\ExpenseAdded($expense));

        return response()->json($expense, 201);
    }

    public function index(Request $request)
    {
        $query = Expense::where('center_id', $request->validated_center_id)
                        ->with(['category', 'event', 'resource']);

        // Filter by accessible halls (hall-based access control)
        // Only show expenses for halls the user can access, or general expenses (null resource_id)
        $query->where(function($q) use ($request) {
            $q->whereIn('resource_id', $request->accessible_resource_ids)
              ->orWhereNull('resource_id'); // Include general expenses
        });

        $expenses = $query->orderBy('expense_date', 'desc')->get();
        return response()->json($expenses);
    }

    public function update(Request $request, Expense $expense)
    {
        if ($expense->center_id !== (int) $request->validated_center_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric',
            'expense_date' => 'required|date',
            'resource_id' => 'nullable|exists:resources,id',
        ]);

        // Validate user has access to the selected hall if provided
        if ($request->resource_id && !$request->user()->hasAccessToResource($request->resource_id)) {
            return response()->json(['message' => 'You do not have access to this hall.'], 403);
        }

        $expense->update([
            'resource_id' => $request->resource_id,
            'event_id' => $request->event_id,
            'category_id' => $request->category_id,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'description' => $request->description,
        ]);

        return response()->json($expense);
    }

    public function destroy(Request $request, Expense $expense)
    {
        if ($expense->center_id !== (int) $request->validated_center_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $expense->delete();
        return response()->json(['message' => 'Expense deleted']);
    }

    public function categories()
    {
        return response()->json(\App\Models\ExpenseCategory::all());
    }
}
