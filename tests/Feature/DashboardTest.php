<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('the dashboard route redirects to the admin panel', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard'))->assertRedirect(route('admin.dashboard'));
});

test('authenticated users can visit the admin dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('admin.dashboard'))->assertOk();
});
