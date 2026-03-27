<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TermsAndPenalty;
use App\Models\User;

class TermsAndPenaltiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('user_type', 'admin')->first();

        if (!$admin) {
            $admin = User::first(); // Fallback to first user
        }

        // Terms and Conditions
        TermsAndPenalty::create([
            'title' => 'Usage Terms',
            'content' => 'By using this platform, you agree to follow all church guidelines and respect other users. All activities must align with Christian values and principles.',
            'type' => 'terms',
            'is_active' => true,
            'created_by' => $admin?->user_id,
            'updated_by' => $admin?->user_id,
        ]);

        TermsAndPenalty::create([
            'title' => 'Booking Policy',
            'content' => 'All bookings must be made through the official platform. Direct bookings are not permitted. Cancellations must be made at least 24 hours in advance.',
            'type' => 'terms',
            'is_active' => true,
            'created_by' => $admin?->user_id,
            'updated_by' => $admin?->user_id,
        ]);

        TermsAndPenalty::create([
            'title' => 'Payment Terms',
            'content' => 'All payments must be completed before service usage. Late payments may result in service suspension.',
            'type' => 'terms',
            'is_active' => true,
            'created_by' => $admin?->user_id,
            'updated_by' => $admin?->user_id,
        ]);

        // Financial Penalties
        TermsAndPenalty::create([
            'title' => 'Late Cancellation Fee',
            'content' => 'Cancellations made less than 24 hours before the scheduled time will incur a penalty fee.',
            'type' => 'penalty',
            'amount' => 50.00,
            'is_active' => true,
            'created_by' => $admin?->user_id,
            'updated_by' => $admin?->user_id,
        ]);

        TermsAndPenalty::create([
            'title' => 'No-Show Penalty',
            'content' => 'Failure to appear for a confirmed booking without prior notice will result in a penalty charge.',
            'type' => 'penalty',
            'amount' => 100.00,
            'is_active' => true,
            'created_by' => $admin?->user_id,
            'updated_by' => $admin?->user_id,
        ]);

        TermsAndPenalty::create([
            'title' => 'Equipment Damage Fee',
            'content' => 'Any damage to church property or equipment will result in repair or replacement costs being charged to the responsible party.',
            'type' => 'penalty',
            'amount' => null, // Variable amount based on damage
            'is_active' => true,
            'created_by' => $admin?->user_id,
            'updated_by' => $admin?->user_id,
        ]);
    }
}
