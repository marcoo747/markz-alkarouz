<?php

namespace App\Console\Commands;

use App\Services\RequestLifecycleService;
use Illuminate\Console\Command;

class ProcessDelayedRequests extends Command
{
    protected $signature = 'requests:process-delayed';
    protected $description = 'Process delayed request status updates';

    public function handle(RequestLifecycleService $lifecycleService): int
    {
        $accepted = $lifecycleService->processDelayedPendingRequests();

        $this->info("Delayed requests processed! Accepted: {$accepted}");

        return self::SUCCESS;
    }
}
