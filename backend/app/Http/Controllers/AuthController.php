<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Center;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        \Illuminate\Support\Facades\Log::info('Login Attempt:', $request->only('email', 'password'));
        
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            // Load Center Branding
            $center = $user->centers()->first(); // Assuming single center for now

            return response()->json([
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
                'center' => $center,
            ]);
        }

        \Illuminate\Support\Facades\Log::error('Login Failed for email: ' . $request->email);
        return response()->json(['message' => 'Invalid login details'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
