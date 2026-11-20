<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ReportInventoryDrift extends Command
{
    protected $signature = 'inventory:report-drift';
    protected $description = 'Read-only audit of potential inventory, request lifecycle, and missings drift';

    public function handle(): int
    {
        $this->info('=== Markaz Alkarouz Read-Only Inventory Drift Report ===');

        $badInventory = DB::table('products')
            ->select('product_id', 'pr_name', 'inventory_quantity')
            ->whereNull('inventory_quantity')
            ->orWhere('inventory_quantity', '<', 0)
            ->orderBy('product_id')
            ->get();
        $this->line("1. Products with NULL or negative inventory_quantity: {$badInventory->count()}");
        foreach ($badInventory as $row) {
            $this->line("   - product_id={$row->product_id} ({$row->pr_name}): inventory_quantity=" . var_export($row->inventory_quantity, true));
        }

        $expiredPending = DB::table('requests')
            ->select('request_id', 'user_id', 'request_status', 'expiry_time')
            ->where('request_status', 'pending')
            ->whereNotNull('expiry_time')
            ->where('expiry_time', '<=', now())
            ->orderBy('request_id')
            ->get();
        $this->line("2. Pending requests past expiry_time: {$expiredPending->count()}");
        foreach ($expiredPending as $row) {
            $this->line("   - request_id={$row->request_id}, user_id={$row->user_id}, expiry_time={$row->expiry_time}");
        }

        $acceptedPastExpiry = DB::table('requests')
            ->select('request_id', 'user_id', 'created_at', 'expiry_time', 'updated_at')
            ->where('request_status', 'accepted')
            ->whereNotNull('expiry_time')
            ->whereColumn('updated_at', '>=', 'expiry_time')
            ->orderBy('request_id')
            ->get();
        $this->line("3. Accepted requests updated at/after expiry_time (candidates for historical auto-accept without stock deduction): {$acceptedPastExpiry->count()}");
        foreach ($acceptedPastExpiry as $row) {
            $this->line("   - request_id={$row->request_id}, expiry_time={$row->expiry_time}, updated_at={$row->updated_at}");
        }

        $badPivots = DB::table('request_products')
            ->select('request_product_id', 'request_id', 'product_id', 'quantity', 'checked_qnty', 'unchecked_qnty')
            ->where('quantity', '<', 0)
            ->orWhere('checked_qnty', '<', 0)
            ->orWhere('unchecked_qnty', '<', 0)
            ->orWhereRaw('checked_qnty > quantity')
            ->orWhereRaw('checked_qnty IS NOT NULL AND unchecked_qnty IS NOT NULL AND (checked_qnty + unchecked_qnty) != quantity')
            ->orderBy('request_product_id')
            ->get();
        $this->line("4. Malformed request_products quantity/checked/unchecked rows: {$badPivots->count()}");
        foreach ($badPivots as $row) {
            $this->line("   - request_product_id={$row->request_product_id} (request={$row->request_id}, product={$row->product_id}): qty={$row->quantity}, checked={$row->checked_qnty}, unchecked={$row->unchecked_qnty}");
        }

        $missingsByPair = DB::table('missings')
            ->select('request_id', 'product_id', DB::raw('SUM(quantity) as missing_sum'), DB::raw('COUNT(*) as missing_rows'))
            ->groupBy('request_id', 'product_id')
            ->get()
            ->keyBy(fn ($r) => "{$r->request_id}:{$r->product_id}");

        $uncheckedByPair = DB::table('request_products')
            ->select('request_id', 'product_id', DB::raw('SUM(COALESCE(unchecked_qnty, 0)) as unchecked_sum'))
            ->groupBy('request_id', 'product_id')
            ->get()
            ->keyBy(fn ($r) => "{$r->request_id}:{$r->product_id}");

        $mismatchLines = [];
        foreach ($missingsByPair as $key => $miss) {
            $uncheckedSum = (int) ($uncheckedByPair->get($key)->unchecked_sum ?? 0);
            if ((int) $miss->missing_sum !== $uncheckedSum || (int) $miss->missing_rows > 1) {
                $mismatchLines[] = "{$key} missings_sum={$miss->missing_sum} (rows={$miss->missing_rows}) vs request_products.unchecked_sum={$uncheckedSum}";
            }
        }
        $this->line("5. Missings vs request_products unchecked_qnty discrepancies (or duplicate missing rows): " . count($mismatchLines));
        foreach ($mismatchLines as $line) {
            $this->line("   - {$line}");
        }

        $this->info('Read-only drift audit finished (no database modifications made).');

        return Command::SUCCESS;
    }
}
