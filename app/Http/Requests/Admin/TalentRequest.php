<?php

namespace App\Http\Requests\Admin;

use App\Models\Talent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TalentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $talentId = $this->route('talent')?->id;

        return [
            'type' => ['required', Rule::in(Talent::TYPES)],
            'full_name' => ['required', 'string', 'max:160'],
            'slug' => ['nullable', 'string', 'max:180', Rule::unique('talents', 'slug')->ignore($talentId)],
            'position' => ['nullable', 'string', 'max:80'],
            'shirt_number' => ['nullable', 'integer', 'min:1', 'max:99'],
            'secondary_positions' => ['nullable', 'array'],
            'secondary_positions.*' => ['nullable', 'string', 'max:40'],
            'nationality' => ['nullable', 'string', 'max:80'],
            'secondary_nationality' => ['nullable', 'string', 'max:80'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'place_of_birth' => ['nullable', 'string', 'max:120'],
            'height_cm' => ['nullable', 'integer', 'min:120', 'max:230'],
            'weight_kg' => ['nullable', 'integer', 'min:40', 'max:150'],
            'preferred_foot' => ['nullable', Rule::in(Talent::PREFERRED_FEET)],
            'current_club' => ['nullable', 'string', 'max:120'],
            'contract_status' => ['nullable', Rule::in(Talent::CONTRACT_STATUSES)],
            'contract_until' => ['nullable', 'date'],
            'market_value' => ['nullable', 'string', 'max:40'],
            'biography' => ['nullable', 'string', 'max:10000'],
            'is_featured' => ['boolean'],
            'status' => ['required', Rule::in(Talent::STATUSES)],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'meta_title' => ['nullable', 'string', 'max:160'],
            'meta_description' => ['nullable', 'string', 'max:300'],

            // Media is chosen in the File Manager, so forms submit storage paths.
            'photo' => ['nullable', 'string', 'max:500'],

            'career_history' => ['nullable', 'array'],
            'career_history.*.club' => ['nullable', 'string', 'max:160'],
            'career_history.*.years' => ['nullable', 'string', 'max:60'],

            'video_links' => ['nullable', 'array'],
            'video_links.*.label' => ['nullable', 'string', 'max:120'],
            'video_links.*.url' => ['nullable', 'url', 'max:500'],

            'video_files' => ['nullable', 'array'],
            'video_files.*' => ['string', 'max:500'],

            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['string', 'max:500'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured' => $this->boolean('is_featured'),
        ]);
    }
}
