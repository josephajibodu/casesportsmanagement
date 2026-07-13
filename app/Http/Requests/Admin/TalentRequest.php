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
            'nationality' => ['nullable', 'string', 'max:80'],
            'current_club' => ['nullable', 'string', 'max:120'],
            'biography' => ['nullable', 'string', 'max:10000'],
            'is_featured' => ['boolean'],
            'status' => ['required', Rule::in(Talent::STATUSES)],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'meta_title' => ['nullable', 'string', 'max:160'],
            'meta_description' => ['nullable', 'string', 'max:300'],

            'photo' => ['nullable', 'image', 'max:5120'],

            'career_history' => ['nullable', 'array'],
            'career_history.*.club' => ['nullable', 'string', 'max:160'],
            'career_history.*.years' => ['nullable', 'string', 'max:60'],

            'video_links' => ['nullable', 'array'],
            'video_links.*.label' => ['nullable', 'string', 'max:120'],
            'video_links.*.url' => ['nullable', 'url', 'max:500'],

            'existing_videos' => ['nullable', 'array'],
            'existing_videos.*' => ['string'],
            'video_uploads' => ['nullable', 'array'],
            'video_uploads.*' => ['file', 'mimes:mp4,mov,webm,ogg,m4v', 'max:512000'],

            'existing_gallery' => ['nullable', 'array'],
            'existing_gallery.*' => ['string'],
            'gallery_uploads' => ['nullable', 'array'],
            'gallery_uploads.*' => ['image', 'max:5120'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured' => $this->boolean('is_featured'),
        ]);
    }
}
