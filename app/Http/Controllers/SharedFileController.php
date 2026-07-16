<?php

namespace App\Http\Controllers;

use App\Models\MediaFile;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Serves files shared via a public link.
 *
 * The file is streamed through the application rather than exposing the
 * storage URL, so the same link works whether the disk is local or a private
 * S3 / MinIO / R2 bucket.
 */
class SharedFileController extends Controller
{
    public function show(Request $request, string $token): StreamedResponse|View
    {
        $file = $this->resolve($token);

        if ($this->needsPassword($request, $file)) {
            return view('shared-file.password', ['token' => $token, 'file' => $file]);
        }

        return Storage::disk($file->storageDisk())->response(
            $file->path,
            $file->name.($file->extension ? '.'.$file->extension : ''),
            ['Content-Type' => $file->mime_type ?: 'application/octet-stream'],
        );
    }

    public function unlock(Request $request, string $token): RedirectResponse
    {
        $file = $this->resolve($token);

        $request->validate(['password' => ['required', 'string']]);

        if (! filled($file->share_password) || ! Hash::check($request->string('password'), $file->share_password)) {
            return back()->withErrors(['password' => 'That password is not correct.']);
        }

        $request->session()->put($this->sessionKey($file), true);

        return redirect()->route('shared-file.show', $token);
    }

    protected function resolve(string $token): MediaFile
    {
        $file = MediaFile::where('share_token', $token)->first();

        abort_if($file === null || $file->shareHasExpired(), 404);

        return $file;
    }

    protected function needsPassword(Request $request, MediaFile $file): bool
    {
        return filled($file->share_password) && ! $request->session()->get($this->sessionKey($file), false);
    }

    protected function sessionKey(MediaFile $file): string
    {
        return "shared-file.{$file->id}.unlocked";
    }
}
