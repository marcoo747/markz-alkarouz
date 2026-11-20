<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UserRequest;
use Carbon\Carbon;

class ProcessDelayedRequests extends Command
{
    protected $signature = 'requests:process-delayed';
    protected $description = 'Process delayed request status updates';

    public function handle()
    {
        // Find all pending requests where the expiry time has passed
        UserRequest::where('request_status', 'pending')
            ->where('expiry_time', '<=', now())
            ->where('expiry_time', '!=', null)
            ->update(['request_status' => 'accepted']);

        $this->info('Delayed requests processed!');
    }
}
