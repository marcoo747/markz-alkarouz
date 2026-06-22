<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\UserRequest;

class UpdateRequestStatus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $requestId;
    protected $newStatus;

    public function __construct($requestId, $newStatus = 'accepted')
    {
        $this->requestId = $requestId;
        $this->newStatus = $newStatus;
    }

    public function handle()
    {
        $userRequest = UserRequest::find($this->requestId);

        if ($userRequest) {
            $userRequest->update([
                'request_status' => $this->newStatus,
            ]);
        }
    }
}
