<?php

namespace App\Models\Concerns;

use App\Models\Category;
use App\Models\Main_Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait HasOutsideVisibility
{
    public function scopeVisibleTo(Builder $query, ?User $user = null): Builder
    {
        if ($user !== null) {
            return $query;
        }

        if ($this instanceof Main_Category) {
            return $query->where($this->getTable() . '.can_go_outside', 1);
        }

        if ($this instanceof Category) {
            return $query->whereHas('main_category', fn (Builder $q) => $q->where('can_go_outside', 1));
        }

        return $query->where(function (Builder $q) {
            $q->whereHas('mainCategory', fn (Builder $m) => $m->where('can_go_outside', 1))
                ->orWhere(function (Builder $fallback) {
                    $fallback->whereNull($this->getTable() . '.main_category_id')
                        ->whereHas('category.main_category', fn (Builder $m) => $m->where('can_go_outside', 1));
                });
        });
    }
}
